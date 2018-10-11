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
const utils = require('./util');

const defaultCamelVersion = "2.18.1";
const defaultCamelDSL = "spring";
const defaultPackagePrefix = "com.";

var appname;
var camelVersion;
var camelDSL;
var package;

function consoleHeader() {
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
            type    : 'input',
            name    : 'camelVersion',
            message : 'Your Camel version',
            default : defaultVersion,
            store   : true
        }, prompts);
        utils.addPrompt({
            type    : 'input',
            name    : 'camelDSL',
            message : 'Camel DSL type (blueprint, spring, or java)',
            choices : ['blueprint', 'spring', 'java'],
            default : defaultDSL,
            validate : utils.validateCamelDSL,
            store   : true
            }, prompts);     
        utils.addPrompt({
            type: 'input',
            name: 'package',
            message: 'Package name: ',
            default: defaultPackage
        }, prompts);
 
        if (showPrompts) {
            return this.prompt(prompts).then(function (props) {
                this.appname = props.name;
                this.camelVersion = props.camelVersion;
                this.camelDSL = props.camelDSL;
                this.package = props.package;
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
    }
};
