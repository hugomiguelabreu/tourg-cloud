const Activity = require('../models').Activity;

exports.activities = function(req, res) {
    return Activity
        .findAll()
        .then((user) => res.status(200).send(user))
        .catch((error) => res.status(400).send(error));
};

exports.activities_city = function (req, res) {
    return Activity
        .findAll({
            where:{
                country: req.params.country,
                city: req.params.city
            }
        })
        .then((user) => res.status(200).send(user))
        .catch((error) => res.status(400).send(error));
};