// require our packages
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // setting bluebird to be promise library for mongoose
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const { port, env, dbURI, sessionSecret } = require('./config/environment');
const errorHandler = require('./lib/errorHandler');
const routes = require('./config/routes');
const customResponses = require('./lib/customResponses');
const authentication = require('./lib/authentication');

// create an express app
const app = express();

// set up our views/template engine
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`); // back tick for pushing in variable to get turned into a string
app.use(expressLayouts); // middleware but makes sense to put it with views

// set up our static files folder
app.use(express.static(`${__dirname}/public`)); // when there is a request for anything, first look in public folder, and it not in there then look in routes.

// connect to our database
mongoose.connect(dbURI);

// set up middleware
if(env !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride((req) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;

    return method;
  }
}));

// set up our sessions
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

// set up flash messages AFTER sessions
app.use(flash()); //uses session to store message in. Depends on session to be triggered/not triggered

// set up our customResponses
app.use(customResponses);

// set up our authentication
app.use(authentication);

// set up our routes - just before our errorHandler
app.use(routes);

// set up our errorHandler - ALWAYS LAST PEICE OF MIDDLEWARE BEFORE OUR LISTEN
app.use(errorHandler);

// connect to a port
app.listen(port, () => console.log(`Express is listening to port ${port}`));
