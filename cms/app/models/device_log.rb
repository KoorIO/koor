class DeviceLog
  include Mongoid::Document
  store_in database: "apps"
  store_in collection: "devicelogs"

  belongs_to :device, :class_name => 'Device', :foreign_key => 'deviceId', :primary_key => :_id

  field :type, type: String, default: ""
  field :data
  field :createdAt, type: Time

end
