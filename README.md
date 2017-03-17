# loopback-example-facade

## The App

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

In the diagram below, you can see the basic application architecture of the **Nano Bank** application.

 * **Clients** (in blue) - "Tablet App", "Phone App", "Web App" - represent potential channel specific client applications.
 * **Facade** - The API's that provide public facing interfaces. They orchestrate the discrete Microservices.
 * **Microservices** - We have considered microservices as internal APIs or smaller services of business logic. They provide simple services for banking transactions. In principle, they are micro applications, and provide a simple component oriented application development. They encapsulate and abstract, complex legacy applications (internal SOA services) and other  proprietery softwares (core-banking, fraud management, cards applications, etc) in general referred to as `System of Records`. 
 * **Internal Services** - Existing services (mostly SOAP, REST, and proprietary HTTP) that accomplishes the goals of a Service Oriented Architecture(SoA). The extent of traditional SOA infrastructure required is based on the complexity of the legacy systems. SOA infact expanded out of the integration problem in legacy systems.
 * **System of Records** - Databases, mainframes, and other information systems 

![Application Architecture](https://github.com/strongloop/loopback-example-facade/blob/master/doc/app-arch.png)
