---
toc: true
title: Migrating a MongoDB App Datastore to PostgreSQL
date: '2017-06-06 00:00:00'
tags:
- infrastructure
redirect_from:
- "/migrating-a-mongodb-app-datastore-to-postgresql"
- "/migrating-a-mongodb-app-datastore-to-postgresql/"
serial_number: 2017.BLG.003
---
A couple weeks ago, [Narro](https://narro.co) had a nice uptick in usage from Pro users that resulted in a large increase in data stored by the application. That is always pleasant but this time, I had a corresponding uptick in price for the data storage. Time for a change!

### Backstory

Years ago, when I first built Narro as a prototype, MongoDB was the New Thing in web development. I had a whole team of colleagues who were very enthusiastic about its uses, but I was a bit skeptical. In addition to helping implement Mongoid Ruby code at work, I thought I would get down into some nitty-gritty details of MongoDB under a Node.js system. Narro also doesn’t have an incredibly relationship-based data model, either, so it seemed like a good idea at the time.

I did learn a great deal. At the day job, it was confirmed that MongoDB was a horrible choice for a heavily-relational monolithic application. Millions of dollars ended up getting scrapped for an implementation of open-source software. In Narro’s codebase, I embraced the lack of relational structure and explored features like the [TTL index](https://docs.mongodb.com/manual/core/index-ttl/), optimized map-reduce queries, and [aggregation pipelines](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/#aggregation-expressions). Some things were impressively flexible, some things were not strong enough, but I stuck with the MongoDB storage because I had no need to change.

### Change

Once the bill for your data storage increases by 1000% in a month, you think about changing things. I have been enjoying the performance, extensibility, and support for PostgreSQL in the past couple years. I calculated the price for running Narro on a PostgreSQL datastore and ended with a price 30% to 5% of the MongoDB storage! The only problem was in getting there.

I wanted to have zero downtime and zero impact on consumers. Narro uses a microservice architecture, which posed its own problems and benefits. I didn’t have to deal with an immense amount of data, but it was millions of records. With that in mind, here was my plan:

1. Create the schema migrations for the new PostgreSQL datastore.
2. Create PostgreSQL-based models that expose the same API methods as the existing MongoDB-based models.
3. Migrate a backup of the existing MongoDB data to PostgreSQL.
4. Start concurrent asynchronous writes to the PostgreSQL database so that MongDB and PostgreSQL contain the same data.
5. Make all read-only microservices and read-only operations happen on the PostgreSQL datastore.
6. Stop writing to the MongoDB datastore. Use only the new PostgreSQL-based models.
7. Done! Remove the MongoDB datastore.

### Execution

In execution, the plan worked well. Creating a superset of the model API methods used throughout the microservices proved tedious but greatly smoothed the transition. The whole process lasted about a week.

Narro was previously using [Mongoose](http://mongoosejs.com) in the Node.js services and [`mgo`](https://labix.org/mgo) in the Go services. The Go services were simple enough that I migrated even the model APIs to [`sqlx`](http://jmoiron.github.io/sqlx/). In the Node.js services, I used [`knex`](http://knexjs.org) for querying the PostgreSQL datastore, and I created new model code that exposed Mongoose-like methods (`findById`, `findOne`, etc.) that were used throughout the code but that now mapped to SQL queries. This meant that, wherever a model was queried, I could just replace the `require` statement with the new model path.

For step #4, I hooked into `post-save` hooks for the existing MongoDB models and then persisted any change with the new PostgreSQL models. This way, there was no degradation or dependency between the coexisting models.

### Pitfalls

The plan, of course, didn’t account for everything. I used PostgreSQL’s [`jsonb`](https://www.postgresql.org/docs/9.4/static/functions-json.html) column type for several fields where I was dumping data in MongoDB, but even that needs to be somewhat structured. I would watch out for that and have canonical mappings for every value in the migration.

After the initial replication of data from MongoDB to PostgreSQL, I ran some common queries to test the performance. I was surprised by how much slower PostgreSQL performed on queries operating in the `jsonb` columns. Luckily, there is some nice [indexing capability specific to `jsonb`](https://www.postgresql.org/docs/9.4/static/datatype-json.html#JSON_INDEXING) in PostgreSQL. After applying some simple indices, PostgreSQL was performing much better than the existing, indexed MongoDB datastore!

Another consideration is that MongoDB’s `ObjectID` type has strange behavior when cast to strings in certain contexts, like moving MongoDB objects to PostgreSQL. It’s a good idea to centralize one function to cast all your model fields, ready for PostgreSQL persistence. This also speaks to another issue in migrating MongoDB data to PostgreSQL: MongoDB data is almost always unstructured in nooks and crannies. It’s a great benefit in the right context, but I would sanitize and normalize _every value_ in the mapping for step #3.

I used the [`uuid-ossp`](https://www.postgresql.org/docs/devel/static/uuid-ossp.html) PostgreSQL extension to mirror MongoDB’s uuid creation for models. Just make sure to enable it (`CREATE EXTENSION IF NOT EXISTS...`) and set it as the default for your column(s).

### Observations

Narro hasn’t actually reached step #7. I found that there are still some things PostgreSQL can’t do.

When I built out [Narro’s public API](https://docs.narro.co), I built in rate-limiting backed by the MongoDB datastore. The leaky-bucket model was built around the [TTL index](https://docs.mongodb.com/manual/core/index-ttl/) feature in MongoDB, which made the business logic clean and performant. This was actually extracted into a library, [`mongo-throttle`](https://github.com/andjosh/mongo-throttle). I couldn’t find such a feature that exists in PostgreSQL (most people will [recommend ‘expire-on-insert’ triggers](http://www.the-art-of-web.com/sql/trigger-delete-old/)) that can run automatically. For now, Narro’s rate-limiting still operates on the MongoDB storage.

The PostgreSQL datastore is more performant than the same MongoDB datastore. Map-reduce queries have been replaced by group-by and joins. Aggregation pipelines have been replaced by window functions and sub-selects. The old is new again.

> “Wait” has [almost always meant “Never.”](https://www.africa.upenn.edu/Articles_Gen/Letter_Birmingham.html)

I keep a running list of my own feature requests for Narro, aside from those of members. One of the first things I wrote down a year or more ago was to migrate the storage to PostgreSQL. It was always in my intentions, but rarely in my heart to make the effort and devote the hours. I’m now grateful for something to push a change.

