module ApplicationHelper
  def cms_url(uri="/")
    "http://#{Quidnunc::CmsHost}#{uri}"
  end
end
