const Guide = require('../models').Guide;
const Activity = require('../models').Activity;

// create guide -> register
// TODO remove this endpoint ???
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

exports.create_activity = function(req, res) {
    return Activity
        .create({
            description: req.body.description,
            city: req.body.city,
            date: req.body.date,
            price: req.body.price
        })
        .then((act) => res.status(201).send(act))
        .catch((error) => res.status(400).send(error));
};