require 'redcarpet'

class EnkiFormatter
  class << self
    # def format_as_xhtml(text)
    #   Lesstile.format_as_xhtml(
    #     text,
    #     :text_formatter => lambda {|text| RedCloth.new(CGI::unescapeHTML(text)).to_html},
    #     :code_formatter => Lesstile::CodeRayFormatter
    #   )
    # end

    def format_comment_as_xhtml(text)
      markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :space_after_headers => true)
      # markdown = Redcarpet::Render::HTML.new(no_links: true, hard_wrap: true)
                                  # (:fenced_code, :no_intraemphasis,
                                  #  :gh_blockcode, :xhtml, :filter_html,
                                  #  :autolink, :no_image, :safelink)
      output = markdown.render(text)
      coderay_filter(output)
    end

    def format_page_as_xhtml(text)
      markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :space_after_headers => true)

      output = markdown.render(text)
      # output = Redcarpet::Markdown.new(text, :hard_wrap , :fenced_code, :no_intraemphasis,
      #                              :gh_blockcode, :xhtml ).to_html
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
