const app_soap = require('../test/app_soap');

console.log('WSDL URL: ' + app_soap.getWSDLURL());
app_soap.startWebService();
