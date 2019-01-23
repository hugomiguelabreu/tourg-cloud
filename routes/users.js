var express = require('express');
var passport = require('passport');
var router = express.Router();
const user_controller = require('../server/controllers/user');




router.post('/register', user_controller.create_user);

router.post('/login',user_controller.login);

router.post('/update', passport.authenticate('jwt', { session: false }), user_controller.update);

router.post('/add_credit_card', user_controller.add_credit_card);

// router.post('/send_message', user_controller.send_message);

router.post('/add_complaint', passport.authenticate('jwt', { session: false }), user_controller.add_complaint);

router.post('/evaluate_activity', passport.authenticate('jwt', { session: false }), user_controller.evaluate_activity);

router.post('/evaluate_guide', passport.authenticate('jwt', { session: false }), user_controller.evaluate_guide);

router.post('/book_activity', passport.authenticate('jwt', { session: false }), user_controller.book_activity);

router.get('/bookings', passport.authenticate('jwt', { session: false }), user_controller.bookings);

module.exports = router;

/* ============ Comments ========== */

/* Route that needs authentication, use example : 
router.get("/secret", passport.authenticate('jwt', { session: false }) ,function(req, res){
        console.log("Key :" + process.env.key);

});
*/