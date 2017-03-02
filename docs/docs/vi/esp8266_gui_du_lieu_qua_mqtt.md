Như các bạn biết, Internet Of Things là môt xu thế công nghệ được mọi người hướng tới nhiều nhất trong thời gian qua. Những Developer kinh nghiệm cũng tham gia nghiên cứu IOT nếu không muốn mình bị lạc hậu. Còn những Developers trẻ tuổi cũng háo hức học IOT để bắt đầu khởi nghiệp, hoặc để có một công việc tốt hơn trong tương lai.

Ngày nay,  IOT hay Khoa Học Công Nghệ không còn là câu chuyện của các cá nhân, tổ chức. Chính phủ nước nhà cũng đã chung tay góp sức bằng nhiều chính sách hỗ trợ cụ thể với những khởi nghiệp trong lĩnh vực này.

Cá nhân tôi cũng chỉ mới nghe về IOT một năm trước. Với nhận định đây là một xu hướng không thể thay thể, tôi bắt đầu nghĩ về nó, và chuẩn bị cho mình những kiến thức cơ bản:

- Cơ bản về điện và điện tử
- Các khái niệm trong IOT
- Tổng quan về kiến trúc các hệ thống IOT
- Giao thức MQTT

Với các tiếp cận của một Developer, tôi luôn bắt đầu viết mã nguồn sau khi nắm sơ bộ các kiến thức cơ bản. Việc thực hành giúp tôi hiểu vấn đề một cách dễ dàng hơn là việc đọc hàng trăm trang tài liệu. Việc đọc cũng rất quan trọng, nhưng nếu chỉ đọc mà không thực hành, tôi sẽ không thể hệ thống được kiến thức của mình.

Do không biết bắt đầu thực hành từ đâu, tôi đã tham gia lớp dành cho người mới bắt đầu của nhóm Maker Hanoi (một cộng đồng các Maker ở Hà Nội). Từ đó, mọi việc trở nên dễ dàng và đơn giản hơn.

Đầu tiên, tôi mua một NodeMCU ESP8266 DevKit với giá 200.000 đồng.

ESP8266 là một module Wifi
NodeMCU ESP8266 DevKit chứa ESP8266 và kết nối USB để giúp chúng ta có thể dễ dàng nạp mã nguồn vào ESP8266.
![NodeMCU ESP8266 Dev Kit](https://sonnguyen.ws/wp-content/uploads/2016/10/14458255952182.jpg)

Tiếp đó, tôi kiếm thêm một dây cáp Micro USB để nối DevKit với máy tính của mình.

![Micro USB Cable](https://sonnguyen.ws/wp-content/uploads/2016/10/gc38111-usb-to-micro-usb.jpg)

Sau khi có DevKit, tôi bắt đầu xem qua ESP8266 Datasheet để hiểu về các chân và cách hoạt động của ESP8266. Và tôi cũng tham khảo thêm ảnh bên dưới để biết các chân đầu ra của DevKit tương ứng với chân nào của ESP8266.

![NodeMCU ESP8266 Dev Kit Pin Out](https://sonnguyen.ws/wp-content/uploads/2016/10/NODEMCU_DEVKIT_V1_0_PINMAP.png)

Sau khi chuẩn bị đầy đủ phần cứng, tôi bắt đầu với phần mềm. Tôi được gợi ý lựa chọn Sming Framework  để viết firmware cho ESP8266. [Sming Framework](https://github.com/SmingHub/Sming) rất dễ hiểu và dễ sử dụng. Tuy nhiên, bạn có thể gặp một vài khó khăn khi cài đặt nó.

Ý tưởng đầu tiên của tôi cho đoạn mã nguồn đầu tiên về IOT là sử dụng ESP866 đẩy dữ liệu lên một IOT Platform. Hiện nay có rất nhiều IOT Platform, có cả mã nguồn mở hay những platform sử dụng miễn phí. Tôi đã lựa chọn Koor.IO - Môt IOT Platform dành cho Developer.

Với [Koor.IO](https://koor.io), tôi có thể tạo Restful API, Websocket và cả MQTT. Koor.IO cũng giúp tôi lưu dữ liệu từ client gửi lên vào hiển thị chúng lên biểu đồ.

Để tiến thành, tôi đã làm theo các bước sau:

##Bước 1: Tạo Projects

Đăng ký tài khoản trên [Koor.IO](https://koor.io) và tạo một projects.

![Create a IOT Project on Koor.IO](https://sonnguyen.ws/wp-content/uploads/2016/10/2016-10-12_1659.png)
Sau khi tạo xong project, chúng ta cần đợi một lúc để Koor.IO cài đặt project.

![](https://sonnguyen.ws/wp-content/uploads/2016/10/2016-10-12_1700.png)

Tiếp đến, mở project và tạo một Field. Field này sẽ giúp Koor.IO nhận biết dữ liệu bạn muốn lưu vào server.

![](https://sonnguyen.ws/wp-content/uploads/2016/10/2016-10-12_1704.png)

Như vậy là chúng ta đã xong với Koor.IO, tiếp đến là viết mã nguồn.

##Bước 2: Mã nguồn

Trước tiên, chúng ta lấy mã nguồn ví dụ của Koor.IO về máy https://github.com/KoorIO/koor-samples.

Trong thưc mục Mqttclient, chúng tao tạo file cấu hình bằng lệnh:
```
cp include/config.h.sample include/config.h
```
Tiến đến, điều chình file include/config.h cho phù hợp với môi trường của mình.
```
// WIFI config
#define WIFI_SSID "PleaseEnterWifiSSID"
#define WIFI_PWD "PleaseEnterWifiPassword"

// MQTT config
#define MQTT_HOST "PleaseEnterMQTTHost"
#define MQTT_PORT 1883
#define MQTT_TOPIC "PleaseEnterMQTTTopic"
```
MQTT_TOPIC  chính là project_domain/fieldcode/fieldcode trên trang Koor.IO. Trong đó, fieldcode là Field Code bạn đã tạo, còn project_domain chính là domain của project.

MQTT_HOST, bạn chọn mqtt.koor.io

Và  WIFI_SSID, WIFI_PWD chính là thông tin mạng WIFI

Bước 4: Biên dịch

Sau khi thay đổi file cấu hình, chúng ta cần biên dịch và nạp mã nguồn vào ESP8266 với lệnh sau:
```
make
make flash
```
##Kết quả

Sau khi build flash thành công, chúng ta mở Dashboard của dự án trên Koor.IO để xem dữ liệu được đẩy lên từ thiết bị theo chu kỳ khoảng 20 giây một lần.

![Koor.IO - Chart - ESP8266](https://sonnguyen.ws/wp-content/uploads/2016/10/2016-10-12_1707.png)
##Các vấn đề có thể gặp

Nếu bạn sử dụng Linux, trong trường hợp máy tính không nhận được DevKit, ta dùng lệnh sau để debug
```
$ lsusb
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 002 Device 002: ID 1a86:7523 QinHeng Electronics HL-340 USB-Serial adapter
Bus 002 Device 001: ID 1d6b:0001 Linux Foundation 1.1 root hub
```
Nếu bạn muốn thấy Logs từ ESP8266, ta dùng lệnh:
```
screen /dev/ttyUSB0 -b 57600
```
Như vậy là đã hoàn thành ứng dụng IOT đầu tiên :)

Nguồn: [https://sonnguyen.ws/vi/toi-da-hoc-internet-things-nhu-nao/](https://sonnguyen.ws/vi/toi-da-hoc-internet-things-nhu-nao/)
