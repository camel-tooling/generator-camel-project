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

var Generator = require('yeoman-generator');
var exec = require('child_process').exec;
var path = require('path');
var fileUrl = require('file-url');

module.exports = class extends Generator {

  prompting() {
    var defaultOutput = 'src//main//java';

    var prompts = [{
      type: 'input',
      name: 'wsdl',
      message: 'URL to the input WSDL',
      store: true
    }, {
      type: 'input',
      name: 'outdirectory',
      message: 'Name of the output directory for generated artifacts',
      default: defaultOutput,
      store: true
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      this.log('wsdl url', props.wsdl);
      this.log('output path', props.outdirectory);
    }.bind(this));
  }

  //writing logic here
  writing() {
    app: {
      var userProps = this.props;
      var platformDelimiter = ':';
      if (process.platform === 'win32') 
        platformDelimiter = ';';

      var mainClass = 'org.jboss.fuse.wsdl2rest.impl.Main';  
      var libDir = path.join(__dirname, 'lib');
      var jarDir = path.join(libDir, 'wsdl2rest-impl.jar');
      var log4jDir = path.join(__dirname, 'config', 'logging.properties');
      var log4jDirStr = String(log4jDir);
      var log4jDirUrl = fileUrl(log4jDirStr);
      var outPath = path.join(process.cwd(), userProps.outdirectory);

      // build the java command with classpath, class name, and the passed parameters
      var cmdString = 'java';
      cmdString = cmdString + ' -Dlog4j.configuration=' + log4jDirUrl;
      cmdString = cmdString + ' -cp ' + jarDir + platformDelimiter + 
        libDir + '\\*' + platformDelimiter + '. ' + mainClass;
      cmdString = cmdString + ' --wsdl ' + userProps.wsdl;
      cmdString = cmdString + ' --out ' + outPath;

      console.log('calling: ' + cmdString);
      const wsdl2rest = exec(cmdString);

      wsdl2rest.stdout.on('data', function (data) {
        console.log(`stdout: ${data}`);
      });
      wsdl2rest.stderr.on('data', function (data) {
        console.log(`stderr: ${data}`);
      });
      wsdl2rest.on('close', (code) => {
        if (code === 0) {
          console.log(`wsdl2rest generated artifacts successfully`);
        } else {
          console.log('code came back as ${code}');
          console.log(`wsdl2rest did not generate artifacts successfully - please check the log file for details`);
        }
      });
    }
  }

};
