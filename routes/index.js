var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
const { Expo } = require('expo-server-sdk')
let expo = new Expo();

// Create the messages that you want to send to clents
let messages = [];

router.get('/', (req, res) => {
    messages.push({
        to: 'ExponentPushToken[#]',
        sound: 'default',
        title: 'Sup brahh',
        body: 'tens de mamar prota mano',
        data: { withSome: 'data' },
    });
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
                // NOTE: If a ticket contains an error code in ticket.details.error, you
                // must handle it appropriately. The error codes are listed in the Expo
                // documentation:
                // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
            } catch (error) {
                console.error(error);
            }
        }
    })();
    messages=[];
    res.send('Hello World!');
})

module.exports = router;
