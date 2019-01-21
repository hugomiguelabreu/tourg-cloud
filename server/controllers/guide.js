const Guide = require('../models').Guide;
const User = require('../models').User;
const Activity = require('../models').Activity;
const Message = require('../models').Message;
const Activity_Date = require('../models').Activity_Date;
const Guide_Evaluation = require('../models').Guide_Evaluation;
const models = require('../models');
const Booking = require('../models').Booking;

var passport = require("passport");
var jwt = require('jsonwebtoken');
var sequelize = models.sequelize;



/* -------------------------- Código em desenvolvimento -------------------- */
/* guide sign-up  - Em desenvolvimento */

exports.create_guide = function(req, res) {

    let c_user = '';

    return sequelize.transaction(function (t) {

        return User.create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone,
            bio: req.body.bio
        }, {transaction: t}).then(function(user) {

            c_user = user;

            return Guide.create({
                account_number: req.body.account_number,
                swift: req.body.swift,
                user_id: user.id
            }, {transaction: t});
        })

    }).then(function(guide) {
        console.log("Transaction Succeed");
        res.status(200).json({ user: c_user, guide: guide});
    }).catch(function(err){
        console.log("Transaction Error");
        res.status(400).json({message: 'email already in use'}); // TODO check different errors
    });
};


//TODO findAll guide include user -> joao falar com renato
exports.login = function(req,res){
    User.findAll({ where:{email: req.body.email ,
                          password: req.body.password
                         }
                })
                .then(function(user){
                        if(typeof user[0] === "undefined") {
                            res.status(401).json({message:"invalid username or password"});
                        }
                        else if(user[0].password === req.body.password) {
                                var payload = {id:user[0].id};
                                var token = jwt.sign(payload,process.env.key);
                                Guide.findAll({ where: {
                                                           user_id:user[0].id
                                                        },
                                                        attributes: ['id', 'account_number', 'swift',
                                                            [sequelize.fn('SUM', sequelize.col('Guide_Evaluations.score')), 'total_guide_score'],
                                                            [sequelize.fn('COUNT', sequelize.col('Guide_Evaluations.score')), 'n_guide_score']],
                                                        group: ["Guide.id", "User.id"],
                                                        include: [{
                                                            model: User,
                                                        },{
                                                            model: Guide_Evaluation,
                                                            attributes: []
                                                        }]
                                                      })
                                    .then(function(guide){
                                        guide[0].password='';
                                        res.json({ token: token, user: guide[0]});
                                    }).catch(function(error){
                                        res.status(400).send(error);
                                    });

                             }
                             else{
                                res.status(401).json({message:"passwords did not match"});
                            }
                })
                .catch(function(err){
                    res.status(400).send(err);
                });
};

/* --------------------------------------------------------------------------- */




exports.create_activity = function(req, res, next) {

    return sequelize.transaction(function (t) {

        activity = Activity
            .create({
                guide_id: req.body.guide_id,
                description: req.body.description,
                category_id: req.body.category_id,
                city: req.body.city,
                lat: req.body.lat,
                lng: req.body.lng,
            }, {transaction: t});



        let dates = req.body.dates.split(',');
        console.log(dates)
        let i = 0;
        let promisses = [];

        for(i=0; i<dates.length; i++){
            console.log(dates[i]);
            p = Activity_Date
                .create({
                    price: req.body.price,
                    timestamp: dates[i],
                    activity_id: activity.id
                }, {transaction: t});

            promisses.push(p)

        }
        // chain all your queries here. make sure you return them.
        return Promisse.all(promisses).then(function (act_dates) {

            let i = 0;
            console.log(act_dates)

            // activity = Activity
            //     .create({
            //         guide_id: req.body.guide_id,
            //         description: req.body.description,
            //         category_id: req.body.category_id,
            //         city: req.body.city,
            //         lat: req.body.lat,
            //         lng: req.body.lng,
            //     }, {transaction: t});

        });

    }).then(function (result) {
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
    }).catch(function (err) {
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
    });


    // return Activity
    //     .create({
    //         guide_id: req.body.guide_id,
    //         description: req.body.description,
    //         category_id: req.body.category_id,
    //         city: req.body.city,
    //         lat: req.body.lat,
    //         lng: req.body.lng,
    //         Activity_Dates: {
    //             price: req.body.price,
    //             timestamp: req.body.timestamp
    //         }
    //     },
    //     {
    //         include: Activity_Date
    //     })
    //     .then((cc) => res.status(201).send(cc))
    //     .catch((error) => res.status(400).send(error));
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


exports.get_bookings = function(req,res) {
    Guide.findAll({
        where:{
            user_id: req.user.id
        },
        include:{
            model: Activity,
            include: {
                model: Booking,
                include: [{
                    model: User,
                    attributes: ['email', 'name', 'phone', 'bio', 'photo_path', 'createdAt']
                },
                    {
                        model: Activity
                    }]
            }
        }
    }).then(function(bookings){
        res.status(201).send(bookings);
    }).catch(function(err){
        console.log(err)
        res.status(400).send(err);
    })
};

