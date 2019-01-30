const models = require('../models');
const Guide = require('../models').Guide;
const User = require('../models').User;
const Activity = require('../models').Activity;
const Message = require('../models').Message;
const Activity_Date = require('../models').Activity_Date;
const Guide_Evaluation = require('../models').Guide_Evaluation;
const Activity_Evaluation = require('../models').Activity_Evaluation;
const Booking = require('../models').Booking;
const Highlight = require('../models').Highlight;
const Language = require('../models').Language;
const Activity_Language = require('../models').Activity_Language;
const default_photo_path = 'uploads/user.jpg';
const default_activity_photo_path = 'uploads/activity.png';
var passport = require("passport");
var jwt = require('jsonwebtoken');

var sequelize = models.sequelize;

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
var upload = multer({storage: storage},{fieldSize: 100000}).single('image');
//.single('image'); // single because we're trying to upload a single image at the time



/* -----------------------------Multer end-def ---------------------*/



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
            bio: req.body.bio,
            photo_path: default_photo_path
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

                                Guide.findAll({
                                    where: {
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
                                    var payload = {id:user[0].id, guide_id:guide[0].id};
                                    var token = jwt.sign(payload,process.env.key);

                                    guide[0].password='';

                                    if(req.body.notification_token){
                                        guide[0].update({
                                            notification_token: req.body.notification_token
                                        }).then(result => {
                                            res.json({ token: token, user: guide[0]});
                                        })
                                    }

                                    else {
                                        res.json({ token: token, user: guide[0]});
                                    }

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



};


exports.create_activity = function(req, res, next) {

    return sequelize.transaction(function (t) {

        let promisses = [];

        return Activity.create({ //TODO get guide id by token
            guide_id: req.user.guide_id,
            description: req.body.description,
            category_id: req.body.category_id,
            city: req.body.city,
            n_people: req.body.n_people,
            duration: req.body.duration,
            lat: req.body.lat,
            lng: req.body.lng,
            price: req.body.price,
            title: req.body.title,
            min_people: req.body.min_people,
            photo_path: default_activity_photo_path
        }, {transaction: t}).then(function (activity) {

            //console.log(Object.keys(activity.__proto__));

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

            let highlight_titles = req.body.highlight_titles.split(';');
            let highlight_descriptions = req.body.highlight_descriptions.split(';');

            for(i=0; i<highlight_titles.length; i++){
                p = Highlight
                    .create({
                        title: highlight_titles[i],
                        description: highlight_descriptions[i],
                        activity_id: activity.id
                    }, {transaction: t});

                promisses.push(p)

            }

            let languages = req.body.languages.split(',');

            for(i=0; i<languages.length; i++){

                p = Language.findOrCreate({
                    attributes: ['name'],
                    where:{
                        name: languages[i]
                    },
                    transaction: t,
                }).then( function (lang) {

                    Activity_Language.create({
                        activity: activity.id,
                        language: lang[0].name
                    })

                });

                promisses.push(p)
            }


            return Promise.all(promisses)
        });

    }).then(function (result) {
        res.status(201).send(result);
    }).catch(function (err) {
        res.status(400).send(err.message)
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

exports.accept_booking = function (req, res) { //TODO refund stripe

    return sequelize.transaction(function (t) {

        // chain all your queries here. make sure you return them.
        return Booking.findOne({
            where:{
                id: req.params.id,
            }
        }, {transaction: t}).then(function (booking) {
            return booking.update({
                accepted: req.body.state
            }, {transaction: t}).then(function (book) {

                if(req.body.state === 'false'){

                    return Guide.findByPk(req.user.guide_id).then(function (guide) {

                        let new_value = guide.balance - booking.value;
                        console.log(new_value);
                        console.log(booking.value);

                        return guide.update({
                            balance: new_value
                        }, {transaction: t}).then(function (result) {

                            stripe.refunds.create({
                                charge: booking.value
                            }).then(function () {

                                // notify user
                                let f = async function () {

                                    let user = await User.findByPk(book.user_id);
                                    let activity = await Activity.findByPk(book.activity_id);

                                    notifications.send_notification(user.notification_token,
                                        'Your booking has been rejected',
                                        'Your booking for ' + activity.title + ' has been canceled');
                                };

                                f();

                                res.status(200).send(result);

                            }).catch(function (err) {

                                throw new Error('payment error');
                            })
                        })
                    })
                }

                else{

                    let f = async function () {

                        let user = await User.findByPk(book.user_id);
                        let activity = await Activity.findByPk(book.activity_id);

                        notifications.send_notification(user.notification_token,
                            'Your booking has been accepted',
                            'Your booking for ' + activity.title + ' has been accepted');
                    };

                    f();

                    res.status(200).send(book);
                }
            });
        });

    }).then(function (result) {
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
    }).catch(function (err) {
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
    });
};

exports.gps = function (req, res) {

    Booking.findByPk(req.params.id).then(function (booking) {
        let old_lat = booking.guide_lat;

        return booking.update({
            guide_lat: req.body.lat,
            guide_lng: req.body.lng
        }).then(function(book){

            if(old_lat === null){

                // notify user
                let f = async function (){

                    let user = await User.findByPk(book.user_id);
                    let activity = await Activity.findByPk(book.activity_id);

                    notifications.send_notification(user.notification_token,
                        'Your customer has started the meet',
                        'Your customer for ' + activity.title + ' has started the meet' );

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

exports.booking_statistics = function (req, res) {

    return Activity_Date.findAll({
        where: sequelize.literal('"Activity_Date"."activity_id" IN ( SELECT "Activity"."id" ' +
            'FROM "Activities" AS "Activity" INNER JOIN "Guides" AS "Guide" ON "Activity"."guide_id" = "Guide"."id" ' +
            'AND "Guide"."user_id" = 2)'),
        group:["Activity_Date.id"],
        attributes: ['id','timestamp',
            [sequelize.fn('COUNT', sequelize.col('Bookings.id')), 'n_bookings']],
        include:{
            model:Booking,
            attributes: []
        },
        order: [['timestamp', 'asc']],
    }).then(function(bookings){
        res.status(200).send(bookings);
    }).catch(function(err){
        console.log(err);
        res.status(400).send(err.message);
    })
};

exports.revenue_statistics = function (req, res) {

    return Activity_Date.findAll({
    }).then(function (bookings) {
        res.status(200).send(bookings);
    }).catch(function (err) {
        console.log(err.message);
        res.status(400).send(err.message);
    })
};


/* End some tour */
exports.end_tour = function(req,res){
    var activity_id = req.body.activity_id;
    var activity_date_id = req.body.activity_date_id;

    Booking.update({
        finished : true,
        guide_lat: null,
        guide_lng: null,
        user_lat: null,
        user_lng: null
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

/* End some tour */
exports.balance = function(req,res){

    return Guide.findOne({
        where:{
            user_id: req.user.id
        },
        attributes: ['balance']
    }).then(function(balance){
        res.status(200).send(balance);
    }).catch(function(err){
        console.log(err.message);
        res.status(400).send(err.message);
    });

};

exports.delete_activity = function(req,res){
    var activity_id = req.body.activity_id;


    return sequelize.transaction(function (t) {

         return Booking.destroy({
                            where:{
                                activity_id: activity_id
                            }
        },{transaction: t})
        .then(function (activity){
                return Activity_Evaluation.destroy({
                    where:{
                        activity_id: activity_id
                    }
                },{transaction: t})
                .then(function(activity_evaluation){
                        return Activity_Date.destroy({
                            where: {
                            activity_id: activity_id
                            }    
                      },{transaction: t})
                        .then(function(booking){
                            return Activity.destroy({
                                        where:{
                                            id: activity_id
                                        }
                                        },{transaction: t})
                        })
                })
        })})
    .then(function(result){
        res.status(200).send("OK");
    })
    .catch(function(err){
        console.log(err.message);
        res.status(400).send(err.message);
    })
};

exports.update_notification_token = function (req, res) {

    return Guide.findByPk(req.user.guide_id)
        .then(function (guide) {
            return guide.update({
                notification_token: req.body.notification_token
            }).then(function(result){
                res.status(200).send(result);
            }).catch(function(err){
                console.log(err);
                res.status(400).send(err);
            })
        }).catch(function (err) {
            res.status(400).json({message: 'guide does not exist'});
        })
};



exports.upload_activity_image = function(req,res) {


    upload(req,res,(err) => {
        if(err)
                res.status(400).send(err);
        else{
            var activity_id = req.body.activity_id;
            return Activity.findByPk(activity_id)
                            .then(function(activity){
                                activity.update({
                                    photo_path: "uploads/" + req.file.filename
                                }).then(function(){
                                    res.send(activity.photo_path);
                                })
                            })
                            .catch(function(err){
                                console.log("ERRO: " + err.message);
                                res.send(activity.photo_path);
                            })
        }

    });
}