/*!
 * Connect - HTTPServer
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var debug = require('debug')('connect:dispatcher');

// prototype

var app = module.exports = {};

// environment

var env = process.env.NODE_ENV || 'development';

/**
 * Utilize the given middleware `handle` to the given `route`,
 * defaulting to _/_. This "route" is the mount-point for the
 * middleware, when given a value other than _/_ the middleware
 * is only effective when that segment is present in the request's
 * pathname.
 *
 * For example if we were to mount a function at _/admin_, it would
 * be invoked on _/admin_, and _/admin/settings_, however it would
 * not be invoked for _/_, or _/posts_.
 *
 * @param {String|Function|Client} route, callback or client
 * @param {Function|Client} callback or client
 * @return {Client} for chaining
 * @api public
 */

app.use = function(route, fn){
  // default route to '/'
  if ('string' != typeof route) {
    fn = route;
    route = '/';
  }

  // wrap sub-apps
  if ('function' == typeof fn.handle) {
    var client = fn;
    client.route = route;
    fn = function(req, res, next){
      client.handle(req, res, next);
    };
  }

  // strip trailing slash
  if ('/' == route[route.length - 1]) {
    route = route.slice(0, -1);
  }

  // add the middleware
  debug('use %s %s', route || '/', fn.name || 'anonymous');
  this.stack.push({ route: route, handle: fn });

  return this;
};

/**
 * Handle  requests, punting them down
 * the middleware stack.
 *
 * @api private
 */

app.handle = function(req, res, out) {
  var stack = this.stack,
      index = 0;

  if(typeof res === 'function' && !out) {
    out = res;
    res = undefined;
  }

  // final function handler
  var done = out || function(err, fin) {};

  function next(err, next_req, next_res) {
    var layer, path, c;

    next_req = next_req || req;
    next_res = next_res || res;

    // next callback
    layer = stack[index++];

    // all done
    if (!layer) {
      done(err, next_req, next_res);
      return;
    }

    try {
      path = (typeof req === 'string') ? req : req.path;
      if (undefined == path) path = '/';

      // skip this layer if the route doesn't match.
      if (0 != path.toLowerCase().indexOf(layer.route.toLowerCase())) return next(err);

      c = path[layer.route.length];
      if (c && '/' != c && '.' != c) return next(err);

      debug('%s %s : %s', layer.handle.name || 'anonymous', layer.route, req.originalUrl);
      var arity = layer.handle.length;
      if (err) {
        if (arity === 4) {
          layer.handle(err, next_req, next_res, next);
        } else {
          next(err);
        }
      } else if (arity < 4) {
        layer.handle(next_req, next_res, next);
      } else {
        next();
      }
    } catch (e) {
      next(e);
    }
  }
  next();
};

/**
 * Log error using console.error.
 *
 * @param {Error} err
 * @api public
 */

function logerror(err){
  if (env !== 'test') console.error(err.stack || err.toString());
}
