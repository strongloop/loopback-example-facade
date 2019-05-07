// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback-example-facade

var colors = require('colors');
var http = require('http');

checkHealth('localhost', 3000, '/api/Vitals');

function checkHealth(host, port, path) {
  var httpOptions = {
    host: host,
    port: port,
    path: path,
    method: 'GET'
  };
  var req = http.request(httpOptions, function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str = str + chunk;
    });
    response.on('end', function() {
      printHealth(JSON.parse(str));
    });
  });
  req.on('error', function(err) {
    console.log(err);
  });
  req.end();
}

const HPIPE = '──';
const BPIPE = '└';
const TPIPE = '├';
const COLORS = {
  healthy: 'green',
  unhealthy: 'red'
};

function printHealth(vitals) {
  console.log(` ├── ${'facade'.white} (${vitals.status.green})`);
  printDependencies(vitals.dependencies);
}

function printDependencies(dependencies, depth) {
  Object.keys(dependencies).forEach(function(name) {
    let info = dependencies[name];
    let prefix = '';
    let status = info.status[COLORS[info.status]];
    depth = depth || 1;

    for(let i = 0; i < depth; i++) {
      prefix = '| ' + prefix;
    }

    if (depth === 1) {
      prefix += '└──'
    } else {
      prefix += '├──'
    }    
    let latency;
    if (info.latency) {
      latency = info.latency.toString();
    }
    if(latency) {
      console.log(` ${prefix} ${name.white} (${status}) ${'latency'.yellow}: ${latency.green}`);
    } else {
      console.log(` ${prefix} ${name.white} (${status})`);
    }
    if (info.dependencies) printDependencies(info.dependencies, depth + 1);
  });
}
