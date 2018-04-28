const express = require('express');

const router = express.Router();
const Alert = require('lib/Alert');
const ActionLog = require('lib/ActionLog');
// const debug = require('lib/debugger')('index');

function sortByDate(arr) {
  return arr.sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    } else if (a.date < b.date) {
      return 1;
    }
    return 0;
  }).map((item) => {
    const date = (new Date(item.date)).toUTCString();
    return { ...item, date };
  });
}
function truncate(arr, len) {
  const array = arr;
  if (array.length > len) {
    array.length = len;
  }
  return array;
}

router.get('/', (req, res) => {
  const alerts = truncate(sortByDate(Alert.all()), 10);
  // debug.log(alerts);
  res.render('dashboard', {
    title: 'Dashboard',
    alerts,
  });
});

router.get('/log', (req, res) => {
  const actions = sortByDate(ActionLog.all());
  // debug.log(actions);
  res.render('log', {
    title: 'System Log',
    actions,
  });
});

router.get('/logout', (req, res) => {
  req.session.user = null;
  req.session.loggedIn = false;
  res.redirect(302, '/login');
});

module.exports = router;
