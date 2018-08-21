/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 const chalk = require('chalk');

const utils = {};

// would be good to handle a few other validation tasks here as well, 
// such as validating the Camel version (is 2.18.1 valid vs. 4.0.0 invalid)

utils.validateCamelDSL = function (value) {
    const isBlueprint = value.match('blueprint');
    const isSpring = value.match('spring');
    const isJava = value.match('java');
    let returnValue;
    if (!isBlueprint && !isSpring && !isJava) {
        returnValue = chalk.red('Camel DSL must be either \'spring\', \'blueprint\', or \'java\'.');
    } else {
        returnValue = true;
    }
    return returnValue;
}

utils.isEmpty = function isEmpty(str) {
    return (!str || 0 === str.length);
}

module.exports = utils;