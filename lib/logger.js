const debug = require('debug');

function newLogger(name) {
  const logger = debug(`gas:${name}`);

  function log(...args) {
    logger(...args);
  }
  function params(req) {
    logger(`PATH: ${req.path}`);
    if (Object.keys(req.params).length > 0) {
      logger('- URL %O', req.params);
    }
    if (Object.keys(req.query).length > 0) {
      logger('- GET %O', req.query);
    }
    if (Object.keys(req.body).length > 0) {
      logger('- POST %O', req.body);
    }
  }

  return {
    log,
    params,
  };
}

module.exports = newLogger;
