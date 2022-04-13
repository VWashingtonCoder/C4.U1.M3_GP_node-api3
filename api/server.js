// 1. express receives a request
// 2. looks through its middleware for a match
// 3. hands off control to the first matching middleware
// 4. middleware may to 1 of 2 things:
//     1. send a response back
//     2. pass on the control to the next middleware

const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use((req, res, next) => {
  req.timestamp = new Date();
  next();
});

server.use(express.json());

server.use('/api/hubs', hubsRouter);

// server.use('GET', '/', (req, res) => {})
server.get('/', (req, res) => {
  res.send(`
    <h2>Hubs API</h2>
    <p>Welcome to the Hubs API</p>
  `);
});

server.use('*', (req, res) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});

module.exports = server;
