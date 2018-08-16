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

module.exports = class extends yeoman {

    constructor(args, opts) {
        super(args, opts);
    
        this.argument('appname', { type: String, required: false });
        this.argument('camelVersion', { type: String, required: false });
        this.argument('camelDSL', { type: String, required: false });
        this.argument('package', { type: String, required: false });
    }

    prompting() {

        this.log('     _                             _');
        this.log('    / \\     _ __     __ _    ___  | |__     ___');
        this.log('   / _ \\   | \'_ \\   / _` |  / __| | \'_ \\   / _ \\');
        this.log('  / ___ \\  | |_) | | (_| | | (__  | | | | |  __/');
        this.log(' /_/   \\_\\ | .__/   \\__,_|  \\___| |_| |_|  \\___|');
        this.log('           |_|');
    
        this.log('       ____                              _');
        this.log('     /  ___|   __ _   _ __ ___     ___  | |');
        this.log('    |  |      / _` | | \'_ ` _ \\   / _ \\ | |');
        this.log('    |  |___  | (_| | | | | | | | |  __/ | |');
        this.log('     \\____|   \\__,_| |_| |_| |_|  \\___| |_|');
        this.log(' -----------------------------------------------');
        this.log('            Camel Project Generator'); 
        this.log(' -----------------------------------------------');
        this.log('');

        var defaultProject = this.appname;
        if (!utils.isEmpty(this.options.appname)) {
            defaultProject = this.options.appname;
        }

        var defaultVersion = '2.18.1';
        if (!utils.isEmpty(this.options.camelVersion)) {
            defaultVersion = this.options.camelVersion;
        }

        var defaultDSL = 'spring';
        if (!utils.isEmpty(this.options.camelDSL)) {
            defaultDSL = this.options.camelDSL;
        }

        var defaultPackage = 'com.' + this.appname;
        if (!utils.isEmpty(this.options.package)) {
            defaultDSL = this.options.package;
        }

        var prompts = [{
                type    : 'input',
                name    : 'name',
                message : 'Your Camel project name',
                default : defaultProject
            }, 
            {
                type    : 'input',
                name    : 'camelVersion',
                message : 'Your Camel version',
                default : defaultVersion,
                store   : true
            },
            {
                type    : 'input',
                name    : 'camelDSL',
                message : 'Camel DSL type (blueprint, spring, or java)',
                choices : ['blueprint', 'spring', 'java'],
                default : defaultDSL,
                validate : utils.validateCamelDSL,
                store   : true
            }, {
                type: 'input',
                name: 'package',
                message: 'Package name: ',
                default: defaultPackage
            }];
            return this.prompt(prompts).then(function (props) {
                this.props = props;
                this.log('camel project name', props.name);
                this.log('camel version', props.camelVersion);
                this.log('camel DSL', props.camelDSL);
                this.log('package name', props.package);
            }.bind(this));
        }
        
        //writing logic here
        writing() {
            app: {
                var userProps = this.props;

                var packageFolder = userProps.package.replace(/\./g, '/');
                var src = 'src/main/java';
                var myTemplatePath = path.join(this.templatePath(), userProps.camelDSL);
                this.folders = glob.sync('**/*/', {cwd: myTemplatePath});
                this.files = glob.sync('**/*', {cwd: myTemplatePath, nodir: true});

                this.log('Creating folders');
                this.folders.forEach(function (folder) {
                    mkdirp.sync(folder.replace(/src\/main\/java/g, path.join(src, packageFolder)));
                });
            
                this.log('Copying files');
                this.sourceRoot(myTemplatePath);
                for (var i = 0; i < this.files.length; i++) {
                    this.fs.copyTpl(
                        this.templatePath(this.files[i]),
                        this.destinationPath(this.files[i].replace(/src\/main\/java/g, path.join(src, packageFolder))),
                        {userProps: userProps}
                    );
                }
            }
        }
};
