const express = require('express');

const router = express.Router();

const loggedIn = require('./../lib/loggedIn');

router.get('/', (req, res, next) => {
  if (loggedIn(req, res)) {
    res.render('dashboard', { title: 'Dashboard' });
  }
});

module.exports = router;
