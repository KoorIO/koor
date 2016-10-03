var mqtt = require('mqtt');
var config = require('config');

var client = mqtt.connect(config.get('broker.url'));

client.on('connect', function (packet) {
    console.log('Connected');
   // client.subscribe('#');
});

client.on('message', function (topic, message) {
    // message is Buffer 
    console.log(topic, message.toString());
});
