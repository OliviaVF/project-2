const User = require('../models/user');

function authentication(req, res, next) {
  if(!req.session.isAuthenticated) return next();

  User
    .findById(req.session.userId)
    .then((user) => {
      if(!user) { //if we don't have a user
        return req.session.regenerate(() => {
          req.flash('alert', 'You must be logged in');
          return res.redirect('/login');
        });
      }

      req.session.userId = user.id; //if we do have a user

      req.user = user;

      res.locals.user = user; // can access user in our views
      res.locals.currentUser = user; // can access user in our views
      res.locals.isAuthenticated = true;

      next();
    })
    .catch(next);
}

module.exports = authentication;
