/*
 * Copyright 2016 IBM Corp.
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

var Utils = require('../../utils.js');

var gKernelP;

/**
 * @param {string} parent
 * @param {string} name
 * @param {string} doc
 *  @class
 *  @extends module:eclairjs/ml/param.Param
 *  @memberof module:eclairjs/ml/param
 */
function IntParam() {
  Utils.handleConstructor(this, arguments, gKernelP);
}

IntParam.moduleLocation = '/ml/param/IntParam';

module.exports = function(kP) {
  if (kP) gKernelP = kP;

  return IntParam;
};