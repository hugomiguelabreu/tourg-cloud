var express = require('express');
var passport = require('passport');
var router = express.Router();
const guide_controller = require('../server/controllers/guide');

router.post('/create_activity', guide_controller.create_activity);
router.post('/send_message', guide_controller.send_message);

/*Login and Register*/
router.post('/register', guide_controller.create_guide);
router.post('/login',guide_controller.login);

/*Get guide bookings*/
router.get('/bookings',passport.authenticate('jwt', { session: false }),guide_controller.get_bookings);

/*Get specific booking*/
router.get('/booking/:id',passport.authenticate('jwt', { session: false }),guide_controller.get_booking);


module.exports = router;
