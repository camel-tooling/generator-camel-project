# Yeoman Resources

## What is Yeoman?
“...a generic scaffolding system allowing the creation of any kind of app. It allows for rapidly getting started on new projects and streamlines the maintenance of existing projects.”

* Provides an app-agnostic generator ecosystem that can be used to put together entire projects or just parts
* Based in node.js using the npm package manager
* Generators are available for Angular, Backbone, React, Polymer, and nearly 6,000 other projects

Common use cases for Yeoman generators include:

* Create a project
* Create a new chunk of a project, like a unit test
* Create a module or package
* Bootstrap a new service
* Enforce standards, best practices, and style guides in generated code
* Gets users started quickly with sample apps

It’s very easy to install once you have NPM on a system:

* Install it: npm install -g yo  (-g only works with admin privileges or via sudo if allowed)
* Find your generator and install it: npm install -g generator-webapp (see above comment!)
* And run it: yo webapp

## What are some basic Yeoman resources to get started?
There are quite a few:

* Main Yeoman site: http://yeoman.io/
* Writing your own Generator: http://yeoman.io/authoring/index.html
* Good tutorial: https://scotch.io/tutorials/create-a-custom-yeoman-generator-in-4-easy-steps
* IntelliJ Yeoman Plug-in: https://plugins.jetbrains.com/plugin/7987-yeoman
* VSCode yo-code Generator: https://code.visualstudio.com/docs/extensions/yocode
* Example from rsvalerio - Apache Camel + Spring Boot + Docker + Release plugin Yeoman Generator: https://github.com/rsvalerio/generator-camel

## Why should we care?
Yeoman can integrate easily with many of the IDEs we currently want to support:

* VSCode (see https://code.visualstudio.com/docs/extensions/yocode )
* IntelliJ (with a plug-in installed) - https://plugins.jetbrains.com/plugin/7987-yeoman 
* Eclipse Che

Depending on what we want to achieve regarding Fuse, we can quickly deliver yeoman generators to the http://yeoman.io/generators/ registry and have new functionality available to our users fast.

## What are we doing in Yeoman?
In Spring 2018, we started playing with Yeoman locally as a quick win to generate a simple project in a cross-platform manner with little code. We demonstrated it at the F2F in Italy in June 2018 and continued work on the Camel Project generator from there. 

A few notes about the generator:

* After installing the generator, create a new directory, change to the directory, and run: yo camel-project
* You provide a name (it defaults to the folder name), a version (defaults to 2.18.2), your DSL type (spring, blueprint, or java - defaults to spring), and a package name (defaults to "com." + project name). 
* If all is well, it creates a simple project based on the DSL-flavored template you provided. 
* To build and run the project, type "mvn install" and "mvn camel:run".

### Running from command line without prompts
With version 0.1.2 we have added command-line capabilities for providing argument values for the prompted information. Without prompting, this allows us to use the generator as part of a larger script to help prep a new project in a more automated fashion.

This allows us to do things like the following and avoid having to go through the prompts:
```
> yo camel-project appname=MyApp camelVersion=2.22.2 camelDSL=spring package=com.myapp
```

## What are some important links for the Camel Project generator?

* Camel Project generator is available at: https://www.npmjs.com/package/generator-camel-project
* Code is available at: https://github.com/camel-tooling/generator-camel-project
* Current list of issues: https://github.com/camel-tooling/generator-camel-project/issues
* Sonar - https://sonarcloud.io/dashboard?id=generator-camel-project
* Travis - https://travis-ci.org/camel-tooling/generator-camel-project

## Development Notes

### Grabbing the code
The code is available at github currently in: https://github.com/camel-tooling/generator-camel-project/

Fork the project and clone it locally. If you have suggestions or improvements, feel free to create
pull requests and issues.

### Running the generator
From the main generator-camel-project directory:
```
> npm link
```

Then create a directory you wish to create a Camel project in and run the generator as described above:
```
> yo camel-project
```

Read more [here](./README.md) for details on how to run the generator with all the bells and whistles.

### Running the Mocha tests
First you must install mocha with npm.

```
> npm install --global mocha
```

Then, in the main generator-camel-project directory:
```
> mocha --timeout=5000
```

Or you can run:
```
> npm test
```

This fires up a mocha instance with the timeout set.

### Deploying to NPM
Currently we've set up an automated system with Travis that uploads a new version to NPM when the following conditions are met:

* Version has been updated (https://github.com/camel-tooling/generator-camel-project/blob/master/package.json#L3)
* A tag has been created (https://github.com/camel-tooling/generator-camel-project/tags)

When those conditions are met, the project is uploaded to the npm server and presented to our users.

The NPM account currently used is for Brian Fitzpatrick (https://www.npmjs.com/settings/bfitzpatrh/) and reuses a token generated there.

