var express = require('express');
var router = express.Router();
const admin_controller = require('../server/controllers/admin');

router.post('/create_guide', admin_controller.create_guide);

router.post('/add_cities', admin_controller.add_city);

router.post('/add_category', admin_controller.add_category);

module.exports = router;