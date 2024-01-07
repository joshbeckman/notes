---
toc: true
title: Handy Kue Maintenance CLI Scripts
date: '2018-01-03 00:00:00'
tags:
- code
- javascript
redirect_from:
- "/handy-kue-cli-maintenance"
- "/handy-kue-cli-maintenance/"
---

Building systems at my last few companies, it has been enormously useful to have a robust queueing platform. I’ve tried Amazon’s SQS, NATS, and a couple others but Automattic’s [Kue](https://github.com/Automattic/kue) has been the best combination of performance and introspection.

Once you’re really using any queue for large batching tasks, you will eventually run into issues with stuck jobs and jobs that need to be evicted early. This is called _queue maintenance_. You should have code that automatically sweeps the queue clean based on your own rules of retry, etc.

Alas, you will probably need to manually clean the queue at some points. This is usually a stressful time where you don’t want to hand-type some half-thought JS snippet into a Node.js console. Something like 30,000 bad jobs are backing up the workers and an investor is testing the product. For these situations, I have made a couple command line (CLI) apps to evict or retry queue/kue jobs. I thought my CLI scripts could help others using the Kue library.

## Kue CLI Scripts

I typically put stuff like this in a `/bin` directory at the root of an application. With that, you can create an executable file for job eviction from the queue:

    $ mkdir bin && touch bin/remove
    $ chmod +x bin/remove

For the parsing of command line arguments, we will need something like [`commander`](https://github.com/tj/commander.js):

    $ npm install commander --save

Inside `./bin/remove`, you can place:

    #!/usr/bin/env node
    const program = require('commander');
    const kue = require('kue');
    const pkg = require('../package'); // load your app details
    const redis = require('../lib/redis'); // some Redis config
    const queue = kue.createQueue(redis); // connect Kue to Redis
    
    // command line options parsing
    program
        .version(pkg.version)
        .description('Remove/delete jobs from kue queue')
        .option('-s, --state <state>',
            'specify the state of jobs to remove [complete]', 'complete')
        .option('-n, --number <number>',
            'specify the max number of jobs [1000]', '1000')
        .option('-t, --type <type>',
            'specify the type of jobs to remove (RegExp)', '')
        .parse(process.argv);
    
    const maxIndex = parseInt(program.number, 10) - 1;
    var count = 0;
    kue.Job.rangeByState(program.state, 0, maxIndex, 'asc', (err, jobs) => {
        Promise.all(jobs.map(job => {
            return new Promise((res, rej) => {
                if (!job.type.match(program.type)) {
                    return res(job);
                }
                job.remove(() => {
                    console.log('removed', job.id, job.type);
                    count++;
                    res(job);
                });
            });
        })).then(() => {
            console.log('total removed:', count);
            process.exit(0);
        }).catch((err) => {
            console.error(err);
            process.exit(1);
        });
    });

Similarly, you can create an executable file for job re-queueing:

    $ mkdir bin && touch bin/requeue
    $ chmod +x bin/requeue

Inside `./bin/requeue`, you can place:

    #!/usr/bin/env node
    const program = require('commander');
    const kue = require('kue');
    const pkg = require('../package'); // load your app details
    const redis = require('../lib/redis'); // some Redis config
    const queue = kue.createQueue(redis); // connect Kue to Redis
    
    // command line options parsing
    program
        .version(pkg.version)
        .description('Requeue jobs into kue queue')
        .option('-s, --state <state>',
            'specify the state of jobs to remove [failed]', 'failed')
        .option('-n, --number <number>',
            'specify the max number of jobs [1000]', '1000')
        .option('-t, --type <type>',
            'specify the type of jobs to remove (RegExp)', '')
        .parse(process.argv);
    
    const maxIndex = parseInt(program.number, 10) - 1;
    var count = 0;
    kue.Job.rangeByState(program.state, 0, maxIndex, 'asc', (err, jobs) => {
        Promise.all(jobs.map(job => {
            return new Promise((res, rej) => {
                if (!job.type.match(program.type)) {
                    return res(job);
                }
                job.inactive();
                console.log('requeued', job.id, job.type);
                count++;
                res(job);
            });
        })).then(() => {
            console.log('total requeued:', count);
            process.exit(0);
        }).catch((err) => {
            console.error(err);
            process.exit(1);
        });
    });

## Example Output

Here’s the help text produced by `remove` (similar to that from `requeue`):

    $ ./bin/remove --help
    # 
    # Usage: remove [options]
    # 
    # Remove/delete jobs from kue queue
    # 
    # 
    # Options:
    # 
    # -V, --version output the version number
    # -s, --state <state> specify the state of jobs to remove [complete]
    # -n, --number <number> specify the max number of jobs [1000]
    # -t, --type <type> specify the type of jobs to remove (RegExp)
    # -h, --help output usage information

And an example execution to remove one job from the failed state of type matching `/foo/`:

    $ ./bin/remove -n 1 -s failed -t foo
    # removed 12876999 foobaz
    # total removed: 1

We use this in our queue system to remove completed jobs on a cron schedule. It has been handy multiple times when a bug worker has failed a bunch of good jobs and we need to re-queue them all. Hopefully, it’s useful to others.

