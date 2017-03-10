# loopback-example-facade

```
$ git clone https://github.com/strongloop/loopback-example-facade
$ cd loopback-example-facade
$ docker-compose up --build
```


## About

In this example, we create "Nano Bank" (a basic banking
application) to demonstrate best practices for writing scalable Microservices using LoopBack.

### Application Architecture

![Application Architecture](https://github.com/strongloop/loopback-example-facade/blob/master/doc/app-arch.png)

### Caching

![Caching](https://github.com/strongloop/loopback-example-facade/blob/master/doc/request-caching.png)

 - How does the cache work in a simple code example?
 - Two approaches to caching:
  - public / shared - cache shared between facade and microservice
  - private - one cache per facade or microservice
  - how to choose?
   - coupling vs isolation
   - what happens when a shared cache goes down?
  - from bottom layer to top: 
   - as you go up, the caching becomes more aggressive
  - microservices should have their own simple private caches
   - developed by multiple teams
   - should be isolated
  - facade and gateway should share a public cache and aggressively cache data
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