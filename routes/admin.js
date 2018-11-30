var express = require('express');
var router = express.Router();
const admin_controller = require('../server/controllers/admin');

router.post('/create_guide', admin_controller.create_guide);

module.exports = router;