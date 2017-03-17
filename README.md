# loopback-example-facade

## The App

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
bin/get-account-summary
```

**Run the System Status Health Check**

```
node health-check-client
```

## About
In this example, we create "Nano Bank" (a basic banking
application) to demonstrate best practices for writing scalable Microservices using LoopBack.

## Microservice Architecture

> "a suite of small services, each running in its own process and communicating with lightweight mechanisms, often an HTTP resource API"
> - [Martin Fowler (on Microservices)](https://martinfowler.com/articles/microservices.html)

