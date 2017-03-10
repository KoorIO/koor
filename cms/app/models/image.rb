class Image
  include Mongoid::Document
  store_in database: "socials"
  store_in collection: "images"

  belongs_to :user, :class_name => 'AppUser', :foreign_key => 'userId', :primary_key => :_id
  belongs_to :album, :class_name => 'Album', :foreign_key => 'albumId', :primary_key => :_id
  field :fileName, type: String
  field :createdAt, type: Time
  rails_admin do
    show do
      field :user
      field :album
      field :createdAt
      field :fileName do
        formatted_value do
          value = Settings.aws.s3.endpoint + bindings[:object].userId + '/' + self.value.to_s
          bindings[:view].tag(:img, { :src => Settings.aws.s3.endpoint + bindings[:object].userId + '/' + bindings[:object].fileName }) << value
        end
      end
    end
  end

end
