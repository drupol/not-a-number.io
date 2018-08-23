---
layout: post
title: A word about Atomium
subtitle: 'A new Drupal 7 base theme'
tags:
- drupal
- theme
- atomic
image: "/assets/images/posts/atomium.jpg"
image_copyrights: Image by <a target="_blank" href="https://commons.wikimedia.org/wiki/File:Atomium_Brussels_-_panoramio_(4).jpg">Niels Mickers</a>.
categories: drupal
date: '2017-07-10T00:00:00.000+00:00'
---

{% include JB/setup %}

The Drupal 7 theme layer has, and sometimes still is, been a nightmare to understand for me. In my modules, I've always tried to avoid this dark corner that are the theme hooks and inspire my code from what I see somewhere else.

Until now, it helped me so far pretty well, that's the beauty of the Open Source.

But recently I've been given the task to build a new base theme for Drupal 7 and thus, to have a deep understanding on how the theme layer is working.

<!--break-->

## Background ##

Working at [European Commission](https://www.drupal.org/european-commission) with a team of fellow Drupalers, I'm in charge of designing a new Drupal 7 base theme.

The requirements were simple:

* provide a *very* clean markup,

* break up with the old theme,

* break up with Bootstrap CSS framework,

* must be *very* simple to extend using atomic design principles.

That was quite a challenge for me to imagine and write such a thing. I'm not a frontend guy... and I don't like so much designing user interfaces.
I really like searching for algorithms, writing them, optimizing them... but theming stuff was not my cup of tea. However, I knew that the theme layer in Drupal 7 is a mess and I decided that I should do something to help, and as I said: "*I like to improve things*".

## History ##

[![Atomium names](/assets/images/posts/IMG_20170224_104603.jpg){:height="160" width="100" .float-left .img-thumbnail}](/assets/images/posts/IMG_20170224_104603.jpg)

So, I started to study how the most commonly themes were written and how they were designed.
[Zen](https://www.drupal.org/project/zen), [Mothership](https://www.drupal.org/project/mothership), [Omega](https://www.drupal.org/project/omega), [Adaptive](https://www.drupal.org/project/adaptivetheme) and [Bootstrap](https://www.drupal.org/project/bootstrap) were reviewed carefully during this process. I started to work on this the first week of February 2017, and [the first commit](http://cgit.drupalcode.org/atomium/commit/?id=8e957f2e266897e89300e1da66d906310c95f0cc) was on the 28th of that same month.

Atomium needed to break up with old theme's habits. Prior explaining how we dealt with them, let's explain what are the issues with the current theme layer.

Oh and by the way, the name "*Atomium*" has been chosen among a list that we've made at work with the colleagues, the photo on the left illustrate all the candidate names that we've come up with before choosing Atomium, suggested by [a colleague](https://twitter.com/gdeudon). It fits perfectly for the project, it's short, not too difficult to write in any language and... [it comes from Belgium](https://en.wikipedia.org/wiki/Atomium) :-)

## Why ##

On of the complexity in the theme layer lies in the fact that Drupal allows you to define HTML components in a template file or in a function. And defining them is sometimes complex. The rendering workflow is something tricky and not so straightforward.

Drupal 7 using standard install and Stark theme defines 152 HTML elements or commonly named '*hook themes*'. 132 of them are made out of PHP functions. The 20 leftovers are from templates.
According to me, mixing templates and functions for rendering HTML is a bit messy.
Each of these two methods has its own pros and cons.

HTML should resides in template files and should be easy to extend.

In Drupal 7, you can extend, preprocess and process a template, but you can not extend a theme function, only overwrite it and preprocess, process it.

So, I tried to see how I could fix that in Atomium, how I could rewrite the "*theme functions*" into simple templates.
Some of you might think "*Why the hell this guy is looking after that ? Does this guy likes to suffer ?*". I just like to fix things properly :-)

Also because [since Drupal 7.33](https://www.drupal.org/drupal-7.33-release-notes), you can debug templates and see which one is used when rendering HTML components, and their corresponding templates suggestions, just by looking at the HTML source code... This option is also configurable within the Atomium settings, see the screenshot below.

But prior fixing that, I needed to find a proper folders and files structure.

## Structure ##

Most of the themes are composed of template files, assets, preprocess and process functions. There is no conventions on how to order and sort these.
There is no hierarchy, no structure, nothing.

Most of the themes I reviewed are using the file template.php as a junk room where everything is dumped in there.

This has to change.

Before doing anything, the first thing to do was to implement a clean structure.

With the requirements in mind, I've managed to build the folder and files structure so it can be easily extended throughout a children theme.

Then, once that was settled, I started [to convert most of Drupal core theme functions into templates](https://github.com/ec-europa/atomium/tree/7.x-1.x/atomium/templates)... and that helped me to understand and improve even further the theme.

After a couple of meetings with the colleagues, we've adjusted the folders and file naming conventions... and we had something great.

## In-depth mechanisms ##

The registry alteration workflow is based on [Bootstrap theme](https://drupal.org/project/bootstrap) with small modifications, clean HTML from [Mothership](https://drupal.org/project/mothership) and other themes I reviewed.

A lot of customizations were done for each '*hook themes*', now called '*components*'.

In order to test if Atomium was behaving correctly, my fellow italian colleague [Antonio De Marco](https://github.com/ademarco) implemented [a nifty way to test the rendering layer](https://github.com/ec-europa/atomium/blob/7.x-1.x/tests/bootstrap.php) by overriding the global "*theme_engine*" variable and have a total control on what Drupal is rendering, just for testing purposes.

Then, to help newcomers to dive into the theme, I've created three subthemes, one based on [Bootstrap 4](https://v4-alpha.getbootstrap.com/), one on [Foundation](http://foundation.zurb.com/), and the last one is a copy of Bartik but using the Atomium mechanisms.

## Features ##

As a base theme, Atomium will be empowering all European Commission websites built with Drupal. The final theme will be [EC Europa Theme](https://github.com/ec-europa/ec-europa-theme/tree/europa-atomium).

### Preprocessing and processing functions ###

Atomium has special features that makes it unique in the Drupal ecosystem.

I think, but I can be wrong, that this is the only theme that provides such a working cascade of preprocess and process functions based on the theme hooks suggestions.

It means that if you call the hook theme '*link*' with some custom suggestions like:

`$mylink = theme('link__suggestion1__suggestion2', array(...));`

The default behavior of Drupal is to only run the `HOOK_preprocess_link()` then stop.

With Atomium, the preprocess and process mechanisms of Drupal 7 will run the following functions, in order:

* `HOOK_preprocess_link(&$variables, $hook)`

* `HOOK_preprocess_link__suggestion1(&$variables, $hook)`

* `HOOK_preprocess_link__suggestion1__suggestion2(&$variables, $hook)`

This way, you may create functions that will be applied to a subgroup of theme hooks, just by giving them a relevant name.

Apparently there has been [some updates in Drupal 8](https://www.drupal.org/node/939462) regarding this and the issue needs to be [backported to Drupal 7](https://www.drupal.org/node/2563445)... Let's hope I can find some time to propose a patch for it so I could remove that logic from Atomium and all the themes could use this amazing feature.

### Attributes handling ###

Another feature added in Atomium is the automatic processing of attributes based on a simple variable name.

Let's say that you create in your preprocess a variable named: '*something_attributes_array*'.

During the main Atomium preprocess function, there is a mechanism that will detect those variables based on the pattern '*\*_attributes_array*' and then will process them through the '*atomium_drupal_attributes()*' function.
Then, in the template, the variable '*something_attributes*' will be available as a string containing the attributes.

The function '*atomium_drupal_attributes()*' is a extended version of '*[drupal_attributes()](https://api.drupal.org/api/drupal/includes%21common.inc/function/drupal_attributes/7.x)*'.
By default, it will `trim()` and `check_plain()` the values, but also, if the key of an attribute is numeric, it will only display its value. Ex: `0 => "data-closable"` will be displayed: `data-closable`.

The other small difference with the original function is that the values in the '*class*' key will be sorted alphabetically.

### Assets ###

![Atomium settings](/assets/images/posts/atomium-settings.png "Atomium settings")

In Atomium, inline javascript is stripped out of the HTML output and moved into a temporary file containing only that inline javascript. Then, that file is inserted in the page as a simple javascript file. This setting can be enabled or disabled through the settings page.

Many CSS coming from Drupal core are stripped out as well, this setting can be configured through the theme info file.

It is also very simple to load a component CSS or JS file just by creating the file in the component directory, it will be loaded automatically.
The file name convention is simple: `[component].[js|css]`.

### Atomic design ###

The structure of Atomium allows you to split each component into its very own directory.
In this way, you can organize your theme components in a clean way, without being cluttered with other stuff.

As components are [render arrays](https://www.drupal.org/docs/7/api/render-arrays/render-arrays-overview), you can create components "composed of components" very quickly.

The idea behind Atomium is to follow an [Atomic design pattern](http://patternlab.io/).
I strongly suggest to read the documentation, it explains everything from the ground.

### Clean markup ###

Atomium tries, in every way, to be as clean as possible when rendering its markup.

Some default added classes has been removed, and most of the components rendered using a theme function has been converted using a template.

As every component is based on a template, we have to make sure that templates are without error and we are good to ship.

## Notable changes ##

In order to be compatible with most contrib modules, I tried not to do too much in Atomium... and accept the fact that things needs to be improved in Drupal and not in the theme.

### breadcrumb handling ###

During the development of this project, a lot of time has been put into analyzing how Drupal's core functions were implemented and how to improve them for better customization.

A good example of this is the breadcrumb generation, I had to do something.

Let's analyse how it's currently done in Drupal and how I implemented it.

The default implementation is:

```php
$variables['breadcrumb'] = theme(
  'breadcrumb',
  array(
    'breadcrumb' => drupal_get_breadcrumb(),
  )
);
```

By default, Drupal uses the function [drupal_get_breadcrumb()](https://api.drupal.org/api/drupal/includes%21common.inc/function/drupal_get_breadcrumb/7.x) in its [template_process_page()](https://api.drupal.org/api/drupal/includes!theme.inc/function/template_process_page/7.x) hook.

That function returns raw HTML. Thus, it's almost impossible to alter the breadcrumbs links in an efficient way in a preprocess or process function.

In order to get a render array, we have to go deeper and rewrite functions accordingly.

`drupal_get_breadcrumb()` calls [menu_get_active_breadcrumb()](https://api.drupal.org/api/drupal/includes!menu.inc/function/menu_get_active_breadcrumb/7.x). This is actually, the function that returns the HTML.

There is no way to alter the result of that function as it returns an array of raw HTML links.

Unfortunately, in order to change this behaviour, we have to create two extra functions in Atomium and change the way the breadcrumb is generated.

Here's how to generate the breadcrumb properly in the `atomium_preprocess_page()`:

```php
  $variables['breadcrumb'] = array(
    '#theme' => array('breadcrumb'),
    '#breadcrumb' => atomium_drupal_get_breadcrumb(),
  );
```

`atomium_drupal_get_breadcrumb()` is an Atomium internal function written only for the breadcrumb handling. Instead of calling `menu_get_active_breadcrumb()`, it calls `atomium_menu_get_active_breadcrumb()` which is also a custom Atomium function that, instead of returning an array of raw HTML links, returns an array of render arrays.

This is why, in `page.tpl.php`, to render it, instead of writing:

`<?php print $breadcrumb; ?>`

You have to use:

`<?php print render($breadcrumb); ?>`

As you can see, the rendering process is at the very end of the Drupal's chain of preprocess and process functions.

And this allows customisations at will in preprocess and process functions because we only deal with render arrays in those functions.

After seeing this in Atomium, a colleague of mine [reported this very specific issue on drupal.org](https://www.drupal.org/node/2863108) as well.

## Contributing ##

Atomium is an [European Commission Open Source project hosted on Github](https://github.com/ec-europa/atomium), you are free to contribute and submit pull requests if you think that something should be done in a different way.

Don't be afraid to drop me a line, I'm quite reactive !

## The future ##

Since a couple of months, I took some distances from Drupal planet for personal reasons. I can't wait to come back after my personal stuff are done.

The plan for the future is to maintain Atomium and improve it. I wish to have time to work on some particular issues that keeps me up at night.

The first issue is [this one](https://drupal.org/node/1545964). Once that issue will be in, you'll be able to use the [TWIG engine in Drupal 7](https://twig.symfony.com/) and all its goodness.
I'm using the patch in production since a year and I haven't got any single problem yet.

Then I really hope that [the breadcrumb patch](https://www.drupal.org/node/2863108) will make its way too, my colleague too care to make it backward compatible so it doesn't break other modules. Of course, if it goes in, those modules will be able to use preprocess functions instead of overriding the breadcrumb theme function... and only that, it's a huge plus.

Of course, as a background task, I need to work on Drupal 8 and see if Atomium would have its place there.