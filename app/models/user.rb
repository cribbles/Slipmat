class User < ActiveRecord::Base

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)

    user && user.is_password?(password) ? user : nil
  end

  def self.generate_session_token
    SecureRandom::urlsafe_base64(16)
  end

  attr_reader :password
  validates :username, presence: true
  validates :email, presence: true
  validates :password_digest, presence: true
  validates :session_token, presence: true
  validates :password, length: { minimum: 8, allow_nil: true }
  after_initialize :ensure_session_token

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.new(password)
  end

  def is_password?(password)
    password_digest.is_password?(password)
  end

  def password_digest
    BCrypt::Password.create(super)
  end

  def reset_session_token!
    self.update!(session_token: self.class.generate_session_token)

    self.session_token
  end

  def ensure_session_token
    self.session_token ||= self.class.generate_session_token
  end
end
