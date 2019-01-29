var express = require('express');
var router = express.Router();

const api_controller = require('../server/controllers/api');

const notifications = require('../notifications');

router.get('/test', function (req, res) { // test route, nao remover pls

    const kek = async function () {



        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), 5000)
        });

        let result = await promise;


        console.log('kekkek')
    };

    const kappa = async function () {



        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), 5000)
        });

        let result = await promise;


        console.log('KAPPPPPPPPPPPPA')

        kek()
    };

    kappa().then(function (r) {

    })

    res.send('ping')

    // notifications.send_notification('ExponentPushToken[9ZcQyeP_QD0xEoINA5RQOV]', 'frase inspiradora',
    //     'se é para desistir, é para desistir de ser fraco');


});

router.get('/activities', api_controller.activities);

router.get('/activities/:id', api_controller.activity);

router.get('/activities_dates/:id', api_controller.activity_dates);

router.get('/activities/search/:city', api_controller.search_city);

router.get('/activities/search/:city/:start_date/:end_date', api_controller.search_dates);

module.exports = router;