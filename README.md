**Quidnunc blog management system**


Setup notes:

1. You'll need Postgres and the Heroku Toolbelt.
2. For reasons that are entirely my (PK) fault, you'll need to fiddle with the database.yml and (to log in to the admin area) session controller.
3. Several environment vars are loaded from a .env file which is not checked in to Git:
  (this is not the format of the actual file, just a list of keys)
  * needed for Paperclip in the Post model:
  - S3_BUCKET_NAME=<secret key redacted>
  - S3_KEY=<secret key redacted>
  - S3_SECRET=<secret key redacted>

  * server settings passed to Unicorn:
  - RACK_ENV=development
  - PORT=3000

  * email sending service settings:
  - EMAIL_SEND_ADDRESS=<secret key redacted>
  - EMAIL_SEND_PASSWORD=<secret key redacted>

4. Launch the app using Foreman (foreman start) to use the .env file and Procfile.
5. The current seeds.rb does not create long posts or posts with images, so there's a few cases it doesn't cover.

This is based on Enki, but it has diverged substantially:

* Ruby 2/Rails 4 updates (Enki wasn't all the way there at the time that I forked it.)
* The Enki comments system has been removed and replaced with Disqus.
* a Google-specific Omniauth strategy instead of OpenID.
* No Markdown or Textile: TinyMCE rich text editor instead.
* Goodbye Cucumber.
* Paperclip for image upload.
* A number of gems have been updated or replaced:
  - acts_as_taggable_on instead of acts_as_taggable_on_steroids
  - up-to-date chronic instead of the workaround fork aaronh-chronic
  - newer will_paginate
  - possibly others
* other implementation-specific changes.


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

**Compatibility**

Uses Ruby 1.9.3 or newer and Rails 4. Runs on MySQL or Postgres. Works on heroku.

**Contributors, these guys rock**

(see the Enki homepage)

**License**

GPL(General Public License) - See LICENSE

Admin design heavily inspired by "Habari":http://www.habariproject.org/en/

**DIFFERENCES FROM ENKI:**
***there are many***

* multi-user login using Omniauth/Google-specific strategy.
* TinyMCE rich text editor.
* multiple additional fields in the Post model.
* OpenID and acts_as_taggable_on_steroids removed. Using acts_as_taggable_on instead.
* Textile removed, Markdown added but not really used.
* Intro Text area for front page, body text for post main. Not concatenated.
* will_paginate for pagination, used more than in original Enki install.
* Disqus for commenting, Enki's comments system removed.
* uses current Chronic for time parsing instead of aaronh-chronic hacky fix to get older Chronic working with newer Rubies.
* Image upload with paperclip to S3.
