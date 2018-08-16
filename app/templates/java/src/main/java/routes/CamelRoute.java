package <%= userProps.package %>.routes;

import org.apache.camel.builder.RouteBuilder;

public class CamelRoute extends RouteBuilder {

	@Override
	public void configure() throws Exception {
		/* 
		 * You can define here the Camel Route.
		 * For instance, start by calling from() method, then use the Fluent API to build the Camel Route definition.
		 */
		from("timer://simpleTimer?period=1000")
			.setBody(simple("Hello from timer at ${header.firedTime}"))
			.to("stream:out");		
	}
}
