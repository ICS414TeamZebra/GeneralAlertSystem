const express = require('express');

const router = express.Router();


// const debug = require('lib/debugger')('login');

const loggedIn = require('lib/loggedIn');
const User = require('lib/User');

function loginRedirect(req, res) {
  const redirect = req.session.loginRedirect;
  req.session.loginRedirect = null;
  if (redirect) {
    res.redirect(302, redirect);
  } else {
    res.redirect(302, '/');
  }
}

router.get('/', (req, res) => {
  if (loggedIn(req, res, false)) {
    res.redirect(302, '/');
  } else {
    res.render('login', { url: req.baseUrl });
  }
});

router.post('/', (req, res) => {
  if (loggedIn(req, res, false)) {
    loginRedirect(req, res);
  } else {
    const { username, password } = req.body;
    if (User.login(username, password)) {
      req.session.user = username;
      req.session.loggedIn = true;
      loginRedirect(req, res);
    } else {
      res.render('login', {
        username: req.body.username,
        url: req.baseUrl,
        message: 'Username or password incorrect.',
      });
    }
  }
});

module.exports = router;
