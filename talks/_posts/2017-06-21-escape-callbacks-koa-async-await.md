---
title: Don't Call Back, I'll Just Wait Here
date: 2017-06-21 00:00:00 Z
redirect_to: "https://ghpages.joshbeckman.org/presents/escape-callbacks-koa-async-await"
presented_at: Chicago Node.js Meetup
---

## JavaScript has non-blocking async i/o

![](https://media.giphy.com/media/26AHIA6ExwHzK1Tkk/giphy.gif)

---

- JS lives on a single thread
- How does it get around that to make things faster?
- JS has the event loop, macrotask queue, microtask queue
- I/O is async, polling for results within slots of the task queue


---


## How does that get us callbacks?

![](https://media.giphy.com/media/c0udlxcZjo3zG/giphy.gif)

---

- Node.js conventionally asks you to pass a closure to invoke in a task downstream
- Maintain state, if we wish, through our async operations
- Continue processing while waiting for the async response

---

~~~js
some_asyncish_task(24, 'foo', function callback(err, thing) {
    if (err) return console.log(err);
    console.log('I\'m in another task?!');
});
console.log('I\'m in this task!');
~~~


---


## How does that get us a node.js web server?

![](https://giant.gfycat.com/WelldocumentedFrightenedAmericancurl.gif)

---

- Web requests, HTTP, WS are async I/O interfaces
- They require callbacks
- What does that look like?

---

~~~js
const port        = 3000;
const http        = require('http');
const request_lib = require('request');
let last_data     = '';

function processPost(request, response, callback) {
    var queryData = "";
    if (typeof callback !== 'function') return null;

    if (request.method == 'POST') {
        console.log('Handling new POST data');
        request.on('data', function(data) {
            queryData += data;
            if (queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413,
                    {'Content-Type': 'application/json'}
                ).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = JSON.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405,
            {'Content-Type': 'application/json'});
        response.end();
    }
}

function requestHandler(request, response) {  
    if (request.method == 'POST') {
        processPost(request, response, function() {
            last_data = request.post;

            response.writeHead(200,
                'OK', {'Content-Type': 'application/json'});
            response.end();
        });
    } else if (request.method === 'GET') {
        response.writeHead(200,
            'OK', {'Content-Type': 'application/json'});
        response.end(JSON.stringify(last_data));
    } else if (request.method === 'PUT') {
        request_lib({
            method: 'PUT',
            url: 'http://httpbin.org/put'
        }, function(err, res, body) {
            if (err) {
                response.writeHead(500,
                    {'Content-Type': 'application/json'});
                response.end();
            }
            response.writeHead(200,
                'OK', {'Content-Type': 'application/json'});
            response.end(body);
        });
    } else {
        response.writeHead(405,
            {'Content-Type': 'application/json'});
        response.end();
    }
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {  
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});
~~~


---


## How does that get us to express?

![](https://media.giphy.com/media/tKX6FNU9UGwF2/giphy.gif)

---

- Express introduces the concept of middleware
- Multiple closures act on an incoming HTTP connection
- The Express architecture lends itself to a healthy ecosystem of middleware modules
- What does that look like?

---

~~~js
const port       = 3000;
const express    = require('express');
const request    = require('request');
const bodyParser = require('body-parser');
const server     = express();
let last_data    = '';

server.use(bodyParser.json());

function log_new_data(req, res, next) {
    console.log('Handling new POST data');
    next();
}

server.get('/', function (req, res) {
    res.status(200).send(last_data);
});

server.post('/', log_new_data, function (req, res) {
    last_data = req.body;
    res.status(200).end();
});

server.put('/', function (req, res){
    request({
        method: 'PUT',
        url: 'http://httpbin.org/put'
    }, function(err, response, body) {
        if (err)
            return res.status(500);
        res.status(200)
            .send(JSON.parse(body));
    });
});

server.listen(port, (err) => {  
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});
~~~


---


## How are callbacks awkward?

![](https://media.giphy.com/media/xUA7aWmr0uddsafLEI/giphy.gif)

---

- Do not guarantee async
- Introduce closure nests (callback hell)
- Have convention to learn (err as first arg, then??)
- Introduce a new frame in the stack
    - (not all that bad, but a consideration)


---


## How do promises help callbacks?

![](https://media.giphy.com/media/3oriNXxayQjvogWZLW/giphy.gif)

---

- Are Promises unique to JavaScript?????
    - Kind of
- Guarantee async (new microtask in the queue)
- Separate your error logic from success paths
- Catch your error once

---

~~~js
function some_promise_task(a, b) {
    return new Promise(function(res, rej) {
        some_asyncish_task(24, 'foo', function callback(err, thing) {
            if (err) return rej(err);
            res(thing);
        });
    });
}
some_promise_task(24, 'foo')
    .then(function(thing) {
        console.log('I\'m in another microtask!');
    })
    .then(function() {
        return some_second_promise();
    })
    .then(function() {
        console.log('I\'m in another microtask!');
    })
    .catch(function(err) {
        console.log('I\'m in another microtask!');
    });
console.log('I\'m in this task!');
~~~

---

## How are promises awkward?

![](https://media.tenor.com/images/0297ca8f06abac20d77e92fb281e49e0/tenor.gif)

---

- Errors disappear
- You now have two callbacks
- You can only resolve one value
    - (good or bad?)
- Still don't have a single flow in your code


---

## How do generators work?

![](http://www.likecool.com/Gear/Pic/Gif%20Circle/Gif-Circle.gif)

---

- Catch your own errors
- Triggers a new microtask for each iteration of the generator
    - When they are yielding Promises
- Generators exist in other languages
- Iterators that are either running, paused, or done
- Combining Generators and Promises
    - get async code pretfified by generator flows
- `koa-compose` does this for us
    - wrap our middleware in a big generator
    - yield to Promises from there
    - It's a hack

---

## How does that get us Koa 1.x?

![](https://s-media-cache-ak0.pinimg.com/originals/a7/2f/fd/a72ffd6fe16417fabd51b58f61f40341.gif)

---

- Node.js > 0.12.x
- Similar core group of developers ([TJ Holowaychuck][0], etc)
- Smaller than Express
- Read the source code, it's pretty
- Offers Node.js HTTP connection abstraction
- Introduces context to pass around and build upon
- Tries to eliminate callback hell with generators
- What does that look like?

---

~~~js
const port    = 3000;
const koa     = require('koa');
const request = require('koa-request');
const koaBody = require('koa-body');
const server  = koa();
let last_data = '';

server.user(koaBody());

server.use(function *log_new_data(next){
    if ('POST' == this.method)
        console.log('Handling new POST data');
    yield next;
});

server.use(function *response(next){
    if ('GET' == this.method)
        this.body = last_data;
    yield next;
});

server.use(function *posted_data(next){
    if ('POST' == this.method) {
        last_data = this.req.body;
        this.response.status = 200;
    }
    yield next;
});

server.use(function *put_proxy(next){
    let response = {};

    if ('PUT' == this.method) {
        response = yield request({
            method: 'PUT',
            url: 'http://httpbin.org/put'
        });
        this.body = JSON.parse(response.body);
    }
    yield next;
});

server.listen(port, (err) => {  
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});
~~~


---

## How does that get us async/await

![](https://68.media.tumblr.com/bec302d257ec0b8018f39343e52adddc/tumblr_n0j37eCDUA1smdot9o1_500.gif)

---

- From node > 7.6.x
- Draws heavily from the C# spec for async/await
- Within a declared async function, you can await a Promise
    - Throw away your wrappers
- Essentially places a frame onto the task queue to handle the Promise resolution
- Catch your own errors explicitly
- Early stages, still
- Drop down to the underlying Promise layer
    - For things like awaiting multiple concurrenty


---


## How does that get us koa 2.x?

![](http://i.imgur.com/8HG6rmA.gif)

---

- Second version of Koa operates 90% the same
- Now middleware functions are all async
- Convenience tooling to convert Koa 1 generators to Promises
    - Which you can then await
- Readable async flow of generators with the guaranteed async of Promises with the middleware composition of Express
- What does that look like?

---

~~~js
const port    = 3000;
const Koa     = require('koa');
const request = require('koa2-request'); 
const koaBody = require('koa-body');
const server  = new Koa();
let last_data = '';

server.use(koaBody());

server.use(async (ctx, next) => {
    if ('POST' == ctx.method)
        console.log('Handling new POST data');
    await next();
});

server.use(async (ctx, next) => {
    if ('GET' == ctx.method)
        ctx.body = last_data;
    await next();
});

server.use(async (ctx, next) => {
    if ('POST' == ctx.method) {
        last_data = ctx.request.body;
        ctx.response.status = 200;
    }
    await next();
});

server.use(async (ctx, next) => {
    let response = {};

    if ('PUT' == ctx.method) {
        response = await request({
            method: 'PUT',
            url: 'http://httpbin.org/put'
        });
        ctx.body = JSON.parse(response.body);
    }
    await next();
});

server.listen(port, (err) => {  
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});
~~~


---


## More things to read

- You can [`util.promisify` your callback code][1]
- Koa [provides nice walkthroughs of generator flows][2]
- Node.js `nextTick` and `setImmediate` [are very different][3]
- Mozilla has a nice [explanation of generators][4]
- We should all understand the JavaScript [stack and task queue][5]

[0]: https://github.com/tj
[1]: https://nodejs.org/api/util.html#util_util_promisify_original
[2]: https://github.com/koajs/koa/blob/v1.x/docs/guide.md
[3]: https://stackoverflow.com/questions/15349733/setimmediate-vs-nexttick
[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
[5]: https://developer.mozilla.org/en/docs/Web/JavaScript/EventLoop
