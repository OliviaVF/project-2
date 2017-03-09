function indexRoute(req, res) {
  res.render('statics/index', { page: 'home'});
}

module.exports = {
  index: indexRoute
};
