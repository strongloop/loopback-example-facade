# Blog Post Work in Progress

## The App

![](https://github.com/strongloop/loopback-example-facade/blob/master/doc/app-mock.png?raw=true)

## Quick-Install
```
$ git clone https://github.com/strongloop/loopback-example-facade
$ cd loopback-example-facade
$ docker-compose up --build
```
Test
```
http://localhost:3000/api/Accounts/summary?accountNumber=CHK52321122
```
Health Check
```
$ docker inspect loopbackexamplefacade_facade_1 --format "{{json .State.Health }}"
```

## About
In this example, we create "Nano Bank" (a basic banking
application) to demonstrate best practices for writing scalable Microservices using LoopBack.


**Architectural Guidelines:**

## Goals
* **User innovation** : user applications in mobile/web must have easier access to banking services and automation through external APIs. eg: When booking flights through an airline's app, the user may have a credit card which gets them points from the banking institution as well as the payment service provider (eg: VISA, mastercard). If the airlines is able to claim the points of the purchase onbehalf of the consumer automatically through an external API, the consumer can use it to buy a lunch en-route free of charge. 

* **Business innovation** : various departments within the bank like stores, consumer service, cash, treasury, risk, etc should be able to build business processes easily using internal API's. eg: When building a latest analytics system within treasury, the design may require data feeds from securities, payments, cash reporting, accounts, etc. The designers must have easier access to data and services within the bank.

* **Service innovation** : Fine grained microservices would give technical excellence to the bank's IT, to provide easier, secure access to various resources available within the bank, as well as make faster design changes. eg: access to document repositories, cash reports, fraud alerts, payment services, etc.

SOA has been the prominent framework to provide business services until microservices arrived. Transition from a complete SOA implementation to Microservices will need a lot of thought about redesign and will have certain pain points. If the business logic could be separated from the integration problems, Microservices could be considered as an improvement of SOA in aspects of business services, though the driving idea behind microservices is different. 
[There are some articles discussing on how SOA can exist with microservices] (https://www.ibm.com/developerworks/websphere/library/techarticles/1601_clark-trs/1601_clark.html)
Most often business logic in SOA applications could be refactored into micro-services. 

* Design Transformation: 
      Architects and solution designers must start by separating business logic from integration solutions in existing SOA applications. Microservices can then be designed by focusing on designing business logic. With microservices business logic could be developed with much agility.

* Working alongside SOA stack:
      SOA services and integration processes might still be required to solve the integration problem in legacy systems.
   * They integrate disparate backend systems which often hold related data, that may lead to data integrity issues.
   * Soa frameworks (eg:BPEL) provides stateful business processes to avoid inconsistencies in distributed transactions.
   * background operations may be performed, message queues would be needed to send request and wait for a response.
   * many systems need transport and data transformation(xml vs soap vs flatfiles vs mainframe), SOA stack has many adapters.
   * transport to domain specific systems often need a message broker or transaction wrappers.
   * distributed transactions require a state machine to commit all or rollback all.
   * some systems are slow processors and would need a to callback to a stateful processor.

* Microservices with small integration/composition capabilities:
      Microservices can be allowed to be stateful, in certain conditions depending on the design, by holding request data and the state of backend process. Usually these raise questions of ownership of data, the atomicity of the transaction and how to quarantee a successful process. Careful analysis and implementation would often provide good results in this case.

## High Level Design
  * External APIs are modeled and data elements are named by the enterprise data-modeling team
  * Security profiles are created as per the policies of the enterprise architecture team.
  * Design of the facade layer is often reviewed directly by the enterprise architecture team.
  * The Microservices layer is designed by the already established guidelines of the internal architecture.
  * Security configurations which are already in use can most often directly be used.
  * Review of microservices design is done by domain specific technical architects and solution architects.
  * Microservices focus on business innovation
  * Facade/External APIs focus on user innovation


### Health

Modern container runtimes such as Docker, provide the ability to periodically run a health check on your running container. Even though your container is running, it still might not be responding, or otherwise in an undesirable state.

Health checks allow you to peek inside a container to ensure they should still be running. Each of your microservices should provide a useful response to this health check beyond a `health | unhealthy`. In this example we provide the following response for every service.

```
# set the health check in docker
HEALTHCHECK --interval=1m --timeout=10s \
  CMD curl -f http://localhost/api/vitals || exit 1

# example response (available per services via `docker inspect`)
{
  "status": "green", # color to display in a monitoring dasbhoard
  "dependencies": {
    "myDataSource": {
      "status": "yellow", # determined by time to "ping"
    },
    "otherServiceWithHealthEndpoint": {
      "status": "green", # from `/api/vitals` `status`
      "dependencies": {...} # same as other `dependencies` object
    }
  }
}
```

![Health](https://github.com/strongloop/loopback-example-facade/blob/master/doc/health.png)

## Prerequisites

### Docker

 - [Installing Docker / Docker Compose](https://docs.docker.com/compose/install/)
