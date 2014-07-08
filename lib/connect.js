/*!
 * Connect
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var merge = require('utils-merge');
var proto = require('./proto');

// expose createClient() as the module

module.exports = createClient;

/**
 * Create a new connect server.
 *
 * @return {Function}
 * @api public
 */

function createClient() {
  function app(req, res, next){ app.handle(req, res, next); }
  merge(app, proto);
  merge(app, EventEmitter.prototype);
  app.route = '/';
  app.stack = [];
  return app;
}
