var express = require('express');
var passport = require('passport');
var router = express.Router();
const guide_controller = require('../server/controllers/guide');

/* --- Auth ---*/
router.post('/register', guide_controller.create_guide);

router.post('/login',guide_controller.login);

router.post('/update_token', passport.authenticate('jwt', { session: false }), guide_controller.update_notification_token);

/* Update guide info */
router.post('/update',passport.authenticate('jwt',{ session: false}), guide_controller.update_data);

/* --- Monies --- */

router.get('/balance',passport.authenticate('jwt',{ session: false}), guide_controller.balance);

/* --- Activities --- */

/* create activity */
router.post('/create_activity',passport.authenticate('jwt', { session: false }), guide_controller.create_activity);

router.delete('/delete_activity/:id',passport.authenticate('jwt', { session: false }),guide_controller.delete_activity);

/* --- Bookings --- */

/*Get guide bookings*/
router.get('/bookings',passport.authenticate('jwt', { session: false }),guide_controller.get_bookings);

/*Get specific booking*/
router.get('/booking/:id',passport.authenticate('jwt', { session: false }),guide_controller.get_booking);

/* set accepted true or false*/
router.post('/booking/:id/accept',passport.authenticate('jwt', { session: false }),guide_controller.accept_booking);

router.post('/booking/:id/gps',passport.authenticate('jwt', { session: false }),guide_controller.gps);

router.post('/booking/end_tour',passport.authenticate('jwt', { session: false }),guide_controller.end_tour);

/* --- Stats --- */

router.get('/booking_statistics',passport.authenticate('jwt', { session: false }),guide_controller.booking_statistics);

router.get('/revenue_statistics',passport.authenticate('jwt', { session: false }),guide_controller.revenue_statistics);
router.post('/activity/upload_image',passport.authenticate('jwt', { session: false }),guide_controller.upload_activity_image);
router.get('/activities',passport.authenticate('jwt', { session: false }),guide_controller.get_activities);
module.exports = router;
