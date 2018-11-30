const Guide = require('../models').Guide;

// create guide -> register
// TODO only admins create guides ???
exports.create_guide = function(req, res) {
    return Guide
        .create({
            account_number: req.body.account_number,
            swift: req.body.swift,
            user_id: req.body.user_id
        })
        .then((user) => res.status(201).send(user))
        .catch((error) => res.status(400).send(error));
};