const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const { dbURI } = require('../config/environment');
mongoose.connect(dbURI);

const User = require('../models/user');
const Pylon = require('../models/pylon');

User.collection.drop();
Pylon.collection.drop();

User
  .create([{
    image: '/assets/images/olivia.jpg',
    name: 'Olivia VF',
    username: 'OliviaVF',
    email: 'olivia@gmail.com',
    password: 'password',
    passwordConfirmation: 'password'
  },{
    image: '/assets/images/snoopdogg.jpg',
    name: 'Calvin Cordozar Broadus, Jr.',
    username: 'Snoop Dogg',
    email: 'snoop@gmail.com',
    password: 'password',
    passwordConfirmation: 'password'
  },{
    image: '/assets/images/jamie.jpg',
    name: 'Ja\'mie King',
    username: 'Ja\'mie',
    email: 'jamie@gmail.com',
    password: 'password',
    passwordConfirmation: 'password'}])
  .then((users) => {
    console.log(`${users.length} users created!`);

    return Pylon.create([{
      name: 'Soho House',
      category: 'Restaurant',
      address: '76 Dean St, Soho, London W1D 3SQ',
      website: 'http://www.sohohousedeanstreet.com/',
      tel: '020 3006 0076',
      lat: '51.5139',
      lng: '0.1329',
      comments: 'Real fancy!',
      createdBy: users[1]
    }]);
  })
  .then((pylons) => {
    console.log(`${pylons.length} pylons created!`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
