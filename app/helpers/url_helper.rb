module UrlHelper
  def post_path(post, options = {})
    suffix = options[:anchor] ? "##{options[:anchor]}" : ""
    path = post.published_at.strftime("/%Y/%m/%d/") + post.slug + suffix
    path = "#{Rails.configuration.action_controller.relative_url_root}#{path}"
    path = URI.join(enki_config[:url], path) if options[:only_path] == false
    path
  end

  def link_to_post(post, link_text=post.title)
    if post.published?
      link_to(link_text, post_path(post))
    else
      link_text
    end
  end
end
