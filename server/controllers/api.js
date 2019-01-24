const Activity = require('../models').Activity;
const Guide = require('../models').Guide;
const User = require('../models').User;
const Activity_Evaluation = require('../models').Activity_Evaluation;
const Guide_Evaluation = require('../models').Guide_Evaluation;
const Activity_Date = require('../models').Activity_Date;
const Booking = require('../models').Booking;
const Category = require('../models').Category;
const City = require('../models').City;

const sequelize = require("sequelize");
const Op = sequelize.Op;

exports.activities = function(req, res) {

    return Activity
        .findAll({
            attributes: ['id','title', 'description', 'city', 'lat', 'lng',
                [sequelize.fn('SUM', sequelize.col('Activity_Evaluations.score')), 'total_activity_score'],
                [sequelize.fn('COUNT', sequelize.col('Activity_Evaluations.score')), 'n_activity_score']],
            group: ['Activity_Evaluations.id',"Activity.id", "Guide.id", "Guide->User.id", "Guide->Guide_Evaluations.id"],
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

            // let i;
            // let result = [];
            //
            // console.log(activities)

            //console.log(activities[0][0]);

            // for(i=0; i < activities.length; i++){
            //     let res = activities.toJSON();
            //     delete res[i]['Guide']['Guide_Evaluations'];
            //     delete res[i]['Activity_Evaluations'];
            //     console.log(i);
            //     console.log(res)
            //     result[i] = res
            // }

            res.status(200).send(activities)
        })
        .catch(function (error) {
            console.log(error);
            return res.status(400).send(error);
        });
};

exports.activity = function (req, res) {
    return Activity
        .findByPk(req.params.id,{
            attributes: ['id','title', 'description', 'city', 'lat', 'lng',
                [sequelize.fn('SUM', sequelize.col('Activity_Evaluations.score')), 'total_activity_score'],
                [sequelize.fn('COUNT', sequelize.col('Activity_Evaluations.score')), 'n_activity_score']],
            group: ['Activity_Evaluations.id',"Activity.id", "Guide.id", "Guide->User.id", "Guide->Guide_Evaluations.id"],
             include: [{
                model: Guide,
                attributes: ['id', 'account_number', 'swift',
                    [sequelize.fn('SUM', sequelize.col('Guide->Guide_Evaluations.score')), 'total_guide_score'],
                    [sequelize.fn('COUNT', sequelize.col('Guide->Guide_Evaluations.score')), 'n_guide_score']],
                include: [{
                    model: User,
                    attributes: ['id','email', 'name', 'phone', 'bio', 'photo_path', 'createdAt']

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

            if(!activities)
                res.status(404).json({message: 'activity not found'});

            // let result = activities.toJSON();
            //
            // delete result['Guide']['Guide_Evaluations'];
            // delete result['Activity_Evaluations'];

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

exports.activity_dates = function (req, res) {

    return Activity
        .findByPk(req.params.id, {
            group: ['Activity.id','Activity_Dates.id', "Activity_Dates->Bookings.id"],
            include:{
                model: Activity_Date,
                attributes: ['id', 'price', 'timestamp',
                    [sequelize.fn('COUNT', sequelize.col('Activity_Dates->Bookings.id')), 'bookings']],
                include:{
                    model: Booking,
                    attributes: []
                }
            }
        })
        .then(activities => {
            res.status(200).send(activities)
        })
        .catch(error => {
            console.log(error);
            return res.status(400).send(error);
        });
};

exports.search_city = function (req, res) {
    return Activity
        .findAll({
            where: {
                city: {
                    $iLike: req.params.city
                }
            },
            attributes: ['id','title', 'description', 'city', 'lat', 'lng',
                [sequelize.fn('SUM', sequelize.col('Activity_Evaluations.score')), 'total_activity_score'],
                [sequelize.fn('COUNT', sequelize.col('Activity_Evaluations.score')), 'n_activity_score']],
            group: ['Activity_Evaluations.id',"Activity.id", "Guide.id", "Guide->User.id", "Guide->Guide_Evaluations.id"],
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

exports.search_dates = function (req, res) {
    return Activity
        .findAll({
            where: {
                city: {
                    $iLike: req.params.city
                }
            },
            attributes: ['id','title', 'description', 'city', 'lat', 'lng',
                [sequelize.fn('SUM', sequelize.col('Activity_Evaluations.score')), 'total_activity_score'],
                [sequelize.fn('COUNT', sequelize.col('Activity_Evaluations.score')), 'n_activity_score']],
            group: ["Activity.id", "Guide.id", "Guide->User.id", "Guide->Guide_Evaluations.id", 'Activity_Evaluations.id', "Activity_Dates.id"],
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
            },{
                model: Activity_Date,
                where: {
                    timestamp: {
                        $between: [req.params.start_date, req.params.end_date]
                    }
                }
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