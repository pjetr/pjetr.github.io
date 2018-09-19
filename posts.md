---
layout: dual_column
title: View all posts
permalink: /posts/
---
{% for post in site.posts %}
  <h3>
    <a href="{{ post.url }}">{{ post.title }}</a>
  </h3>
  {{ post.excerpt | strip_html }}
{% endfor %}