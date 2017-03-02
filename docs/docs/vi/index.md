### Giới thiệu
Koor.IO (Gọi tắt là Co) là một IoT Platform Việt nam đầu tiên được mở miễn phí cho mọi người sử dụng và chia sẻ. Sản phẩn sẽ hướng đến là một mạng kết nối không giới hạn giữa thiết bị với con người. Koor.IO hướng tới một mạng chia sẻ kết nối với đầy đủ tính năng của một mạng xã hội cho cả con người lẫn thiết bị.

### Bắt đầu với Koor.IO
Để bắt đầu sử dụng, mọi người vào tạo một tài khoản ở trang [https://koor.io](https://koor.io/app). Hiện tại hệ thống hỗ trợ các bạn đăng ký qua email (có gửi email xác nhận) và qua Github.

Sau khi tạo tài khoản và đăng nhập thành công, bạn có thể bắt đầu tạo một Project. Với mỗi một Project, Koor.IO sẽ tạo cho các bạn một subdomain. Subdomain này sẽ được sử dụng để gọi các Restful API và định danh các MQTT Topics của dự án.

Chúng tôi luôn hướng tới sự miễn phí vô hạn cho người dùng. Tuy nhiên, trong giai đoạn đầu, để tránh Spamer, chúng tôi sẽ giới hạn 10 Projects cho một tài khoản. Nếu các bạn có nhu cầu tạo nhiều hơn 10 dự án, các bạn có thể liên hệ trực tiếp với chúng tôi.

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
curl -XGET --header "Content-Type: application/json" --header "Authorization:[project_secret_key]" https://[project_domain].koor.io/get/field/[field_code]/[page]
```

### Devices
With Koor.IO, you are able to manage all devices in your Internet of Things.
- Update Device Status realtime
- Send/Receive data from devices on MQTT channel and Websocket
- Receive data from devices on HTTP

### Dashboard & Chart
With Free Plan, we will show the chart of the data for maximum 500 records.
