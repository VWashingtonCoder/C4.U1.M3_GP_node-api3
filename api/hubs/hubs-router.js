const express = require('express');

const Hubs = require('./hubs-model.js');
const { validateHub, ensureHubIdExists } = require('./hubs-middleware.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();


function moodyGatekeeper(req, res, next) {
  let r = Math.floor(Math.random() * 3);
  if(r == 0) {
    res.status(403).json({message: "YOU SHALL NOT PASS!"});
  } else {
    next();
  }
}

function rootPathGetHandler(req, res, next) {
  console.log(req.timestamp);
  Hubs.find(req.query)
    .then(hubs => {
      throw new Error("blah");
      res.status(200).json(hubs);
    })
    .catch(error => {
      next({ error });
    });
}

router.get('/', /*moodyGatekeeper,*/ rootPathGetHandler);

router.get('/:id', ensureHubIdExists, (req, res, next) => {
  res.json(req.existingHub);
  next(5);
});

router.post('/', validateHub, (req, res) => {
  Hubs.add(req.hub)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error adding the hub',
      });
    });
});

router.delete('/:id', ensureHubIdExists, (req, res) => {
  Hubs.remove(req.existingHub.id)
    .then(() => {
      res.status(200).json(req.existingHub);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error removing the hub',
      });
    });
});

router.put('/:id', validateHub, ensureHubIdExists, (req, res) => {
  Hubs.update(req.params.id, req.hub)
    .then(() => {
      res.status(200).json({ ...req.existingHub, ...req.hub });
      // res.status(200).json({ id: req.existingHub.id, name: req.hub.name });
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error updating the hub',
      });
    });
});

router.get('/:id/messages', ensureHubIdExists, (req, res) => {
  Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error getting the messages for the hub',
      });
    });
});

router.post('/:id/messages', ensureHubIdExists, (req, res) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then(message => {
      res.status(201).json(message);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error adding message to the hub',
      });
    });
});

module.exports = router;
