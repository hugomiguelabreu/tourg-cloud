const Activity = require('../models').Activity;
const Guide = require('../models').Guide;
const User = require('../models').User;

exports.activities = function(req, res) {

    return Activity
        .findAll({
            include: [{
                model: Guide,
                include: [{
                    model: User,
                    attributes: ['email', 'name', 'phone', 'bio', 'photo_path', 'createdAt']
                }]
            }]
        })
        .then(function (activities) {
            res.status(200).send(activities)
        })
        .catch(function (error) {
            console.log(error)
            return res.status(400).send(error);
        });
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