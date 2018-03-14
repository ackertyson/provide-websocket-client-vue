# provide-websocket-client-vue

## Install

`npm install --save provide-websocket-client-vue`

## Usage

```
Vue = require 'vue'
VueSocketClient = require 'provide-websocket-client-vue'
Vue.use VueSocketClient, hostUrl: 'ws://my_websocket_host'

# ...and in component...

methods:
  onData: (data) ->
    console.log 'my msg response', data

  onError: (err) ->
    console.log 'my msg error', err

  mySocketRequest: ->
    @$socket.send 'my msg', 'my msg body', onData [, onError]
```

## Local dev

`gulp`

## Test

`npm test`
