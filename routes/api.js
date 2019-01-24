var express = require('express');
var router = express.Router();

const api_controller = require('../server/controllers/api');

router.get('/test', function (req, res) { // test route, nao remover pls
    res.send('ping')
});

router.get('/activities', api_controller.activities);

router.get('/activities/:id', api_controller.activity);

router.get('/activities_dates/:id', api_controller.activity_dates);

router.get('/activities/search/:city', api_controller.search_city);

router.get('/activities/search/:city/:start_date/:end_date', api_controller.search_dates);

module.exports = router;