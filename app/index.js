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

var yeoman = require('yeoman-generator');
var glob = require('glob');
var path = require('path');
var mkdirp = require('mkdirp');
var fileUrl = require('file-url');
var exec = require('child_process').exec;
var fs = require('fs');

const chalk = require('chalk');
const utils = require('./util');

const defaultCamelVersion = "2.22.2";
const defaultCamelDSL = "spring";
const defaultPackagePrefix = "com.";
const defaultOutputDirectory = 'src/main/java';
const defaultJaxRsUrl = "http://localhost:8081/jaxrs";
const defaultJaxWsUrl = "http://localhost:8080/somepath";

function consoleHeader() {
    var pjson = require('../package.json');
    console.log('     _                             _');
    console.log('    / \\     _ __     __ _    ___  | |__     ___');
    console.log('   / _ \\   | \'_ \\   / _` |  / __| | \'_ \\   / _ \\');
    console.log('  / ___ \\  | |_) | | (_| | | (__  | | | | |  __/');
    console.log(' /_/   \\_\\ | .__/   \\__,_|  \\___| |_| |_|  \\___|');
    console.log('           |_|');

    console.log('       ____                              _');
    console.log('     /  ___|   __ _   _ __ ___     ___  | |');
    console.log('    |  |      / _` | | \'_ ` _ \\   / _ \\ | |');
    console.log('    |  |___  | (_| | | | | | | | |  __/ | |');
    console.log('     \\____|   \\__,_| |_| |_| |_|  \\___| |_|');
    console.log(' -----------------------------------------------');
    console.log('            Camel Project Generator');
    console.log('                 Version: ' + pjson.version);
    console.log(' -----------------------------------------------');
    console.log('');
}

module.exports = class extends yeoman {

    constructor(args, opts) {
        super(args, opts);

        // base arguments
        this.argument('appname', { type: String, required: false });
        this.argument('camelVersion', { type: String, required: false });
        this.argument('camelDSL', { type: String, required: false });
        this.argument('package', { type: String, required: false });

        // wsdl2rest options
        this.option('wsdl2rest');
        this.option('debug');

        // wsdl2rest arguments
        this.argument('wsdl', { type: String, required: false });
        this.argument('outdirectory', { type: String, required: false });
        this.argument('jaxrs', { type: String, required: false });
        this.argument('jaxws', { type: String, required: false });
    }

    prompting() {

        var showPrompts = true;

        if (utils.isNotNull(this.options.appname) &&
            utils.isNotNull(this.options.camelVersion) &&
            utils.isNotNull(this.options.camelDSL) &&
            utils.isNotNull(this.options.package)) {
            // no prompts
            showPrompts = false;
        }

        let showWsdl2Rest = this.options.wsdl2rest;
        if (typeof showWsdl2Rest == 'undefined') showWsdl2Rest = false;

        var showW2RPrompts = showPrompts;
        if (!showPrompts && showWsdl2Rest) {
            showW2RPrompts = (utils.isNull(this.options.wsdl)) &&
                (utils.isNull(this.options.outdirectory)) &&
                (utils.isNull(this.options.jaxrs)) &&
                (utils.isNull(this.options.jaxws));
        }

        if (showPrompts || showW2RPrompts) {
            consoleHeader();
        }

        var defaultProject = utils.setDefault(this.appname, this.options.appname);
        var defaultVersion = utils.setDefault(defaultCamelVersion, this.options.camelVersion);
        var defaultDSL = utils.setDefault(defaultCamelDSL, this.options.camelDSL);
        var defaultPackage = utils.setDefault(defaultPackagePrefix + this.appname, this.options.package);

        var prompts = [];
        utils.addPrompt({
            type: 'input',
            name: 'name',
            message: 'Your Camel project name',
            default: defaultProject
        }, prompts);
        utils.addPrompt({
            type: 'input',
            name: 'camelVersion',
            message: 'Your Camel version',
            default: defaultVersion,
            store: true
        }, prompts);
        utils.addPrompt({
            type: 'input',
            name: 'camelDSL',
            message: 'Camel DSL type (blueprint, spring, spring-boot, or java)',
            choices: ['blueprint', 'spring', 'spring-boot', 'java'],
            default: defaultDSL,
            validate: (value) => {
                return utils.validateCamelDSL(value, showWsdl2Rest);
            },
            store: true
        }, prompts);
        utils.addPrompt({
            type: 'input',
            name: 'package',
            message: 'Package name: ',
            default: defaultPackage,
            validate : utils.validatePackage
        }, prompts);

        var defaultOutputDir = utils.setDefault(defaultOutputDirectory, this.options.outdirectory);
        var defaultJaxRS = utils.setDefault(defaultJaxRsUrl, this.options.jaxrs);
        var defaultJaxWS = utils.setDefault(defaultJaxWsUrl, this.options.jaxws);
        var defaultWsdl = utils.setDefault('no wsdl specified', this.options.wsdl);

        if (showWsdl2Rest) {
             utils.addPrompt({
                type: 'input',
                name: 'wsdl',
                message: 'URL to the input WSDL',
                store: true
            }, prompts);
            utils.addPrompt({
                type: 'input',
                name: 'outdirectory',
                message: 'Name of the output directory for generated artifacts',
                default: defaultOutputDir,
                store: true
            }, prompts);
            utils.addPrompt({
                type: 'input',
                name: 'jaxrsURL',
                message: 'Address of the generated jaxrs endpoint',
                default: defaultJaxRS,
                store: true
            }, prompts);
            utils.addPrompt({
                type: 'input',
                name: 'jaxwsURL',
                message: 'Address of the target jaxws endpoint',
                default: defaultJaxWS,
                store: true
            }, prompts);
        }

        if (showPrompts || showW2RPrompts) {
            return this.prompt(prompts).then(function (props) {
                this.appname = props.name;
                this.camelVersion = props.camelVersion;
                this.camelDSL = props.camelDSL;
                this.package = props.package;
                if (showWsdl2Rest) {
                    this.outdirectory = props.outdirectory;
                    this.wsdl = props.wsdl;
                    this.jaxwsURL = props.jaxwsURL;
                    this.jaxrsURL = props.jaxrsURL;
                }
            }.bind(this));
        } else {
            this.appname = defaultProject;
            this.camelVersion = defaultVersion;
            this.camelDSL = defaultDSL;
            this.package = defaultPackage;
            if (showWsdl2Rest) {
                this.outdirectory = defaultOutputDir;
                this.wsdl = defaultWsdl;
                this.jaxwsURL = defaultJaxWS;
                this.jaxrsURL = defaultJaxRS;
            }
    }
    };

    //writing logic here
    writing() {
        let showWsdl2Rest = this.options.wsdl2rest;
        let showDebug = this.options.debug;

        var packageFolder = this.package.replace(/\./g, '/');
        var src = 'src/main/java';
        var myTemplatePath = path.join(this.templatePath(), this.camelDSL);
        this.folders = glob.sync('**/*/', { cwd: myTemplatePath });
        this.files = glob.sync('**/*', { cwd: myTemplatePath, nodir: true });
        
        this.log('Creating folders');
        this.folders.forEach(function (folder) {
            mkdirp.sync(folder.replace(/src\/main\/java/g, path.join(src, packageFolder)));
        });

        this.log('Copying files');
        this.sourceRoot(myTemplatePath);

        var userProps = {};
        userProps.name = this.appname;
        userProps.camelVersion = this.camelVersion;
        userProps.camelDSL = this.camelDSL;
        userProps.package = this.package;

        for (var i = 0; i < this.files.length; i++) {
            var skipFile = false;
            if (showWsdl2Rest) {
                skipFile = testFileForWsdl2RestSkip(this.files[i]);
            } else {
                skipFile = testFileForTemplateSkip(this.files[i]);
            }

            if (!skipFile) {
                if(this.files[i].localeCompare('pom.xml.wsdl2rest') == 0) {
                    var tempOutFile = "pom.xml";
                    this.fs.copyTpl(
                        this.templatePath(this.files[i]),
                        this.destinationPath(tempOutFile.replace(/src\/main\/java/g, path.join(src, packageFolder))),
                        { userProps: userProps }
                    );
                } else {
                    this.fs.copyTpl(
                        this.templatePath(this.files[i]),
                        this.destinationPath(this.files[i].replace(/src\/main\/java/g, path.join(src, packageFolder))),
                        { userProps: userProps }
                    );
                }
            }
        }

        if (showWsdl2Rest) {
            return wsdl2restGenerate(this.wsdl, this.outdirectory, this.jaxrsURL, this.jaxwsURL, this.camelDSL, showDebug);
        }
    }
};

var skipListForWsdl2RestFiles = [
    'src/main/resources/META-INF/spring/camel-context.xml',
    'src/main/resources/OSGI-INF/blueprint/blueprint.xml',
    'src/main/resources/camel-context.xml',
    'pom.xml'
];

function testFileForWsdl2RestSkip(file) {
    for(var i=0; i<skipListForWsdl2RestFiles.length; i++) {
        if (skipListForWsdl2RestFiles[i] == file) return true;
    }
}

var skipListForTemplateFiles = [
    'pom.xml.wsdl2rest'
];

function testFileForTemplateSkip(file) {
    for(var i=0; i<skipListForTemplateFiles.length; i++) {
        if (skipListForTemplateFiles[i] == file) return true;
    }
}

function wsdl2restGenerate(wsdlUrl, outputDirectory, jaxrs, jaxws, dsl, isDebug) {
    if (dsl.includes('java')) {
        console.log(`Generating Rest DSL from SOAP for a Camel Java DSL is currently unsupported.`);
        return;
    }

    var wsdl2restdir = path.join(__dirname, 'wsdl2rest');
    var targetDir = path.join(wsdl2restdir, 'target');
    var jar = utils.findWsdl2RestJar(targetDir);

    var logPath = path.join(wsdl2restdir, 'config', 'logging.properties');
    var logUrl = fileUrl(logPath);

    var actualJavaOutDirectory = outputDirectory;
    if (actualJavaOutDirectory.endsWith('/java')) {
        actualJavaOutDirectory = actualJavaOutDirectory.substring(0, actualJavaOutDirectory.indexOf("/java"));
    }
    var outPath = path.join(process.cwd(), actualJavaOutDirectory);
    var wsdlFileUrl;
    if (wsdlUrl.startsWith('http')) {
        wsdlFileUrl = wsdlUrl;
    } else if (!wsdlUrl.startsWith('file:')) {
        wsdlFileUrl = fileUrl(wsdlUrl);
    } else {
        wsdlFileUrl = wsdlUrl;
    }
 
    if (!fs.existsSync(outPath)){
        console.log(`Creating wsdl2rest java output directory`);
        fs.mkdirSync(outPath);
    }

    var restContextPath;
    var rawContextPath;

    const isBlueprint = dsl.match('blueprint');
    const isSpringBoot = dsl.match('spring-boot');
    const isSpring = dsl.match('spring');

    if (isBlueprint) {
        rawContextPath = "src/main/resources/OSGI-INF/blueprint/blueprint.xml";
    } else if (isSpringBoot) {
        rawContextPath = "src/main/resources/camel-context.xml";
    } else if (isSpring) {
        rawContextPath = "src/main/resources/META-INF/spring/camel-context.xml";
    }
    restContextPath = path.join(process.cwd(), rawContextPath);

    // build the java command with classpath, class name, and the passed parameters
    var cmdString = 'java '
        + ' -Dlog4j.configuration=' + logUrl
        + ' -jar ' + jar
        + ' --wsdl ' + wsdlFileUrl
        + ' --out ' + outPath;

    if (isBlueprint) {
        cmdString = cmdString + ' --blueprint-context ' + restContextPath;
    } else {
        cmdString = cmdString + ' --camel-context ' + restContextPath;
    }

    if (jaxrs) {
        cmdString = cmdString + ' --jaxrs ' + jaxrs;
    }
    if (jaxws) {
        cmdString = cmdString + ' --jaxws ' + jaxws;
    }
    console.log('Calling wsdl2rest');
    if (isDebug) {
        console.log('   command used: ' + cmdString);
    }
    return new Promise((resolve, reject) => {
        const wsdl2rest = exec(cmdString);
        if (isDebug) {
            wsdl2rest.stdout.on('data', function (data) {
                console.log(`stdout: ${data}`);
            });
            wsdl2rest.stderr.on('data', function (data) {
                console.log(`stderr: ${data}`);
            });
        }
        wsdl2rest.on('close', function (code) {
            if (code === 0) {
                console.log('   ' + chalk.green('create') + ' CXF artifacts for specified WSDL at ' + outputDirectory);
                console.log('   ' + chalk.green('create') + ' ' + rawContextPath);
                resolve()
            } else {
                reject()
                console.log(`   stderr: ${code}`);
                console.log(`   wsdl2rest did not generate artifacts successfully - please check the log file for details or re-run with --debug flag`);
            }
        });    
    })
}
