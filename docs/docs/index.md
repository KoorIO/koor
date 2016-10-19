### Overview
Koor.IO is your backend. You are able to create any Resful API, Websocket for your micservices application and MQTT for your IoT System. Our mission create a flexible, plugable Backend. You will easily create and modify the backend and never worry about infrastructure or platform.

### How to get started
You just need to create an account at [https://koor.io](https://koor.io).

After that, you should create a project firstly. With per project, we will create a subdomain. So you can use that domain for our services (RestfulAPI, Websocket).

Our policy is unlimit project for user. However, to avoid spamer, we limit **10 projects** at the beginning. If you want to increase the limit, please contact us.

### Restful API
You can create unlimited API each project. We support to run APIs on Swagger. This service will be very usefull for IoT Developer and Mobile Developer. You are not only able to create any [mockup restful API](https://koor.io), but also you can store the payload of Restful API requests.

### WebSocket
You will easily to open a websocket connection and emit messages via 'test_message', 'broad_message' channel. 

#### SocketIO client example
For example, you have a project with domain: `57ee5f572c6xxxxxfe.koor.io`
```html
<script src="/socket.io/socket.io.js"></script>
<script>
var socket = io('http://57ee5f572c6xxxxxfe.koor.io');
socket.on('test_message', function (data) {
    console.log(data);
    socket.emit('test_message', { my: 'data' });
});
</script>
```

After running your code in browser, you can access `https://koor.io` to see the message emited by your example

### MQTT
You can connect our MQTT broker and publish/subscrible any channel with format `[subdomain]/*`. Currently, we support both MQTT and MQTT over Websocket.

- MQTT: `mqtt://mqtt.koor.io`
- MQTT over Websocket: `ws://[project_domain]/mqtt`

#### NodeJS MQTT client example
For example, you have a project with domain: `57ee5f572c6xxxxxfe.koor.io.
And you use MQTTJS to connect KoorIO broker, you can refer the source code below:
```
var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://mqtt.koor.io');

client.on('connect', function (packet) {
    console.log('Connected');
    client.subscribe('57ee5f572c6xxxxxfe.koor.io/demo/hello');
    client.publish('57ee5f572c6xxxxxfe.koor.io/demo/hello');
});

client.on('message', function (topic, message) {
    // message is Buffer 
    console.log(topic, message.toString());
}); 

```
*Note: you only have permissions to subscribe/publish on the channels with prefix `57ee5f572c6xxxxxfe.koor.io`*


### Fields
We supports you create custom fields. With Free Plan, You can create/update/delete maximum 10 custom fields for per project, and 500 records per custom field. Base on the custom fields, you will store the data pushed by the clients
And you are also able to download your data by using API as below
```
curl -XGET --header "Content-Type: application/json" --header "Authorization:[project_secret_key]" https://[project_domain].koor.io/field/[field_code]/[page]
```

### Dashboard & Chart
With Free Plan, we will show the chart of the data for maximum 500 records.
