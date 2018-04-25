const express = require('express');
const names = require('lib/names');
const render = require('./alertRenderer');
const debugging = require('lib/debugger');
const Alert = require('lib/Alert');
const User = require('lib/User');

// const demoAlert = {
//   event: names.events.missile,
//   message: 'BALLISTIC MISSILE THREAT INBOUND TO HAWAII. SEEK IMMEDIATE SHELTER. THIS IS NOT A DRILL.',
//   methods: ['eas'],
//   locations: ['hawaii'],
// };

function validateCreate(alert) {
  if (!alert.event) {
    throw new Error('No event chosen.');
  }
  if (!(alert.event in names.events)) {
    throw new Error('Invalid event chosen.');
  }
  if (!alert.message) {
    throw new Error('No message provided.');
  }
  if (alert.methods.length === 0) {
    throw new Error('No methods chosen.');
  }
  if (alert.locations.length === 0) {
    throw new Error('No locations chosen.');
  }
  for (const method of alert.methods) {
    if (!(method in names.alertMethods)) {
      throw new Error(`Invalid method ${method}.`);
    }
  }
  for (const location of alert.locations) {
    if (!(location in names.locations)) {
      throw new Error(`Invalid location ${location}.`);
    }
  }
}

function validateConfirm(username, password, confirm, confirmString) {
  if (confirm !== confirmString) {
    throw new Error('Incorrect confirmation string.');
  }
  if (!User.checkLogin(username, password)) {
    throw new Error('Incorrect username or password.');
  }
  if (!User.checkRole(username, 'supervisor')) {
    throw new Error(`User ${username} isn't a supervisor.`);
  }
}

function alertActive(req, res, next, id) {
  if (!Alert.exists(id)) {
    const err = new Error(`Alert ${id} doesn't exist.`);
    err.status = 404;
    next(err);
    return false;
  } else if (Alert.checkSent(id)) {
    if (req.originalUrl !== `${req.baseUrl}/receipt/${id}`) {
      res.redirect(302, `${req.baseUrl}/receipt/${id}`);
      return false;
    }
  } else if (Alert.checkCancelled(id)) {
    res.redirect(302, `/cancel/receipt/${id}`);
    return false;
  }
  return true;
}

function newRouter(alertType, confirmString, perform) {
  const router = express.Router();
  const debug = debugging(alertType);

  router.use((req, res, next) => {
    debug.params(req);
    next();
  });

  router.get('/', (req, res) => {
    res.redirect(302, `${req.baseUrl}/create`);
  });

  router.get('/create', (req, res) => {
    const {
      event, message, methods = [], locations = [],
    } = req.body;

    const urlForm = `${req.baseUrl}/create`;
    render.create(res, alertType, {
      event, message, methods, locations, urlForm,
    });
  });

  router.post('/create', (req, res) => {
    if (req.body.back) {
      res.redirect(302, '/');
    } else {
      const {
        event,
        message,
      } = req.body;
      let {
        methods = [],
        locations = [],
      } = req.body;
      if (!Array.isArray(methods)) {
        methods = [methods];
      }
      if (!Array.isArray(locations)) {
        locations = [locations];
      }

      try {
        // demo alertId
        const alert = {
          type: alertType,
          event,
          message,
          methods,
          locations,
          user: req.session.user,
          date: new Date(),
        };
        validateCreate(alert);
        const alertId = Alert.create(alert);
        res.redirect(302, `${req.baseUrl}/confirm/${alertId}`);
      } catch (e) {
        const err = e.message;
        const urlForm = `${req.baseUrl}/create`;
        render.create(res, alertType, {
          event, message, methods, locations, urlForm,
        }, err);
      }
    }
  });

  router.get('/confirm/:alertId', (req, res, next) => {
    const { alertId } = req.params;
    if (alertActive(req, res, next, alertId)) {
      const alert = Alert.get(alertId); // testing only
      const { username = '' } = req.body;
      const urlForm = `${req.baseUrl}/confirm/${alertId}`;
      render.confirm(res, alertType, {
        alertId, username, confirmString, urlForm, ...alert,
      });
    }
  });

  router.post('/confirm/:alertId', (req, res, next) => {
    const { alertId } = req.params;
    if (req.body.back) {
      Alert.delete(alertId);
      res.redirect(302, `${req.baseUrl}/create`);
    } else if (alertActive(req, res, next, alertId)) {
      const alert = Alert.get(alertId);
      const {
        confirm = '',
        username = '',
        password = '',
      } = req.body;

      try {
        validateConfirm(username, password, confirm, confirmString);
        debug.log(`Sending alert ${alertId}`, alert);
        perform(alert);
        Alert.send(alertId, req.session.user, username);
        res.redirect(302, `${req.baseUrl}/receipt/${alertId}`);
      } catch (e) {
        const err = e.message;
        const urlForm = `${req.baseUrl}/confirm/${alertId}`;
        render.confirm(res, alertType, {
          alertId, username, confirmString, urlForm, ...alert,
        }, err);
      }
    }
  });

  router.get('/receipt/:alertId', (req, res, next) => {
    const { alertId } = req.params;
    if (alertActive(req, res, next, alertId)) {
      const alert = Alert.get(alertId); // testing only
      const urlCancel = `/cancel/create/${alertId}`;
      const urlFinish = '/';
      render.receipt(res, alertType, {
        alertId, urlCancel, urlFinish, ...alert,
      });
    }
  });

  return router;
}

module.exports = newRouter;
