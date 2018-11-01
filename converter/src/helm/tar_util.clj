(ns helm.tar-util
  (:require [clojure.java.io :as io])
  (:import [java.util Base64]
           [java.io ByteArrayOutputStream ByteArrayInputStream]
           [org.apache.commons.io IOUtils]
           [org.apache.commons.compress.archivers.tar
            TarArchiveEntry
            TarArchiveOutputStream
            TarArchiveInputStream]
           [org.apache.commons.compress.compressors.gzip
            GzipCompressorOutputStream GzipCompressorInputStream]
           [java.nio.charset StandardCharsets]))

(defn add-tar-entry [taos name str-contents]
  (let [entry-bytes (.getBytes str-contents StandardCharsets/UTF_8)
        tar-entry (TarArchiveEntry. name)]
    (.setSize tar-entry (count entry-bytes))
    (.putArchiveEntry taos tar-entry)
    (.write taos entry-bytes)
    (.closeArchiveEntry taos)))

(defn tarify [entries]
  (let [baos (ByteArrayOutputStream.)
        taos (TarArchiveOutputStream. baos)]
    (.setLongFileMode taos TarArchiveOutputStream/LONGFILE_POSIX)
    (doseq [[name contents] entries] (add-tar-entry taos name contents))
    (.close taos)
    (let [bytes (.toByteArray baos)
          gzbaos (ByteArrayOutputStream.)
          gzip-stream (GzipCompressorOutputStream. gzbaos)]
      (.write gzip-stream bytes)
      (.finish gzip-stream)
      (.close gzip-stream)
      (.toByteArray gzbaos))))

(defn conj-if [acc val]
  (if val (conj acc val) acc))

;; define a shorter name -- hopefully improving readability
(def UTF8 StandardCharsets/UTF_8)

(defn read-all-files [tarstr]
  (let [decoded (.decode (Base64/getDecoder) (.getBytes tarstr UTF8))]
    (with-open [tarin (TarArchiveInputStream.
                       (GzipCompressorInputStream.
                        (ByteArrayInputStream. decoded)))]
      (loop [entry (.getNextTarEntry tarin) contents [] names []]
        (if (nil? entry)
          [contents names]
          (let [data (when (.isFile entry)
                       (String. (IOUtils/toByteArray tarin) UTF8))
                name (when (.isFile entry) (.getName entry))
                newcontents (conj-if contents data)
                newnames (conj-if names name)]
            (recur (.getNextTarEntry tarin) newcontents newnames)))))))
