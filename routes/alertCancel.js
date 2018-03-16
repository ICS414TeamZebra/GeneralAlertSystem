const express = require('express');

const router = express.Router();

const loggedIn = require('./../lib/loggedIn');
const names = require('./../lib/names');
const render = require('./../lib/cancelRenderer');

const confirmString = 'CANCEL ALERT';

const demoAlerts = [
  {
    event: 'missile',
    message: 'BALLISTIC MISSILE THREAT INBOUND TO HAWAII. SEEK IMMEDIATE SHELTER. THIS IS NOT A DRILL.',
    methods: ['eas'],
    locations: ['hawaii'],
    id: 0,
    date: 'Jan 1, 2018, 12:00PM',
  },
];

const demoCancel = {
  alert: demoAlerts[0],
  message: 'There is no missile threat or danger to the State of Hawaii. Repeat. False Alarm.',
  methods: ['eas'],
  locations: ['hawaii'],
  date: 'Jan 1, 2018, 12:02PM',
};

router.get('/', (req, res, next) => {
  if (loggedIn(req, res)) {
    res.redirect(301, `${req.baseUrl}/create`);
  }
});

router.get('/:alertId', (req, res, next) => {
  if (loggedIn(req, res)) {
    const { alertId } = req.params;
    res.redirect(301, `${req.baseUrl}/create/${alertId}`);
  }
});


router.get('/create', (req, res, next) => {
  if (loggedIn(req, res)) {
    // consoleParams(req);

    const urlForm = `${req.baseUrl}/create`;
    render.create(res, {
      alerts: demoAlerts, urlForm,
    });
  }
});

router.get('/create/:alertId', (req, res, next) => {
  if (loggedIn(req, res)) {
    // consoleParams(req);
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
  }
});

router.post('/create', (req, res, next) => {
  if (loggedIn(req, res)) {
    // consoleParams(req);

    if (req.body.back) {
      res.redirect(301, '/dashboard');
    } else {
      const {
        alert, message, methods = [], locations = [],
      } = req.body;
      const alertId = demoCancel.alert.id;

      let validate = true;
      if (validate) {
        // demo alertId
        res.redirect(301, `${req.baseUrl}/confirm/${alertId}`);
      } else {
        const err = 'you did a bad';
        const urlForm = `${req.baseUrl}/create`;
        render.create(res, {
          alert, alerts: demoAlerts, message, methods, locations, urlForm,
        }, err);
      }
    }
  }
});

router.get('/confirm/:alertId', (req, res, next) => {
  if (loggedIn(req, res)) {
    // consoleParams(req);
    const { alertId } = req.params;
    const {
      confirm = '', username = '', password = '',
    } = req.body;
    const urlForm = `${req.baseUrl}/confirm/${alertId}`;
    render.confirm(res, {
      alertId, username, confirmString, urlForm, ...demoCancel,
    });
  }
});

router.post('/confirm/:alertId', (req, res, next) => {
  if (loggedIn(req, res)) {
    // consoleParams(req);
    const { alertId } = req.params;
    if (req.body.back) {
      res.redirect(301, `${req.baseUrl}/create/${alertId}`);
    } else {
      const { alertId } = req.params;
      const {
        confirm = '', username = '', password = '',
      } = req.body;

      let validate = true;
      if (validate) {
        res.redirect(301, `${req.baseUrl}/receipt/${alertId}`);
      } else {
        const err = 'you did a bad';
        const urlForm = `${req.baseUrl}/confirm/${alertId}`;
        render.confirm(res, {
          alertId, username, confirmString, urlForm, ...demoCancel,
        }, err);
      }
    }
  }
});

router.get('/receipt/:alertId', (req, res, next) => {
  if (loggedIn(req, res)) {
    // consoleParams(req);
    const { alertId } = req.params;
    const urlCancel = `/alert/cancel/${alertId}`;
    const urlFinish = '/dashboard';
    render.receipt(res, {
      alertId, urlCancel, urlFinish, ...demoCancel,
    });
  }
});

module.exports = router;
