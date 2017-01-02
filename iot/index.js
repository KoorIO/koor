var mqtt = require('mqtt');
var config = require('config');

var client = mqtt.connect(config.get('broker.url'));

client.on('connect', function (packet) {
    console.log('Connected');
    var CronJob = require('cron').CronJob;
    var job = new CronJob('* * * * * *', function() {
        client.publish('koor.io/timer', Math.floor(Date.now() / 1000).toString());
    }, function() {},
    true,
    'GMT'
    );
});

client.on('message', function (topic, message) {
    // message is Buffer 
    console.log(topic, message.toString());
});
