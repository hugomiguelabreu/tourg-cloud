const User = require('../models').User;
const Credit_Card = require('../models').Credit_Card;

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