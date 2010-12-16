class CrmContact < ActiveRecord::Base

  scope :unpushed, :conditions => ["crm_pushed_at is null"]
  
  module Validations
    NameRegex       = /\A[^[:cntrl:]\\<>\/&]*\z/
    NameMessage     = "doesn't allow control characters.".freeze

    EmailNameRegex  = '[\w\.%\+\-]+'.freeze
    DomainHeadRegex = '(?:[A-Z0-9\-]+\.)+'.freeze
    DomainTldRegex  = '(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|jobs|museum)'.freeze
    EmailRegex      = /\A#{EmailNameRegex}@#{DomainHeadRegex}#{DomainTldRegex}\z/i
    BadEmailMessage = "doesn't look like an email address.".freeze
  end
  
  validates_presence_of     :first_name
  validates_format_of       :first_name,     :with => Validations::NameRegex,  :message => Validations::NameMessage, :allow_nil => true
  validates_length_of       :first_name,     :maximum => 128
  
  validates_presence_of     :last_name
  validates_format_of       :last_name,     :with => Validations::NameRegex,  :message => Validations::NameMessage, :allow_nil => true
  validates_length_of       :last_name,     :maximum => 128
  
  validates_presence_of     :email
  validates_length_of       :email,    :within => 6..128 #r@a.wk
  validates_uniqueness_of   :email
  validates_format_of       :email,    :with => Validations::EmailRegex, :message => Validations::BadEmailMessage

end