const User = require('../models').User;
const Credit_Card = require('../models').Credit_Card;
const Activity = require('../models').Activity;
const Message = require('../models').Message;
const Complaint = require('../models').Complaint;
const Activity_Evaluation = require('../models').Activity_Evaluation;
const Guide_Evaluation = require('../models').Guide_Evaluation;
const Booking = require('../models').Booking;

// create user -> register
exports.create_user = function(req, res) {
    return User
        .create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone,
            bio: req.body.bio
        })
        .then((user) => res.status(201).send(user))
        .catch((error) => res.status(400).send(error));
};

// add credit card
exports.add_credit_card = function(req, res) {
    return Credit_Card
        .create({
            number: req.body.number,
            expiry_date: req.body.expiry_date,
            user_id: req.body.user_id
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};

exports.add_activity = function (req, res, next) {

    return Booking
        .create({
            user_id: req.body.user_id,
            activity_id: req.body.activity_id,
            timestamp: req.body.timestamp
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};

exports.send_message = function (req, res, next) { // true user -> guide | false guide -> user

    return Message
        .create({
            msg: req.body.msg,
            way: true,
            user_id: req.body.user_id,
            guide_id: req.body.guide_id
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};

exports.add_complaint = function (req, res, next) { // true user -> guide | false guide -> user

    return Complaint
        .create({
            text: req.body.text,
            way: true,
            user_id: req.body.user_id,
            guide_id: req.body.guide_id
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};

//TODO check if user went to the activity
exports.evaluate_activity = function (req, res, next) {

    return Activity_Evaluation
        .create({
            text: req.body.text,
            user_id: req.body.user_id,
            activity_id: req.body.activity_id,
            score: req.body.score
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};

//TODO check if user went to the activity with this guide
exports.evaluate_guide = function (req, res, next) {

    return Guide_Evaluation
        .create({
            text: req.body.text,
            user_id: req.body.user_id,
            guide_id: req.body.guide_id,
            score: req.body.score
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};