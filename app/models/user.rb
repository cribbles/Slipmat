class User < ActiveRecord::Base
  include Formattable

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)

    user && user.is_password?(password) ? user : nil
  end

  def self.generate_session_token
    SecureRandom::urlsafe_base64(16)
  end

  attr_reader :password

  has_many :user_collections
  has_many :collection, through: :user_collections, source: :record
  has_many :user_wants
  has_many :wantlist, through: :user_wants, source: :record
  has_many :user_contributions
  has_many :contributions, through: :user_contributions, source: :record

  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates :email, presence: true,
                    length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  validates :password_digest, presence: true
  validates :session_token, presence: true
  validates :password, length: { minimum: 8, allow_nil: true }

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
