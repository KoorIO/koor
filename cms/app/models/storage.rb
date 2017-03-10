class Storage
  include Mongoid::Document
  store_in database: "apps"
  store_in collection: "storages"

  belongs_to :field, :class_name => 'Field', :foreign_key => 'fieldId', :primary_key => :_id

  field :data
  field :createdAt, type: Time

end
