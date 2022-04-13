const Hubs = require('./hubs-model');

function validateHub(req, res, next) {
	// in httpie, send numbers with key:=value
	if (typeof req.body.name != 'string' || req.body.name.trim() == '') {
		res.status(400).json({ message: 'name is required' });
		return;
	}

	req.hub = { name: req.body.name.trim() };
	next();
}


function ensureHubIdExists(req, res, next) {

}


module.exports = {
	validateHub,
};