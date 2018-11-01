(ns helm.core
  (:require [clojure.string :as str]
            [clojure.pprint :as pprint]
            [clojure.data.json :as json]
            [clj-yaml.core :as yaml]
            [helm.tar-util :as tar]
            [clojure.edn :as edn])
  (:import [java.util Base64]
           [java.io
            ByteArrayInputStream
            ByteArrayOutputStream
            PrintStream]
           [org.apache.commons.compress.archivers.tar TarArchiveInputStream]
           [org.apache.commons.compress.compressors.gzip
            GzipCompressorInputStream]
           [java.nio.charset StandardCharsets]))

(defn ppwrap [tag val]
  (pprint/pprint (list tag val))
  val)

(defn valueRef [x] (str ".Values." x))

(defn valueRef? [x]
  (re-matches #"([.]Values|int [.]Values|float [.]Values)[.].+" x))

(def untranslated [[:apiVersion :*]
                   [:kind :*]
                   [:* :metadata :name :*]
                   [:* :metadata :annotations :*]])

(defn match-context [cval pat]
  (cond (empty? cval) (every? #{:*} pat)
        (empty? pat) false
        (= (first cval) (first pat)) (recur (rest cval) (rest pat))
        (= (first pat) :*) (or (match-context cval (rest pat))
                               (recur (rest cval) pat))))

(defn standard-leave-alone-check [cval]
  (some #(match-context cval %) untranslated))

(defn standard-leave-alone-fun [context]
  (when-let [cval (rest context)]
    (standard-leave-alone-check cval)))

(def ^:dynamic *leave-alone-fun* standard-leave-alone-fun)

(defn pematch [wtp]
  (fn pe [cval] (not (match-context cval [:* wtp :*]))))

(defn lmatch [cval]
  (not (or (match-context cval [:* :labels :*])
           (match-context cval [:* :selector :*]))))

(defn get-base-leave-alone-fun [what-to-parameterize]
  (if (or (seq? what-to-parameterize)
          (vector? what-to-parameterize))
    (if (= (count what-to-parameterize) 1)
      (get-base-leave-alone-fun (first what-to-parameterize))
      (let [all-funs (mapv get-base-leave-alone-fun what-to-parameterize)]
        (fn leave-alone-loop [context]
          (loop [funs all-funs]
            (or (empty? funs)
                (and ((first funs) context) (recur (rest funs))))))))
    (case what-to-parameterize
      (:ports :env) (pematch what-to-parameterize)
      (:labels) lmatch
      standard-leave-alone-fun)))

;; Now allow :none so we can explicitly specify what gets parameterized
;; via diffs.
(defn get-leave-alone-fun [what-to-parameterize]
  (if (or (= what-to-parameterize :none)
          (= what-to-parameterize [:none])
          (and (not (keyword? what-to-parameterize))
               (empty? what-to-parameterize)))
    (constantly true)
    (let [base-fun (get-base-leave-alone-fun what-to-parameterize)]
      (if (= base-fun standard-leave-alone-fun)
        standard-leave-alone-fun
        (fn standard-plus [context]
          (when-let [cval (rest context)]
            (or (standard-leave-alone-check cval)
                (base-fun cval))))))))

(defn leave-alone [context]
  (*leave-alone-fun* context))

(defn cap [s] (if (= s "") s (str (str/upper-case (.charAt s 0)) (subs s 1))))
(defn uncap [s] (if (= s "") s (str (str/lower-case (.charAt s 0)) (subs s 1))))

;; Template support - main function "templatize" generates all templates
;; and "values.yaml" file

;; Random tag used as a stand-in for template text in a yaml file. For each
;; template item, we insert a single entry map keyed with the template tag
;; whose value is a base64 encoded version of the template item. This ensures
;; that there are no stray "}" characters to make replacing the entry difficult
;; later. After generating the yaml, we make a pass over the string and
;; replace all entries that look like: "{<tag>: <encoded value>}" with:
;; "{{<unencoded value>}}".
(def template-tag
  :wyrntbsgosfjkqaxejatqxwmmejjtigkleyzrhohrllocnxwosjdejyidjrdnndgfnisokrcxwlhvsigtoykqzjnyxpkfmdwvyiv)

;; Three new tags - one for missing maps in paths, one for diffs coming into
;; helm, one for encoding the non-scalar values in diffs.
(def editable-map-tag
  :xapiqpjbxpmemcleyxgcyrktusqaltdbfaufabxsxbpobtjcfehxojgnehirhvpzwlorlqrdhdejwgrsjbfjriosxycwyylaagqa)

(def diff-tag
  :wqjauocfqrvobdoonefoaivoazcxkorfvkxupuwndscnrmcpormelafkovlamsgqkaiffsqewyipgpfugvfaqrkgbjpykysdffmw)

(def chunk-tag
  :lucahguzpnhhglvnpxrorkynqksucwjzytpepmgmpxpnxzaextfivvjjeumgbwpsdszqrbmlfyfbhrnwudxpcycixmyaevxfvmyv)

;; Unkeyworded version of the tag to build into the replacement regex
(def tag-name (name template-tag))

;; Pattern used to find tagged entries for replacement
(def tag-pattern (re-pattern (str "[{]" tag-name "[:][ ][^}]*[}]")))

;; Special case for array entries to pick up the '-' in YAML
(def array-tag-pattern (re-pattern (str "[-][ ][{]" tag-name "[:][ ][^}]*[}]")))

(defn encode [to-encode]
  (if (not (string? to-encode))
    (.encodeToString (Base64/getEncoder) (.getBytes (str tag-name to-encode)))
    (cond (valueRef? to-encode)
          (.encodeToString (Base64/getEncoder) (.getBytes to-encode))

          (try (number? (edn/read-string to-encode)) (catch Exception _ false))
          (.encodeToString (Base64/getEncoder)
                           (.getBytes (str "\"" to-encode "\"")))
          :else
          (.encodeToString (Base64/getEncoder)
                           (.getBytes (str tag-name to-encode))))))

(defn decode [to-decode]
  (let [res (String. (.decode (Base64/getDecoder) to-decode))]
    (if (.startsWith res tag-name)
      (subs res (count tag-name))
      res)))

(defn encode-bytes [to-encode]
  (.encodeToString (Base64/getEncoder) to-encode))

(defn decode-bytes [to-decode]
  (.decode (Base64/getDecoder) to-decode))

(declare templatize templatize-in-context)

;; Similar to version in "diff" but used for variable naming.
(defn ident [x]
  (cond (:kind x) (str "_metadata_name_" (:name (:metadata x)) "_")
        (:name x) (str "_name_" (:name x) "_")
        (:containerPort x) (str "_containerPort_" (:containerPort x) "_")
        (:port x) (str "_port_" (:port x) "_")
        (diff-tag x) (:identifier x)
        (map? x) (first (keys x))
        (string? x) (str "_simple_value_" x)
        :else (throw (RuntimeException. (str "Unidentifiable entry: " x)))))

(defn conj-if [vec item] (if (empty? item) vec (conj vec item)))

(defn fixup-key [x]
  (cond (keyword? x) (keyword (fixup-key (name x)))
        (or (number? x) (re-matches #"\d+\.\d+" x)) x ;; leave decimals alone
        :else (str/replace x #"\.(.)" #(.toUpperCase (%1 1)))))

(defn canonicalize-name [item]
  (fixup-key
   (cond (keyword? item) (canonicalize-name (name item))
         (integer? item) item
         :else (apply str (map cap (str/split item #"[-]"))))))

;; Construct the string path leading to a value that will be inserted into
;; a template and used to name an entry in the values.yaml file. Also keeps
;; track of names and contexts that have been seen.
(defn context-string [context]
  (loop [items context idx 0 res []]
    (if (empty? items)
      (let [full-context (vec (concat context res))
            canonical (uncap
                       (apply str (apply concat
                                         (map-indexed #(str %2 %1) res))))]
        canonical)
      (let [item (first items)
            cstring (canonicalize-name item)]
        (recur (rest items) (inc idx) (conj res cstring))))))

;; templatize-array and templatize-map recursively replace
;; primitive (non-array and non-map) values within the structures with
;; tagged contents.
(defn templatize-array [data context]
  (loop [vals data result-array [] result-values []]
    (if (empty? vals)
      [result-array (str/join "\n" result-values)]
      (let [[r v]
            (templatize-in-context
             (first vals)
             (conj context (ident (first vals))))]
        (recur (rest vals) (conj result-array r) (conj-if result-values v))))))

(defn create-template-helper [data context]
  (let [cstring (context-string context)]
    (cond (instance? java.lang.Boolean data)
          [{template-tag (encode (valueRef cstring))}
           (format "%s: %s" cstring data)]

          (nil? data)
          [{template-tag (encode (valueRef cstring))}
           (format "%s: null" cstring)]

          (integer? data)
          [{template-tag (encode (format "int %s" (valueRef cstring)))}
           (format "%s: \"%s\"" cstring data)]

          (float? data)
          [{template-tag (encode (format "float %s" (valueRef cstring)))}
           (format "%s: \"%s\"" cstring data)]

          (string? data)
          [{template-tag (encode (valueRef cstring))}
           (format "%s: \"%s\"" cstring data)]

          :else
          [{template-tag (encode (valueRef cstring))}
           (format "%s: '%s'" cstring (json/write-str data))])))

;; Create a tagged entry for a primitive value that we will templatize.
(defn create-template [data context]
  (if (leave-alone context)
    [{template-tag (encode data)} ""]
    (create-template-helper data context)))

;; Now we have special cases for tags coming from diff (diff-tag and
;; editable-map-tag)
(defn templatize-map [data context]
  (cond (diff-tag data) ; pre-defined as a variable
        (let [inner (edn/read-string (decode (get data diff-tag)))]
          (if (chunk-tag inner)
            (create-template-helper (json/read-str (chunk-tag inner)
                                                   :key-fn keyword)
                                    context)
            (create-template-helper inner context)))

        (editable-map-tag data)
        (let [subdata (get data editable-map-tag)
              val (decode (get subdata diff-tag))
              cstring (context-string context)]
          (if (= val "")
            [{template-tag (encode (valueRef cstring))}
             (format "%s: \"\"" cstring)]
            [{(:identifier subdata)
              {template-tag (encode (format "%s | quote" (valueRef cstring)))}}
             (format "%s: \"%s\"" cstring val)]))

        :else
        (loop [vals (seq data) result-array [] result-values []]
          (if (empty? vals)
            [(into {} result-array) (str/join "\n" result-values)]
            (let [[k v] (first vals)
                  [r rv] (templatize-in-context v (conj context k))]
              (recur (rest vals) (conj result-array [(fixup-key k) r])
                     (conj-if result-values rv)))))))

(defn templatize-in-context [data context]
  (cond (map? data) (templatize-map data context)
        (or (seq? data) (vector? data)) (templatize-array data context)
        :else (create-template data context)))

;; replace tagged entries with decoded actual template values
(defn replace-tags [str-val]
  (str/replace
   (str/replace str-val
                array-tag-pattern
                #(let [actual (subs % 2) ; the "- "
                       decoded (decode (subs actual
                                             (inc (str/index-of actual " "))
                                             (dec (count actual))))]
                   (if (valueRef? decoded)
                     (str "{{if " decoded "}}"
                          "{{printf \"- %s\" "
                          decoded
                          "}}"
                          "{{end}}")
                     decoded)))
   tag-pattern
   #(let [decoded
          (decode (subs %
                        (inc (str/index-of % " "))
                        (dec (count %))))]
      (if (valueRef? decoded)
        (format "{{%s}}" decoded)
        decoded))))

;; Templatize a sequence of maps; they are templatized together to keep
;; naming conflicts from occurring across different templates (as they all
;; share the same "values.yaml" file).
(defn templatize [data-seq what-to-parameterize]
  (binding [*leave-alone-fun* (get-leave-alone-fun what-to-parameterize)]
    (let [vals-and-strings
          (mapv #(templatize-in-context (:contents %) [(uncap (:name %))])
                data-seq)
          raw-vals (mapv first vals-and-strings)
          cstrings (mapcat #(let [val (second %)] (if (= val "") nil (list val)))
                              vals-and-strings)]
      [(mapv (fn [data contents]
               {:name (:name data)
                :contents (replace-tags (yaml/generate-string contents))})
             data-seq raw-vals)
       (str (str/join "\n" cstrings) "\n")])))

;; Chart support - builds a gzipped chart file containing:
;;    Chart.yaml
;;    templates/*.yaml

(defn chart-file-path [chart-name file-name]
  (str chart-name "/" file-name ".yaml"))

(defn template-file-path [chart-name template-name]
  (chart-file-path chart-name (str "templates/" template-name)))

;; Generate nerd mode from chart bytes
(defn nerdify [chart]
  (let [bais (ByteArrayInputStream. chart)
        gzis (GzipCompressorInputStream. bais)
        tais (TarArchiveInputStream. gzis)
        baos (ByteArrayOutputStream.)
        ps (PrintStream. baos)]
    (loop [chart-file-entry (.getNextTarEntry tais) first-time true]
      (when chart-file-entry
        (when-not first-time (.print ps "\n---\n"))
        (let [entry-size (.getSize chart-file-entry)
              buf (byte-array entry-size)]
          (.print ps (str (.getName chart-file-entry) ":\n\n"))
          (.read tais buf 0 entry-size)
          (.write baos buf 0 entry-size))
        (recur (.getNextTarEntry tais) false)))
    (.close ps)
    (String. (.toByteArray baos) StandardCharsets/UTF_8)))

(defn build-chart [name version templates what-to-parameterize]
  (let [chart-file-contents (yaml/generate-string
                             {:name name :version version}
                             :dumper-options {:flow-style :block})
        [[& templates] values-file-contents] (templatize templates
                                                         what-to-parameterize)]
    (vec
     (concat [[(chart-file-path name "Chart") chart-file-contents]
              [(chart-file-path name "values") values-file-contents]]
             (map (fn [template]
                    [(template-file-path name (:name template))
                     (:contents template)])
                  templates)))))

;; (make-chart <chart name> <chart version> [<manifest>...])
;; to get the bytes for a chart tgz file.
(defn make-chart [name version templates what-to-parameterize]
    (tar/tarify (build-chart name version templates what-to-parameterize)))

(defn build-chart-input [k8s]
  (mapcat (fn [values]
            (vec
             (mapcat
              (fn [item]
                (if (template-tag item)
                  []
                  [{:name (str (:kind item) (cap (:name (:metadata item))))
                    :contents item}]))
              values)))
          (vals (dissoc k8s :app-name))))

(defn chartify [k8s-output what-to-parameterize]
  (make-chart (:app-name k8s-output) "0.0.1" (build-chart-input k8s-output)
              what-to-parameterize))

;; Main entry point -- call with k8s convert output
(defn to-helm [k8s-output & what-to-parameterize]
  (encode-bytes (chartify k8s-output (vec (or what-to-parameterize [:all])))))

(defn to-nerd-helm [k8s-output & what-to-parameterize]
  (nerdify (chartify k8s-output (vec (or what-to-parameterize [:all])))))
