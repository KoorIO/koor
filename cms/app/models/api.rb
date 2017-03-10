class Api
  include Mongoid::Document
  store_in database: "apps"
  store_in collection: "apis"

  belongs_to :user, :class_name => 'AppUser', :foreign_key => 'userId', :primary_key => :_id
  belongs_to :project, :class_name => 'Project', :foreign_key => 'projectId', :primary_key => :_id

  field :name,              type: String, default: ""
  field :createdAt, type: Time
  field :updatedAt, type: Time

  rails_admin do
    edit do
      field :name
      field :user
      field :project
    end
  end

end
