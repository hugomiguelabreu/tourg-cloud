var express = require('express');
var passport = require('passport');
var router = express.Router();
const user_controller = require('../server/controllers/user');

/* --- Auth --- */

router.post('/register', user_controller.create_user);

router.post('/login',user_controller.login);

router.post('/update', passport.authenticate('jwt', { session: false }), user_controller.update);

/* --- Monies --- */

router.post('/add_credit_card', passport.authenticate('jwt', { session: false }), user_controller.add_credit_card);

router.get('/credit_cards', passport.authenticate('jwt', { session: false }), user_controller.credit_card);

router.delete('/credit_card', passport.authenticate('jwt', { session: false }), user_controller.delete_credit_card);

// router.post('/send_message', user_controller.send_message);

/* --- Complaints --- */

router.post('/add_complaint', passport.authenticate('jwt', { session: false }), user_controller.add_complaint);

/* --- Evaluations --- */

router.post('/evaluate_activity', passport.authenticate('jwt', { session: false }), user_controller.evaluate_activity);

router.post('/evaluate_guide', passport.authenticate('jwt', { session: false }), user_controller.evaluate_guide);

/* --- Bookings --- */

router.post('/book_activity', passport.authenticate('jwt', { session: false }), user_controller.book_activity);

router.get('/bookings', passport.authenticate('jwt', { session: false }), user_controller.bookings);

router.get('/booking/:id', passport.authenticate('jwt', { session: false }), user_controller.booking);

router.post('/booking/:id/gps',passport.authenticate('jwt', { session: false }),user_controller.gps);

module.exports = router;

/* ============ Comments ========== */

/* Route that needs authentication, use example : 
router.get("/secret", passport.authenticate('jwt', { session: false }) ,function(req, res){
        console.log("Key :" + process.env.key);

});
*/