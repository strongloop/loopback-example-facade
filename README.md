# loopback-example-facade

This example demonstrates the **Microservice Facade Pattern**. It includes **four LoopBack applications** that implement the API that provides the data for the screen mocked up below.

<img src="https://github.com/strongloop/loopback-example-facade/blob/master/doc/app-mock.png?raw=true" width="300" />

## Try it out

**Download and run the code.**

```
$ git clone https://github.com/strongloop/loopback-example-facade
$ cd loopback-example-facade
$ docker-compose up --build
```

**Make a request to get the account summary screen data.**

```
$ bin/get-account-summary
```

**Run the System Status Health Check**

```
$ node health-check-client
```

## More Info

 - [What are Microservices?](https://github.com/strongloop/loopback-example-facade/wiki/What-are-Microservices%3F)
 - [The Microservice Facade Pattern](https://github.com/strongloop/loopback-example-facade/wiki/The-Microservice-Facade-Pattern)
 - [Caching Strategies](https://github.com/strongloop/loopback-example-facade/wiki/Caching-Strategieshttps://github.com/strongloop/loopback-example-facade/wiki/Health-Checks-and-System-Status)
 - [Health Checks and System Status](https://github.com/strongloop/loopback-example-facade/wiki/Health-Checks-and-System-Status)
 - [Transforming your Architecture](https://github.com/strongloop/loopback-example-facade/wiki/Transforming-your-Architecture)