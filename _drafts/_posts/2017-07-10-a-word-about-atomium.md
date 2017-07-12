---
layout: post
title: A word about Atomium
subtitle: 'TODO: A Drupal theme'
tags:
- drupal
- theme
- atomic
image: "/assets/images/posts/atomium.jpg"
image_copyrights: Image by <a target="_blank" href="https://commons.wikimedia.org/wiki/File:Atomium_Brussels_-_panoramio_(4).jpg">Niels
  Mickers</a>.
categories: drupal
date: '2017-07-10T00:00:00.000+00:00'
---


{% include JB/setup %}

The Drupal 7 theme layer has, and sometimes still is, been a nightmare to understand for me. <span style="font-size: 1rem;">In my modules, I've always tried to avoid this dark corner that are the theme hooks and inspire my code from what I see somewhere else.&nbsp;</span><span style="font-size: 1rem;">Until now, it helped me so far pretty well, that's the beauty of the Open Source.</span>

Working at [European Commission](https://www.drupal.org/european-commission) with a team of fellow Drupalers, I'm in charge of designing a new Drupal 7 base theme.

The requirements were simple:

* provide a *very* clean markup,

* break up with the old theme,

* break up with Bootstrap CSS framework,

* must be *very* simple to extend.

That was quite a challenge for me to imagine and write such a thing. I'm not a frontend guy... and I don't like so much designing user interface related stuff.
<span style="font-size: 1rem;">I really like searching for algorithms, writing them, optimizing them... but theming stuff was not my cup of tea.<br></span><span style="font-size: 1rem;">However, I knew that the theme layer in Drupal 7 is a mess and I decided that I should do something to help, and as I said, I like to improve things.</span>

So, I started to study how the most commonly themes were written and how they were designed.
<a href="https://www.drupal.org/project/zen" style="font-size: 1rem; background-color: rgb(255, 255, 255);">Zen</a><span style="font-size: 1rem;">, </span><a href="https://www.drupal.org/project/mothership" style="font-size: 1rem; background-color: rgb(255, 255, 255);">Mothership</a><span style="font-size: 1rem;">, </span><a href="https://www.drupal.org/project/omega" style="font-size: 1rem; background-color: rgb(255, 255, 255);">Omega</a><span style="font-size: 1rem;">, </span><a href="https://www.drupal.org/project/adaptivetheme" style="font-size: 1rem; background-color: rgb(255, 255, 255);">Adaptive</a><span style="font-size: 1rem;"> and </span><a href="https://www.drupal.org/project/bootstrap" style="font-size: 1rem; background-color: rgb(255, 255, 255);">Bootstrap</a><span style="font-size: 1rem;"> were reviewed carefully during this process.&nbsp;</span><span style="font-size: 1rem;">I started to work on this the first week of February 2017, and </span><a href="http://cgit.drupalcode.org/atomium/commit/?id=8e957f2e266897e89300e1da66d906310c95f0cc" style="font-size: 1rem; background-color: rgb(255, 255, 255);">the first commit</a><span style="font-size: 1rem;"> was on the 28th of that same month.</span>

Atomium needed to break up with old theme's habits. Prior explaining how we dealt with them, let's explain what are the issues with the current theme layer.

The complexity in the theme layer lies in the fact that Drupal allows you to define HTML components in a template file or in a function. And defining them is sometimes complex. The rendering workflow is something tricky too, and not so logic, but that will be for later.

Drupal 7 using standard install and Stark theme defines 152 HTML elements or commonly named "*hook themes*". 132 of them are made out of PHP functions. The 20 leftovers are from templates.
<span style="font-size: 1rem;">According to me, mixing templates and functions for rendering HTML is a bit messy.<br>Each of these two methods has its own pros and cons.<br></span><span style="font-size: 1rem;">HTML should resides in template files and should be easy to extend.<br></span><span style="font-size: 1rem;">In Drupal 7, you can extend, preprocess and process a template, but you can not extend a theme function, only overwrite it and preprocess, process it.</span>

So, I tried to see how I could fix that in Atomium, how I could rewrite the "*theme functions*" into simple templates.
<span style="font-size: 1rem;">Some of you might think "</span>*Why the hell this guy is looking after that ? Does this guy likes to suffer ?*<span style="font-size: 1rem;">". I just like to fix things properly :-)<br></span><span style="font-size: 1rem;">Also because </span><a href="https://www.drupal.org/drupal-7.33-release-notes" style="font-size: 1rem; background-color: rgb(255, 255, 255);">since Drupal 7.33</a><span style="font-size: 1rem;">, you can debug templates and see which one is used when rendering HTML components, and their corresponding templates suggestions, just by looking at the HTML source code.</span>

But prior fixing that, I needed to find a proper folders and files structure.

Most of the themes are composed of template files, assets, preprocess and process functions. There is no conventions on how to order and sort these.
<span style="font-size: 1rem;">There is no hierarchy, no structure, nothing. It means that before doing anything, the first thing to do was to implement this.<br></span><span style="font-size: 1rem;">With the requirements in mind, I've managed to build the folder and files structure so it can be easily extended throughout a children theme.</span>

Then, once that was settled, I started [to convert most of Drupal core theme functions into templates](https://github.com/ec-europa/atomium/tree/7.x-1.x/atomium/templates)... and that helped me to understand and improve even further the theme.

After a couple of meetings with the colleagues, we've adjusted the folders and file naming conventions... and we had something great.

The registry alteration workflow is based on [Boostrap theme](https://drupal.org/project/bootstrap), clean HTML from [Mothership](https://drupal.org/project/mothership) and a lot of customizations were done for each '*hook themes*', now called '*components*'.
<span style="font-size: 1rem;">In order to test if Atomium was behaving correctly, my fellow italian colleague </span><a href="https://github.com/ademarco" style="font-size: 1rem; background-color: rgb(255, 255, 255);">Antonio De Marco</a><span style="font-size: 1rem;"> </span><a href="https://github.com/ec-europa/atomium/blob/7.x-1.x/tests/bootstrap.php" style="font-size: 1rem; background-color: rgb(255, 255, 255);">implemented a nifty way to test the rendering layer</a><span style="font-size: 1rem;"> by overriding the global "<i>theme_engine</i>" variable and have a total control on what Drupal is rendering, just for testing purposes.</span>

Then, to help newcomers to dive into the theme, I've created three subthemes, one based on [Bootstrap 4](https://v4-alpha.getbootstrap.com/), one on [Foundation](http://foundation.zurb.com/), and the last one is a copy of Bartik but using the Atomium mechanisms.

* Why it started ?

* When it started ?

* Atomic design - what it is ?

* What are alternatives ?

* Why is atomium so different ?

* What are the issue with Drupal theming layer ?

* How pre and process mechanism are different from regular themes ? From Bootstrap theme ?

[{:class="img-fluid img-thumbnail float-left" :height="200px" width="200px"}](/assets/images/posts/IMG_20170224_104603.jpg)