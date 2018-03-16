// DO NOT USE YET LOL

const express = require('express');
const loggedIn = require('./../lib/loggedIn');
const names = require('./names');
const render = require('./../lib/alertRenderer');

const demoAlert = {
  event: names.events.missile,
  message: 'BALLISTIC MISSILE THREAT INBOUND TO HAWAII. SEEK IMMEDIATE SHELTER. THIS IS NOT A DRILL.',
  methods: ['eas'],
  locations: ['hawaii'],
};

function newRouter(alertType, confirmString) {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    if (loggedIn(req, res)) {
      res.redirect(301, `${req.baseUrl}/create`);
    }
  });

  router.get('/create', (req, res, next) => {
    if (loggedIn(req, res)) {
      // consoleParams(req);
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
      // consoleParams(req);

      if (req.body.back) {
        res.redirect(301, '/dashboard');
      } else {
        const {
          event, message, methods = [], locations = [],
        } = req.body;

        let validate = true;
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
      // consoleParams(req);
      const { alertId } = req.params;
      const {
        confirm = '', username = '', password = '',
      } = req.body;
      const urlForm = `${req.baseUrl}/confirm/${alertId}`;
      render.confirm(res, alertType, {
        alertId, username, confirmString, urlForm, ...demoAlert,
      });
    }
  });

  router.post('/confirm/:alertId', (req, res, next) => {
    if (loggedIn(req, res)) {
      // consoleParams(req);
      if (req.body.back) {
        res.redirect(301, '/create');
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
          render.confirm(res, alertType, {
            alertId, username, confirmString, urlForm, ...demoAlert,
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
      render.receipt(res, alertType, {
        alertId, urlCancel, urlFinish, ...demoAlert,
      });
    }
  });

  return router;
}

module.exports = newRouter;
