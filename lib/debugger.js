const debug = require('debug');

function newDebugger(name) {
  const debugThis = debug(`gas:${name}`);

  function log(...args) {
    debugThis(...args);
  }
  function params(req) {
    debugThis(`PATH: ${req.path}`);
    if (Object.keys(req.params).length > 0) {
      debugThis('- URL %O', req.params);
    }
    if (Object.keys(req.query).length > 0) {
      debugThis('- GET %O', req.query);
    }
    if (Object.keys(req.body).length > 0) {
      debugThis('- POST %O', req.body);
    }
  }

  return {
    log,
    params,
  };
}

module.exports = newDebugger;
