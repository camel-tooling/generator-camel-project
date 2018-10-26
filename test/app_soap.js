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

 var http = require('http');
var soap = require('soap');
var path = require('path');
var methods = {};

var helloworldservice = {
    HelloService: {
        HelloPort: {
            // This is how to define an asynchronous function.
            sayHello: function (args, callback) {
                // do some work
                console.log('sayHello: ' + JSON.stringify(args));
                callback({'greeting': 'Hello '+ args.firstName});
            }
        }
    }
};

var wsdlFile = path.join(__dirname, '../test/helloworld.wsdl');

var wsdlxml = require('fs').readFileSync(wsdlFile, 'utf8'),
    server = http.createServer(function (request, response) {
        response.end("404: Not Found: " + request.url);
    });

var PORT = 3000;

methods.startWebService = function () {
    server.listen(PORT);
    console.log('server running on port ' + PORT);

    soap.listen(server, '/helloworldservice', helloworldservice, wsdlxml);
}

methods.stopWebService = function () {
    server.close(function() {
        server = null;
  });
}

methods.getServiceURL = function() {
    return 'http://localhost:' + PORT + '/helloworldservice';
}

methods.getWSDLURL = function() {
    return methods.getServiceURL() + '?wsdl';
}

module.exports = methods;
