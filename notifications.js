const { Expo } = require('expo-server-sdk');
let expo = new Expo();

exports.console = function (msg){

    console.log(msg)
};

exports.send_notification = function (token, title, body) {

    // Create the messages that you want to send to clents
    let messages = [];
    messages.push({
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: { withSome: 'data' },
    });
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {

        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);

            } catch (error) {
                console.error(error);
            }
        }
    })();
};