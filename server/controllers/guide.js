const Guide = require('../models').Guide;
const User = require('../models').User;
const Activity = require('../models').Activity;
const Message = require('../models').Message;
const Activity_Date = require('../models').Activity_Date;
const models = require('../models');

var passport = require("passport");
var jwt = require('jsonwebtoken');
var sequelize = models.sequelize;



/* -------------------------- Código em desenvolvimento -------------------- */
/* guide sign-up  - Em desenvolvimento */
 /* Notes: */
 /* Está a fazer RollBack no guide - mas não devia */
 /* Input:

    POST http://localhost:3000/api/guide/register

    email
    password
    name
    phone
    bio
    account_number
    swift
*/
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
        });

    }).then(function(result) {
        console.log("Transaction Succeed");
        res.status(200).send([c_user, result]) // [created user, created guide]
    }).catch(function(err){
        console.log("Transaction Error");
        res.status(400).send(err);
    });

};


/* guide log-in  - Em desenvolvimento */
exports.login = function(req,res){
    User.findAll({ where:{ user_id: req.body.email ,
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

                                Guide.findAll({where:{user_id:req.body.email}}).then(function(guide){
                                  guide[0].password='';
                                  res.json({ token: token, user: guide[0]});
                                }).catch(function(guide){
                                  res.status(400).json({message:"Bad Request"});
                                });

                             }
                             else{
                                res.status(401).json({message:"passwords did not match"});
                            }
                })
                .catch(function(user){
                        res.status(400).json({message:"Bad Request"});
                });
};

/* --------------------------------------------------------------------------- */




exports.create_activity = function(req, res, next) {

    return Activity
        .create({
            guide_id: req.body.guide_id,
            description: req.body.description,
            city: req.body.city, // TODO add country and coordinates
            Activity_Dates: {
                price: req.body.price,
                timestamp: req.body.timestamp
            }
        },
        {
            include: Activity_Date
        })
        .then((cc) => res.status(201).send(cc))
        .catch((error) => res.status(400).send(error));
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
