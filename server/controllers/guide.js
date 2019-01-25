const models = require('../models');
const Guide = require('../models').Guide;
const User = require('../models').User;
const Activity = require('../models').Activity;
const Message = require('../models').Message;
const Activity_Date = require('../models').Activity_Date;
const Guide_Evaluation = require('../models').Guide_Evaluation;
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
            console.log("Criou o user!");
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

exports.update_data = function (req,res,next) {


     return sequelize.transaction(function (t) {
            
        return User.update({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone,
            bio: req.body.bio
            },
            { where:{
                    id: req.user.id
                    }
            ,transaction: t}).then(function(user){
            return Guide.update({
                account_number: req.body.account_number,
                swift: req.body.swift
                },
                { where: {
                        user_id: req.user.id
                         }
                ,transaction: t});
            })

    }).then(function(guide) {
        console.log("Transaction Succeed");
        res.status(200).json({
            user: {
              email: req.body.email,
              password: undefined,
              name: req.body.name,
              phone: req.body.phone,
              bio: req.body.bio  
            },
            guide: {
                user_id: req.user.id,
                account_number: req.body.account_number,
                swift: req.body.swift
            }
        });
    }).catch(function(err){
        console.log("Transaction error: " + err);
        res.status(400).json({message: err.message}); 
    });



}


exports.create_activity = function(req, res, next) {

    return sequelize.transaction(function (t) {

        return Activity.create({
            guide_id: req.body.guide_id,
            description: req.body.description,
            category_id: req.body.category_id,
            city: req.body.city,
            n_people: req.body.n_people,
            duration: req.body.duration,
            lat: req.body.lat,
            lng: req.body.lng
        }, {transaction: t}).then(function (activity) {

            // console.log(Object.keys(activity.__proto__));

            let dates = req.body.dates.split(',');
            let i;
            let promisses = [];

            for(i=0; i<dates.length; i++){
                p = Activity_Date
                    .create({
                        price: req.body.price,
                        timestamp: dates[i],
                        activity_id: activity.id
                    }, {transaction: t});

                promisses.push(p)

            }
            return Promise.all(promisses)
        });

    }).then(function (result) {
        res.status(201).send(result);
    }).catch(function (err) {
        res.status(400).send(err)
    });
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
                },
                {
                    model: Activity_Date
                }]
            }
        }
    }).then(function(bookings){
        res.status(200).send(bookings[0]);
    }).catch(function(err){
        console.log(err)
        res.status(400).send(err);
    })
};

exports.get_booking = function(req,res) {

    Booking.findByPk(req.params.id, {

        include: [{
            model: User
        },
        {
            model: Activity_Date
        },
        {
            model: Activity
        }]
    }).then(function(bookings){
        res.status(200).send(bookings);
    }).catch(function(err){
        console.log(err)
        res.status(400).send(err);
    })
};

exports.accept_booking = function (req, res) {

    Booking.findByPk(req.params.id).then(function (booking) {
        booking.update({
            accepted: req.body.state
        }).then(function(book){
            res.status(200).send(book);
        }).catch(function(err){
            console.log(err)
            res.status(400).send(err);
        })
    }).catch(function(err){
        res.status(400).send(err);
    })

};

exports.gps = function (req, res) {

    Booking.findByPk(req.params.id).then(function (booking) {
        booking.update({
            guide_lat: req.body.lat,
            guide_lng: req.body.lng
        }).then(function(book){
            res.status(200).send(book);
        }).catch(function(err){
            console.log(err);
            res.status(400).send(err);
        })
    }).catch(function(err){
        res.status(400).send(err);
    })

};



/* End some tour */
exports.end_tour = function(req,res){
    var activity_id = req.body.activity_id;
    var activity_date_id = req.body.activity_date_id;

    Booking.update({
        finished : true
    },{
    where:{
        activity_id : activity_id,
        activity_date_id : activity_date_id
    }})
    .then(function(booking){
        res.status(200).send("OK");
    })
    .catch(function(err){
        console.log(err.message);
        res.status(400).send(err.message);
    });
};

// TODO
exports.delete_activity = function(req,res){};

exports.statistics = function (req, res) {

    Booking.findAll({
        attributes: ['id', ['Activity.title', 'kappa']],
        include:[{
            model: Activity,
            attributes: ['id'],
            include: Activity_Date
        }]

    }).then(function(bookings){
        res.status(200).send(bookings);
    }).catch(function(err){
        res.status(400).send(err.message);
    })


    // Guide.findAll({
    //     where:{
    //         user_id: req.user.id
    //     },
    //     order: [sequelize.fn('date_trunc', 'day', sequelize.col('Activities->Bookings.createdAt'))],
    //     group: [sequelize.fn('date_trunc', 'day', sequelize.col('Activities->Activity_Dates.timestamp')), "Guide.id",
    //         "Activities.id", "Activities->Bookings.id", "Activities->Activity_Dates.id"],
    //  internal/modules/cjs/loader.js   attributes:[],
    //     include:[{
    //         model: Activity,
    //         where:{
    //             id: 57
    //         },
    //         attributes: ['id', 'title'],
    //         include: [{
    //             model: Booking
    //         },{
    //             model: Activity_Date
    //         }
    //         ]
    //     }]
    // }).then(function(bookings){
    //     res.status(200).send(bookings);
    // }).catch(function(err){
    //     console.log(err)
    //     res.status(400).send(err.message);
    //})

};

