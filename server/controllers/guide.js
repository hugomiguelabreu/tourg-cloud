const Guide = require('../models').Guide;
const Activity = require('../models').Activity;
const Message = require('../models').Message;

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
            price: req.body.price,
            guide_id: req.body.guide_id
        })
        .then((act) => res.status(201).send(act))
        .catch((error) => res.status(400).send(error));
};

exports.send_message = function (req, res, next) { // true user -> guide | false guide -> user

    return Message
        .create({
            msg: req.body.msg,
            way: false,
            user_id: req.body.user_id,
            guide_id: req.body.guide_id
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};