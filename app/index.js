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

const utils = require('./util');

const defaultCamelVersion = "2.22.1";
const defaultCamelDSL = "spring";
const defaultPackagePrefix = "com.";

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

        this.argument('appname', { type: String, required: false });
        this.argument('camelVersion', { type: String, required: false });
        this.argument('camelDSL', { type: String, required: false });
        this.argument('package', { type: String, required: false });

        this.option('wsdl2rest');
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

        if (showPrompts) {
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
            message: 'Camel DSL type (blueprint, spring, or java)',
            choices: ['blueprint', 'spring', 'java'],
            default: defaultDSL,
            validate: utils.validateCamelDSL,
            store: true
        }, prompts);
        utils.addPrompt({
            type: 'input',
            name: 'package',
            message: 'Package name: ',
            default: defaultPackage,
            validate : utils.validatePackage
        }, prompts);

        if (showWsdl2Rest) {
            var defaultOutput = 'src//main//java';
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
                default: defaultOutput,
                store: true
            }, prompts);
    
        }

        if (showPrompts) {
            return this.prompt(prompts).then(function (props) {
                this.appname = props.name;
                this.camelVersion = props.camelVersion;
                this.camelDSL = props.camelDSL;
                this.package = props.package;
                if (showWsdl2Rest) {
                    this.outdirectory = props.outdirectory;
                    this.wsdl = props.wsdl;
                }
            }.bind(this));
        } else {
            this.appname = defaultProject;
            this.camelVersion = defaultVersion;
            this.camelDSL = defaultDSL;
            this.package = defaultPackage;
        }
    };

    //writing logic here
    writing() {
        let showWsdl2Rest = this.options.wsdl2rest;

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
            this.fs.copyTpl(
                this.templatePath(this.files[i]),
                this.destinationPath(this.files[i].replace(/src\/main\/java/g, path.join(src, packageFolder))),
                { userProps: userProps }
            );
        }

        if (showWsdl2Rest) {
            wsdl2restGenerate(this.wsdl, this.outdirectory);
        }
    }
};

function wsdl2restGenerate(wsdlUrl, outputDirectory) {
    var dsl = new String(this.camelDSL);
    if (dsl.indexOf('java') > 0) {
        console.log(`Generating Rest DSL from SOAP for a Camel Java DSL is currently unsupported.`);
    }

    var wsdl2restdir = path.join(__dirname, 'wsdl2rest');
    var targetDir = path.join(wsdl2restdir, 'target');
    var jar = path.join(targetDir, 'wsdl2rest-impl-fatjar-0.1.1-SNAPSHOT.jar');
    var log4jDir = path.join(wsdl2restdir, 'config', 'logging.properties');
    var log4jDirStr = String(log4jDir);
    var log4jDirUrl = fileUrl(log4jDirStr);
    var outPath = path.join(process.cwd(), outputDirectory);
 
    if (!fs.existsSync(outPath)){
        console.log(`Creating wsdl2rest java output directory`);
        fs.mkdirSync(outPath);
    }

    var blueprintPath;
    var springPath;
    if (dsl.indexOf('blueprint') > 0) {
        blueprintPath = path.join(process.cwd(), "src/main/resources/OSGI-INF/blueprint/blueprint-rest.xml");
    } else {
        springPath = path.join(process.cwd(), "src/main/resources/META-INF/spring/camel-context-rest.xml");
    };

    // build the java command with classpath, class name, and the passed parameters
    var cmdString = 'java';
    cmdString = cmdString + ' -jar ' + jar;
    cmdString = cmdString + ' -Dlog4j.configuration=' + log4jDirUrl;
    cmdString = cmdString + ' --wsdl ' + wsdlUrl;
    cmdString = cmdString + ' --out ' + outPath;

    if (dsl.indexOf('blueprint') > 0) {
        cmdString = cmdString + ' --blueprint-context ' + blueprintPath;
    } else {
        cmdString = cmdString + ' --camel-context ' + springPath;
    }
    console.log('calling: ' + cmdString);
    const wsdl2rest = exec(cmdString);
    wsdl2rest.stdout.on('data', function (data) {
      console.log(`stdout: ${data}`);
    });
    wsdl2rest.stderr.on('data', function (data) {
      console.log(`stderr: ${data}`);
    });
    wsdl2rest.on('close', function (code) {
      if (code === 0) {
        console.log(`wsdl2rest generated artifacts successfully`);
      } else {
        console.log(`stderr: ${code}`);
        console.log(`wsdl2rest did not generate artifacts successfully - please check the log file for details`);
      }
    });    
}
