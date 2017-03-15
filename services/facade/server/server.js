'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var healthCheck = require('./health-check');
var app = module.exports = loopback();
var Promise = require('bluebird');

app.get('/vitals/docker', (req, res) => {
  res.send('ok');
});

app.get('/vitals', (req, res) => {
  var services = healthCheck.checkHealth();
  Promise.all(services).then(function(results) {
    var health = {'status': 'healthy', dependencies: {}};
    results.forEach(function(item) {
      health.dependencies[item.path] = item.health;
    });
    res.json(health);
  });
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
