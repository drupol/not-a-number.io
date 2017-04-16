---
---

ready = ->
  links = document.links
  for link in links
    if (link.hostname != window.location.hostname)
      link.target = '_blank'

document.addEventListener("DOMContentLoaded", ready);
