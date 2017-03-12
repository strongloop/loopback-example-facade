# loopback-example-facade

```
$ git clone https://github.com/strongloop/loopback-example-facade
$ cd loopback-example-facade
$ docker-compose up --build
$ curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/Accounts/summary?accountNumber=CHK52321122'
```


## About

In this example, we create "Nano Bank" (a basic banking
application) to demonstrate best practices for writing scalable Microservices using LoopBack.

### Microservice Architecture

> "a suite of small services, each running in its own process and communicating with lightweight mechanisms, often an HTTP resource API"
> - [Martin Fowler (on Microservices)](https://martinfowler.com/articles/microservices.html)

In the diagram below, you can see the basic application architecture of the **Nano Bank** application.

 - **Clients** (in blue) - "Tablet App", "Phone App", "Web App" - represent potential channel specific client applications
 - **Facade** - The API's that provide public facing interfaces. They orchestrate the discrete Microservices
 - **Microservices** - The individual units of business logic that encapsulate and abstract, legacy applications (internal core banking services) and other complex proprietery applications in general referred to as `System of Records`
 - **Internal Services** - Existing services (mostly SOAP, REST, and proprietary HTTP) that accomplishes the goals of a Service Oriented Architecture(SoA) to integrate systems
 - **Systems of Record** - Databases, mainframes, and other information systems 

![Application Architecture](https://github.com/strongloop/loopback-example-facade/blob/master/doc/app-arch.png)

There are three key principals to this design:

**1) One way dependencies**

Each arrow represents the direction of coupling. Eg. the facade must know about the Account service API, but not the other way around. Microservices should not depend on the facade/API layer, more on why below.

**2) Purposeful Interfaces**

The facade should act as the mediator, simple orchestrator and aggregator. It should do so in a way that treats its clients (eg. a mobile application) as the first class citizen. This could mean providing coarse grain APIs that are purpose designed, allowing mobile clients to access data without having to do much aggregation. In some cases this also mean providing very fine grain APIs that allow almost database like access, allowing client applications to provide more rich / interactive experiences. The facade pattern used in this example allows for each service to be simple and focused. In this case on interacting with data in a reliable and scalable way. This doesn't mean the facade should be complex because it doesn't include any business logic. It only provides specific interfaces.

**3) Simple and Isolated Microservices**

Microservices represent the integration layer for the disparate backend systems. These systems often hold correlated data which may lead to data integrity issues and inconsistencies in business processes. Microservices need to use the best tools available across different plaforms and runtimes to give a consistent service abstraction. Microservices are hence PolyGlot services and could use multiple languages and runtimes within the same application domain.

### High Level Design

** Facade **

####Accounts API:
Provides models for users to create and query all types of bank accounts
  - POST: /RetailBanking/Accounts  > `AccountType = "Savings", "Checking"`
  - POST: /Wholesale/Accounts      > `AccountType = "Pension", "International"`
  - POST: /Commercial/Accounts     > `AccountType = "CertificateOfDeposits", "LetterOfCredit"`
  - POST: /Loan/Accounts           > `AccountType = "Mortgage", "Personal"`
  ```
     {
       "AccountType": "string",
       "CustomerNumber": "string"
     }
   ```

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

![Health](https://github.com/strongloop/loopback-example-facade/blob/master/doc/health.png)

## Prerequisites

### Docker

 - [Installing Docker / Docker Compose](https://docs.docker.com/compose/install/)

### Tutorials

- [Getting started with LoopBack](http://loopback.io/doc/en/lb3/Getting-started-with-LoopBack.html)
- [Other tutorials and examples](http://loopback.io/doc/en/lb3/Tutorials-and-examples.html)

### Knowledge

- [LoopBack models](http://docs.strongloop.com/display/LB/Defining+models)
- [LoopBack adding application logic](http://docs.strongloop.com/display/LB/Adding+application+logic)
- [LoopBack Swagger Connector]() (Link TBD)

## Procedure

### Step 1
### Step 2
### Step 3


[More LoopBack examples](https://github.com/strongloop/loopback-example)
