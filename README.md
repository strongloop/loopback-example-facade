# loopback-example-facade

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
http://localhost:3004/api/Vitals
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

## Goals
* **User innovation** : user applications in mobile/web must have easier access to banking services and automation through external APIs. eg: When booking flights through an airline's app, the user may have a credit card which gets them points from the banking institution as well as the payment service provider (eg: VISA, mastercard). If the airlines is able to claim the points of the purchase onbehalf of the consumer automatically through an external API, the consumer can use it to buy a lunch en-route free of charge. 

* **Business innovation** : various departments within the bank like stores, consumer service, cash, treasury, risk, etc should be able to build business processes easily using internal API's. eg: When building a latest analytics system within treasury, the design may require data feeds from securities, payments, cash reporting, accounts, etc. The designers must have easier access to data and services within the bank.

* **Service innovation** : Fine grained microservices would give technical excellence to the bank's IT, to provide easier, secure access to various resources available within the bank, as well as make faster design changes. eg: access to document repositories, cash reports, fraud alerts, payment services, etc.

***Architectural Principles:***

**1) One way dependencies**

Each arrow represents the direction of coupling. Eg. the facade must know about the Account service API, but not the other way around. Microservices should not depend on the facade/API layer, more on why below.

**2) Simple and Purposeful Interfaces**

The facade provides easy standard business models as APIs for the users like, POST:/Retail/Account, (to create a checking account) and act as a mediator, simple orchestrator and data aggregator. It treats its clients (eg. a mobile application) as the first class citizen. This could mean providing coarse grain APIs like, POST:/Retail/PayPalPayment (to complete shopping online and make payment via paypal authentication) that are purpose designed allowing mobile clients to access data without having to do much aggregation. In some cases this also mean providing very fine grain APIs that allow almost database like access, allowing client applications to provide more rich / interactive experiences. This doesn't mean the facade should be complex because it doesn't include any business logic; it only provides specific interfaces. The facade pattern used in this example allows for each service to be simple and focused, interacting in a reliable and scalable way.

**3) Isolated Microservices**

Microservices implements business logic and provides internal services or internal APIs, like debit an account, create Ach Transaction, validate cheque fraudevents, etc. Microservices need to use the best tools available across different plaforms and runtimes to give a consistent service abstraction. Microservices are hence PolyGlot services and could use multiple languages and runtimes within the same application domain. In Microservices Architecture, fine grained services allow APIs to securely access many resources and tools with agility.

**Architectural Guidelines:**

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


### Caching

This example demonstrates two styles of Microservice caching. **Public** - sharing a cache between multiple services and **Private** - isolated caching, one cache per service.

![Caching](https://github.com/strongloop/loopback-example-facade/blob/master/doc/request-caching.png)

**How to choose which style of cache to use?**

In the diagram above you can see where each type of caching is appropriate. As requests flow from top to bottom, caching should become less aggressive. At the lower layers, data consistency is more important than performance. At the higher levels, eg. the facade and API gateway, caching can be much more aggressive. As mentioned above, the facade layer should not have any business logic. This means data at this layer does not have the same consistency requirements as data in the lower tiers.

Microservices should be isolated. When possible this should be applied to their dependencies, in this case their cache. Isolation allows you to develop services independently and quickly. Rebuilding services becomes much simpler this way, since there aren't shared contracts for a shared cache.

**Public Cache Example**


DataPower Assembly (API Gateway)

```yaml
- invoke:
  title: Get quote for given symbol
  target-url: WXS://grid/read?key=/symbols/{symbol}
```

LoopBack Application (Facade)

```js
const messageBroker = new Client(connectionInfo, Adapter); // strong-pubsub
messageBroker.subscribe('/symbols/*');
messageBroker.on('message', setPriceForSymbol);

function setPriceForSymbol(topic, price) {
  Cache.set(topic, price);
}
```

The example above demonstrates the Facade and API Gateway sharing the same cache to allow the gateway to access dynamic data (stock prices changing) without the cost of an extra HTTP request.

**Private Cache Example**
```js
// server/mixins/cache-queries.js
module.exports = function(Model, options) {
  CachedModel.on('dataAccessConfigured', function() {
    const Model = this;
    Model._findLive = CachedModel.find;
    Model.find = async (filter, options) => {
      const key = getKeyForFilter(filter);
      var cached = await Cache.get(key);
      if (cached) 
        return Promise.resolve(cached);
      else
        return Model._findLive(filter, options);
    };
  });
};
```

The private cache example, demonstrates a simple caching layer for an individual microservice. The details of `getKeyForFilter`, how the cached data is stored (eg. JSON) and all other concerns need to be understood only by this service.

**TTL**

  - ttl
   - data that doesn't change often should be cached with a ttl that reflects a longer time / usage
   - data that changes often should be cached with a shorter ttl
  - consistency (only in SoR) vs highly dynamic (only in cache)
    - what makes it hard is the grey area in between 

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
