const router = require('express').Router();
const sessionsController = require('../controllers/sessions');
const registrationsController = require('../controllers/registrations');
const staticsController = require('../controllers/statics');
const secureRoute = require('../lib/secureRoute');
const upload = require('../lib/upload');

router.route('/')
  .get(staticsController.index);

// router.get('/', (req, res) => res.render('index'));

router.route('/register')
  .get(registrationsController.new)
  .post(upload.single('filename'), registrationsController.create);


router.route('/login')
  .get(sessionsController.new)
  .post(sessionsController.create);

router.route('/logout')
  .get(sessionsController.delete);

router.all('*', (req, res) => res.notFound());

module.exports = router; //if you haven't done this then it will throw an error 'requires middleware'.
