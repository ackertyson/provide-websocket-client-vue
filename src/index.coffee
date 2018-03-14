VueResource = require 'vue-resource'
WebSocketClient = require('provide-websockets').Client


class VueSocketClient
  constructor: (@Vue, { hostUrl, onError }) ->
    throw new Error 'You must pass hostUrl to constructor' unless hostUrl?
    onError ?= @onError
    @socketService = new WebSocketClient hostUrl, onError

  _console: (method, data) ->
    # make sure browser console has desired METHOD; fall back to console.log()
    return console.log(data) unless console[method]?
    console[method] data

  getSocket: (callback) ->
    return callback @socket if @socket?
    @Vue.http.get('/auth/socket/token').then (response) =>
      @socketService.connect response.body.token, callback

  _handleConnectionError: (err, msg, body, onData, onError) ->
    @onError err
    @socket = null # reset socket to trigger reconnection
    if body._isRetry? # only retry once
      @_console 'error', "...giving up on '#{msg}'"
      return
    @_console 'info', "...will retry '#{msg}' once" if err.message is 'Socket is closed'
    body._isRetry = true
    @send msg, body, onData, onError

  onError: (err) => # component did not provide onError(); print them to console
    @_console 'error', err

  send: (msg, body, onData, onError) =>
    onError ?= @onError
    @getSocket (socket) =>
      @socket = socket
      socket.send msg, body, onData, onError, @_handleConnectionError.bind @


module.exports =
  install: (Vue, options) ->
    Vue.use VueResource unless Vue.http?
    Vue::$socket = new VueSocketClient Vue, options
