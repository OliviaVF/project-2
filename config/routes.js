const router = require('express').Router();
const sessionsController = require('../controllers/sessions');
const registrationsController = require('../controllers/registrations');
const staticsController = require('../controllers/statics');
const secureRoute = require('../lib/secureRoute');
const upload = require('../lib/upload');
const oauth = require('../controllers/oauth');

const users = require('../controllers/users');
const pylons = require('../controllers/pylons');

router.route('/')
  .get(staticsController.index);

router.route('/pylons')
  .get(secureRoute, pylons.index)
  .post(secureRoute, pylons.create);

router.route('/pylons/new')
  .get(secureRoute, pylons.new);

router.route('/pylons/:id')
  .put(secureRoute, pylons.update)
  .delete(secureRoute, pylons.delete);

router.route('/pylons/:id/edit')
  .get(secureRoute, pylons.edit);

router.route('/users')
  .get(secureRoute, users.index);

router.route('/users/:id')
  .get(secureRoute, users.show)
  .delete(secureRoute, users.delete);

router.route('/users/:id/edit')
  .get(secureRoute, users.edit);

// logged in user's profile page
// router.route('/user')
// .get(secureRoute, registrations.show) -> could use the users/show template

router.route('/register')
  .get(registrationsController.new)
  .post(upload.single('filename'), registrationsController.create);

router.route('/login')
  .get(sessionsController.new)
  .post(sessionsController.create);

router.route('/logout')
  .get(sessionsController.delete);

router.route('/oauth/facebook')
.get(oauth.facebook);

router.all('*', (req, res) => res.notFound());

module.exports = router; //if you haven't done this then it will throw an error 'requires middleware'.
