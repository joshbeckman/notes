---
title: Twice Around The JS Event Loop
date: 2018-06-26 00:00:00.000000000 Z
redirect_to: https://ghpages.joshbeckman.org/presents/twice-around-the-javascript-event-loop
presented_at: Chicago JavaScript Meetup
tags:
- software-engineering
- code-snippets
- officeluv
serial_number: 2018.TLK.003
---
<section data-markdown>

# {{ page.title }}

</section>
<section data-markdown>

- You probably have "bugs" due to this stuff
- This is complicated
- Ask questions!

</section>
<section data-markdown>
## Often Heard

- JavaScript is single-threaded
- JavaScript is event-driven
- JavaScript is asynchronous
- JavaScript is non-blocking
- JavaScript runs the same in Node.js & the browser
</section>
<section data-markdown>
## What Happens?

```js
const s = new Date().getSeconds();
var elapsed;

setTimeout(() => {
  console.log("Ran after " + (new Date().getSeconds() - s) + " seconds");
}, 500);

while(true) {
  elapsed = new Date().getSeconds() - s;
  if (elapsed >= 2) {
    console.log("Good, looped for 2 seconds");
    break;
  }
}
```
</section>
<section data-markdown>
## What Happens?

```js
function foo() {
    setTimeout(function foo() {
        Promise.resolve('foo')
            .then(console.log);
    }, 0);
}
function bar() {
    setTimeout(function bar() {
        console.log('bar');
    }, 0);
}
function foobar() {
    foo();
    bar();
}
foobar();
```
</section>
<section data-markdown>
![JS runtime general model](/images/js-runtime-general-model.png)
</section>
<section data-markdown>
## Browsers

Stack-governed

Task-driven
- Macrotask queue
- Microtask queue
</section>
<section data-markdown>
## Macrotasks

- Events
- Timeout/Interval
- XHR
- Window messages

Also called Events or Messages
</section>
<section data-markdown>
## Microtasks

- Promises
- Object observers

Also called Jobs
</section>
<section data-markdown>
## Animation Tasks

- RequestAnimationFrame
</section>
<section data-markdown>
## Browser Event Loop

1. Run the oldest task in macrotask queue until stack bottom.
2. Run _all_ tasks in microtask queue until empty.
3. Once per frame, run _all_ present tasks in animation queue until stack bottom.
4. Run _all_ tasks in microtask queue until empty.
5. Rinse, repeat (loop)
</section>
<section data-markdown>
![Browser JS runtime general model](/images/js-runtime-microtask-model.png)
</section>
<section data-markdown>
## Browser Event Loop

- Macrotasks created in-loop are processed next loop
- Microtasks created in-loop are processed until queue is empty
- Animation tasks created in-loop are processed next loop
</section>
<section data-markdown>
## Stack Bottom

```js
button.addEventListener('click', () => {
    Promise.resolve().then(() => { console.log('microtask 1') });
    console.log('click macrotask 1');
});
button.addEventListener('click', () => {
    Promise.resolve().then(() => { console.log('microtask 2') });
    console.log('click macrotask 2');
});
```
</section>
<section data-markdown>
## Stack Bottom

```js
button.addEventListener('click', () => {
    Promise.resolve().then(() => { console.log('microtask 1') });
    console.log('click macrotask 1');
});
button.addEventListener('click', () => {
    Promise.resolve().then(() => { console.log('microtask 2') });
    console.log('click macrotask 2');
});
button.click();
```
</section>
<section data-markdown>
## Browser Non-JS Macrotasks

- Compute styles
- Compute Layout
- Paint
</section>
<section data-markdown>
## Visual Macrotasks Ordering

- RequestAnimationFrame (Chrome/FireFox/spec)
- Compute styles
- Compute Layout
- Paint
- RequestAnimationFrame (Safari/IE/Edge)

This matters for changing styles!
</section>
<section data-markdown>
## Browser JS Guidelines

- Identify your macro/micro tasks
- Find stack bottom
</section>
<section data-markdown>
## Node.js

Queue-governed

Task-driven
- Macrotask queue
- Microtask queue
</section>
<section data-markdown>
## Node.js Macrotask Queues

- Timers
- I/O callbacks
- (Poll)
- Immediates
- I/O Close callbacks
</section>
<section data-markdown>
## Node.js Microtask Queues

- nextTicks
- Promises
</section>
<section>
<section data-markdown>
## Node.js Event Loop

1. Run the oldest task in Timers queue until new.
2. Run the oldest task in nextTick queue until empty.
3. Run the oldest task in Promise queue until empty.
4. Repeat 2 and 3 until both are empty.
</section>
<section data-markdown>
## Node.js Event Loop 2

1. Run the oldest task in I/O queue until new.
2. Run the oldest task in nextTick queue until empty.
3. Run the oldest task in Promise queue until empty.
4. Repeat 2 and 3 until both are empty.
</section>
<section data-markdown>
## Node.js Event Loop 3

1. Run the oldest task in Immediates queue until new.
2. Run the oldest task in nextTick queue until empty.
3. Run the oldest task in Promise queue until empty.
4. Repeat 2 and 3 until both are empty.
</section>
<section data-markdown>
## Node.js Event Loop 4

1. Run the oldest task in I/O Close queue until new.
2. Run the oldest task in nextTick queue until empty.
3. Run the oldest task in Promise queue until empty.
4. Repeat 2 and 3 until both are empty.
</section>
<section data-markdown>
## Node.js Event Loop

[![Node.js Event Queue Summary image](/images/node-js-queues.png)](https://jsblog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810)
</section>
</section>
<section data-markdown>
## Node.js Non-JS Macrotasks

- Poll for I/O
</section>
<section data-markdown>
## Node.js Guidelines

- Sort your tasks into queues
- Watch your I/O starvation
</section>
<section data-markdown>
## But Why?

- Computing styles
- Automating tests
- Triggering manual events
- Batching Promises
- Ordering callbacks
</section>
<section>
<section data-markdown>
## Super Fun Quiz

```js
setTimeout(() => console.log('this is setTimeout 1'), 0);
setTimeout(() => {
    console.log('this is setTimeout 2');
    Promise.resolve().then(() => {
        console.log('this is promise added inside setTimeout');
    });
}, 0);
setTimeout(() => console.log('this is setTimeout 3'), 0);
setTimeout(() => console.log('this is setTimeout 4'), 0);
setTimeout(() => console.log('this is setTimeout 5'), 0);

Promise.resolve.then(() => console.log('this is promise 1'));
Promise.resolve().then(() => {
    Promise.resolve().then(() => {
        console.log('this is the inner promise inside promise');
    });
});
```
</section>
</section>
<section>
<section data-markdown>
## Bonus Round

Event demultiplexer

- Browser
- `libuv`

</section>
<section data-markdown>
## libuv

External modules that makes use of native C++ and libuv is likely to use the thread pool (think: database access).

```js
process.env.UV_THREADPOOL_SIZE = 4; // default
```

</section>
</section>
<section data-markdown>
## Good Resources

- [Node.js Event Loop Details](https://jsblog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810)
- [General JS Runtime Model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#Event_loop)
- [Browser JS Event Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
- [Browser JS Event Loop Bugs/Differences](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [Node.js Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [HTML Standard for JS Task Queues](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)
</section>
<section data-markdown>

## We're Hiring @ OfficeLuv!

https://officeluv.github.io

</section>
<section data-markdown>

## Thanks!

https://www.andjosh.com/presents

</section>
