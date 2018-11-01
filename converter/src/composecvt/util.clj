(ns composecvt.util
  (:require [clojure.walk :as walk]))

(defn sort-map-keys [themap]
  (walk/postwalk (fn [x] (if (map? x) (into (sorted-map) x) x)) themap))

