var colors = require('colors');

let service = 'facade'; // pass this as an arg to the cli
let url = 'http://facade/vitals';

const vitals = {
  status: 'healthy',
  dependencies: {
    accounts: {
      status: 'healthy',
      dependencies: {
        'accounts-redis': {
          status: 'healthy'
        },
        'accounts-db': {
          status: 'healthy'
        }
      }
    },
    transactions: {
      status: 'unhealthy',
      dependencies: {
        'shared-redis': {
          status: 'healthy'
        },
        'mongodb': {
          status: 'unhealthy'
        }
      }
    },
    customers: {
      status: 'healthy',
      meta: {
        memory: process.memoryUsage()
      },
      dependencies: {
        'shared-redis': {
          status: 'healthy'
        },
        internalService: {
          status: 'healthy'
        }
      }
    }
  }
};

const HPIPE = '──';
const BPIPE = '└';
const TPIPE = '├';


const COLORS = {
  healthy: 'green',
  unhealthy: 'red'
};

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

    console.log(` ${prefix} ${name.white} (${status})`);
    if (info.dependencies) printDependencies(info.dependencies, depth + 1);
  });
}

console.log(` ├── ${'facade'.white} $('healthy'.green)`);
printDependencies(vitals.dependencies);
