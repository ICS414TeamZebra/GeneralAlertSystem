const express = require('express');

const router = express.Router();
const Alert = require('lib/Alert');
const ActionLog = require('lib/ActionLog');

router.get('/', (req, res) => {
  res.render('dashboard', { title: 'Dashboard', alerts: Alert.all() });
});
router.get('/log', (req, res) => {
  res.render('log', { title: 'System Log', actions: ActionLog.all() });
});
router.get('/logout', (req, res) => {
  req.session.user = null;
  req.session.loggedIn = false;
  res.redirect(302, '/login');
});

module.exports = router;
