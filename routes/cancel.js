const DeviceManager = require('lib/DeviceManager');
const debug = require('lib/debugger')('cancel');

function perform(alert) {
  const config = '';
  for (const device of alert.methods) {
    DeviceManager.open(device);
    DeviceManager.configure(config);
    if (alert.type === 'live') {
      DeviceManager.warningOFF(device, alert.message);
    }
    DeviceManager.close(device);
  }
}

function validateCreate(alert) {
  if (!alert.cancelled.message) {
    throw new Error('No message provided.');
  }
}

const User = require('lib/User');

const confirmString = 'CANCEL ALERT';

function validateConfirm(username, password, confirm) {
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

router.get('/create', (req, res, next) => {
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

router.post('/create', (req, res, next) => {
  const alertId = req.body.alert;
  if (req.body.back) {
    res.redirect(302, '/');
  } else if (alertActive(req, res, next, alertId)) {
    const { message } = req.body;
    try {
      const alert = Alert.get(alertId);
      alert.cancelled = { message };
      validateCreate(alert);
      Alert.update(alertId, alert);
      res.redirect(302, `${req.baseUrl}/confirm/${alertId}`);
    } catch (e) {
      const err = e.message;
      const urlForm = `${req.baseUrl}/create`;
      const alerts = Alert.all().filter(alert => (alert.status === 'sent'));
      render.create(res, {
        alertId,
        alerts,
        message,
        urlForm,
      }, err);
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
      alert.cancelled = { message };
      validateCreate(alert);
      Alert.update(alertId, alert);
      res.redirect(302, `${req.baseUrl}/confirm/${alertId}`);
    } catch (e) {
      const err = e.message;
      const urlForm = `${req.baseUrl}/create/${alertId}`;
      const alerts = Alert.all().filter(alert => (alert.status === 'sent'));
      render.create(res, {
        alertId,
        alerts,
        message,
        urlForm,
      }, err);
    }
  }
});

router.get('/confirm/:alertId', (req, res, next) => {
  const { alertId } = req.params;
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
      const err = e.message;
      const urlForm = `${req.baseUrl}/confirm/${alertId}`;
      render.confirm(res, {
        username,
        confirmString,
        urlForm,
        alert,
        message: alert.cancelled.message,
      }, err);
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
