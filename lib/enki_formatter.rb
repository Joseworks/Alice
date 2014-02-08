require 'redcarpet'

class EnkiFormatter
  class << self

    def format_page_as_xhtml(text)
      markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, space_after_headers: true)

      output = markdown.render(text)
    end

  end
end
