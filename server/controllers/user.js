const models = require('../models');
const User = require('../models').User;
const Card = require('../models').Card;
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

const stripe = require("stripe")("sk_test_uuFlZ3ucNIgOPNPwdZ9hjDyD");

const notifications = require('../../notifications');

/* ------------------------- ---Multer ----- ---------------------- */
const multer = require('multer');
const path = require('path');
/* Setting a static folder named public */
//app.use(express.static('./public')); Já está à frente
/* Set multer storage engine */
//'../../public/uploads',
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
                cb(null, './public/uploads');
            },
    filename: function(req,file,cb){
        /* Callback function (error, fileName) */
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
});


/* Initialize the upload variable through multer set*/
var upload = multer({storage: storage}).single('image');
//.single('image'); // single because we're trying to upload a single image at the time



/* -----------------------------Multer end-def ---------------------*/




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

                                if(req.body.notification_token){
                                    user[0].update({
                                        notification_token: req.body.notification_token
                                    }).then(result => {
                                        res.json({ token: token, user: user[0]});
                                    })
                                }else{
                                    res.json({ token: token, user: user[0]});
                                }

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
    return Card.create({
        user_id: req.user.id,
        customer_id: req.body.customer_id,
        last_four: req.body.last_four,
        type: req.body.type
    }).then((cc) => res.status(200).send(cc))
    .catch((error) => res.status(400).send(error.message));

};


exports.credit_card = function(req, res) {

    return Card.findAll({
        where: {
            user_id: req.user.id
        }
    }).then((cc) => res.status(200).send(cc))
    .catch((error) => res.status(400).send(error.message));

};

exports.delete_credit_card = function(req, res) {

    return Card.findOne({
        where: {
            user_id: req.user.id,
            id: req.body.id
        }
    }).then(function (cc) {
        cc.destroy();
        res.status(200).json({message: 'deleted'})
    })
        .catch((error) => res.status(400).send(error.message));

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

    return Sequelize.transaction(function (t) {

        return Booking.findAll({
            where:{
                activity_date_id: req.body.activity_date_id
            }
        }, {transaction: t}).then(function (b) {

            if(b[0])
                throw new Error('booking already exists on this date');

            return Activity.findByPk(req.body.activity_id, {transaction: t})
                .then(function (activity) {

                    if(req.body.n_bookings > activity.n_people || req.body.n_bookings < activity.min_people)
                        throw new Error('invalid number of people');

                    return Booking.create({
                        user_id: req.user.id,
                        activity_id: req.body.activity_id,
                        activity_date_id: req.body.activity_date_id
                    },{transaction: t}).then(function (booking) {

                        return Guide.findByPk(activity.guide_id, {transaction: t})
                            .then(function (guide) {

                                if(req.body.token && req.body.save === 'true'){

                                    // Save credit card

                                    return stripe.customers.create({
                                        description: 'Customer for ' + activity.title,
                                        source: req.body.token // obtained with Stripe.js
                                    }). then(function (customer) {

                                        return Card.create({
                                            user_id: req.user.id,
                                            customer_id: customer.id,
                                            type: req.body.type,
                                            last_four: req.body.last_four
                                        }, {transaction: t}).then(function (cc) {

                                            let value = (req.body.n_booking * activity.price) * 100;
                                            console.log(value);

                                            return stripe.charges.create({
                                                amount: value,
                                                currency: "eur",
                                                customer: customer.id,
                                                description: "Charge for " + activity.title
                                            }).then(function (result) {

                                                if (result.status === 'succeeded'){
                                                    let value = (req.body.n_booking * activity.price) + parseFloat(guide.balance);

                                                    notifications.send_notification(guide.notification_token,
                                                        'You have a new booking',
                                                        activity.title + ' has been booked');

                                                    return guide.update({
                                                        balance: value
                                                    })
                                                }

                                                throw new Error('payment error')

                                            }).catch(function (err) {
                                                console.log(err)
                                                throw new Error('payment error')
                                            });
                                        })


                                    });
                                }

                                else{

                                    if(req.body.token && req.body.save === 'false'){

                                        // User credit card but dont save

                                        let value = (req.body.n_booking * activity.price) * 100;

                                        return stripe.charges.create({
                                            amount: value,
                                            currency: "eur",
                                            source: req.body.token,
                                            description: "Charge for " + activity.title
                                        }).then(function (result) {

                                            if (result.status === 'succeeded'){
                                                let value = (req.body.n_booking * activity.price) + parseFloat(guide.balance);

                                                notifications.send_notification(guide.notification_token,
                                                    'You have a new booking',
                                                    activity.title + ' has been booked');

                                                return guide.update({
                                                    balance: value
                                                })
                                            }

                                            throw new Error('payment error')
                                        })
                                    }

                                    else{

                                        // Charge using customer_id

                                        let value = (req.body.n_booking * activity.price) * 100;

                                        return stripe.charges.create({
                                            amount: value,
                                            currency: "eur",
                                            customer: req.body.customer_id,
                                            description: "Charge for " + activity.title
                                        }).then(function (result) {

                                            if (result.status === 'succeeded'){
                                                let value = (req.body.n_booking * activity.price) + parseFloat(guide.balance);

                                                notifications.send_notification(guide.notification_token,
                                                    'You have a new booking',
                                                    activity.title + ' has been booked');

                                                return guide.update({
                                                    balance: value
                                                })
                                            }

                                            throw new Error('payment error')

                                        }).catch(function (err) {
                                            console.log(err)
                                            throw new Error('payment error')
                                        });

                                    }

                                }
                            })
                    })
                })
        });
    }).then(function (result) {
        res.status(200).send(result)
    }).catch(function (err) {
        res.status(400).json({message: err.message});
    });
};


exports.bookings = function (req, res, next) {

    return Booking.findAll({
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

exports.booking = function (req, res, next) {

    return Booking.findOne({
        where:{
            id: req.params.id,
            user_id: req.user.id
        },
        include: [{
            model: Activity_Date
        },{
            model: Activity,
            include:{
                model: Guide,
                attributes:['id','account_number','swift','createdAt'],
                include: {
                    model: User,
                    attributes: ['id', 'email', 'name', 'phone', 'bio', 'photo_path', 'createdAt']
                }
            }
        }]
    }).then(function(bookings){
        res.status(200).send(bookings);
    }).catch(function(err){
        console.log(err);
        res.status(400).send(err);
    })
};

exports.gps = function (req, res) {

    return Booking.findByPk(req.params.id).then(function (booking) {

        let old_lat = booking.user_lat;

        return booking.update({
            user_lat: req.body.lat,
            user_lng: req.body.lng
        }).then(function(book){

            if(old_lat === null){

                // notify user
                let f = async function (){

                    let activity = await Activity.findByPk(book.activity_id);
                    let guide = await Guide.findByPk(activity.guide_id)

                    notifications.send_notification(guide.notification_token,
                        'Your guide has started the meet',
                        'Your guide for ' + activity.title + ' has started the meet' );

                };

                f();
            }

            res.status(200).send(book);
        }).catch(function(err){
            console.log(err);
            res.status(400).send(err);
        })
    }).catch(function(err){
        res.status(400).send(err);
    })

};


exports.upload_image = function(req,res){
    upload(req,res, (err) => {
        if(err){
            res.status(400).send(err);
        }
        else{
            var user_id = req.user.id;
            return User.findByPk(user_id)
                    .then(function(user){
                        console.log("User: " + user);
                        user.update({
                            photo_path: "uploads/" + req.file.filename
                        }).then(function(){
                            res.send(user.photo_path);
                        })
                        
                    })
                    .catch(function(err){
                        console.log("Erro");
                        res.send(err.message);
                    });
            }
    })
};

exports.update_notification_token = function (req, res) {

    return User.findByPk(req.user.id)
        .then(function (user) {
            return user.update({
                notification_token: req.body.notification_token
            }).then(function(result){
                res.status(200).send(result);
            }).catch(function(err){
                console.log(err);
                res.status(400).send(err);
            })
        }).catch(function (err) {
            res.status(400).json({message: 'user does not exist'});
        })
};

