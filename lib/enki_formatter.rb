require 'redcarpet'

class EnkiFormatter
  class << self

    def format_page_as_xhtml(text)
      markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :space_after_headers => true)

      output = markdown.render(text)
      coderay_filter(output)
    end

  private

    def coderay_filter(text)
      text.gsub!(%r{<pre lang="(.*?)"><code>(.*?)</code></pre>}m) do |match|
        CodeRay.scan(CGI::unescapeHTML($2), $1).html(:line_numbers => :table).div
      end
      text
    end
  end
end
