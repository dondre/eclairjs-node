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

var Utils = require('./utils.js');

var gKernelP;

/**
 * @classdesc
 * @param {object} obj
 * @param {object} obj
 * @constructor
 * @memberof module:eclairjs
 */
function Tuple4() {
  Utils.handleConstructor(this, arguments, gKernelP);
}

/**
 *
 * @returns {Promise.<object>}
 */
Tuple4.prototype._1 = function () {
  var args = {
    target: this,
    method: '_1',
    args: Utils.wrapArguments(arguments),
    returnType: Object
  };

  return Utils.generate(args);
};

/**
 *
 * @returns {Promise.<object>}
 */
Tuple4.prototype._2 = function () {
  var args = {
    target: this,
    method: '_2',
    args: Utils.wrapArguments(arguments),
    returnType: Object
  };

  return Utils.generate(args);
};

/**
 *
 * @returns {Promise.<object>}
 */
Tuple4.prototype._3 = function () {
  var args = {
    target: this,
    method: '_3',
    args: Utils.wrapArguments(arguments),
    returnType: Object
  };

  return Utils.generate(args);
};

/**
 *
 * @returns {Promise.<object>}
 */
Tuple4.prototype._4 = function () {
  var args = {
    target: this,
    method: '_4',
    args: Utils.wrapArguments(arguments),
    returnType: Object
  };

  return Utils.generate(args);
};

Tuple4.moduleLocation = '/Tuple4';

module.exports = function(kP) {
  if (kP) gKernelP = kP;
  return Tuple4;
};