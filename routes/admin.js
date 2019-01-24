var express = require('express');
var router = express.Router();
const admin_controller = require('../server/controllers/admin');

router.post('/create_guide', admin_controller.create_guide);

// router.post('/add_category', api_controller.add_category);

module.exports = router;