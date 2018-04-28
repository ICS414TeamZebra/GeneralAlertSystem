const express = require('express');

const router = express.Router();
const Alert = require('lib/Alert');
const ActionLog = require('lib/ActionLog');

router.get('/', (req, res) => {
  res.render('dashboard', { title: 'Dashboard', alerts: Alert.all() });
});
router.get('/log', (req, res) => {
  res.render('log', {
    title: 'System Log',
    actions: ActionLog.all().sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    }).map((item) => {
      const date = (new Date(item.date)).toUTCString();
      return { ...item, date };
    }),
  });
});
router.get('/logout', (req, res) => {
  req.session.user = null;
  req.session.loggedIn = false;
  res.redirect(302, '/login');
});

module.exports = router;
