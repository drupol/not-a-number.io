---
layout: default
title: "News"
tagline: Not A Number
group: navigation
order: -10
---

{% for post in site.posts %}
<article class="teaser">

<h2><a href="{{ HOME_PATH }}{{post.url}}">{{post.title}}</a></h2>
  <p class="blog-post-meta small">
    <i class="fa fa-calendar"></i>
    <time datetime="{{ post.date | date: "%Y-%m-%dT%H:%M:%SZ" }}" itemprop="datePublished">{{ post.date | date_to_long_string }}</time>
  </p>

<div class="excerpt">
{{post.excerpt | strip_html | strip_newlines}}..
</div>

<div class="read-more">
    <p><a class="btn btn-secondary btn-block" href="{{ post.url }}" role="button">Read more <i class="fa fa-arrow-circle-right"></i></a></p>
</div>

</article>
{% endfor %}