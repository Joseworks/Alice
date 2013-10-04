This is based on Enki:

**Enki**


A Ruby on Rails blogging app for the fashionable developer.

Preferences are for the masses. Any real coder knows the easiest and best way to customize something is by *hacking code*. Because you want your blog to be you, not bog standard install #4958 with 20 posts per page instead of 15. For this you need a *clean, simple, easy to understand code base* that stays out of your way. No liquid drops and templates hindering your path, no ugly PHP(Hypertext Preprocessor) stylings burning your eyeballs.

[Enki home](http://github.com/xaviershay/enki)

**More info**

Enki is a compact, easily extendable base for your blog. It does this by being highly opinionated, for example:

* Public facing views should adhere to standards (XHTML(eXtensible Hypertext Markup Language), Atom)
* /yyyy/mm/dd/post-title is a good URL for your posts
* Live comment preview should be provided by default
* Google does search better than you or I
* You don't need a plugin system when you've got decent source control
* If you're not using OpenID you're a chump
* Hacking code is the easiest way to customize something

**URL path prefix**

Enki can run your blog with a URL path prefix.  For example, you can run it at example.com/*blog* instead of blog.example.com.  You can do so with the RAILS_RELATIVE_URL_ROOT environment variable, set either before starting the server or in config/application.rb before Enki::Application.  Uncommenting this line in config/application.rb will enable this behavior in all environments:

<pre><code>ENV['RAILS_RELATIVE_URL_ROOT'] = '/blog'</code></pre>

**Compatibility**

Uses Ruby 1.9.3 or newer and Rails 4. Runs on MySQL or Postgres. Works on heroku.
)

**Contributors, these guys rock**

(see the Enki homepage)

**License**

GPL(General Public License) - See LICENSE

Admin design heavily inspired by "Habari":http://www.habariproject.org/en/
