const User = require('../models/user');
const Pylon = require('../models/pylon');

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
    return Pylon
      .find({ createdBy: user.id })
      .exec()
      .then((pylons) => {
        res.render('users/show', { user, pylons });
      });
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


module.exports = {
  index: indexRoute,
  show: showRoute,
  delete: deleteRoute
};
