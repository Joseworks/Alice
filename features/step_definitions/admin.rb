Given /I am logged in/ do
  # post '/admin/session', :bypass_login => '1'
  visit '/admin/session'
  check "Bypass credentials check"
  click_on "Login with OpenID"
end

Then /a RuntimeError is thrown when I press "(.*)"/ do |button|
  lambda {
    click_button(button)
  }.should raise_error
end