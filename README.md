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
                 Version: 0.1.3
 -----------------------------------------------

? Your Camel project name (myproject)
? Your Camel version 2.22.2
? Camel DSL type (blueprint, spring, or java) blueprint
? Package name:  com.myproject
camel project name myproject
camel version 2.22.2
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

### Notes on the main input fields for the generator

* 'Camel project name' defaults to the name of the directory in which you start the generator.
* 'Camel version' currently defaults to 2.22.2 but if you provide a different version, that version then becomes the default for the next time the generator is run.
* 'Camel DSL type' defaults to 'spring' but if you change it to a valid DSL type such as 'blueprint', 'spring', or 'java', that becomes the default for the next time the generator is run. If you enter an invalid value, the generator will present an error ">> Camel DSL must be either 'spring', 'blueprint', or 'java'.". Note that with the --wsdl2rest flag set, your DSL options are limited to 'spring' and 'blueprint'.
* 'Package name' defaults to 'com.' + the name of the directory (i.e. 'com.myproject'). This default does not change if you provide a different value. Note that you may need to change the package name to make it valid if your directory/project name contains special characters.

### wsdl2rest Options

As of version 0.1.3, you now have the option to scaffold a new Spring or Blueprint project based on an available WSDL file for a JAX-WS service. 

To run the generator with the additional wsdl2rest functionality, now you simply type:
```
> yo camel-project --wsdl2rest
```

This will prompt you for two additional properties:
* URL to the input WSDL? URL to the input WSDL (requires a file URL such as file:/E:/eclipse-photon/eclipse-workspace/empty-spring/src/main/resources/META-INF/wsdl/Address.wsdl or a WSDL served by a running JAX-WS service such as http://localhost:3000/helloworldservice?wsdl)
* Name of the output directory for generated artifacts? Name of the output directory for generated artifacts src//main//java (this is defaulted to src/main/java and will be where the generated CXF source goes from the wsdl you specify)
* Address of the generated jaxrs endpoint? This provides the path where the generated Camel Rest DSL service will be available when run and defaults to http://localhost:8081/jaxrs
* Address of the target jaxws endpoint? This provides the path where the JAX-WS service is running and currently defaults to http://localhost:8080/somepath. Note that this value must be changed currently to match the address:port provided in the WSDL's service/port definition. (See Known Issues for some details on this problem.)

### A note on supported WSDLs

The addition of the --wsdl2rest option has been made available to help scaffold projects for simple running SOAP services. The wsd2rest utility handles basic SOAP cases, but may not handle your particular scenario if your service uses WS-Security or other more complex options. 

To aid with debugging, we have added a "--debug" flag that will show additional information in the terminal. However, the wsdl2rest utility creates two log files -- velocity.log and wsdl2rest.log -- that will provide even more information. 

If you have a particular WSDL case you wish to be supported, we recommend logging a new issue with a WSDL sample and as much information as you can provide at https://github.com/jboss-fuse/wsdl2rest/issues

## Development Notes

### Downloading the code
The code is available at github currently in: https://github.com/camel-tooling/generator-camel-project/

Fork the project and clone it locally. If you have suggestions or improvements, feel free to create
pull requests and issues.

### Building the generator
From the main generator-camel-project directory:
```
> npm link
```

### Running the generator
Then create a directory you wish to create a Camel project in and run the generator as described above:
```
> yo camel-project
```

## Running the Generator from the Command Line
We have added command-line capabilities for providing argument values for the prompted information. Without prompting, this allows us to use the generator as part of a larger script to help prep a new project in a more automated fashion.

This allows us to do things like the following and avoid having to go through the prompts:
```
> yo camel-project appname=MyApp camelVersion=2.19.1 camelDSL=spring package=com.myapp
```

### Running the Generator from the Command Line with wsdl2rest
With version 0.1.3, we have also added command-line support for wsdl2rest options. Note that all values must be specified for successful project generation.

> yo camel-project appname=MyApp camelVersion=2.22.2 camelDSL=spring package=com.myapp wsdl=http://localhost:3000/helloworldservice?wsdl outdirectory=src/main/java jaxrs=http://localhost:8081/rest jaxws=http://localhost:3000/helloworldservice

### Running the generated projects

Generated templates for spring, blueprint, and Java DSLs can be run with:
```
> mvn install
> mvn camel:run
```

Note that there is an issue testing the generated Blueprint/wsdl2rest project currently using mvn camel:run, but it should deploy and run successfully on a Karaf/OSGi container. (See Known Issues)

### Running the Mocha tests
First you must install mocha with npm.
```
> npm install --global mocha
```
Then, in the main generator-camel-project directory:
```
> npm test
```

## Running the Generated Templates

Generated templates for spring, blueprint, and Java DSLs can be run with:
```
> mvn install
> mvn camel:run
```

## Known Issues

* jboss-fuse/wsdl2rest issue #72 - wsdl2rest does not currently pick up the jaxws address from the service/port/soap:address in the referenced wsdl - https://github.com/jboss-fuse/wsdl2rest/issues/72
* jboss-fuse/wsdl2rest issue #73 - update generated blueprint configuration to enable standalone testing as well as OSGi deployment - https://github.com/jboss-fuse/wsdl2rest/issues/73
