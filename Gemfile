source "https://rubygems.org"

gem "jekyll", "~> 3.1"
gem "jekyll-sitemap"
gem "jekyll-paginate"
gem "pygments.rb"
require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages']