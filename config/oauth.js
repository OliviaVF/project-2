const { env } = require('./environment');

module.exports = {
  facebook: {
    loginURL: 'https://www.facebook.com/v2.8/dialog/oauth',
    accessTokenURL: 'https://graph.facebook.com/v2.8/oauth/access_token',
    profileURL: 'https://api.facebook.com/user',
    clientId: process.env.FACEBOOK_CLIENT_ID2,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET2,
    redirectURI: env === 'development' ? 'https://pure-atoll-74725.herokuapp.com/oauth/facebook' : 'http://localhost:3000/oauth/facebook',
    getLoginURL() {
      return `${this.loginURL}?client_id=${this.clientId}&redirect_uri=${this.redirectURI}`;
    }
  }
};
