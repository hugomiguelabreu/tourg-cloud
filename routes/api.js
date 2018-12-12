var express = require('express');
var router = express.Router();

const api_controller = require('../server/controllers/api');


router.get('/activities', api_controller.activities);

module.exports = router;