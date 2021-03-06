// 1. express receives a request
// 2. looks through its middleware for a match
// 3. hands off control to the first matching middleware
// 4. middleware may to 1 of 2 things:
//     1. send a response back
//     2. pass on the control to the next middleware

const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

function add_timestamp(req, res, next) {
  req.timestamp = new Date();
  next();
}

function log_a_thing(req, res, next) {
  console.log("here's a thing");
  next();
}


const loggy_thingy = arg => (req, res, next) => {
  console.log(arg);
  next();
};

server.use(add_timestamp, log_a_thing);

server.use(express.json());

server.use(helmet());

server.use(morgan('dev'));


server.use(loggy_thingy('asdf'));
server.use(loggy_thingy("here's another one!"));

server.use('/api/hubs', hubsRouter);

// server.use('GET', '/', (req, res) => {})
server.get('/', (req, res) => {
  res.send(`
    <h2>Hubs API</h2>
    <p>Welcome to the Hubs API</p>
  `);
});

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Error retrieving the hubs',
    stack: err.error.stack,
  });
});

server.use('*', (req, res) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});

module.exports = server;
