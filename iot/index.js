var mqtt = require('mqtt');
var config = require('config');

var client = mqtt.connect(config.get('broker.url'));

client.on('connect', function (packet) {
    console.log('Connected');
    //client.subscribe('5814db3171d02f000eca3cf8.koor.io/devices/5814db41818638001b8e8bfa');
});

client.on('message', function (topic, message) {
    // message is Buffer 
    console.log(topic, message.toString());
});
