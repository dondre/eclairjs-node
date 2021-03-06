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

    // Load the data stored in LIBSVM format as a DataFrame.
    var data = sqlContext
      .read()
      .format("libsvm")
      .load(__dirname+"/../mllib/data/sample_libsvm_data.txt");

    // Index labels, adding metadata to the label column.
    // Fit on whole dataset to include all labels in index.
    var labelIndexer = new spark.ml.feature.StringIndexer()
      .setInputCol("label")
      .setOutputCol("indexedLabel")
      .fit(data);

    // Automatically identify categorical features, and index them.
    var featureIndexer = new spark.ml.feature.VectorIndexer()
      .setInputCol("features")
      .setOutputCol("indexedFeatures")
      .setMaxCategories(4) // features with > 4 distinct values are treated as continuous
      .fit(data);

    // Split the data into training and test sets (30% held out for testing)
    data.randomSplit([0.7, 0.3]).then(function(splits) {
      var trainingData = splits[0];
      var testData = splits[1];


      // Train a DecisionTree model.
      var dt = new spark.ml.classification.DecisionTreeClassifier()
        .setLabelCol("indexedLabel")
        .setFeaturesCol("indexedFeatures");

      labelIndexer.labels().then(function(labels) {
        // Convert indexed labels back to original labels.
        var labelConverter = new spark.ml.feature.IndexToString()
          .setInputCol("prediction")
          .setOutputCol("predictedLabel")
          .setLabels(labels);

        // Chain indexers and tree in a Pipeline
        var pipeline = new spark.ml.Pipeline()
          .setStages([labelIndexer, featureIndexer, dt, labelConverter]);

        // Train model.  This also runs the indexers.
        var model = pipeline.fit(trainingData);

        // Make predictions.
        var predictions = model.transform(testData);

        // Select (prediction, true label) and compute test error
        var evaluator = new spark.ml.evaluation.MulticlassClassificationEvaluator()
         .setLabelCol("indexedLabel")
         .setPredictionCol("prediction")
         .setMetricName("precision");

        var promises = [];
        promises.push(predictions.select("predictedLabel", "label", "features").take(100));
           promises.push(evaluator.evaluate(predictions));

        Promise.all(promises).then(resolve).catch(stop);
      });
    }).catch(stop);
  });
}

if (global.SC) {
  // we are being run as part of a test
  module.exports = run;
} else {
  var sc = new spark.SparkContext("local[*]", "Decision Tree Classification");
  run(sc).then(function(results) {
    console.log('Predicted:', JSON.stringify(results[0]));
    console.log('Test Error:', 1-results[1]);
    stop();
  }).catch(stop);
}