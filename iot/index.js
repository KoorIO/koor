var mqtt = require('mqtt');
var config = require('config');
var client  = mqtt.connect([config.get('broker.url')]);
 
client.on('connect', function () {
  client.subscribe('presence');
  client.publish('presence', 'Hello mqtt');
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(topic, message.toString());
});
