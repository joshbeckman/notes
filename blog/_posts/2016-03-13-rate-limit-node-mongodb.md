---
toc: true
title: Rate-Limit Your Node.js API in Mongo
date: '2016-03-13 00:00:00'
tags:
- code
- javascript
redirect_from:
- "/rate-limit-node-mongodb"
- "/rate-limit-node-mongodb/"
---

 **Update:** After a request by [Jason Humphrey](https://github.com/GreenPioneer), I’ve released this implementation as a standalone NPM module: [mongo-throttle](https://github.com/andjosh/mongo-throttle).

I needed to build a rate-limiting middleware for the new [Narro public API](http://docs.narro.co), and I was [inspired to make the database do my heavy lifting]( /2016/03/12/databases-doing-dirty-work/). In Narro’s case, that’s MongoDB.

### Expiring Records From MongoDB

Mongo has a useful feature called [a TTL index](https://docs.mongodb.org/manual/tutorial/expire-data/).

> TTL collections make it possible to store data in MongoDB and have the mongod automatically remove data after a specified number of seconds or at a specific clock time.

You can tell Mongo to remove data for you! We will use this to remove expired request counts from our rate-limiting check. There are a couple important things to note about this feature:

- As an index, it is set upon collection creation. If you want to change it, you’ll have to do so manually.
- The index-specific field, `expireAfterSeconds`, is _in seconds_. Unlike most other timestamps in your JavaScript code, _don’t_ divide this by 1000.

### Throttle Model

First, let’s build our model to store in our rate-limiting collection. Here we define our `expires` TTL index on our `createdAt` field (it only takes one field to expire a record from the collection). We are also defining a `max` number of requests per IP address (conforming to an IP-specific regex).

```js
/**
 * A rate-limiting Throttle record, by IP address
 * models/throttle.js
 */
var Throttle,
    mongoose = require('mongoose'),
    config = require('../config'),
    Schema = mongoose.Schema;

Throttle = new Schema({
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: config.rateLimit.ttl // (60 * 10), ten minutes
    },
    ip: {
        type: String,
        required: true,
        trim: true,
        match: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    },
    hits: {
        type: Number,
        default: 1,
        required: true,
        max: config.rateLimit.max, // 600
        min: 0
    }
});

Throttle.index({ createdAt: 1 }, { expireAfterSeconds: config.rateLimit.ttl });
module.exports = mongoose.model('Throttle', Throttle);
```

### Throttler Middleware

I’m using Express/Koa here, so I’m going to write this as a middleware library. All we want to do is find-or-create an existing `Throttle` record for the requesting IP and increment its value. Upon reaching the max, we can truncate the request chain immediately. The benefit we get from defining our model above is never having to reset records or remove them from the collection!

```js
// Module dependencies
var config = require('../config'),
    Throttle = require('../models/throttle');

/**
   * Check for request limit on the requesting IP
   *  
   * @access public
   * @param {object} request Express-style request
   * @param {object} response Express-style response
   * @param {function} next Express-style next callback
   */ 
module.exports = function(request, response, next) {
    'use strict';
    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;

    // this check is necessary for some clients that set an array of IP addresses
    ip = (ip || '').split(',')[0]; 

    Throttle
        .findOneAndUpdate({ip: ip},
            { $inc: { hits: 1 } },
            { upsert: false })
        .exec(function(error, throttle) {
            if (error) {
                response.statusCode = 500;
                return next(error);
            } else if (!throttle) {
                throttle = new Throttle({
                    createdAt: new Date(),
                    ip: ip
                });
                throttle.save(function(error, throttle) {
                    if (error) {
                        response.statusCode = 500;
                        return next(error);
                    } else if (!throttle) {
                        response.statusCode = 500;
                        return response.json({
                            errors: [
                                {message: 'Error checking rate limit'}
                            ]
                        });
                    }

                    respondWithThrottle(request, response, next, throttle);
                });
            } else {
                respondWithThrottle(request, response, next, throttle);
            }
        });

    function respondWithThrottle(request, response, next, throttle) {
        var timeUntilReset = (config.rateLimit.ttl * 1000) -
                    (new Date().getTime() - throttle.createdAt.getTime()),
            remaining = Math.max(0, (config.rateLimit.max - throttle.hits));

        response.set('X-Rate-Limit-Limit', config.rateLimit.max);
        response.set('X-Rate-Limit-Remaining', remaining);
        response.set('X-Rate-Limit-Reset', timeUntilReset);
        request.throttle = throttle;
        if (throttle.hits < config.rateLimit.max) {
            return next();
        } else {
            response.statusCode = 429;
            return response.json({
                errors: [
                    {message: 'Rate Limit reached. Please wait and try again.'}
                ]
            });
        }
    }
};
```

### Throttling In Use

Once we have our middleware in place, we can simply drop it into the request-handling chain of Express/Koa and appropriately rate-limit our clients.

```js
var fs = require('fs'),
    throttler = require('../lib/throttler'),
    pkg = JSON.parse(fs.readFileSync('./package.json'));

// I'll assume you've defined your app instance
app.get('/api', throttler, function(req, res) {
    res.jsonp({
        meta: {
            version: pkg.version,
            name: pkg.name
        }
    });
});
```

In practice, I placed the `throttler` middleware ahead of things like authentication. If you wanted to rate-limit on something like an API key or authenticated user record, you could do so by placing authentication ahead of rate-limiting and changing the `ip` field on the `Throttle` model to something like a user ID or API key.

