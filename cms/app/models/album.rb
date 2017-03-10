class Album
  include Mongoid::Document
  store_in database: "socials"
  store_in collection: "albums"

  belongs_to :user, :class_name => 'AppUser', :foreign_key => 'userId', :primary_key => :_id
  field :name, type: String
  field :descriptioin, type: String
  field :createdAt, type: Time
end
