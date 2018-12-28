const User = require('../models').User;
const Credit_Card = require('../models').Credit_Card;
const Activity = require('../models').Activity;
const Message = require('../models').Message;
const Complaint = require('../models').Complaint;
const Activity_Evaluation = require('../models').Activity_Evaluation;
const Guide_Evaluation = require('../models').Guide_Evaluation;
var passport = require("passport");
var jwt = require('jsonwebtoken');
const Booking = require('../models').Booking;


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




    // return Credit_Card
    //     .create({
    //         number: req.body.number,
    //         expiry_date: req.body.expiry_date,
    //         user_id: req.body.user_id
    //     })
    //     .then((cc) => res.status(201).send(cc))
    //     .catch((error) => res.status(400).send(error));
};

exports.send_message = function (req, res, next) { // true user -> guide | false guide -> user

    return Message
        .create({
            msg: req.body.msg,
            way: true,
            user_id: req.body.user_id,
            guide_id: req.body.guide_id
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};

exports.add_complaint = function (req, res, next) { // true user -> guide | false guide -> user

    return Complaint
        .create({
            text: req.body.text,
            way: true,
            user_id: req.body.user_id,
            guide_id: req.body.guide_id
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};

//TODO check if user went to the activity
exports.evaluate_activity = function (req, res, next) {

    return Activity_Evaluation
        .create({
            text: req.body.text,
            user_id: req.body.user_id,
            activity_id: req.body.activity_id,
            score: req.body.score
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};

//TODO check if user went to the activity with this guide
exports.evaluate_guide = function (req, res, next) {

    return Guide_Evaluation
        .create({
            text: req.body.text,
            user_id: req.body.user_id,
            guide_id: req.body.guide_id,
            score: req.body.score
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
};

exports.book_activity = function (req, res, next) {

    User.findByPk(req.user.id) //TODO transaction ???
        .then(function (user) {

            Booking.create({
                user_id: user.id,
                activity_id: req.body.activity_id,
                activity_date_id: req.body.activity_date_id

            }).then(function (booking) {

                user.addBooking(booking)
                    .then(function (result) {
                        res.status(200).send(booking)
                    }).catch(function (err) {
                    res.status(400).send(err)
                })

            }).catch(function (err) {
                res.status(400).send(err)
            })

        }).catch(function (err) {
            res.status(400).send(err)
        })
};

exports.bookings = function (req, res, next) {

    User.findByPk(req.user.id) // TODO verify activity_date_id == activity_id ???
        .then(function (user) {

            user.getBookings()
                .then(function (bookings) {
                    res.status(201).send(bookings)
                }).catch(function (err) {
                    res.status(400).send(err)
            })

        }).catch(function (err) {
            res.status(400).send(err)
        })
};