var express = require('express');
var passport = require('passport');
var router = express.Router();
const guide_controller = require('../server/controllers/guide');

// create activity
router.post('/create_activity', guide_controller.create_activity);
router.post('/send_message', guide_controller.send_message);

/*Login and Register*/
router.post('/register', guide_controller.create_guide);
router.post('/login',guide_controller.login);

router.get('/get_bookings', passport.authenticate('jwt', { session: false }), guide_controller.get_bookings);


module.exports = router;
