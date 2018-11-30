const User = require('../models').User;

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