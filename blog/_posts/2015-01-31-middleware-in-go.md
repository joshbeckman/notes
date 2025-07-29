---
toc: true
title: Writing Database Middleware in Go
date: '2015-01-31 00:00:00'
tags:
- code-snippets
redirect_from:
- "/middleware-in-go"
- "/middleware-in-go/"
serial_number: 2015.BLG.001
---
I’ve been writing two main types of Go programs recently. One routes `http` input through a series of transformations and calculations and one receives `http` input to transform or return data stores.

For the latter, I had a hard time figuring out the best way to maintain a persistent database connection while still taking advantage of Go’s concurrency. I settled on writing an entensible middleware to establish a connection and clone sessions for each incoming request.

The benefit of this approach is that I can offload the connection and session management to the database itself. It can pool and queue connections for me when things scale. I also don’t have to worry about latency issues in connecting to the database on every request, since I can establish one on application boot and clone from there.

Here is a brief scaffold of how I’m doing this. I’ll use `mgo` and a mongoDB here, but you could substitute most database drivers with the approriate syntax. In the simplest case, you can make your `main.go` and `middleware.go` separate files. This makes it easier to break functionality into the appropriate place.

### middleware.go

```go
package main

import (
        "fmt"
        "gopkg.in/mgo.v2" // our DB driver
        "os"
)

type Controller struct {
        // This will be our extensible type that will
        // be used as a common context type for our routes
        session *mgo.Session // our cloneable session
}

func NewController() (*Controller, error) {
        // This function will return to us a 
        // Controller that has our common DB context.
        // We can then use it for multiple routes
        uri := os.Getenv("MONGO_URI")
        if uri == "" {
                return nil, fmt.Errorf("no DB connection string provided")
        }
        session, err := mgo.Dial(uri)
        if err != nil {
                return nil, err
        }
        return &Controller{
            session: session,
    }, nil
}
```

### main.go

```go
package main

import (
        "fmt"
        "gopkg.in/mgo.v2"
        "labix.org/v2/mgo/bson"
        "log"
        "net/http"
        "os"
)

func main() {
        // Our main func, of course, will
        // Initialize our DB connection with 
        // a call to NewController and will
        // defer our session closing until we finish
        // running completely
        ctl, err := NewController()
        if err != nil {
                log.Fatal(err)
        }

        http.handleFunc("/", ctl.renderHello)
        http.ListenAndServe(":80", nil)
}

// Our response method will be called on our controller context
func (ctl *Controller) renderHello(w http.ResponseWriter, r *http.Request) {
        // First, we will clone a session and connect to our 
        // desired database
        // Remember, ctl holds our persistent DB connection
        // already.
        session := ctl.session.Clone()
        defer session.Close()
        db := session.DB(os.Getenv("MONGO_DB"))
        // Here, we'll simply retrieve one account from 
        // our Accounts collection, using the Account type
        // which I wrote out elsewhere.
        result := Account{}
        err := db.C("accounts").Find(bson.M{"name": r.URL.Query().Get("name")}).One(&result)
        if err != nil {
                http.Error(w, err.Error(), http.StatusNotFound)
                return
        } else {
                fmt.Fprintf(w, "Hello, %s", result.name)
        }
}
```

With the middleware and context separated out like this, you can easily set up a context or multiple contexts in which to handle your responses. Otherwise, you’re stuck connecting on every request. If you do that, you’re gonna have a bad time.

