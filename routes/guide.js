var express = require('express');
var passport = require('passport');
var router = express.Router();
const guide_controller = require('../server/controllers/guide');
router.post('/send_message', guide_controller.send_message);

/*Login and Register*/
router.post('/register', guide_controller.create_guide);
router.post('/login',guide_controller.login);

/* create activity */
router.post('/create_activity',passport.authenticate('jwt', { session: false }), guide_controller.create_activity);

/*Get guide bookings*/
router.get('/bookings',passport.authenticate('jwt', { session: false }),guide_controller.get_bookings);

/*Get specific booking*/
router.get('/booking/:id',passport.authenticate('jwt', { session: false }),guide_controller.get_booking);

/* set accepted true or false*/
router.post('/booking/:id/accept',passport.authenticate('jwt', { session: false }),guide_controller.accept_booking);

module.exports = router;
