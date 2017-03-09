const rp = require('request-promise');
const oauth = require('../config/oauth');
const User = require('../models/user');

function facebook(req, res, next) {

  console.log(req.query);
  return rp({
    method: 'GET',
    url: oauth.facebook.accessTokenURL,
    qs: {
      client_id: oauth.facebook.clientId,
      redirect_uri: oauth.facebook.redirectURI,
      client_secret: oauth.facebook.clientSecret,
      code: req.query.code
    },
    json: true
  })

 .then((token) => {

   return rp.get({
     url: 'https://graph.facebook.com/v2.5/me?fields=id,name,email,picture',
     qs: token,
     json: true
   });
 })
 .then((profile) => {
   console.log(profile);
   return User.findOne({email: profile.email })//first check their emails in case they already exist on our systm
     .then((user) => {
       if(!user) {
         user = new User({
           name: profile.name,
           email: profile.email
         });
       }

       user.facebookId = profile.id;
       user.image = profile.picture.data.url;
       return user.save();
     });
 })
 .then((user) => {
   req.session.userId = user.id;
   req.session.isAuthenticated = true;

   req.flash('info', `welcome back ${user.name}!`);
   res.redirect('/');
 })
 .catch(next);
}

module.exports = {
  facebook
};
