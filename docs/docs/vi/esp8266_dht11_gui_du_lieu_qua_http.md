# ESP8266 gửi dữ liệu qua giao thức HTTP
---
Trong phần này, mình sẽ tiếp tục chia sẻ với các bạn ngày thứ 2 học IOT của mình.

Trong phần trước, mình đã tìm hiểu cơ bản về ESP8266, và NodeMCU DevKit cũng như Sming Framework. Phần này mình sẽ tiến hành đo nhiệt độ, độ ẩm và gửi dữ liệu lên Cloud.

### Chuẩn bị phần cứng
Để có thể đo nhiệt độ, độ ẩm, chúng ta dùng cảm biến DHT11, giá thị trường khoảng 50 ngàn VNĐ (phương Tây họ hay dùng DHT22 hơn).

![Cảm biến nhiệt độ, độ ẩm DHT11](https://sonnguyen.ws/vi/wp-content/uploads/sites/2/2016/11/DHT11-module.jpg)

*DHT11 có ba chân. Trong đó, chân S là chân tín hiệu. Hai chân còn lại là chân nguồn và chân đất.*

Như vậy, ta sẽ kết nối DHT11 với NodeMCU như sau:

- Chân đất của DHT11 nối với chân đất của NodeMCU
- Chân nguồn của DHT11 nối với chân nguồn của NodeMCU
- Chân tín hiệu của DHT11 nối với chân D2 của NodeMCU

![ESP8266 DHT11](https://sonnguyen.ws/vi/wp-content/uploads/sites/2/2016/11/esp8266dht11.png)
(Ảnh ESP6266 lấy từ esp8266.vn)

Sau khi chuẩn bị xong phần cứng, chúng ta cần chuẩn bị mã nguồn để nạp vào ESP8266.  Về cơ bản, mã nguồn cần làm ba việc sau:

- Kết nối Wifi
- Kết nối DHT11, lấy dữ liệu nhiệt độ và độ ẩm
- Gửi dữ liệu nhiệt độ, độ ẩm qua Internet lên Cloud

Có khá nhiều lựa chọn cho Cloud, bạn có thể dùng ThingSpeak.  Với mình, mình chọn Koor.IO.

Mình đã viết mã nguồn trên nền tảng Sming Framework và đẩy lên Github ở link sau [https://github.com/KoorIO/koor-samples/tree/master/HttpClient](https://github.com/KoorIO/koor-samples/tree/master/HttpClient)

Các bước thao tác trên Koor.IO, và triển khai mã nguồn mình đã ghi lại video. Các bạn có thể xem video để biết cụ thể hơn.

### Video hướng dẫn
<iframe width="760" height="500" src="https://www.youtube.com/embed/yOC4r8tGFg0" frameborder="0" allowfullscreen></iframe>

Như vậy, việc đẩy dữ liệu từ thiết bị lên Cloud trở nên hết sức dễ dàng với sự hỗ trợ của ESP8266, Koor.IO và Sming Framework.

Ngày tiếp theo, mình sẽ nghiên cứu thêm về Micropython for ESP8266, hứa hẹn là mọi chuyện sẽ dễ dàng hơn nữa. Chúng ta có thể làm một ví dụ đơn giản kiểu như bật tất đèn LED qua MQTT chẳng hạn.

Nguồn: [https://sonnguyen.ws/vi/ngay-thu-2-hoc-iot-nhiet-va-gui-du-lieu-len-cloud/](https://sonnguyen.ws/vi/ngay-thu-2-hoc-iot-nhiet-va-gui-du-lieu-len-cloud/)
