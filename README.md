**Quidnunc blog management system**

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
