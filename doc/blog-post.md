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


## Prerequisites

### Docker

 - [Installing Docker / Docker Compose](https://docs.docker.com/compose/install/)
