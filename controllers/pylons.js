const Pylon = require('../models/pylon');

function indexRoute(req, res, next) {
  Pylon
    .find()
    .populate('createdBy')
    .exec()
    .then((pylons) => res.render('pylons/index', { pylons }))
    .catch(next);
}

function newRoute(req, res) {
  return res.render('pylons/new');
}

function createRoute(req, res, next) {
  req.body.createdBy = req.user;

  Pylon
    .create(req.body)
    .then(() => res.redirect('/pylons'))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest(`/pylons`, err.toString());
      next(err);
    });
}

module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute
};
