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

describe('generator-camel:app', function () {

  describe('Should properly scaffold with default config for Spring', function () {

    before(function () {
      basicProps.name = 'MyAppMock';
      basicProps.package = 'com.generator.mock';
      basicProps.camelVersion = '2.18.2';
      basicProps.camelDSL = 'spring';

      return helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function (dir) {
          var done = this.async(); // `this` is the RunContext object.
          fs.copy(path.join(__dirname, '../templates'), dir, done);
        })
        .withPrompts({ name: basicProps.name })
        .withPrompts({ camelVersion: basicProps.camelVersion })
        .withPrompts({ camelDSL: basicProps.camelDSL })
        .withPrompts({ package: basicProps.package })
        .toPromise();
    });

    it('Should create the basic structure', function () {
      assert.file('pom.xml');
      assert.file('README.md');
      assert.file('src/main/resources/META-INF/spring/camel-context.xml');
    });

    it('Should create pom.xml with default content', function () {
      assert.fileContent('pom.xml', new RegExp('<groupId>' + basicProps.package + '</groupId>') );
      assert.fileContent('pom.xml', new RegExp('<artifactId>' + basicProps.name + '</artifactId>') );
    });
  });

  describe('Should properly scaffold with default config for Blueprint', function () {

    before(function () {
      basicProps.name = 'MyAppMockBP';
      basicProps.package = 'com.generator.mock.bp';
      basicProps.camelVersion = '2.18.2';
      basicProps.camelDSL = 'blueprint';

      return helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function (dir) {
          var done = this.async(); // `this` is the RunContext object.
          fs.copy(path.join(__dirname, '../templates'), dir, done);
        })
        .withPrompts({ name: basicProps.name })
        .withPrompts({ camelVersion: basicProps.camelVersion })
        .withPrompts({ camelDSL: basicProps.camelDSL })
        .withPrompts({ package: basicProps.package })
        .toPromise();
    });

    it('Should create the basic structure', function () {
      assert.file('pom.xml');
      assert.file('README.md');
      assert.file('src/main/resources/OSGI-INF/blueprint/blueprint.xml');
    });

    it('Should create pom.xml with default content', function () {
      assert.fileContent('pom.xml', new RegExp('<groupId>' + basicProps.package + '</groupId>') );
      assert.fileContent('pom.xml', new RegExp('<artifactId>' + basicProps.name + '</artifactId>') );
    });
  });

  describe('Should properly scaffold with default config for Java DSL', function () {

    before(function () {
      basicProps.name = 'MyAppMockJava';
      basicProps.package = 'com.generator.mock.javadsl';
      basicProps.camelVersion = '2.18.2';
      basicProps.camelDSL = 'java';

      return helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function (dir) {
          var done = this.async(); // `this` is the RunContext object.
          fs.copy(path.join(__dirname, '../templates'), dir, done);
        })
        .withPrompts({ name: basicProps.name })
        .withPrompts({ camelVersion: basicProps.camelVersion })
        .withPrompts({ camelDSL: basicProps.camelDSL })
        .withPrompts({ package: basicProps.package })
        .toPromise();
    });

    it('Should create the basic structure', function () {
      assert.file('pom.xml');
      assert.file('README.md');
      assert.file('src/main/java/com/generator/mock/javadsl/routes/CamelRoute.java');
      assert.file('src/main/java/com/generator/mock/javadsl/routes/Launcher.java');
    });

    it('Should create pom.xml with default content', function () {
      assert.fileContent('pom.xml', new RegExp('<groupId>' + basicProps.package + '</groupId>') );
      assert.fileContent('pom.xml', new RegExp('<artifactId>' + basicProps.name + '</artifactId>') );
    });
  });

  describe('Should properly scaffold with command line options rather than prompts', function () {

    before(function () {
      basicProps.name = 'MyAppMock2';
      basicProps.package = 'com.generator.mock2';
      basicProps.camelVersion = '2.18.2';
      basicProps.camelDSL = 'spring';

      var args = [];
      args.push("appname=" + basicProps.name);
      args.push("camelVersion=" + basicProps.camelVersion);
      args.push("camelDSL=" + basicProps.camelDSL);
      args.push("package=" + basicProps.package);

      return helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function (dir) {
          var done = this.async(); // `this` is the RunContext object.
          fs.copy(path.join(__dirname, '../templates'), dir, done);
        })
        .withArguments(args)
        .toPromise();
    });

    it('Should create the basic structure', function () {
      assert.file('pom.xml');
      assert.file('README.md');
      assert.file('src/main/resources/META-INF/spring/camel-context.xml');
    });

    it('Should create pom.xml with default content', function () {
      assert.fileContent('pom.xml', new RegExp('<groupId>' + basicProps.package + '</groupId>') );
      assert.fileContent('pom.xml', new RegExp('<artifactId>' + basicProps.name + '</artifactId>') );
    });
  });
});
