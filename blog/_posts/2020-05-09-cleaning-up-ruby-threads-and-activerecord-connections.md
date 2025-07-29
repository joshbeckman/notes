---
toc: true
title: Correct Ruby Threads and ActiveRecord Connections
date: '2020-05-09 00:00:00'
tags:
- code-snippets
redirect_from:
- "/cleaning-up-ruby-threads-and-activerecord-connections"
- "/cleaning-up-ruby-threads-and-activerecord-connections/"
serial_number: 2020.BLG.005
---
Recently, we had an opportunity to trivially parallelize some ActiveRecord queries in our Ruby server. In a common response structure, we needed to both query for the actual data requested along with some meta-information about pagination, etc.

Instead of querying for both parts of this response in sequence, we could query for both concurrently, using Ruby’s thread implementation. By default, Ruby threads will execute until they are waiting on an I/O event (like a database query), at which point they hand off Ruby’s GIL execution lock to another thread. Once the I/O response is ready, the kernel will pre-emptively pause another thread to pick it back up. This allows you to wait for multiple I/O responses at the same time, rather than in sequence.

```ruby
resource, total_count = [
  Thread.new { SomeRecord.find(params[:id]) },
  Thread.new { SomeRecord.size },
].map(&:value)
```

After a few concurrent requests to the server running that code, though, you will begin to see `ActiveRecord::ConnectionTimeoutError` exceptions! Request/response threads will crash, you will be unhappy. This is because, by default, ActiveRecord never returns these connections after the thread finishes.

The limit on your database connection count is of course ultimately dictated by your database server, but usually the limit is set by your ActiveRecord database pool size configuration, which defaults to 5. Since ActiveRecord’s number of database connections is limited, and your code keeps holding on to connections while asking for new ones in each request, you will eventually run out of connections.

To fix this problem, you just need to tell ActiveRecord that you’re done with the connections created within your thread(s). There’s a method dedicated to this [on `ActiveRecord::Base` called `clear_active_connections!`](https://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/ConnectionHandler.html#method-i-clear_active_connections-21). After the connections are returned to the pool, they can be re-used by the next thread.<sup><a href="#fn:1">1</a></sup>

```ruby
resource, total_count = [
  Thread.new do
    SomeRecord.find(params[:id])
  ensure
    ActiveRecord::Base.clear_active_connections!
  end,
  Thread.new do
    SomeRecord.size
  ensure
    ActiveRecord::Base.clear_active_connections!
  end,
].map(&:value)
```

You may wonder why we don’t always need to do this release call for ActiveRecord database connections elsewhere in our codebase. It’s because ActiveRecord itself actually maintains a count of database connections created during each Rack request (one thread per request) and releases them back to the pool once the request has finished. You only need to manually clear active connections when spawning your own threads.

Now, if you run the second version above, **you will still have the same problem**! This time, exceptions will only appear when your server is running close to its limit of active connections (which will depend on your puma/unicorn/whatever configuration). You will still run out of pooled database connections because you actually need _additional connections_ for each worker instance of your server.

The most common Ruby servers (puma, unicorn) run by creating set of worker instances of your app, which then handle incoming requests. Generally, each of those workers will spawn threads (up to a limit) to handle responding to requests concurrently. Let’s say you have 2 puma workers, and configure a limit of 5 threads per worker. This means that your server can handle up to 10 concurrent open client connections.

Now, most advice out there will tell you to set your database pool limit to the same limit as your worker thread count (5, in this example). This ensures that each thread can get its own ActiveRecord database connection. Remember that ActiveRecord keeps a count of how many connections it has, opening one per request (one per server worker thread).

However, now that we have some code that spawns threads of its own, with an ActiveRecord connection for each, we will be asking for more connections of that database pool. In the example code above, 2 new threads executing an ActiveRecord query each will ask for 2 new database connections of that pool.

What we need to do is increase our database pool limit. We need to increase it commensurate with the number of threads that each request/response cycle might spawn. In the example above, we’re creating 2 new threads (in addition to our 1 thread inherent in the request handler), so we need to increase our connection pool limit to 3x what it was previously. If the limit was previously 5, you need to increase it to 15. If you have some code that spawns 4 concurrent threads and your pool size was originally 8, you new pool size needs to be 40. ActiveRecord won’t hold on to all of those pool connections all the time, but it needs to know the higher limit or your code asking for a new connection will get refused.

```ruby
pool_size = server_thread_count * (your_code_thread_count + 1)
```

If you go increase that pool limit, your `ActiveRecord::ConnectionTimeoutError` exceptions will immediately disappear. You’ll get the speed improvements of concurrent I/O in your Ruby threads while keeping your ActiveRecord connections clean. And all it’ll cost you is a higher pool size.

1. 

As an alternative, [ActiveRecord also has a `with_connection` method](https://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/ConnectionPool.html#method-i-with_connection) that you can use as a wrapper. I don’t prefer this method, as it will _always_ check out a database connection (and return it for you), even if the execution doesn’t end up needing it. I would recommend clearing any connections that happen to have been used instead. [↩︎](#fnref:1)

