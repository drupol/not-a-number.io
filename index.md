---
layout: default
title: "NaN :: N0t A Number"
tagline: Not A Number
---

<div class="jumbotron">
    <h1 class="display-3">{{ site.title }}</h1>
    <p class="lead">
      Welcome to my repository of non-convergent suite of random letters.<br/>
      Here, you may contemplate the variation of 26 letters and some other weird characters.
    </p>
</div>

{% for post in site.posts %}
<article class="teaser">

{% if post.image %}
<div class="image">
<a href="{{ HOME_PATH }}{{post.url}}">
  <img src="{{site.url}}/assets/images/{{post.image}}" />
</a>
</div>
{% endif %}

<h2><a href="{{ HOME_PATH }}{{post.url}}">{{post.title}}</a></h2>

<div class="excerpt">
{{post.excerpt | strip_html | strip_newlines}}..
</div>

<div class="read-more">
    <p><a class="btn btn-sm btn-secondary btn-block" href="{{ post.url }}" role="button">Read more <i class="fa fa-arrow-circle-right"></i></a></p>
</div>

</article>
{% endfor %}  
