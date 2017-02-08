class AppUser
  include Mongoid::Document
  store_in database: "users"
  store_in collection: "users"

  field :email, type: String, default: ""
  field :isActive, type: Boolean

end
