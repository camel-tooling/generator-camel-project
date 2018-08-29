java ^
    -Dlog4j.configuration=file:./config/logging.properties ^
    -jar ./lib/wsdl2rest-impl.jar ^
    --wsdl file:./wsdl/address.wsdl ^
    --out output 

