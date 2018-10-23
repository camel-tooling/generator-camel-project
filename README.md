[![GitHub tag](https://img.shields.io/github/tag/camel-tooling/generator-camel-project.svg?style=plastic)]()
[![Build Status](https://travis-ci.org/camel-tooling/generator-camel-project.svg?branch=master)](https://travis-ci.org/camel-tooling/generator-camel-project)
[![License](https://img.shields.io/badge/license-Apache%202-blue.svg)]()
[![Gitter](https://img.shields.io/gitter/room/camel-tooling/Lobby.js.svg)](https://gitter.im/camel-tooling/Lobby)

# generator-camel-project
Yeoman-based Camel Project Generator. 

This project uses the Yeoman framework and node.js to generate the scaffold for Apache Camel projects
as well as a simple template that can be used as a starting point. 

For a Spring DSL-based project, the structure looks like this:
```
├── README.md                                          Project Readme file
├── pom.xml                                            Maven Project Object Model file
└── src
    ├── main
    │   └── resources
    │       └── META-INF
    │           └── spring
    │               └── camel-context.xml              Camel configuration file (Spring XML DSL)
```

For a Blueprint DSL-based project, the structure looks like this:
```
├── README.md                                          Project Readme file
├── pom.xml                                            Maven Project Object Model file
└── src
    ├── main
    │   └── resources
    │       └── OSGI-INF
    │           └── blueprint
    │               └── blueprint.xml                  Camel configuration file (Blueprint XML DSL)
```

For a Java DSL-based project, the structure looks like this:
```
├── README.md                                          Project Readme file
├── pom.xml                                            Maven Project Object Model file
└── src
    ├── main
    │   └── java
    │       └── [your package name]
    │           └── routes
    │               └── CamelRoute.java                Camel Java class file containing sample route
    │               └── Launcher.java                  Java class aiding in launching from command line
```

## Installing the Camel Project generator

You must have yeoman installed first:
```
> npm install -g yo
```

The generator is located in the npm repository (https://www.npmjs.com/package/generator-camel-project):
```
> npm install --global generator-camel-project
```

## Running the Camel Project generator
```
> mkdir myproject
> cd myproject
> yo camel-project

     _                             _
    / \     _ __     __ _    ___  | |__     ___
   / _ \   | '_ \   / _` |  / __| | '_ \   / _ \
  / ___ \  | |_) | | (_| | | (__  | | | | |  __/
 /_/   \_\ | .__/   \__,_|  \___| |_| |_|  \___|
           |_|
       ____                              _
     /  ___|   __ _   _ __ ___     ___  | |
    |  |      / _` | | '_ ` _ \   / _ \ | |
    |  |___  | (_| | | | | | | | |  __/ | |
     \____|   \__,_| |_| |_| |_|  \___| |_|
 -----------------------------------------------
            Camel Project Generator
                 Version: 0.1.2
 -----------------------------------------------

? Your Camel project name (myproject)
? Your Camel version 2.18.2
? Camel DSL type (blueprint, spring, or java) blueprint
? Package name:  com.myproject
camel project name myproject
camel version 2.18.2
camel DSL blueprint
package name com.myproject
Creating folders
Copying files
   create pom.xml
   create README.md
   create src\main\resources\OSGI-INF\blueprint\blueprint.xml
   create src\main\resources\OSGI-INF\log4j2.properties
>
```

### Notes on input fields

* 'Camel project name' defaults to the name of the directory in which you start the generator.
* 'Camel version' defaults to 2.18.2 but if you provide a different version, that version then becomes the default  for the next time the generator is run.
* 'Camel DSL type' defaults to 'spring' but if you change it to a valid DSL type such as 'blueprint', 'spring', or 'java', that becomes the default for the next time the generator is run. If you enter an invalid value, the generator will present an error ">> Camel DSL must be either 'spring', 'blueprint', or 'java'.".
* 'Package name' defaults to 'com.' + the name of the directory (i.e. 'com.myproject'). This default does not change if you provide a different value.

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

## Running the Generator from the Command Line (*NEW*) 
With version 0.1.2 we have added command-line capabilities for providing argument values for the prompted information. Without prompting, this allows us to use the generator as part of a larger script to help prep a new project in a more automated fashion.

This allows us to do things like the following and avoid having to go through the prompts:
```
> yo camel-project appname=MyApp camelVersion=2.19.1 camelDSL=spring package=com.myapp
```

### Running the Mocha tests
First you must install mocha with npm.
```
> npm install --global mocha
```
Then, in the main generator-camel-project directory:
```
> mocha
```

## Running the Generated Templates

Generated templates for spring, blueprint, and Java DSLs can be run with:
```
> mvn install
> mvn camel:run
```
