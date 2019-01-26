const fs = require('fs');
const request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download('https://fastly.4sqi.net/img/general/original/20896080_v6VSRbH7s4Df4Hor7qL6d1RKraMbwYPFf4OwZaKthgw.jpg', 'pic.jpg', function(){
  console.log('done');
});
