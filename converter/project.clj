(defproject converter "0.1.0-SNAPSHOT"
  :description "Converts between Yipee flat format and Kubernetes YAML format"
  :url "https://yipee.io"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/tools.logging "0.4.0"]
                 [ch.qos.logback/logback-classic "1.2.3"]
                 [clj-yaml "0.4.0"]
                 [commons-io "2.6"]
                 [org.apache.commons/commons-compress "1.14"]
                 [org.javasimon/javasimon-core "4.1.3"]
                 [org.clojure/data.json "0.2.6"]
                 [org.flatland/ordered "1.5.6"]
                 [liberator "0.15.1"]
                 [compojure "1.6.0"]
                 [ring/ring-jetty-adapter "1.6.2"]
                 [ring/ring-core "1.6.2"]
                 [com.github.seancfoley/ipaddress "3.0.0"]
                 [prismatic/schema "1.1.7"]
                 [potemkin "0.4.5"]
                 [com.networknt/json-schema-validator "0.1.7"]
                 [environ "1.1.0"]
                 [inflections "0.13.0"]
                 [arete "0.6.0"]]

  :main ^:skip-aot converter.core
  :plugins [[lein-cloverage "1.0.9"] [lein-environ "1.1.0"]]
  :jvm-opts ["-Xmx1g" "-server"]
  :target-path "target/%s"
  :repositories [["buildrepo" {:url "file:buildrepo" :username "" :password ""}]]
  :resource-paths ["logconfig" "resources/tools.jar"]
  :profiles {:uberjar {:aot :all}
             :dev {:env {:build-time "true"}
                   :dependencies
                   [[clj-http/clj-http "3.7.0"]]}})
