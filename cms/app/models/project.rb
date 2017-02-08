class Project
  include Mongoid::Document
  store_in database: "apps"
  store_in collection: "projects"

  belongs_to :user, :class_name => 'AppUser', :foreign_key => 'userId', :primary_key => :_id

  field :name,              type: String, default: ""

end
