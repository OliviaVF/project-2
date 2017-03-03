const router = require('express').Router();
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const secureRoute = ('../lib/secureRoute');

router.get('/', (req, res) => res.render('statics/index'));

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
    .get(sessions.new)
    .post(sessions.create);

router.all('*', (req, res) => res.notFound());

module.exports = router; //if you haven't done this then it will throw an error 'requires middleware'.
