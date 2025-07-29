---
title: Build Your Own Node.js CLI Package
date: 2018-04-16 00:00:00.000000000 Z
redirect_to: https://ghpages.joshbeckman.org/presents/build-a-nodejs-cli-package
presented_at: Chicago Node.js Meetup
tags:
- software-engineering
- code-snippets
- open-source
serial_number: 2018.TLS.002
---
<style>
div.asciicast iframe {
width: 100% !important;
height: calc(100vh - 4rem) !important;
}
</style>
<section data-markdown>
# Build Your Own Node.js CLI Package
</section>
<section data-markdown>
![GIF](https://media.giphy.com/media/yR4xZagT71AAM/giphy.gif)
</section>
<section data-markdown>
## Coverage
* Node.js CLI first principles
* Frameworks
* Configuration
* Distribution
</section>
<section data-markdown>
## Principles of CLI
</section>
<section data-markdown>
### Node.js Scripting
Running an event loop to completion or interruption
</section>
<section data-markdown>
### Interactive / Session
Great for destructive or constructive actions

`command (begin session)`
</section>
<section>
<script src="https://asciinema.org/a/176637.js" id="asciicast-176637" async data-size="big" data-cols="60" data-rows="16"></script>
</section>
<section data-markdown>
### Single Command
Great for compositional, single-purpose scripts

`command [arguments]`
```bash

$ ls -l -a
total 24
drwxr-xr-x   6 Josh  staff   204 Jul 26  2017 .
drwxr-xr-x   6 Josh  staff   204 Aug 10  2017 ..
drwxr-xr-x  15 Josh  staff   510 Apr 15 17:26 .git
-rw-r--r--   1 Josh  staff  1061 Jul 26  2017 LICENSE
-rw-r--r--   1 Josh  staff  1030 Jul 26  2017 README.md
-rwxr-xr-x   1 Josh  staff  1190 Jul 26  2017 heroku_multi

```
</section>
<section data-markdown>
### Multiple Commands
More like complete applications

`prefix command [arguments]`
```bash
$ git log --pretty=format:%s
new:usr: Add initial working version
Initial commit
$ git status
On branch master
Your branch is up to date with 'origin/master'.
```
</section>
<section data-markdown>
### What makes Node.js a good candidate?
* Widely available
* Event Loop can be a benefit
* Forked processes can be a benefit
* Distribution is wickedly simple/fast
</section>
<section data-markdown>
## Communicating to Node.js Scripts
</section>
<section data-markdown>
### What's in a `process`?
Your script always operates in context
```js
process {
  title: 'node',
  version: 'v8.1.2',
  moduleLoadList: 
   [ 'Binding contextify',
     'Binding natives',
     'Binding config',
     'NativeModule events',
     'Binding async_wrap',
     'Binding icu',
     'NativeModule util',
     'Binding uv',
     'NativeModule buffer',
     'Binding buffer',
     'Binding util',
     'NativeModule internal/util',
     'NativeModule internal/errors',
     'Binding constants',
     'NativeModule internal/buffer',
     'NativeModule timers',
     'Binding timer_wrap',
     'NativeModule internal/linkedlist',
     'NativeModule async_hooks',
     'NativeModule assert',
     'NativeModule internal/process',
     'NativeModule internal/process/warning',
     'NativeModule internal/process/next_tick',
     'NativeModule internal/process/promises',
     'NativeModule internal/process/stdio',
     'NativeModule internal/url',
     'NativeModule internal/querystring',
     'NativeModule querystring',
     'Binding url',
     'NativeModule path',
     'NativeModule module',
     'NativeModule internal/module',
     'NativeModule vm',
     'NativeModule fs',
     'Binding fs',
     'NativeModule stream',
     'NativeModule internal/streams/legacy',
     'NativeModule _stream_readable',
     'NativeModule internal/streams/BufferList',
     'NativeModule internal/streams/destroy',
     'NativeModule _stream_writable',
     'NativeModule _stream_duplex',
     'NativeModule _stream_transform',
     'NativeModule _stream_passthrough',
     'Binding fs_event_wrap',
     'NativeModule internal/fs',
     'NativeModule console',
     'Binding tty_wrap',
     'NativeModule tty',
     'NativeModule net',
     'NativeModule internal/net',
     'Binding cares_wrap',
     'Binding tcp_wrap',
     'Binding pipe_wrap',
     'Binding stream_wrap',
     'Binding signal_wrap',
     'Binding inspector' ],
  versions: 
   { http_parser: '2.7.0',
     node: '8.1.2',
     v8: '5.8.283.41',
     uv: '1.12.0',
     zlib: '1.2.11',
     ares: '1.10.1-DEV',
     modules: '57',
     openssl: '1.0.2l',
     icu: '59.1',
     unicode: '9.0',
     cldr: '31.0.1',
     tz: '2017b' },
  arch: 'x64',
  platform: 'darwin',
  release: 
   { name: 'node',
     sourceUrl: 'https://nodejs.org/download/release/v8.1.2/node-v8.1.2.tar.gz',
     headersUrl: 'https://nodejs.org/download/release/v8.1.2/node-v8.1.2-headers.tar.gz' },
  argv: [ '/usr/local/bin/node', '/Users/Joshua/src/foo.js' ],
  execArgv: [],
  env: 
   { TERM_PROGRAM: 'Apple_Terminal',
     ANDROID_HOME: '/Users/Joshua/Library/Android/sdk',
     TERM: 'xterm-256color',
     SHELL: '/bin/bash',
     CLICOLOR: '1',
     TMPDIR: '/var/folders/0c/1xh24_cd64z0qgdyhrrhqmzm0000gp/T/',
     Apple_PubSub_Socket_Render: '/private/tmp/com.apple.launchd.xzSg211msb/Render',
     TERM_PROGRAM_VERSION: '404',
     USER: 'Joshua',
     SSH_AUTH_SOCK: '/private/tmp/com.apple.launchd.I8BfXr2o6k/Listeners',
     PATH: '/Users/Joshua/.cargo/bin:~/Library/Android/sdk/tools:~/Library/Android/sdk/platform-tools:/Library/Frameworks/Python.framework/Versions/2.7/bin:/usr/local/bin:/usr/local/share/npm/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/go/bin:/opt/X11/bin:/usr/local/git/bin:/Users/Joshua/.rvm/bin:/Users/Joshua/projects/golang/bin:/Users/Joshua/bin',
     PWD: '/Users/Joshua/src',
     EDITOR: 'vim',
     LANG: 'en_US.UTF-8',
     XPC_FLAGS: '0x0',
     XPC_SERVICE_NAME: '0',
     HOME: '/Users/Joshua',
     SHLVL: '1',
     PYTHONPATH: '/usr/local/lib/python2.7/site-packages:',
     LOGNAME: 'Joshua',
     GOPATH: '/Users/Joshua/projects/golang',
     PKG_CONFIG_PATH: '/opt/local/lib/pkgconfig:',
     DISPLAY: '/private/tmp/com.apple.launchd.Vdwo7PHHuC/org.macosforge.xquartz:0',
     SECURITYSESSIONID: '186a6',
     OLDPWD: '/Users/Joshua/src/github.com/andjosh/andjosh.github.io',
     _: '/usr/local/bin/node',
     __CF_USER_TEXT_ENCODING: '0x1F6:0x0:0x0' },
  pid: 99573,
  features: 
   { debug: false,
     uv: true,
     ipv6: true,
     tls_npn: true,
     tls_alpn: true,
     tls_sni: true,
     tls_ocsp: true,
     tls: true },
  _needImmediateCallback: false,
  execPath: '/usr/local/bin/node',
  debugPort: 9229,
  _startProfilerIdleNotifier: [Function: _startProfilerIdleNotifier],
  _stopProfilerIdleNotifier: [Function: _stopProfilerIdleNotifier],
  _getActiveRequests: [Function: _getActiveRequests],
  _getActiveHandles: [Function: _getActiveHandles],
  reallyExit: [Function: reallyExit],
  abort: [Function: abort],
  chdir: [Function: chdir],
  cwd: [Function: cwd],
  umask: [Function: umask],
  getuid: [Function: getuid],
  geteuid: [Function: geteuid],
  setuid: [Function: setuid],
  seteuid: [Function: seteuid],
  setgid: [Function: setgid],
  setegid: [Function: setegid],
  getgid: [Function: getgid],
  getegid: [Function: getegid],
  getgroups: [Function: getgroups],
  setgroups: [Function: setgroups],
  initgroups: [Function: initgroups],
  _kill: [Function: _kill],
  _debugProcess: [Function: _debugProcess],
  _debugPause: [Function: _debugPause],
  _debugEnd: [Function: _debugEnd],
  hrtime: [Function: hrtime],
  cpuUsage: [Function: cpuUsage],
  dlopen: [Function: dlopen],
  uptime: [Function: uptime],
  memoryUsage: [Function: memoryUsage],
  binding: [Function: binding],
  _linkedBinding: [Function: _linkedBinding],
  _setupDomainUse: [Function: _setupDomainUse],
  _events: 
   { warning: [Function],
     newListener: [Function],
     removeListener: [Function],
     SIGWINCH: [Function] },
  _rawDebug: [Function],
  _eventsCount: 4,
  domain: null,
  _maxListeners: undefined,
  _fatalException: [Function],
  _exiting: false,
  assert: [Function],
  config: 
   { target_defaults: 
      { cflags: [],
        default_configuration: 'Release',
        defines: [],
        include_dirs: [],
        libraries: [] },
     variables: 
      { asan: 0,
        coverage: false,
        debug_devtools: 'node',
        force_dynamic_crt: 0,
        host_arch: 'x64',
        icu_data_file: 'icudt59l.dat',
        icu_data_in: '../../deps/icu-small/source/data/in/icudt59l.dat',
        icu_endianness: 'l',
        icu_gyp_path: 'tools/icu/icu-generic.gyp',
        icu_locales: 'en,root',
        icu_path: 'deps/icu-small',
        icu_small: true,
        icu_ver_major: '59',
        llvm_version: 0,
        node_byteorder: 'little',
        node_enable_d8: false,
        node_enable_v8_vtunejit: false,
        node_install_npm: true,
        node_module_version: 57,
        node_no_browser_globals: false,
        node_prefix: '/',
        node_release_urlbase: 'https://nodejs.org/download/release/',
        node_shared: false,
        node_shared_cares: false,
        node_shared_http_parser: false,
        node_shared_libuv: false,
        node_shared_openssl: false,
        node_shared_zlib: false,
        node_tag: '',
        node_use_bundled_v8: true,
        node_use_dtrace: true,
        node_use_etw: false,
        node_use_lttng: false,
        node_use_openssl: true,
        node_use_perfctr: false,
        node_use_v8_platform: true,
        node_without_node_options: false,
        openssl_fips: '',
        openssl_no_asm: 0,
        shlib_suffix: '57.dylib',
        target_arch: 'x64',
        uv_parent_path: '/deps/uv/',
        uv_use_dtrace: true,
        v8_enable_gdbjit: 0,
        v8_enable_i18n_support: 1,
        v8_enable_inspector: 1,
        v8_no_strict_aliasing: 1,
        v8_optimized_debug: 0,
        v8_promise_internal_field_count: 1,
        v8_random_seed: 0,
        v8_use_snapshot: true,
        want_separate_host_toolset: 0,
        want_separate_host_toolset_mkpeephole: 0,
        xcode_version: '7.0' } },
  emitWarning: [Function],
  nextTick: [Function: nextTick],
  _tickCallback: [Function: _tickCallback],
  _tickDomainCallback: [Function: _tickDomainCallback],
  stdout: [Getter],
  stderr: [Getter],
  stdin: [Getter],
  openStdin: [Function],
  exit: [Function],
  kill: [Function],
  argv0: 'node',
  mainModule: 
   Module {
     id: '.',
     exports: {},
     parent: null,
     filename: '/Users/Joshua/src/foo.js',
     loaded: false,
     children: [],
     paths: 
      [ '/Users/Joshua/src/node_modules',
        '/Users/Joshua/node_modules',
        '/Users/node_modules',
        '/node_modules' ] } }
```
</section>
<section data-markdown>
### Executing with environment variables
Pervasive, global, shared

Like cues, rather than directives
</section>
<section>
<script src="https://asciinema.org/a/176415.js" id="asciicast-176415" async data-size="big" data-cols="60" data-rows="16"></script>
</section>
<section data-markdown>
### Executing with flags/argv
Specific, pedantic

Like directives, rather than cues

_Will exclude node-specific flags placed before the script name._
</section>
<section>
<script src="https://asciinema.org/a/176433.js" id="asciicast-176433" async data-size="big" data-cols="60" data-rows="16"></script>
</section>
<section data-markdown>
### Standard Input
Powerful in conjunction with others

Data, rather than directive
</section>
<section>
<script src="https://asciinema.org/a/176432.js" id="asciicast-176432" async data-size="big" data-cols="60" data-rows="16"></script>
</section>
<section data-markdown>
### Placement Matters
```bash
#
$ [env] node [node-flags] &lt;script&gt; [argv]
# [stdin]
#
```
</section>
<section data-markdown>
## Frameworks
</section>
<section data-markdown>
### Interactive / Session
[flatiron/prompt](https://github.com/flatiron/prompt)

A beautiful command-line prompt for node.js

* Simple, familiar API
</section>
<section data-markdown>
```js
  var prompt = require('prompt');
  prompt.start();
  prompt.get(['username', 'email'], function (err, result) {
    console.log('Command-line input received:');
    console.log('  username: ' + result.username);
    console.log('  email: ' + result.email);
  });
```
```sh
  $ node examples/simple-prompt.js
  prompt: username: some-user
  prompt: email: some-user@some-place.org
  Command-line input received:
    username: some-user
    email: some-user@some-place.org
```
</section>
<section data-markdown>
### Session & Args
[esatterwhite/node-seeli](https://github.com/esatterwhite/node-seeli)

Object orientated, event driven CLI module

* Handles both interactive and directive
* Heavy up-front configuration
* Allows for heavily automated parsing
* Emits events
</section>
<section data-markdown>
```js
const os = require('os');
const cli = require('seeli');
cli.set({
  exitOnError: true
, color: 'green'
, name: 'example'
});
const Hello = new cli.Command({
  description:"displays a simple hello world command"
, name: 'hello'
, ui: 'dots'
, usage:[
    `${cli.bold("Usage:")} ${cli.get('name')} hello --interactive`
  , `${cli.bold("Usage:")} ${cli.get('name')} hello --name=john`
  , `${cli.bold("Usage:")} ${cli.get('name')} hello --name=john --name=marry --name=paul -v screaming`
  ]

, flags:{
    name:{
      type:[ String, Array ]
    , shorthand:'n'
    , description:"The name of the person to say hello to"
    , required:true
    }
  , volume:{
      type:String
    , choices:['normal', 'screaming']
    , description:"Will yell at each person"
    , default:'normal'
    , shorthand:'v'
    }
  }
, onContent: (content) => {
    console.log(content.join(os.EOL))
  }
, run: async function( cmd, data ){
    const out = [];
    this.ui.start('processing names');
    var names = Array.isArray( data.name ) ? data.name : [ data.name ];
    for( var x = 0; x< names.length; x++ ){
      this.ui.text = (`processing ${names[x]}`)
      let value = "Hello, " + names[x];
       out.push( data.volume === 'screaming' ? value.toUpperCase() : value );
    }
    this.ui.succeed('names processed successfully');
    return out
  }
});
cli.use('hello', Hello);
cli.run();
```
</section>
<section data-markdown>
![Example seeli GIF](https://raw.githubusercontent.com/esatterwhite/node-seeli/master/assets/seeli.gif)
</section>
<section data-markdown>
### Argument-Based
[tj/commander.js](https://github.com/tj/commander.js#readme)

Node.js command-line interfaces made easy

* No dependencies
* As simple as possible
* Lends itself to more complex CLIs
</section>
<section data-markdown>
```js
var program = require('commander');
program
  .option('--no-sauce', 'Remove sauce')
  .option('--topping', 'The good parts', 'cheese')
  .parse(process.argv);
console.log(`you ordered a ${program.topping} pizza`);
if (program.sauce)
	console.log('  with sauce');
else
	console.log('  without sauce');
```
```bash
$ node index.js --topping green
you ordered a green pizza
  with sauce
$ node index.js --no-saouce
you ordered a cheese pizza
  without sauce
```
</section>
<section data-markdown>
### Arguments & Meta-CLI
[heroku/oclif](https://github.com/oclif/oclif)

Node.js Open CLI Framework. Built with 💜 by Heroku.

* Argument parsing
* Command structure, generation
* Testing helpers
* Plugins
* Hooks
* Optional Typescript
* Brand new
</section>
<section data-markdown>
```js
const {Command, flags} = require('@oclif/command');
class OclifExampleSingleJsCommand extends Command {
  async run() {
    const {flags} = this.parse(OclifExampleSingleJsCommand);
    const name = flags.name || 'world';
    this.log(`hello ${name} from ./src/index.js`);
  }
}
OclifExampleSingleJsCommand.flags = {
  version: flags.version({char: 'v'}),
  help: flags.help({char: 'h'}),
  name: flags.string({char: 'n', description: 'name to print'}),
};
```
```bash
$ node index.js
hello world from ./src/index.js
$ node index.js --name foobar
hello foobar from ./src/index.js
```
</section>
<section data-markdown>
## Configuration & Settings
</section>
<section data-markdown>
### Avoid If Possible
CI build scripts probably don't need much
* Standard input
* Environment variables
* Arguments
</section>
<section data-markdown>
### Persistent State
Daily interactive scripts can benefit from pre-configuration
* Authentication
* Preferences
* Aliases
</section>
<section data-markdown>
### Config / Dot Files
* Default empty
* Loading
* Saving
* Upgrading / Migrating
* Be a good neighbor
</section>
<section data-markdown>
### Where to Load?

* Root vs. local config files

```js
const path = require('path');
const os = require('os');
const pkg = require('../../package.json');
const rootConfig = path.resolve(os.homedir(), '.' + pkg.name, 'config.json');
const localConfig = path.resolve(process.cwd(), '.' + pkg.name + '.json');
```
</section>
<section data-markdown>
### Config File Tools
[indexzero/nconf](https://github.com/indexzero/nconf)

Hierarchical node.js configuration with files, environment variables, command-line arguments, and atomic object merging.
</section>
<section data-markdown>
## Packaging & Distribution
Make a package!

Decide if your package is a module or a script.
(or both)
</section>
<section data-markdown>
### Registering a bin command
```js
// package.json
{
  "name": "foobar",
  //...
  "bin": {
    "foobar": "./src/bin"
  }
  // ...
```
* Symlinked into **prefix/bin** for global installs
*  **./node_modules/.bin/** for local installs.
</section>
<section data-markdown>
Make sure that your file(s) referenced in **bin** starts with **#!/usr/bin/env node**, otherwise the scripts are started without the node executable!
```js
#!/usr/bin/env node
const pkg = require('../../package.json');
```
</section>
<section data-markdown>
### Naming things is hard
It's possible to have [zero or more](https://docs.npmjs.com/files/package.json#bin) bin commands
```js
"bin": "./bin/cmd.js",
// or
"bin": {
  "one": "./bin/one.js",
  "two": "./bin/two/",
}
```
</section>
<section data-markdown>
### Remote Diagnostics
Allow for introspection

[visionmedia/debug](https://github.com/visionmedia/debug#readme)

A tiny JavaScript debugging utility modelled after Node.js core's debugging technique. Works in Node.js and web browsers
</section>
<section data-markdown>
```js
var a = require('debug')('worker:a')
  , b = require('debug')('worker:b');
(function work() {
  a('doing lots of uninteresting work');
  setTimeout(work, Math.random() * 1000);
})();
(function workb() {
  b('doing some work');
  setTimeout(workb, Math.random() * 2000);
})();
```
![](https://user-images.githubusercontent.com/71256/29091486-fa38524c-7c37-11e7-895f-e7ec8e1039b6.png)
</section>
<section data-markdown>
### Remote Logging
* Think carefully about whether to send remote logs
* Homebrew's Google Analytics tussle
</section>
<section data-markdown>
### Communicating Updates
Be careful, as this can get annoying
```bash
$ nom version [major|minor|patch]
# can later be fetched from
# https://api.github.com/repos/&lt;user&gt;/&lt;repo&gt;/tags
```
[oclif/plugin-warn-if-update-available](https://github.com/oclif/plugin-warn-if-update-available)
</section>
<section data-markdown>
## Ideas
</section>
<section data-markdown>
### Automated interactions
Propagating CI events
* Generating builds
* Notifying of events
</section>
<section data-markdown>
### Replicating UI
Sometimes you don't want to leave the editor/terminal
* Remote authoring
* Clicking buttons
* Consolidated monitoring
</section>
<section data-markdown>
### Configure Existing Scripts
* What options are you setting with environment variables?
* Make those explicit
* What options are you editing on the fly?
* Make those explicit
</section>
<section data-markdown>
## Questions & Thanks
[www.andjosh.com/presents](https://www.andjosh.com/presents)
</section>
