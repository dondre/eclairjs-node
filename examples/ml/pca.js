/*
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function exit() {
  process.exit();
}

function stop(e) {
  if (e) {
    console.log(e);
  }
  sc.stop().then(exit).catch(exit);
}

var spark = require('../../lib/index.js');

function run(sc) {
  return new Promise(function(resolve, reject) {
    var sqlContext = new spark.sql.SQLContext(sc);

    var  data = sc.parallelize([
      spark.sql.RowFactory.create(spark.mllib.linalg.Vectors.sparse(5, [1, 3], [1.0, 7.0])),
      spark.sql.RowFactory.create(spark.mllib.linalg.Vectors.dense([2.0, 0.0, 3.0, 4.0, 5.0])),
      spark.sql.RowFactory.create(spark.mllib.linalg.Vectors.dense([4.0, 0.0, 0.0, 6.0, 7.0]))
    ]);

    var schema = new spark.sql.types.StructType([
      new spark.sql.types.StructField("features", new spark.mllib.linalg.VectorUDT(), false, spark.sql.types.Metadata.empty())
    ]);
    var df = sqlContext.createDataFrame(data, schema);
    var pca = new spark.ml.feature.PCA()
      .setInputCol("features")
      .setOutputCol("pcaFeatures")
      .setK(3)
      .fit(df);
    var pcaDf = pca.transform(df).select("pcaFeatures");
    pcaDf.select("pcaFeatures").take(10).then(resolve).catch(reject);
  });
}

if (global.SC) {
  // we are being run as part of a test
  module.exports = run;
} else {
  var sc = new spark.SparkContext("local[*]", "PCA");
  run(sc).then(function(results) {
    console.log("Result:", JSON.stringify(results));
    stop();
  }).catch(stop);
}