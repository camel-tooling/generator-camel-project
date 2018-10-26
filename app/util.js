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
const download = require("mvn-artifact-download").default;
const utils = {};

// List extracted from: https://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html
var reservedKeywords = {
    abstract: true,
    continue: true,
    for: true,
    new: true,
    switch: true,
    assert: true,
    default: true,
    package: true,
    synchronized: true,
    boolean: true,
    do: true,
    if: true,
    private: true,
    this: true,
    break: true,
    double: true,
    implements: true,
    protected: true,
    throw: true,
    byte: true,
    else: true,
    import: true,
    public: true,
    throws: true,
    case: true,
    enum: true,
    instanceof: true,
    return: true,
    transient: true,
    catch: true,
    extends: true,
    int: true,
    short: true,
    try: true,
    char: true,
    final: true,
    interface: true,
    static: true,
    void: true,
    class: true,
    finally: true,
    long: true,
    strictfp: true,
    volatile: true,
    float: true,
    native: true,
    super: true,
    while: true
};

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

utils.isNotNull = function isNotNull(object) {
    return (object != null);
}

utils.setDefault = function setDefault(baseDefault, optionDefault) {
    let newDefault = baseDefault;
    if (!utils.isEmpty(optionDefault)) {
        let index = optionDefault.indexOf('=');
        newDefault = optionDefault.substring(index + 1, optionDefault.length);
    }
    return newDefault;
}

utils.addPrompt = function addPrompt(promptContent, promptsList) {
    if (Array.isArray(promptsList)) {
        promptsList.push(promptContent);
    }
}

utils.validatePackage = function (packageName) {
    const regex = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/;
    if (!regex.test(packageName)) {
        return chalk.red('Unsupported package name. Package must follow standard Java package naming guidelines.');
    }
    let array = packageName.split('.');
    for (let i = 0; i < array.length; i++) {
        if (reservedKeywords.hasOwnProperty(array[i])) {
            return chalk.red('Package name may not contain standard Java keywords such as \'' + array[i] + '\'.');
        }
    }
    return true;
}

async function getArtifact(artifactString, repositoryUr, value) {
    try {
        await download(artifactString, null, repositoryUrl).
            done(function(_result) {return true;});
    } catch(error) {
      return chalk.red('Camel version \'' + value + '\' is not available in public repositories.');
    }
  }

utils.validateCamelVersion = function(value) {
    let artifactString = 'org.apache.camel:camel-spring:' + value;
    let repositoryUrl = 'http://central.maven.org/maven2/';
    return getArtifact(artifactString, repositoryUrl, value);
}

module.exports = utils;