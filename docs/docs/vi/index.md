### Giới thiệu
Koor.IO (Gọi tắt là Co) là một IoT Platform Việt nam đầu tiên được mở miễn phí cho mọi người sử dụng và chia sẻ. Sản phẩn sẽ hướng đến là một mạng kết nối không giới hạn giữa thiết bị với con người. Koor.IO hướng tới một mạng chia sẻ kết nối với đầy đủ tính năng của một mạng xã hội cho cả con người lẫn thiết bị.

### Bắt đầu với Koor.IO
Để bắt đầu sử dụng, mọi người vào tạo một tài khoản ở trang [https://koor.io](https://koor.io/app). Hiện tại hệ thống hỗ trợ các bạn đăng ký qua email (có gửi email xác nhận) và qua Github.

Sau khi tạo tài khoản và đăng nhập thành công, bạn có thể bắt đầu tạo một Project. Với mỗi một Project, Koor.IO sẽ tạo cho các bạn một subdomain. Subdomain này sẽ được sử dụng để gọi các Restful API và định danh các MQTT Topics của dự án.

*Chú ý: Project Status biểu thị trạng thái của Project Subdomain. Khi Project Status chuyển từ màu đỏ sang màu Đỏ sang màu Xanh, thì có nghĩa rằng bạn có thể sử dụng được Restful API hay Websocket*

Chúng tôi luôn hướng tới sự miễn phí vô hạn cho người dùng. Tuy nhiên, trong giai đoạn đầu, để tránh Spamer, chúng tôi sẽ giới hạn 10 Projects cho một tài khoản. Nếu các bạn có nhu cầu tạo nhiều hơn 10 dự án, các bạn có thể liên hệ trực tiếp với chúng tôi.

### Thiết bị (Device)

Việc đầu tiên khi bắt đầu một Project, đó là tạo các thiết bị (Device). Koor.IO hỗ trợ bạn tạo mới không giới hạn các thiết bị trong mỗi Project. Để tạo thiết bị, bạn chỉ việc cung cấp thông tin của nó. Tuy nhiên, bạn cũng có thể bổ sung các thông tin sau:
- Môt tả thiết bị
- Vị trí (Lat, Long)
- Ảnh
- Địa chỉ

Sau khi tạo thiết bị thành công, bạn đã có thể **gửi dữ liệu tới thiết bị qua cả Restful API/MQTT, đồng thời có thể nhận dữ liệu gửi lên từ thiết bị qua MQTT**. Koor.IO hướng tới cung cấp giao diện thân thiện để bạn có thể làm những việc đó một cách dễ dàng nhất.

### Restful API
Restful API có thể được tạo tự động sau khi bạn tạo thành công một Thiết Bị. Những APIs được tạo tự động này mô tả cho bạn cách gửi dữ liệu tới thiết bị qua Restful API. Qua Swagger, bạn sẽ đễ dàng chạy thử việc gửi dữ liệu đó. Như vậy, bạn hoàn toàn có thể **gửi dữ liệu từ điện thoại thông minh tới Thiết Bị** thông qua API đó.

Ngoài ra, Koor.IO cũng cho phép bạn tạo nhiều APIs khác nhau tùy theo nhu cầu. Chức năng này rất hữu ích với cả IoT và Mobile Developer.

### MQTT
Bạn hoàn toàn có thể gửi/nhận dữ liệu từ Thiết Bị bằng giao thức MQTT. Bạn chỉ việc sử dụng chính xác các thông tin sau cho MQTT:
- MQTT Server: `mqtt://mqtt.koor.io`
- MQTT Topics: `[domain_cua_du_an]/devices/[device_id] hoặc [domain_cua_du_an]/devices/[device_id]/[chuoi_ky_tu_tuy_bien]`

Ví dụ, Project của bạn có domain là `58b171f16882b6000fb33c42.koor.io`, và ID của Thiết Bị là `58b29d56791a89000f2dd3f4` thì MQTT Topics để gửi/nhận dữ liệu tới thiết bị sẽ có thể là: `58b171f16882b6000fb33c42.koor.io/devices/58b29d56791a89000f2dd3f4`, `58b171f16882b6000fb33c42.koor.io/devices/58b29d56791a89000f2dd3f4/test1` hoặc `58b171f16882b6000fb33c42.koor.io/devices/58b29d56791a89000f2dd3f4/test2`

*Chú ý: Ngay khi bạn Subscribe những MQTT Topics như trên, thì đèn trạng thái của Thiết Bị trên Koor.IO sẽ bật xanh. Khi không có kết nối MQTT tới các Topics đó, đèn trạng thái của thiết bị sẽ là màu đỏ.*

### Logs Thời gian thực
Koor.IO có chức năng *Realtime Logs để hỗ trợ giám sát/theo dõi dữ liệu gửi qua MQTT theo thời gian thực*. Điều đó có nghĩa rằng, tất cả các dữ liệu gửi đến hoặc gửi từ thiết bị bạn đều có thể quan sát được qua giao diện web. Đống thời các dữ liệu đó cũng được lưu lại dưới dạng Logs.

### Fields
Chức năng sẽ giúp các bạn lưu *trữ dữ liệu gửi lên từ thiết bị và hiển thị lên biểu đồ*. Mỗi Field được tạo ra sẽ có một `fieldcode`. Sau khi bạn thành công một Field, hệ thống sẽ tự động tạo sẵn các Restful API để bạn có thể chạy thử. Ngoài ra, hệ thống cũng hỗ trợ ghi dữ liệu gửi lên từ thiết bị qua giao thức MQTT sử dụng chính xác các thông tin sau:
- MQTT Server: `mqtt://mqtt.koor.io`
- MQTT Topics: `[domain_cua_du_an]/fields/[field_code]`

### Các ví dụ
[ESP8266 gửi dữ liệu qua giao thức MQTT](https://koor.io/docs/vi/esp8266_gui_du_lieu_qua_mqtt)
