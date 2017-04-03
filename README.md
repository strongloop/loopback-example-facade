# loopback-example-facade

This example demonstrates best practices for building scalable Microservices. [See the slides](https://www.slideshare.net/RitchieMartori/scaling-your-microservices-with-loopback) for an overview.

 - [The Interaction Tier](https://github.com/strongloop/loopback-example-facade/wiki/The-Interaction-Tier)
 - [The Microservice Facade Pattern](https://github.com/strongloop/loopback-example-facade/wiki/The-Microservice-Facade-Pattern)
 - [Caching Strategies](https://github.com/strongloop/loopback-example-facade/wiki/Caching-Strategies)
 - [Health Checks and System Status](https://github.com/strongloop/loopback-example-facade/wiki/Health-Checks-and-System-Status)
 - [Transforming your Architecture](https://github.com/strongloop/loopback-example-facade/wiki/Transforming-your-Architecture)

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
