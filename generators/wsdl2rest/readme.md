# Yeoman Generator for wsdl2rest

The wsdl2rest Yeoman Generator demonstrates the use of the wsdl2rest utility in a framework that is cross-ide (VSCode, IntelliJ with plug-in, and Eclipse Che). This is a sub-generator of the camel-project generator. 

NOTE THAT THIS CODE IS SUBJECT TO CHANGE RAPIDLY AND IS VERY MUCH A WORK IN PROGRESS.

## Building the Generator

In the ./generators/wsdl2rest directory, run:
```
> mvn clean install
```

This will pull the needed Java files into the ./generators/wsdl2rest/lib directory.

Once the files are there, make sure you are in the generator-wsdl2rest folder:

* type: npm link
* type: yo camel-project:wsdl2rest
* follow prompts
    for URL to input WSDL - it can be remote or local with a file:/ URL
    for Name of the output directory for generated artifacts - type a folder name - right now it's just added to the folder where you currently are

If all goes well, you should have a generated Camel XML DSL configuration file (Spring DSL) with REST DSL elements and generated wrapper code for the WSDL you pointed to. 
