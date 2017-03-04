const User = require('../models/user');

function indexRoute(req, res, next) {
  User
    .find()
    .exec()
    .then((users) => res.render('users/index', { users }))
    .catch(next);
}

function showRoute(req, res, next) {
  User
  .findById(req.params.id)
  .exec()
  .then((user) => {
    if(!user) return res.notFound();
    return res.render('users/show', { user });
  })
  .catch(next);
}

function deleteRoute(req, res, next) {
  req.user
    .remove()
    .then(() => {
      req.session.regenerate(() => res.unauthorized('/', 'Your account has been deleted'));
    })
    .catch(next);
}

function newPylonRoute(req, res) {
  res.render('users/newPylon');
}

module.exports = {
  index: indexRoute,
  show: showRoute,
  delete: deleteRoute,
  newPylon: newPylonRoute
};
