var mqtt = require('mqtt');
var config = require('config');

var client = mqtt.connect(config.get('broker.url'));

client.on('connect', function (packet) {
    console.log('Connected');
    client.subscribe('580cdb2e089c0a000d8efc03.koor.io/devices/580cdb3c089c0a000d8efc04');
});

client.on('message', function (topic, message) {
    // message is Buffer 
    console.log(topic, message.toString());
});
