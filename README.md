# loopback-example-facade

## Quick-Install
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

 * **Clients** (in blue) - "Tablet App", "Phone App", "Web App" - represent potential channel specific client applications
 * **Facade** - The API's that provide public facing interfaces. They orchestrate the discrete Microservices
 * **Microservices** - In principal, are micro applications, and provide a simple component oriented application development. In our architecture we have considered microservices (/microapplications) as the individual units of business logic and provide simple service interfaces for banking transactions. They encapsulate and abstract, legacy applications (internal core banking services) and other complex proprietery softwares in general referred to as `System of Records`. 
 * **Internal Services** - Existing services (mostly SOAP, REST, and proprietary HTTP) that accomplishes the goals of a Service Oriented Architecture(SoA). The extent of traditional SOA infrastructure required is based on the complexity of the legacy systems. SOA infact expanded out of the integration problem in legacy systems.
   * Some of the systems accept only flat files as input, file adapters will be needed to connect with them.
   * domain specific systems often have a message broker as a means of accepting communication
   * monolithic single install systems may have online transaction wrappers installed with them
   * background operations may be performed, message queues would be needed to send request and wait for a response.
   * same entity like customer may exist in multiple DBs, requiring data graphs.
   * parallel transactions/services may need to be initiated, which require a state machine to commit all or rollback all
   * different systems may need different transport protocols, like http vs soap vs mainframe
   * different systems may need different data formats, like cobol copy books, feed files, xml, command interfaces
   * some systems are slow processors and would need a url/endpoint to callback on completion
> Most often SOA applications could be refactored into micro-services. Microservices, could be considered as an improvement of SOA in aspects of service encapsulation, though the driving idea behind microservices is different. With microservices business processes interact with each other at a granular level. There are many articles discussing on how SOA can exist with microservices. [Microservices and SOA, Friends or Enemies] (https://www.ibm.com/developerworks/websphere/library/techarticles/1601_clark-trs/1601_clark.html)

 - **Systems of Record** - Databases, mainframes, and other information systems 

![Application Architecture](https://github.com/strongloop/loopback-example-facade/blob/master/doc/app-arch.png)

There are three key principals to this design:

**1) One way dependencies**

Each arrow represents the direction of coupling. Eg. the facade must know about the Account service API, but not the other way around. Microservices should not depend on the facade/API layer, more on why below.

**2) Simple and Purposeful Interfaces**

The facade should provide easy application interfaces for the users and act as a mediator, simple orchestrator and data aggregator. It should do so in a way that treats its clients (eg. a mobile application) as the first class citizen. This could mean providing coarse grain APIs that are purpose designed, allowing mobile clients to access data without having to do much aggregation. In some cases this also mean providing very fine grain APIs that allow almost database like access, allowing client applications to provide more rich / interactive experiences. This doesn't mean the facade should be complex because it doesn't include any business logic; it only provides specific interfaces. The facade pattern used in this example allows for each service to be simple and focused, interacting in a reliable and scalable way.

**3) Isolated Microservices**

Microservices represent the services layer and implements the business logic. They integrate disparate backend systems which often hold correlated data in separate data stores, that may lead to data integrity issues and inconsistencies in business processes. 
Microservices need to use the best tools available across different plaforms and runtimes to give a consistent service abstraction. Microservices are hence PolyGlot services and could use multiple languages and runtimes within the same application domain.

## High Level Design
  * External APIs are modeled and data elements are named by the enterprise data-modeling team
  * Security profiles are created as per the policies of the enterprise architecture team.
  * Design of the facade layer is often reviewed directly by the enterprise architecture team.
  * The Microservices layer is designed by the already established guidelines of the internal architecture.
  * Security configurations which are already in use can most often directly be used.
  * Review of microservices design is done by domain specific technical architects and solution architects.
  * Microservices focus on business innovation
  * Facade/External APIs focus on user innovation

### Facade 

* **Accounts API:**
Provides models for users to create and query all types of bank accounts

 * before creating an account it calls the account number generator
 * Any cash deposit will be preceded by checking a CashMonitoringReport microservice
 * URLs
   * POST: /RetailBanking/Accounts
     * `AccountType = "Savings", "Checking"`
    * GET:  /RetailBanking/Accounts ?AccountNumber=
    * POST: /Wholesale/Accounts
      * `AccountType = "Pension", "International"`
    * GET:  /Wholesale/Accounts ?AccountNumber=
    * POST: /Commercial/Accounts
      * `AccountType = "CertificateOfDeposits", "LetterOfCredit"`
    * GET:  /Commercial/Accounts ?AccountNumber=
    * POST: /Loan/Accounts
      * `AccountType = "Mortgage", "Personal"`
    * GET:  /Loan/Accounts ?AccountNumber=
    * POST: /RetailBanking/Debit
    * POST: /RetailBanking/Credit
    * POST: /RetailBanking/Cheques
    * POST: /Retailbanking/Deposit
    * POST: /Loan/Payments
    * POST: /Wholesale/LetterOfCredit
    * POST: /Customer/CashMonitoringReport 
      * accessible only to tellers

 * Data:
  ```
  {
     "AccountType": "string",
     "CustomerNumber": "string"
  }
  ```

* **Customer API:**
 * Provides models for users to create and query customers for all banking domains 
 * URLs
   * POST: /Personal/Customer
   * POST: /Business/Customer
   * GET: /Personal/Customer ?CustomerNumber=
   * GET: /Business/Customer ?CustomerNumber=

 * Data:
  ```
  {
     "Address": "string",
     "SSN": "string",
     "Identification": "string"
  }
  ```


### Microservices 

* **Account Number Generator:**
  * Creates new account numbers
  * interacts with core banking to generate account numbers
     * POST: /GenerateAccount

* **Customer:**
  * Creates new customers and queries customers
  * interacts with core banking to generate customer numbers
    * POST: /Customer
    * GET: /Customer ?CustomerNumber= &id= 
  
* **Retail Account:**
   * Creates new checking or savings account and queries retail accounts
   * after creation of an account it creates a new account summary in core banking
      * POST: /Account
      * GET: /Account ?CustomerNumber=
      * GET: /Account ?AccountNumber=
* **CashMonitoringReport:**
   * handles calls to a cash transactions monitoring system to avoid money laundering
     * POST: /Customer/CashReporting
     * GET: /Customer/CashReporting ?CustomerNumber=

* **Loan Account:**
  * Creates new loan accounts and queries loan accounts
  * after creation of an account it creates a new account summary in core banking
    * POST: /Account
    * GET: /Account ?CustomerNumber=
    * GET: /Account ?AccountNumber=

* **Transactions:**
  * submits transactions on accounts in core-banking 
  * A debit transaction in one account will result in a credit transaction in another account.
    * POST: /Transaction
    * GET: /Transaction ?AccountNumber= 
    * Implements the transactions on accounts.

* **AchTransactions:**
  * submits ACH transactions for bank to bank transfer
  * Implements ACH transactions, makes calls to ACH clearing house.
    * POST: /Transaction
    * GET: /Transaction ?AccountNumber= 
    
* **SwiftTransactions:**
  * submits swift transactions for international transfers
  * Implements call to swift gateways.
    * POST: /Transaction
    * GET: /Transaction ?AccountNumber= 
    
* **CashTransactions:**
  * handles teller transactions
  * after posting the transaction, notifies any Cash Reporting/Money Laundering/Cash monitoring system.
    * POST: /Transaction
    * GET: /Transaction ?AccountNumber= 
    
* **Account Summary:**
   * Updates summary data in core-banking, updated with monthly details for average balance, etc
     * POST: /Account
     * GET: /Account ?AccountNumber=


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
