var express = require('express');
var router = express.Router();
const guide_controller = require('../server/controllers/guide');

router.post('/create_guide', guide_controller.create_guide);

module.exports = router;