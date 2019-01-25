const models = require('../models');
const User = require('../models').User;
const Credit_Card = require('../models').Credit_Card;
const Activity = require('../models').Activity;
const Activity_Date = require('../models').Activity_Date;
const Message = require('../models').Message;
const Complaint = require('../models').Complaint;
const Activity_Evaluation = require('../models').Activity_Evaluation;
const Guide_Evaluation = require('../models').Guide_Evaluation;
const Guide = require('../models').Guide;
const Booking = require('../models').Booking;

var passport = require("passport");
var jwt = require('jsonwebtoken');

const sequelize = require("sequelize");
const Sequelize = models.sequelize;


/* user sign up */
exports.create_user = function(req, res) {
    return User
        .create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone,
            bio: req.body.bio
        })
        .then(function(user){ 
            user.password = '';
            res.status(201).send(user);
        })
        .catch(function(error){ 
            res.status(400).send(error);
         });
};

/* user log in */
exports.login = function(req,res){
    User.findAll({ where:{ email: req.body.email ,
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
                                user[0].password='';
                                res.json({ token: token, user: user[0]});
                             }
                             else{
                                res.status(401).json({message:"passwords did not match"});
                            }
                })
                .catch(function(user){
                        res.status(400).json({message:"Bad Request"});
                });
};

exports.update = function(req,res){

    User.findById(req.user.id)
        .then(function (user) {

            user.update({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                phone: req.body.phone,
                bio: req.body.bio
            }).then(function (up_user) {
                up_user.password = '';
                res.status(200).json(up_user);
            }).catch(function (err) {
                res.status(400).send(err)
            })

        }).catch(function (err) {
            res.status(400).send(err)
    })
};




// add credit card
exports.add_credit_card = function(req, res) {

    user = User.findAll({
        where: {
            email: req.body.email
        }
    }).then(function (user) {

        console.log(user[0].name);
        res.status(201).send(user)

    })
        .catch((error) => res.status(400).send(error));
};


exports.add_complaint = function (req, res, next) { // true user -> guide | false guide -> user

    return Complaint
        .create({
            text: req.body.text,
            way: true,
            user_id: req.user.user_id,
            guide_id: req.body.guide_id
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};


exports.evaluate_activity = function (req, res, next) {

    return Sequelize.transaction(function (t) {

        return Booking
            .findAll({
                where:{
                    id: req.body.booking_id,
                    user_id: req.user.id,
                    //activity_id: req.body.activity_id,
                    activity_evaluation_id: null
                }
            }, {transaction: t})
            .then(function (b) {

                if(!b[0])
                    throw new Error("user already evaluated activity");
                    // TODO check for more errors???

                return Activity_Evaluation
                    .create({
                        text: req.body.text,
                        user_id: req.user.id,
                        activity_id: req.body.activity_id,
                        score: req.body.score
                    }, {transaction: t}).then(function (activity_eval) {

                        return b[0].setActivity_Evaluation(activity_eval, {transaction: t})
                    })
            })
    }).then(function (result) {
        res.status(200).send(result)
    }).catch(function (err) {
        res.status(400).json({message: err.message })
    });
};

exports.evaluate_guide = function (req, res, next) {

    return Sequelize.transaction(function (t) {

        return Booking
            .findAll({
                where:{
                    id: req.body.booking_id,
                    user_id: req.user.id,
                    guide_evaluation_id: null
                }
            }, {transaction: t})
                .then(function (b) {

                    if(!b[0])
                        throw new Error("user already evaluated guide");
                    // TODO check for more errors???

                    return Guide_Evaluation
                        .create({
                            text: req.body.text,
                            user_id: req.user.id,
                            guide_id: req.body.guide_id,
                            score: req.body.score
                        }, {transaction: t}).then(function (guide_eval) {

                            return b[0].setGuide_Evaluation(guide_eval, {transaction: t})
                    })
        })
    }).then(function (result) {
        res.status(200).send(result)
    }).catch(function (err) {
        res.status(400).json({message: err.message })
    });
};

/* Trying to book an activity for n_people. */
exports.book_activity = function (req, res, next) {
    var activity_id = req.body.activity_id;
    var activity_date_id = req.body.activity_date_id; 
    var n_bookings = req.body.n_booking;
    var user_id = req.user.id;
    var user_aux,activity_aux,booking_aux;
   
    return Sequelize.transaction(function(t){
        return Booking.count({
            where:{
                activity_id: activity_id,
                activity_date_id: activity_date_id
            }
        },{transaction: t})
        .then(function(count){
            if(count > 0) throw new Error();

            return Activity.findByPk(activity_id
            ,{transaction: t})
        })
            .then(function(activity){
                activity_aux = activity;
                if(n_bookings > activity.n_people){
                    throw new Error();
                }
                return User.findByPk(user_id
                ,{transaction: t})
            })
                .then(function (user) {
                    user_aux = user;
                    return Booking.create({
                    user_id: user.id,
                    activity_id: activity_id,
                    activity_date_id: activity_date_id

                },{transaction: t})
                })     
                    .then(function(booking) {
                        booking_aux = booking;
                        return user_aux.addBooking(booking.id,{transaction: t});
                    })
                
    }).then(function(result) {
        console.log("Transaction Succeed");
        user_aux.password = undefined;
        res.status(200).json({
                        user: user_aux,
                        activity: activity_aux,
                        booking: booking_aux
        });
        send(result);
    }).catch(function(err){
        res.status(400).send(err.message);
    });
};


exports.bookings = function (req, res, next) {

    Booking.findAll({
        where:{
            user_id: req.user.id
        },
        group: ['Booking.id', "Activity.id", "Activity_Date.id", "Activity->Guide.id", "Activity->Guide->User.id"],
        include:[{
            model: Activity,
            attributes: ['id','title', 'description', 'city', 'lat', 'lng',
                [sequelize.fn('SUM', sequelize.col('Activity->Activity_Evaluations.score')), 'total_activity_score'],
                [sequelize.fn('COUNT', sequelize.col('Activity->Activity_Evaluations.score')), 'n_activity_score']],
            include: [{
                model: Guide,
                attributes: ['id','account_number','swift','createdAt'],
                include: {
                    model: User
                }
            },{
                model: Activity_Evaluation,
                attributes: []
            }]
        },{
            model: Activity_Date,
        }]
    }).then(function (bookings) {
        res.status(200).send(bookings)
    }).catch(function (err) {
        res.status(400).send(err.message)
    })
};

exports.gps = function (req, res) {

    Booking.findByPk(req.params.id).then(function (booking) {
        booking.update({
            user_lat: req.body.lat,
            user_lng: req.body.lng
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