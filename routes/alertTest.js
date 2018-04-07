const express = require('express');

const router = express.Router();

const loggedIn = require('./../lib/loggedIn');
const names = require('./../lib/names');
const render = require('./../lib/alertRenderer');
const debug = require('./../lib/debugger')('test');

const DeviceManager = require('./../lib/DeviceManager');

const alertType = 'test';
const confirmString = 'TEST ALERT';

const demoAlert = {
  event: 'missile',
  message: 'BALLISTIC MISSILE THREAT INBOUND TO HAWAII. SEEK IMMEDIATE SHELTER. THIS IS NOT A DRILL.',
  methods: ['eas'],
  locations: ['hawaii'],
  date: 'Jan 1, 2018, 12:00PM',
};

router.get('/', (req, res, next) => {
  if (loggedIn(req, res)) {
    res.redirect(301, `${req.baseUrl}/create`);
  }
});

router.get('/create', (req, res, next) => {
  if (loggedIn(req, res)) {
    debug.params(req);
    const {
      event, message, methods = [], locations = [],
    } = req.body;

    const urlForm = `${req.baseUrl}/create`;
    render.create(res, alertType, {
      event, message, methods, locations, urlForm,
    });
  }
});

router.post('/create', (req, res, next) => {
  if (loggedIn(req, res)) {
    debug.params(req);

    if (req.body.back) {
      res.redirect(301, '/dashboard');
    } else {
      const {
        event, message, methods = [], locations = [],
      } = req.body;

      const validate = true;
      if (validate) {
        // demo alertId
        const alertId = 0;
        res.redirect(301, `${req.baseUrl}/confirm/${alertId}`);
      } else {
        const err = 'you did a bad';
        const urlForm = `${req.baseUrl}/create`;
        render.create(res, alertType, {
          event, message, methods, locations, urlForm,
        }, err);
      }
    }
  }
});

router.get('/confirm/:alertId', (req, res, next) => {
  if (loggedIn(req, res)) {
    debug.params(req);
    const { alertId } = req.params;
    const {
      confirm = '', username = '', password = '',
    } = req.body;
    const alert = demoAlert; // testing only
    const urlForm = `${req.baseUrl}/confirm/${alertId}`;
    render.confirm(res, alertType, {
      alertId, username, confirmString, urlForm, ...alert,
    });
  }
});

router.post('/confirm/:alertId', (req, res, next) => {
  if (loggedIn(req, res)) {
    debug.params(req);
    if (req.body.back) {
      res.redirect(301, `${req.baseUrl}/create`);
    } else {
      const { alertId } = req.params;
      const {
        confirm = '', username = '', password = '',
      } = req.body;
      const alert = demoAlert; // testing only

      const validate = true;
      if (validate) {
        for (const device of alert.methods) {
          DeviceManager.open(device);
          DeviceManager.test(device, alert.message, 'result?');
          DeviceManager.close(device);
        }

        res.redirect(301, `${req.baseUrl}/receipt/${alertId}`);
      } else {
        const err = 'you did a bad';
        const urlForm = `${req.baseUrl}/confirm/${alertId}`;
        render.confirm(res, alertType, {
          alertId, username, confirmString, urlForm, ...alert,
        }, err);
      }
    }
  }
});

router.get('/receipt/:alertId', (req, res, next) => {
  if (loggedIn(req, res)) {
    debug.params(req);
    const { alertId } = req.params;
    const alert = demoAlert; // testing only
    const urlCancel = `/alert/cancel/create/${alertId}`;
    const urlFinish = '/dashboard';
    render.receipt(res, alertType, {
      alertId, urlCancel, urlFinish, ...alert,
    });
  }
});

module.exports = router;
