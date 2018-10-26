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

'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var basicProps = {};
var fs = require('fs-extra');
const app_soap = require('./app_soap');

var defaultCamel = '2.22.2';

describe('generator-camel:wsdl2rest', function () {
  before(function () {
    app_soap.startWebService();
    console.log('Started web service on ' + app_soap.getServiceURL());
  });

  after(function () {
    app_soap.stopWebService();
    console.log('Stopped web service on ' + app_soap.getServiceURL());
  });

  describe('Should properly scaffold with wsdl2rest', function () {
    it('Should create the basic structure and CXF files for spring', function () {
      basicProps.name = 'MyAppMock';
      basicProps.package = 'com.generator.mock';
      basicProps.camelVersion = defaultCamel;
      basicProps.camelDSL = 'spring';
      var wsdlPath = path.join(__dirname, '../test/address.wsdl');
      basicProps.wsdl = wsdlPath;
      basicProps.outdirectory = 'src/main/java';
      return helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function (dir) {
          var done = this.async(); // `this` is the RunContext object.
          fs.copy(path.join(__dirname, '../templates'), dir, done);
          basicProps.outdirectory = path.join(dir, 'src/main/java');
        })
        .withOptions({ wsdl2rest: true })
        .withOptions({ debug: true })
        .withPrompts({ name: basicProps.name })
        .withPrompts({ camelVersion: basicProps.camelVersion })
        .withPrompts({ camelDSL: basicProps.camelDSL })
        .withPrompts({ package: basicProps.package })
        .withPrompts({ wsdl: basicProps.wsdl })
        .withPrompts({ outdirectory: basicProps.outdirectory })
        .toPromise()
        .then(() => {
          assert.file('pom.xml');
          assert.file('README.md');
          assert.file('src/main/resources/META-INF/spring/camel-context.xml');
          assert.file('src/main/java/org/jboss/fuse/wsdl2rest/test/doclit/Address.java');
          assert.noFile('pom.xml.wsdl2rest');
        });
    });

    it('Should create the basic structure and CXF files for blueprint', function () {
      basicProps.name = 'MyAppMock';
      basicProps.package = 'com.generator.mock';
      basicProps.camelVersion = defaultCamel;
      basicProps.camelDSL = 'blueprint';
      var wsdlPath = path.join(__dirname, '../test/address.wsdl');
      basicProps.wsdl = wsdlPath;
      basicProps.outdirectory = 'src/main/java';
      return helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function (dir) {
          var done = this.async(); // `this` is the RunContext object.
          fs.copy(path.join(__dirname, '../templates'), dir, done);
          basicProps.outdirectory = path.join(dir, 'src/main/java');
        })
        .withOptions({ wsdl2rest: true })
        .withPrompts({ name: basicProps.name })
        .withPrompts({ camelVersion: basicProps.camelVersion })
        .withPrompts({ camelDSL: basicProps.camelDSL })
        .withPrompts({ package: basicProps.package })
        .withPrompts({ wsdl: basicProps.wsdl })
        .withPrompts({ outdirectory: basicProps.outdirectory })
        .toPromise()
        .then(() => {
          assert.file('pom.xml');
          assert.file('README.md');
          assert.file('src/main/resources/OSGI-INF/blueprint/blueprint.xml');
          assert.file('src/main/java/org/jboss/fuse/wsdl2rest/test/doclit/Address.java');
          assert.noFile('pom.xml.wsdl2rest');
        });
    });

    it('Should create the basic structure and CXF files for spring with an internal running WSDL url', function () {

      basicProps.name = 'HelloWorld';
      basicProps.package = 'com.mock.hello';
      basicProps.camelVersion = defaultCamel;
      basicProps.camelDSL = 'spring';
      basicProps.jaxwsURL = 'http://localhost:3000/helloworldservice';
      basicProps.wsdl = 'http://localhost:3000/helloworldservice?wsdl';
      basicProps.outdirectory = 'src/main/java';
      basicProps.jaxrsURL = 'http://localhost:8081/rest';

      return helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function (dir) {
          var done = this.async(); // `this` is the RunContext object.
          fs.copy(path.join(__dirname, '../templates'), dir, done);
          basicProps.outdirectory = path.join(dir, 'src/main/java');
        })
        .withOptions({ wsdl2rest: true })
        .withPrompts({ name: basicProps.name })
        .withPrompts({ camelVersion: basicProps.camelVersion })
        .withPrompts({ camelDSL: basicProps.camelDSL })
        .withPrompts({ package: basicProps.package })
        .withPrompts({ wsdl: basicProps.wsdl })
        .withPrompts({ outdirectory: basicProps.outdirectory })
        .withPrompts({ jaxwsURL: basicProps.jaxwsURL })
        .withPrompts({ jaxrsURL: basicProps.jaxrsURL })
        .toPromise()
        .then(function (dir) {
          assert.file('pom.xml');
          assert.file('README.md');
          assert.file('src/main/resources/META-INF/spring/camel-context.xml');
          assert.noFile('pom.xml.wsdl2rest');
        });
    });

    it('Should create the basic structure and CXF files for spring with a sample wsdl and all required command line options', function () {
      basicProps.name = 'Address2';
      basicProps.package = 'com.mock.address2';
      basicProps.camelVersion = defaultCamel;
      basicProps.camelDSL = 'spring';
      basicProps.jaxwsURL = 'http://localhost:9090/AddressPort';
      basicProps.jaxrsURL = 'http://localhost:8081/rest';
      var wsdlPath = path.join(__dirname, '../test/address.wsdl');
      basicProps.wsdl = wsdlPath;
      basicProps.outdirectory = 'src/main/java';

      var args = [];
      args.push("appname=" + basicProps.name);
      args.push("camelVersion=" + basicProps.camelVersion);
      args.push("camelDSL=" + basicProps.camelDSL);
      args.push("package=" + basicProps.package);
      args.push("wsdl=" + basicProps.wsdl);
      args.push("outdirectory=" + basicProps.outdirectory);
      args.push("jaxrs=" + basicProps.jaxrsURL);
      args.push("jaxws=" + basicProps.jaxwsURL);

      return helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function (dir) {
          var done = this.async(); // `this` is the RunContext object.
          fs.copy(path.join(__dirname, '../templates'), dir, done);
          basicProps.outdirectory = path.join(dir, 'src/main/java');
        })
        .withArguments(args)
        .withOptions({ wsdl2rest: true })
        .toPromise()
        .then(() => {
          assert.file('pom.xml');
          assert.file('README.md');
          assert.file('src/main/resources/META-INF/spring/camel-context.xml');
          assert.noFile('pom.xml.wsdl2rest');
        });
    });
  });
});