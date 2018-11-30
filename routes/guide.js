var express = require('express');
var router = express.Router();
const guide_controller = require('../server/controllers/guide');

router.post('/create_guide', guide_controller.create_guide);

// create activity
router.post('/create_activity', guide_controller.create_activity);

module.exports = router;