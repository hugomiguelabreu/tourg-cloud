const Activity = require('../models').Activity;
const Guide = require('../models').Guide;
const User = require('../models').User;
const Activity_Evaluation = require('../models').Activity_Evaluation;
const Guide_Evaluation = require('../models').Guide_Evaluation;
const Activity_Date = require('../models').Activity_Date;
const Booking = require('../models').Booking;
const Category = require('../models').Category;
const City = require('../models').City;
const Highlight = require('../models').Highlight;
const Activity_Language = require('../models').Activity_Language;
const Language = require('../models').Language;

const sequelize = require("sequelize");
const Op = sequelize.Op;

exports.activities = function(req, res) {
    
    return Activity
        .findAll({
            attributes: ['id','title', 'description', 'city', 'lat', 'lng', 'duration', 'n_people', 'category_id', 'price', 'min_people', 'photo_path',
                [sequelize.fn('SUM', sequelize.col('Activity_Evaluations.score')), 'total_activity_score'],
                [sequelize.fn('COUNT', sequelize.col('Activity_Evaluations.score')), 'n_activity_score']],
            group: ["Activity.id", "Guide.id", "Activity_Evaluations.activity_id", "Guide->User.id"],
            order: ['id'],
            include: [{
                model: Activity_Evaluation,
                attributes: []
                },{
                    model: Guide,
                    attributes:['id', 'account_number', 'swift',
                        [sequelize.literal(' ( SELECT SUM("Guide_Evaluations"."score") AS "total_guide_score" ' +
                            'FROM "Guides" AS "Guide" LEFT OUTER JOIN "Users" AS "User" ON "Guide"."user_id" = "User"."id" ' +
                            'LEFT OUTER JOIN "Guide_Evaluations" AS "Guide_Evaluations" ON "Guide"."id" = "Guide_Evaluations"."guide_id" ' +
                            'WHERE "Guide"."id" = "Activity"."guide_id" GROUP BY "Guide"."id", "User"."id")'), 'total_guide_score'],
                        [sequelize.literal(' ( SELECT COUNT("Guide_Evaluations"."score") AS "n_guide_score" ' +
                            'FROM "Guides" AS "Guide" LEFT OUTER JOIN "Users" AS "User" ON "Guide"."user_id" = "User"."id" ' +
                            'LEFT OUTER JOIN "Guide_Evaluations" AS "Guide_Evaluations" ON "Guide"."id" = "Guide_Evaluations"."guide_id" ' +
                            'WHERE  "Guide"."id" = "Activity"."guide_id" GROUP BY "Guide"."id", "User"."id")'), 'n_guide_score']
                    ],
                    include:{
                        model: User,
                        attributes: ['id', 'name', 'email', 'phone', 'bio', 'photo_path', 'createdAt']
                    }
            }]
        })
        .then(function (activities) {

            res.status(200).send(activities)
        })
        .catch(function (error) {
            console.log(error);
            return res.status(400).send(error.message);
        });
};

exports.activity = function (req, res) {

    return Activity
        .findByPk(req.params.id,{
            attributes: ['id','title', 'description', 'city', 'lat', 'lng', 'duration', 'n_people', 'category_id', 'price', 'min_people', 'photo_path',
                [sequelize.fn('SUM', sequelize.col('Activity_Evaluations.score')), 'total_activity_score'],
                [sequelize.fn('COUNT', sequelize.col('Activity_Evaluations.score')), 'n_activity_score']],
            group: ["Activity.id", "Guide.id", "Activity_Evaluations.activity_id", "Guide->User.id", "Highlights.id","Activity_Languages.id"],
            order: ['id'],
            include: [{
                model: Activity_Evaluation,
                attributes: []
                },{
                    model: Guide,
                    attributes:['id', 'account_number', 'swift',
                        [sequelize.literal(' ( SELECT SUM("Guide_Evaluations"."score") AS "total_guide_score" ' +
                            'FROM "Guides" AS "Guide" LEFT OUTER JOIN "Users" AS "User" ON "Guide"."user_id" = "User"."id" ' +
                            'LEFT OUTER JOIN "Guide_Evaluations" AS "Guide_Evaluations" ON "Guide"."id" = "Guide_Evaluations"."guide_id" ' +
                            'WHERE "Guide"."id" = "Activity"."guide_id" GROUP BY "Guide"."id", "User"."id")'), 'total_guide_score'],
                        [sequelize.literal(' ( SELECT COUNT("Guide_Evaluations"."score") AS "n_guide_score" ' +
                            'FROM "Guides" AS "Guide" LEFT OUTER JOIN "Users" AS "User" ON "Guide"."user_id" = "User"."id" ' +
                            'LEFT OUTER JOIN "Guide_Evaluations" AS "Guide_Evaluations" ON "Guide"."id" = "Guide_Evaluations"."guide_id" ' +
                            'WHERE  "Guide"."id" = "Activity"."guide_id" GROUP BY "Guide"."id", "User"."id")'), 'n_guide_score']
                    ],
                    include:{
                        model: User,
                        attributes: ['id', 'name', 'email', 'phone', 'bio', 'photo_path', 'createdAt']
                    }
            },{
                model: Highlight,
                attributes: ['title','description']
            },
            {
                model: Activity_Language,
                attributes: ['language']
            }
        ]
        })
        .then(function (activities) {

            res.status(200).send(activities)
        })
        .catch(function (error) {
            console.log(error);
            return res.status(400).send(error.message);
        });
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
                    [Op.iLike]: req.params.city + '%'
                }
            },
            attributes: ['id','title', 'description', 'city', 'lat', 'lng', 'duration', 'n_people', 'category_id', 'price', 'min_people', 'photo_path',
                [sequelize.fn('SUM', sequelize.col('Activity_Evaluations.score')), 'total_activity_score'],
                [sequelize.fn('COUNT', sequelize.col('Activity_Evaluations.score')), 'n_activity_score']],
            group: ["Activity.id", "Guide.id", "Activity_Evaluations.activity_id", "Guide->User.id"],
            order: ['id'],
            include: [{
                model: Activity_Evaluation,
                attributes: []
                },{
                    model: Guide,
                    attributes:['id', 'account_number', 'swift',
                        [sequelize.literal(' ( SELECT SUM("Guide_Evaluations"."score") AS "total_guide_score" ' +
                            'FROM "Guides" AS "Guide" LEFT OUTER JOIN "Users" AS "User" ON "Guide"."user_id" = "User"."id" ' +
                            'LEFT OUTER JOIN "Guide_Evaluations" AS "Guide_Evaluations" ON "Guide"."id" = "Guide_Evaluations"."guide_id" ' +
                            'WHERE "Guide"."id" = "Activity"."guide_id" GROUP BY "Guide"."id", "User"."id")'), 'total_guide_score'],
                        [sequelize.literal(' ( SELECT COUNT("Guide_Evaluations"."score") AS "n_guide_score" ' +
                            'FROM "Guides" AS "Guide" LEFT OUTER JOIN "Users" AS "User" ON "Guide"."user_id" = "User"."id" ' +
                            'LEFT OUTER JOIN "Guide_Evaluations" AS "Guide_Evaluations" ON "Guide"."id" = "Guide_Evaluations"."guide_id" ' +
                            'WHERE  "Guide"."id" = "Activity"."guide_id" GROUP BY "Guide"."id", "User"."id")'), 'n_guide_score']
                    ],
                    include:{
                        model: User,
                        attributes: ['id', 'name', 'email', 'phone', 'bio', 'photo_path', 'createdAt']
                    }
            },{
                model: Activity_Date,
                where:{
                    id:{
                        [Op.notIn]: [sequelize.literal(' SELECT "Activity_Dates"."id" ' +
                            'FROM "Activity_Dates" RIGHT OUTER JOIN "Bookings" ON "Activity_Dates"."id" = "Bookings"."activity_date_id" ' +
                            'WHERE "Activity_Dates"."id" > 0')], //TODO >0 jabardo ???
                    }
                },
                attributes: []

            }]
        })
        .then(function (activities) {

            res.status(200).send(activities)
        })
        .catch(function (error) {
            console.log(error);
            return res.status(400).send(error.message);
        });
};

exports.search_dates = function (req, res) {

    return Activity
        .findAll({
            where: {
                city: {
                    [Op.iLike]: req.params.city
                }
            },
            attributes: ['id','title', 'description', 'city', 'lat', 'lng', 'duration', 'n_people', 'category_id', 'price', 'min_people', 'photo_path',
                [sequelize.fn('SUM', sequelize.col('Activity_Evaluations.score')), 'total_activity_score'],
                [sequelize.fn('COUNT', sequelize.col('Activity_Evaluations.score')), 'n_activity_score']],
            group: ["Activity.id", "Guide.id", "Activity_Evaluations.activity_id", "Guide->User.id", "Activity_Dates.id"],
            order: ['id'],
            include: [{
                model: Activity_Evaluation,
                attributes: [],
                },{
                    model: Guide,
                    attributes:['id', 'account_number', 'swift',
                        [sequelize.literal(' ( SELECT SUM("Guide_Evaluations"."score") AS "total_guide_score" ' +
                            'FROM "Guides" AS "Guide" LEFT OUTER JOIN "Users" AS "User" ON "Guide"."user_id" = "User"."id" ' +
                            'LEFT OUTER JOIN "Guide_Evaluations" AS "Guide_Evaluations" ON "Guide"."id" = "Guide_Evaluations"."guide_id" ' +
                            'WHERE "Guide"."id" = "Activity"."guide_id" GROUP BY "Guide"."id", "User"."id")'), 'total_guide_score'],
                        [sequelize.literal(' ( SELECT COUNT("Guide_Evaluations"."score") AS "n_guide_score" ' +
                            'FROM "Guides" AS "Guide" LEFT OUTER JOIN "Users" AS "User" ON "Guide"."user_id" = "User"."id" ' +
                            'LEFT OUTER JOIN "Guide_Evaluations" AS "Guide_Evaluations" ON "Guide"."id" = "Guide_Evaluations"."guide_id" ' +
                            'WHERE  "Guide"."id" = "Activity"."guide_id" GROUP BY "Guide"."id", "User"."id")'), 'n_guide_score']
                    ],
                    include:{
                        model: User,
                        attributes: ['id', 'name', 'email', 'phone', 'bio', 'photo_path', 'createdAt']
                    }
                },{
                model: Activity_Date,
                where: {
                    timestamp: {
                        [Op.between]: [req.params.start_date, req.params.end_date]
                    },
                    id:{
                        [Op.notIn]: [sequelize.literal(' SELECT "Activity_Dates"."id" ' +
                            'FROM "Activity_Dates" RIGHT OUTER JOIN "Bookings" ON "Activity_Dates"."id" = "Bookings"."activity_date_id" ' +
                            'WHERE "Activity_Dates"."id" > 0')], //TODO >0 jabardo ???
                    }
                },
                attributes: []
            }]
        })
        .then(function (activities) {

            res.status(200).send(activities)
        })
        .catch(function (error) {
            console.log(error);
            return res.status(400).send(error.message);
        });
};