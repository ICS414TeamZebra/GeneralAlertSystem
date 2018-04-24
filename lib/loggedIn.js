module.exports = (req, res, redirect = true) => {
  const loggedIn = req.session.user && req.session.loggedIn;
  if (!loggedIn && redirect) {
    req.session.loginRedirect = req.originalUrl;
    console.log(`go back to ${req.session.loginRedirect} when done`);
    res.redirect(302, '/login');
  }
  return (loggedIn === true);
};
