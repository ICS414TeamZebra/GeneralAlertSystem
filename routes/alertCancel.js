const express = require('express');

const router = express.Router();

const render = require('lib/cancelRenderer');

const DeviceManager = require('lib/DeviceManager');

const confirmString = 'CANCEL ALERT';

const Alert = require('lib/Alert');
const User = require('lib/User');
const debug = require('lib/debugger')('cancel');

// const demoAlerts = [
//   {
//     event: 'missile',
//     message: 'BALLISTIC MISSILE THREAT INBOUND TO HAWAII. SEEK IMMEDIATE SHELTER. THIS IS NOT A DRILL.',
//     methods: ['eas'],
//     locations: ['hawaii'],
//     id: 0,
//     date: 'Jan 1, 2018, 12:00PM',
//   },
// ];

// const demoCancel = {
//   alert: demoAlerts[0],
//   message: 'There is no missile threat or danger to the State of Hawaii. Repeat. False Alarm.',
//   methods: ['eas'],
//   locations: ['hawaii'],
//   date: 'Jan 1, 2018, 12:02PM',
// };

router.use((req, res, next) => {
  debug.params(req);
  next();
});

router.get('/', (req, res, next) => {
  res.redirect(302, `${req.baseUrl}/create`);
});

router.get('/create', (req, res, next) => {
  const alerts = Alert.all();
  const urlForm = `${req.baseUrl}/create`;
  render.create(res, {
    alerts, urlForm,
  });
});

router.get('/create/:alertId', (req, res, next) => {
  const { alertId } = req.params;
  const {
    message, methods = [], locations = [],
  } = req.body;
  // demo alert
  let { alert } = req.body;
  if (!alert) {
    ({ alert } = demoCancel);
  }
  const urlForm = `${req.baseUrl}/create`;
  render.create(res, {
    alert, alerts: demoAlerts, message, methods, locations, urlForm,
  });
});

router.post('/create', (req, res, next) => {
  if (req.body.back) {
    res.redirect(302, '/dashboard');
  } else {
    const {
      alert, message, methods = [], locations = [],
    } = req.body;
    const alertId = demoCancel.alert.id;

    let validate = true;
    if (validate) {
      // demo alertId
      res.redirect(302, `${req.baseUrl}/confirm/${alertId}`);
    } else {
      const err = 'you did a bad';
      const urlForm = `${req.baseUrl}/create`;
      render.create(res, {
        alert, alerts: demoAlerts, message, methods, locations, urlForm,
      }, err);
    }
  }
});

router.get('/confirm/:alertId', (req, res, next) => {
  const { alertId } = req.params;
  const {
    confirm = '', username = '', password = '',
  } = req.body;
  const alert = demoCancel;

  const urlForm = `${req.baseUrl}/confirm/${alertId}`;
  render.confirm(res, {
    alertId, username, confirmString, urlForm, ...alert,
  });
});

router.post('/confirm/:alertId', (req, res, next) => {
  const { alertId } = req.params;
  if (req.body.back) {
    res.redirect(302, `${req.baseUrl}/create/${alertId}`);
  } else {
    const { alertId } = req.params;
    const {
      confirm = '', username = '', password = '',
    } = req.body;
    const alert = demoCancel;

    let validate = true;
    if (validate) {
      for (const device of alert.methods) {
        DeviceManager.open(device);
        DeviceManager.warningOFF(device, alert.message, 'result?');
        DeviceManager.close(device);
      }

      res.redirect(302, `${req.baseUrl}/receipt/${alertId}`);
    } else {
      const err = 'you did a bad';
      const urlForm = `${req.baseUrl}/confirm/${alertId}`;
      render.confirm(res, {
        alertId, username, confirmString, urlForm, ...alert,
      }, err);
    }
  }
});

router.get('/receipt/:alertId', (req, res, next) => {
  const { alertId } = req.params;
  const urlCancel = `/alert/cancel/${alertId}`;
  const urlFinish = '/dashboard';
  const alert = demoCancel;

  render.receipt(res, {
    alertId, urlCancel, urlFinish, ...alert,
  });
});

module.exports = router;
