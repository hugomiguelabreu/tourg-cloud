const sequelize = require("sequelize");
const Activity = require('../models').Activity;
const Guide = require('../models').Guide;
const User = require('../models').User;
const Activity_Evaluation = require('../models').Activity_Evaluation;
const Guide_Evaluation = require('../models').Guide_Evaluation;

exports.activities = function(req, res) {

    return Activity
        .findAll({
            attributes: ['title', 'description', 'city', 'lat', 'lng',
                [sequelize.fn('SUM', sequelize.col('Activity_Evaluations.score')), 'total_activity_score'],
                [sequelize.fn('COUNT', sequelize.col('Activity_Evaluations.score')), 'n_activity_score']],
            group: ["Activity.id", "Guide.id", "Guide->User.id"],
            include: [{
                model: Guide,
                attributes: ['id', 'account_number', 'swift',
                    [sequelize.fn('SUM', sequelize.col('Guide->Guide_Evaluations.score')), 'total_guide_score'],
                    [sequelize.fn('COUNT', sequelize.col('Guide->Guide_Evaluations.score')), 'n_guide_score']],
                include: [{
                    model: User,
                    attributes: ['email', 'name', 'phone', 'bio', 'photo_path', 'createdAt']

                },{
                    model: Guide_Evaluation,
                    attributes: []
                }]
            },{
                model: Activity_Evaluation,
                attributes: []
            }]
        })
        .then(function (activities) {
            res.status(200).send(activities)
        })
        .catch(function (error) {
            console.log(error);
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


// return Activity
//     .findAll({
//         include: [{
//             model: Guide,
//             attributes: [[sequelize.fn('SUM', sequelize.col('Guide_Evaluation.score')), 'total_score']],
//             include: [{
//                 model: User,
//                 attributes: ['email', 'name', 'phone', 'bio', 'photo_path', 'createdAt']
//
//             },
//                 {
//                     model: Guide_Evaluation,
//                     attributes: []
//                 }]
//         },{
//             model: Activity_Evaluation
//         }]
//     })
//     .then(function (activities) {
//         res.status(200).send(activities)
//     })
//     .catch(function (error) {
//         console.log(error);
//         return res.status(400).send(error);
//     });


// .findAll({
//     attributes: [[sequelize.fn('SUM', sequelize.col('score')), 'total_score']],
//     group: ["Activity.id"],
//     include: [
//         {
//             model: Activity_Evaluation,
//             attributes: []
//         }]
// })
//     .then(function (activities) {
//         res.status(200).send(activities)
//     })
//     .catch(function (error) {
//         console.log(error);
//         return res.status(400).send(error);
//     });