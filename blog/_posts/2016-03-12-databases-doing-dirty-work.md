---
toc: true
title: Databases Doing Dirty-work
date: '2016-03-12 00:00:00'
redirect_from:
- "/databases-doing-dirty-work"
- "/databases-doing-dirty-work/"
tags:
- sql
- threadmeup
---

[Eric did a great thing](http://www.codedependant.net/2016/03/11/timeseries-apis-on-a-dime-with-tnode-astypie-and-mysql/) in the past two weeks with his implementation of data calculating MySQL tables. In short, he wrote a table definition that updates itself on the hour by recalculating its own columns and records by determining the accrued new data and then summing and saving rows for each of our customers. Think of it as a preemptive cache that only has as much overheard as what has accrued in the last hour, with the added benefit of being entirely contained within our MySQL table definitions.

It’s reminded me of the old adage about letting the database do the work for you. There’s usually a way to get the information collated and keyed just the way you want it, but it will take more forethought into your query. And you more than likely won’t be able to use your shiny ORM.

Inspired by Eric’s approach, I started researching some specialty methods for MongoDB. I use Mongo as the datastore for the main service (out of a few micro-services) on [Narro](https://www.narro.co). MongoDB doesn’t have the job scheduling Eric employed for calculating time-series data, but it does have auto-expiry of records. I wonder what we could do with this? How about building [a rate-limiting service that auto-expires]( /2016/03/13/rate-limit-node-mongodb/) request counts!

