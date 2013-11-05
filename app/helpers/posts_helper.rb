module PostsHelper
  include ActsAsTaggableOn::TagsHelper

  # This isn't strictly correct, but it's a pretty good guess
  # and saves another hit to the DB
  def more_content?
    @posts.size == Post::DEFAULT_LIMIT
  end

  def updated_time(post)
    if post.updated?
      "Updated:#{post.edited_at.strftime("%l:%M, %b %d")}"
    end
  end

  def disqus_comments
    javascript_tag("/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
        var disqus_shortname = 'quidnunc'; // required: replace example with your forum shortname

        /* * * DON'T EDIT BELOW THIS LINE * * */
        (function() {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();")
  end

  def disqus_comment_counts
    javascript_tag("/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
      var disqus_shortname = 'quidnunc'; // required: replace example with your forum shortname

      /* * * DON'T EDIT BELOW THIS LINE * * */
      (function () {
      var s = document.createElement('script'); s.async = true;
      s.type = 'text/javascript';
      s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
      (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
      }());")
  end
end
