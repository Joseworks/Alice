class Post < ActiveRecord::Base

  self.per_page = 15

  acts_as_taggable

  is_impressionable counter_cache: true

  attr_accessor           :image
  has_attached_file       :image, styles: {thumb: "100x100#", small: "200x200>", medium: "540>x400>"},
                                  storage: :s3,
                                  bucket: ENV['S3_BUCKET_NAME'],
                                  url: ":s3_domain_url",
                                  path: "/:class/:attachment/:id_partition/:style/:filename'",
                                  s3_credentials: {
                                    access_key_id: ENV['S3_KEY'],
                                    secret_access_key: ENV['S3_SECRET']
                                  }

  before_validation       :generate_slug
  before_validation       :set_dates
  before_save             :apply_filter
  before_save             :apply_filter_to_intro

  validates               :author, :title, :slug, :body, :intro_text, presence: true
  validates               :slug, uniqueness: true

  validates_attachment    :image, content_type: { content_type: ['image/jpg', 'image/jpeg', 'image/png'] },
                                  size: { in: 0..1.megabytes }

  validate                :validate_published_at_natural_parsed_and_assigned

  validate                :tag_list, :length => { maximum: 30 }
  validate                :tag_format

  def validate_published_at_natural_parsed_and_assigned
    if published_at_natural.present? && !published?
      errors.add("published_at_natural", "Unable to parse time")
    end
  end

  attr_accessor :minor_edit
  def minor_edit
    @minor_edit ||= "1"
  end

  def minor_edit?
    self.minor_edit == "1"
  end

  def published?
    published_at?
  end

  def updated?
    self.edited_at > self.published_at + 61
  end

  attr_accessor :published_at_natural
  def published_at_natural
    @published_at_natural ||= published_at.to_s
  end

  class << self
    def find_recent(options = {})
      tag = options.delete(:tag)
      page_num = options.delete(:page) || nil
      options = {
        order:      'posts.published_at DESC',
        conditions: ['published_at < ?', Time.now],
        page:       page_num
      }.merge(options)
      if tag
        tagged_with(tag).paginate(options)
      else
        paginate(options)
      end
    end

    def find_by_permalink(year, month, day, slug, options = {})
      post = where(slug: slug).first || raise(ActiveRecord::RecordNotFound)
    end

    def find_all_grouped_by_month
      posts = find(
        :all,
        order:      'posts.published_at DESC',
        conditions: ['published_at < ?', Time.now]
      )
      posts.group_by(&:month).inject([]) {|a, v| a << MonthPostHolder.new(v[0], v[1])}
    end
  end

  def destroy_with_undo
    transaction do
      undo = DeletePostUndo.create_undo(self)
      self.destroy
      return undo
    end
  end

  def month
    published_at.beginning_of_month
  end

  def apply_filter
    self.body_html = EnkiFormatter.format_page_as_xhtml(self.body)
  end

  def apply_filter_to_intro
    self.intro_text_html = EnkiFormatter.format_page_as_xhtml(self.intro_text)
  end

  def set_dates
    self.edited_at = Time.now if !minor_edit? or self.edited_at.nil?
      if self.published_at_natural.blank?
        self.published_at = nil
      elsif new_published_at = Chronic.parse(self.published_at_natural)
          self.published_at = new_published_at
      end
  end

  def flag_for_review
    self.ready_for_review = Time.now
  end

  def generate_slug
    self.slug = self.title.dup if self.slug.blank?
    self.slug = SlugProcessor.slugorize(self.slug)
  end

  def publish_now
    self.published_at = Time.now
  end

  def previous_post
    Post.where(["published_at < ?", published_at]).last
  end

  def next_post
    Post.where(["published_at > ?", published_at]).first
  end

  def tag_format
    tag_list.each do |tag|
      errors.add(:tag_list, "too long. maximum is 50 characters") if tag.length > 50
      errors.add(:tag_list, "tags cannot contain a period") if tag.include? '.'
    end
  end

end