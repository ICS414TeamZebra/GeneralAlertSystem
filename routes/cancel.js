const DeviceManager = require('lib/DeviceManager');
const debug = require('lib/debugger')('cancel');
const ValidationError = require('lib/ValidationError');

function perform(alert) {
  const config = '';
  for (const device of alert.methods) {
    DeviceManager.open(device);
    DeviceManager.configure(config);
    if (alert.type === 'live') {
      DeviceManager.warningOFF(device, alert.cancelled.message);
    }
    DeviceManager.close(device);
  }
}

function validateCreate(alert, message) {
  const errors = [];
  if (!alert) {
    errors.push('Please select an alert.');
  }
  if (!message) {
    errors.push('No message provided.');
  }
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

const User = require('lib/User');

const confirmString = 'CANCEL ALERT';

function validateConfirm(username, password, confirm) {
  const errors = [];
  if (confirm !== confirmString) {
    errors.push('Incorrect confirmation string.');
  }
  if (!User.checkLogin(username, password)) {
    errors.push('Incorrect username or password.');
  } else if (!User.checkRole(username, 'supervisor')) {
    errors.push(`User ${username} isn't a supervisor.`);
  }
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

const Alert = require('lib/Alert');

function alertActive(req, res, next, id) {
  if (!Alert.exists(id)) {
    const err = new Error(`Alert ${id} doesn't exist.`);
    err.status = 404;
    next(err);
    return false;
  } else if (Alert.checkCancelled(id)) {
    if (req.originalUrl !== `${req.baseUrl}/receipt/${id}`) {
      res.redirect(302, `${req.baseUrl}/receipt/${id}`);
      return false;
    }
  } else if (!Alert.checkSent(id)) {
    const err = new Error(`Alert ${id} was never sent.`);
    err.status = 404;
    next(err);
    return false;
  }
  return true;
}

const render = require('./cancelRenderer');
const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  debug.params(req);
  next();
});

router.get('/', (req, res) => {
  res.redirect(302, `${req.baseUrl}/create`);
});

router.get('/create', (req, res) => {
  const alerts = Alert.all().filter(alert => (alert.status === 'sent'));
  const urlForm = `${req.baseUrl}/create`;
  render.create(res, {
    alerts, urlForm,
  });
});

router.get('/create/:alertId', (req, res, next) => {
  const { alertId } = req.params;
  const { message } = req.body;
  // demo alert
  if (alertActive(req, res, next, alertId)) {
    const urlForm = `${req.baseUrl}/create`;
    const alerts = Alert.all().filter(alert => (alert.status === 'sent'));
    render.create(res, {
      alertId,
      alerts,
      message,
      urlForm,
    });
  }
});

router.post('/create', (req, res) => {
  const alertId = req.body.alert;
  if (req.body.back) {
    res.redirect(302, '/');
  } else { // } if (alertActive(req, res, next, alertId)) {
    const { message } = req.body;
    try {
      const alert = Alert.get(alertId);
      validateCreate(alert, message);
      alert.cancelled = { message };
      Alert.update(alertId, alert);
      res.redirect(302, `${req.baseUrl}/confirm/${alertId}`);
    } catch (e) {
      const urlForm = `${req.baseUrl}/create`;
      const alerts = Alert.all().filter(alert => (alert.status === 'sent'));
      render.create(res, {
        alertId,
        alerts,
        message,
        urlForm,
      }, e);
    }
  }
});

router.post('/create/:alertId', (req, res, next) => {
  const alertId = req.body.alert;
  if (req.body.back) {
    res.redirect(302, '/');
  } else if (alertActive(req, res, next, alertId)) {
    const { message } = req.body;
    try {
      const alert = Alert.get(alertId);
      validateCreate(alert, message);
      alert.cancelled = { message };
      Alert.update(alertId, alert);
      res.redirect(302, `${req.baseUrl}/confirm/${alertId}`);
    } catch (e) {
      const urlForm = `${req.baseUrl}/create/${alertId}`;
      const alerts = Alert.all().filter(alert => (alert.status === 'sent'));
      render.create(res, {
        alertId,
        alerts,
        message,
        urlForm,
      }, e);
    }
  }
});

router.get('/confirm/:alertId', (req, res, next) => {
  const { alertId } = req.params;
  if (alertActive(req, res, next, alertId)) {
    const { username = '' } = req.body;
    const alert = Alert.get(alertId); // testing only
    const urlForm = `${req.baseUrl}/confirm/${alertId}`;
    render.confirm(res, {
      username,
      confirmString,
      urlForm,
      alert,
      message: alert.cancelled.message,
    });
  }
});

router.post('/confirm/:alertId', (req, res, next) => {
  const { alertId } = req.params;
  if (req.body.back) {
    res.redirect(302, `${req.baseUrl}/create/${alertId}`);
  } else if (alertActive(req, res, next, alertId)) {
    const alert = Alert.get(alertId);
    const {
      confirm = '',
      username = '',
      password = '',
    } = req.body;

    try {
      validateConfirm(username, password, confirm);
      debug.log(`Cancelling alert ${alertId}`, alert);
      perform(alert);
      Alert.cancel(alertId, req.session.user, username);
      res.redirect(302, `${req.baseUrl}/receipt/${alertId}`);
    } catch (e) {
      const urlForm = `${req.baseUrl}/confirm/${alertId}`;
      render.confirm(res, {
        username,
        confirmString,
        urlForm,
        alert,
        message: alert.cancelled.message,
      }, e);
    }
  }
});

router.get('/receipt/:alertId', (req, res, next) => {
  const { alertId } = req.params;
  if (alertActive(req, res, next, alertId)) {
    const alert = Alert.get(alertId); // testing only
    const urlFinish = '/';
    render.receipt(res, {
      alertId, urlFinish, alert,
    });
  }
});

module.exports = router;
