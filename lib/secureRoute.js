function secureRoute(req, res, next) {
  if(!req.session.isAuthenticated || !req.session.userId) {
    return req.session.regenerate(() => res.unauthorised());
  }
  next();
}

module.exports = secureRoute;
