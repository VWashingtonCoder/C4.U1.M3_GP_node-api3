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
      next({ status: 400, message: 'asdf' });
    });
}

router.get('/', /*moodyGatekeeper,*/ rootPathGetHandler);

router.get('/:id', ensureHubIdExists, (req, res, next) => {
  res.json(req.existingHub);
});

router.post('/', validateHub, (req, res, next) => {
  Hubs.add(req.hub)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(error => next({ error }));
});

router.delete('/:id', ensureHubIdExists, (req, res, next) => {
  Hubs.remove(req.existingHub.id)
    .then(() => {
      res.status(200).json(req.existingHub);
    })
    .catch(error => next({ error }));
});

router.put('/:id', validateHub, ensureHubIdExists, (req, res, next) => {
  Hubs.update(req.params.id, req.hub)
    .then(() => {
      res.status(200).json({ ...req.existingHub, ...req.hub });
      // res.status(200).json({ id: req.existingHub.id, name: req.hub.name });
    })
    .catch(error => next({ error }));
});

router.get('/:id/messages', ensureHubIdExists, (req, res, next) => {
  Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(error => next({ error }));
});

router.post('/:id/messages', ensureHubIdExists, (req, res, next) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then(message => {
      res.status(201).json(message);
    })
    .catch(error => next({ error }));
});

module.exports = router;
