class User < ActiveRecord::Base
  include Formattable

  VALID_USERNAME_REGEX = /\A[a-z]+[a-z0-9\-_]+[a-z0-9]\z/i
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)

    user && user.is_password?(password) ? user : nil
  end

  def self.find_or_create_by_auth_hash(auth_hash)
    user = User.find_by(
      provider: auth_hash[:provider],
      uid: auth_hash[:uid]
    )

    if user.nil?
      user = User.create!(
        provider: auth_hash[:provider],
        uid: auth_hash[:uid],
        username: auth_hash[:info][:name],
        email: SecureRandom::urlsafe_base64(8) + "@slipmat.xyz",
        password: SecureRandom::urlsafe_base64,
        image: auth_hash[:info][:image]
      )
    end

    user
  end

  def self.generate_session_token
    SecureRandom::urlsafe_base64(16)
  end

  attr_reader :password

  has_many :user_collections
  has_many :collection, through: :user_collections, source: :record
  has_many :user_wants
  has_many :wantlist, through: :user_wants, source: :record
  has_many :contributions, class_name: "UserContribution"
  has_many :authored_comments, class_name: "Comment", foreign_key: :author_id
  has_many :recent_activity, class_name: "UserActivity"

  validates :username, presence: true,
                       length: { minimum: 3, maximum: 25 },
                       format: { with: VALID_USERNAME_REGEX },
                       uniqueness: { case_sensitive: false }
  validates :email, presence: true,
                    length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  validates :password_digest, presence: true
  validates :session_token, presence: true
  validates :password, length: { minimum: 8, allow_nil: true }

  has_attached_file :image, default_url: "default-user.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  after_initialize :ensure_session_token

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    password_digest.is_password?(password)
  end

  def password_digest
    BCrypt::Password.new(super)
  end

  def reset_session_token!
    self.update!(session_token: self.class.generate_session_token)

    self.session_token
  end

  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end
end
