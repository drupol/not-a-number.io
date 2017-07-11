---
layout: post
category : drupal
title: "A word about Atomium"
subtitle: "TODO: A Drupal theme"
tags : [drupal, theme, atomic]
image: /assets/images/posts/atomium.jpg
image_copyrights: 'Image by <a target="_blank" href="https://commons.wikimedia.org/wiki/File:Atomium_Brussels_-_panoramio_(4).jpg">Niels Mickers</a>.'
---
{% include JB/setup %}

The Drupal 7 theme layer has, and sometimes still is, been a nightmare to understand for me.

In my modules, I've always tried to avoid this dark corner that are the theme hooks and inspire my code from what I see somewhere else.

Until now, it helped me so far pretty well, that's the beauty of the Open Source.

I'm working at [European Commission](https://www.drupal.org/european-commission) with a team of fellow Drupalers and recently, I've been in charge of designing a new Drupal 7 base theme.

The requirements were simple:

* provide a *very* clean markup,
* break up with the old theme,
* break up with Bootstrap CSS framework,
* must be *very* simple to extend.

That was quite a challenge for me to imagine and write such a thing. I'm not a frontend guy... and I don't like so much designing user interface related stuff.

I really like searching for algorithms, writing them, optimizing them... but theming stuff was not my cup of tea.

However, I knew that the theme layer in Drupal 7 is a mess and I decided that I should do something to help, and as I said, I like to improve things.

So, I started to study how the most commonly themes were written and how they were designed.

[Zen](https://www.drupal.org/project/zen), [Mothership](https://www.drupal.org/project/mothership), [Omega](https://www.drupal.org/project/omega), [Adaptive](https://www.drupal.org/project/adaptivetheme) and [Bootstrap](https://www.drupal.org/project/bootstrap) were reviewed carefully during this process.

Of course, I'm not writing this blog post to talk about these themes and what's good or not in it.

I started to work on this project the first week of February 2017, and [the first commit](http://cgit.drupalcode.org/atomium/commit/?id=8e957f2e266897e89300e1da66d906310c95f0cc) was on the 28th of that same month.

Atomium needed to break up with old theme's habits. Prior explaining how we dealt with them, let's list and explain what are the issues with the current theme layer.

The complexity in the theme layer in Drupal resides in the fact that HTML can be output from a template file or from a function.

Drupal core using standard install and Stark theme defines 152 html elements or commonly named "hook themes". 132 of them are made out of PHP functions. The 20 leftovers are from templates.

According to me, mixing templates and functions for rendering HTML is a bit messy. Of course using functions has some performance advantages.

According to me, HTML must resides in template files and should be easily extended... In Drupal 7, you can extend, preprocess and process a template, but you can not extend a theme function, only preprocess and process it.

So, I tried to see how I could fix that in Atomium, how I could rewrote "theme functions" into simple templates.

Some of you might think "*Why the hell this guy is looking after that ? Does this guy likes to suffer ?*". I just like to fix things properly :-)

Also because [since Drupal 7.33](https://www.drupal.org/drupal-7.33-release-notes), you can debug which templates is used when rendering HTML components, and their corresponding templates suggestions, just by looking at the HTML source code.

But prior fixing that, I needed to find a proper folders and files structure.

Most of themes are composed of template files, assets, preprocess and process functions. There is no conventions on how to order and sort these.

There is no hierarchy, no structure, nothing. It means that prior doing anything, the first thing to do was to implement this.

With the requirements in mind, I've managed to build the folder and files structure so it can be easily extended throughout a children theme.

Then, once that was settled, I started [to convert most of Drupal core theme functions into templates](https://github.com/ec-europa/atomium/tree/7.x-1.x/atomium/templates)... and that helped me to understand and improve even further the theme layer.

After a couple of meetings with the colleagues, we've adjusted the folders and file naming conventions... and we had something great.

The registry alteration workflow was based on [Boostrap theme](https://drupal.org/project/bootstrap), clean HTML from [Mothership](https://drupal.org/project/mothership) and a lot of customizations were done for each '*hook themes*', now called '*components*'.

In order to test if Atomium was behaving correctly, my fellow italian colleague [Antonio De Marco](https://github.com/ademarco) [implemented a nifty way to test the rendering layer](https://github.com/ec-europa/atomium/blob/7.x-1.x/tests/bootstrap.php) by overriding the global 'theme_engine' variable and have a total control on what Drupal is rendering, just for testing purposes.

Then, to help newcomers to dive into the theme, I've created three subthemes, one based on [Bootstrap 4](https://v4-alpha.getbootstrap.com/), one on [Foundation](http://foundation.zurb.com/), and the last one is a copy of Bartik but using the Atomium mechanisms.



* Why it started ?
* When it started ?
* Atomic design - what it is ?
* What are alternatives ?
* Why is atomium so different ?
* What are the issue with Drupal theming layer ?
* How pre and process mechanism are different from regular themes ? From Bootstrap theme ?

[![Deciding the name was not an easy task...](/assets/images/posts/IMG_20170224_104603.jpg){:class="img-fluid img-thumbnail float-left" :height="200px" width="200px"}](/assets/images/posts/IMG_20170224_104603.jpg)
