// const express = require('express');

// replace with session checks and stuff later
const loggedIn = true;

module.exports = (req, res) => {
  if (!loggedIn) {
    res.redirect('/login');
  }
  return (loggedIn === true);
};
