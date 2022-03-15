const EventEmitter = require('events');

// const logger = require('./logger');
// const path = require('path');
// logger('message');

// const os = require('os');

const Logger = require('./logger');
const logger = new Logger();

//Register a listener
logger.on('messageLogged', (arg) => {
    console.log('Listener called', arg)
});

logger.log('message');

// // var pathObj = path.parse(__filename);

// var totalMemory = os.totalmem()
// var freeMemory = os.freemem()

// // console.log(pathObj);

// console.log('Total memory: ' + totalMemory);
// console.log(`Free Memory: ${freeMemory} `);