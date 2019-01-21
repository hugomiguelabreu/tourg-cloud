var express = require('express');
var router = express.Router();

const api_controller = require('../server/controllers/api');

router.get('/test', function (req, res) { // test route, nao remover pls
    res.send('ping')
});

router.post('/add_category', api_controller.add_category);

router.get('/activities', api_controller.activities);

router.get('/activities/:id', api_controller.activity);

router.get('/activities_dates/:id', api_controller.activity_dates);

// router.get('/add_cities', api_controller.add_city);

module.exports = router;