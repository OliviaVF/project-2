const Pylon = require('../models/pylon');

function indexRoute(req, res, next) {
  Pylon
    .find()
    .sort({updatedAt: 'desc'})
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
  console.log(req.body);
  Pylon
    .create(req.body)
    .then(() => res.redirect('/pylons'))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest('/pylons', err.toString());
      next(err);
    });
}

function deleteRoute(req, res, next) {
  Pylon
    .findById(req.params.id)
    .exec()
    .then((pylon) => {
      if(!pylon) return res.notFound();
      return pylon.remove();
    })
    .then(() => res.redirect('/pylons'))
    .catch(next);
}


function editRoute(req, res, next) {
  Pylon
    .findById(req.params.id)
    .exec()
    .then((pylon) => {
      return res.render('pylons/edit', { pylon });
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Pylon
    .findById(req.params.id)
    .exec()
    .then((pylon) => {
      if(!pylon) return res.notFound();

      for(const field in req.body) {
        pylon[field] = req.body[field];
      }

      return pylon.save();
    })
    .then(() => res.redirect(`/pylons/${req.params.id}`))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest(`/pylons/${req.params.id}/edit`, err.toString());
      next(err);
    });
}

module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  delete: deleteRoute,
  update: updateRoute,
  edit: editRoute
};
