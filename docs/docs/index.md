## Overview
Koor.IO is your backend. You are able to create any Resful API, Websocket for your micservices application and MQTT for your IoT System. Our mission create a flexible, plugable Backend. You will easily create and modify the backend and never worry about infrastructure or platform.

## How to get started
You just need to create an account at [https://koor.io](https://koor.io).

After that, you should create a project firstly. With per project, we will create a subdomain. So you can use that domain for our services (RestfulAPI, Websocket).

Our policy is unlimit project for user. However, to avoid spamer, we limit **10 projects** at the beginning. If you want to increase the limit, please contact us.

## Restful API
You can create unlimited API each project. We support to run APIs on Swagger.

## WebSocket
You will easily to open a websocket connection and emit messages via 'test_message', 'broad_message' channel. 

### Javascript Example
You can user SocketIO as an websocket client.
```html
<script src="/socket.io/socket.io.js"></script>
<script>
var socket = io('http://[project_domain]');
socket.on('test_message', function (data) {
    console.log(data);
    socket.emit('test_message', { my: 'data' });
});
</script>
```

After running your code in browser, you can access `https://koor.io` to see the message emmited by your example

## MQTT
You can connect our MQTT broker and publish/subscrible any channel with format `[subdomain]/*`. Currently, we support both MQTT and MQTT over Websocket.

- MQTT: `mqtt://mqtt.koor.io`
- MQTT over Websocket: `ws://[project_domain]/mqtt`

*Note: Please remember to replace `[project_domain]` with the domain of your project*
