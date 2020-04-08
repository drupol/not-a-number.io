---
date: '2018-07-10'
images: 
  - /images/puzzle.jpg
subtitle: The ultimate missing Drupal 7 module
tags:
  - drupal
  - theme
  - theme registry
title: Registry on steroids
---
Last year, I wrote with the help of my colleagues, a new theme for Drupal 7: [Atomium]({{< ref "2017-07-10-a-word-about-atomium" >}}).

That theme needed to break with the habits from the past and implements new concepts while giving more flexibility to the end-user.
As those concepts were pretty new for most of the people using it, I've been asked to give training to some teams.

During the trainings, I usually explain in 2 hours, almost a year of research and development, so, you guessed it, it's impossible to explain everything from the ground in the details.

When I did the last training, I wanted to do something easier, this is how I came up with a new idea...

<!--break-->

## Background ##

Late February 2018, I'm preparing a training for a team that is going to use [Atomium](https://www.drupal.org/project/atomium) version 2.7 at the time.

The team I was going to train was composed of mostly developers, so I decided to do something a bit more in-depth.

Atomium is obviously composed of templates, but also of an heavy layer of code that alter the Drupal theme registry, this is usually the part that people never understand, but this is the most important one.

I had the idea to move out that part of the code into a module and make it available to the whole community without forcing people to use Atomium. This is how [Registry on steroids](https://www.drupal.org/project/registryonsteroids) has been created.
I first started it alone, then [Andreas Hennings](https://www.drupal.org/u/donquixote) joined the team. Thanks to him for his amazing knowledge of PHP and Drupal.

## Let's dive ##

Before diving into the main subject, let's refresh our memory on how the Drupal theme layer works.

The Drupal theme registry is, according to me, one of the most important piece in Drupal.
It contains all the theme hooks declared in the system. Each of these theme hooks have a definition that contains crucial information.
One of the most important piece of information is the phase callbacks.
Before going there, be aware that Drupal 7 is able to render an HTML component in two different ways:

* Using a template
* Using a render function

Drupal 7 processes the variables that are sent in the templates and/or through a render function in two phases:

* The `preprocess` phase
* The `process` phase

Each of those phase contains a list of callbacks that are executed one after the other.
The process phase is not used that much in the community. The Drupal 7 fork, [Backdrop](https://backdropcms.org/) decided [to get rid of it](https://github.com/backdrop/backdrop-issues/issues/193).
Anyway, one of the most important role of the Drupal theme registry is to collect those callbacks automatically and sort them in a particular order, for each theme hook.

The order is the following for the `preprocess` phase:

* `template_preprocess()`
* `template_preprocess_HOOK()`
* `[MODULE]_preprocess()`
* `[MODULE]_preprocess_HOOK()`
* `[THEME_ENGINE]_preprocess()`
* `[THEME_ENGINE]_preprocess_HOOK()`
* `[PARENTS_THEME]_preprocess()`
* `[PARENTS_THEME]_preprocess_HOOK()`
* `[THEME]_preprocess()`
* `[THEME]_preprocess_HOOK()`

And the same for the `process` phase:

* `template_process()`
* `template_process_HOOK()`
* `[MODULE]_process()`
* `[MODULE]_process_HOOK()`
* `[THEME_ENGINE]_process()`
* `[THEME_ENGINE]_process_HOOK()`
* `[PARENTS_THEME]_process()`
* `[PARENTS_THEME]_process_HOOK()`
* `[THEME]_process()`
* `[THEME]_process_HOOK()`

There is no limit in the callbacks, but there is no trick, the more callbacks you have the slower it will be to process them all.

In addition to automatically detect the callbacks, it is possible to manually add, delete or reorder phase callbacks through a specific hook: [hook_theme_registry_alter()](https://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_theme_registry_alter/7.x), see [an example](https://cgit.drupalcode.org/ds/tree/ds.module#n123) in the [Display Suite module](https://www.drupal.org/project/ds).

## A hidden feature ##

Rendering a theme hook in Drupal can be done in different ways:

* Using the [theme()](https://api.drupal.org/api/drupal/includes!theme.inc/function/theme/7.x) function
* Using a [render array](https://www.drupal.org/docs/7/api/render-arrays/render-arrays-overview)

Let's define a theme hook in my custom module, in the file `mymodule.module`:

    function mymodule_theme() {
        return array(
            'marquee' => array(
              'variables' => array(
                'text' => '',
              ),
              'template' => 'marquee',
            ),
        );    
    }

We've just defined an HTML component `marquee` with one variable: `text` and it will be using a template `marquee.tpl.php`, the template file must be created in the theme you are using. In my case, I'm using the core theme 'seven'.
I know that using a core theme is not a good practice, but in this case, it's easier to explain all of this.

To render it, we can use the `theme()` function:

    $html = theme(
      'marquee',
      array(
        'text' => 'The marquee HTML component',
      )
    );

The result is:

    <!-- THEME DEBUG -->
    <!-- CALL: theme('marquee') -->
    <!-- BEGIN OUTPUT from 'themes/seven/marquee.tpl.php' -->
    
    <marquee>The marquee HTML component</marquee>

    <!-- END OUTPUT from 'themes/seven/marquee.tpl.php' -->

You may have noticed that I have enabled [the theme debug of Drupal](https://www.drupal.org/docs/7/theming/overriding-themable-output/working-with-template-suggestions) in order to show which template is used to render my `marquee` component.

Now let's say that we want to create some `preprocess` callbacks:

* In the custom module: `mymodule_preprocess_marquee(&$variables, $hook)`
* In the theme: `seven_preprocess_marquee(&$variables, $hook)`

Once you flush the cache, Drupal will detect those callbacks and add them in the theme registry, in the proper phase callbacks stack, in this case, the `preprocess` phase.

Now, there's a kind of secret feature, not really a secret, but rather an undocumented feature.

There is a way to create `variants` of my component in a very easy way, just by extending the name of the component like this: `marquee__variant1`

    $html = theme(
      'marquee__variant1',
      array(
        'text' => 'The marquee HTML component - variant 1',
      )
    );

The output of this will be:

    <!-- THEME DEBUG -->
    <!-- CALL: theme('marquee__variant1') -->
    <!-- FILE NAME SUGGESTIONS:
       * marquee--variant1.tpl.php
       x marquee.tpl.php
    -->
    <!-- BEGIN OUTPUT from 'themes/seven/marquee.tpl.php' -->
    
    <marquee>The marquee HTML component - variant 1</marquee>

    <!-- END OUTPUT from 'themes/seven/marquee.tpl.php' -->
    
You may notice that there is now a list of file name suggestions that has been built by Drupal automatically, based on the hook theme in use.

Let's update our example with something more explanatory...

    $hook_theme = implode(
      '__',
      array(
        'marquee', 
        strtolower(date('F')),
        strtolower(date('l')),
      )
    );

    $html = theme(
      $hook_theme,
      array(
        'text' => 'The marquee HTML component',
      )
    );

The result will be:

    <!-- THEME DEBUG -->
    <!-- CALL: theme('marquee__july__tuesday') -->
    <!-- FILE NAME SUGGESTIONS: 
       * marquee--july--tuesday.tpl.php
       * marquee--july.tpl.php
       x marquee.tpl.php
    -->
    <!-- BEGIN OUTPUT from 'themes/seven/marquee.tpl.php' -->
    
    <marquee>The marquee HTML component</marquee>

    <!-- END OUTPUT from 'themes/seven/marquee.tpl.php' -->
    
You can also create preprocess that goes with it:

* In the custom module: `mymodule_preprocess_marquee__july__tuesday(&$variables, $hook)`
* In the theme: `seven_preprocess_marquee__july__tuesday(&$variables, $hook)`

Drupal includes a very nice and handy template file detection system by splitting the theme name at each `__` (_double underscores_), starting from the right.

In this particular case, you could create 2 templates `marquee--july--tuesday.tpl.php` and another `marquee--july.tpl.php`, those templates will be automatically picked up by Drupal at the right time.

- Every Tuesdays in July it will be: `marquee--july--tuesday.tpl.php`
- Every other days in July it will be: `marquee--july.tpl.php`
- Every other days it will be: `marquee.tpl.php`

_Pretty nice isn't it ?_

## Registry on steroids ##

Let's say that you'd like to have preprocess functions applied to specific templates: `marquee--july--tuesday.tpl.php` and `marquee--july.tpl.php`.

Naturally, one may think that we could create a preprocess callback named:

* In the custom module: `mymodule_preprocess_marquee__july(&$variables, $hook)`
* In the theme: `seven_preprocess_marquee__july(&$variables, $hook)`

Unfortunately, Drupal will not execute those preprocess when rendering the `marquee--july--tuesday.tpl.php` but only when rendering `marquee--july.tpl.php`.

There is no phase callbacks inheritance in Drupal 7.

**And this is why Registry on steroids has been created!**

It has been created to fill that gap and allow people to have an inheritance in the preprocess and process phase callbacks.

The issue [#2563445](https://www.drupal.org/project/drupal/issues/2563445) is about this, but I doubt it will be fixed one day unfortunately.

## Registry on steroids Alter ##

If you install Registry on steroids, you will notice that it comes with one submodule.

Now that you're aware of what **Registry on steroids** is doing, that `Alter` submodule is basically a module that alter all the render arrays of Drupal. It update and extend the `#theme` property, based on the element value.

Example with the `region` hook theme.

Drupal doesn't call `theme('region', ...)` to render a region, it's using a render array, something that roughly look like this:

    $page = array(
      '#theme_wrappers => array('html'),
      'sidebar' => array(
        '#theme_wrappers' => array('region'),
        'block1' => array(...),
        'block2' => array(...),
      ),
    );

ROS Alter, will alter the array and will transform it into:

    $page = array(
      '#theme_wrappers => array('html'),
      'sidebar' => array(
        '#theme_wrappers' => array('region__sidebar'),
        'block1' => array(...),
        'block2' => array(...),
      ),
    );

By doing this simple modification, you could have different templates and preprocess per region:

    <!-- THEME DEBUG -->
    <!-- CALL: theme('region__sidebar') -->
    <!-- FILE NAME SUGGESTIONS: 
       * region--sidebar.tpl.php
       x region.tpl.php
    -->
    <!-- BEGIN OUTPUT from 'modules/system/region.tpl.php' -->

    // REGION CONTENT HERE    

    <!-- END OUTPUT from 'modules/system/region.tpl.php' -->

This example is very basic, but ROS Alter does more than that, try it and you will see.

It is also possible to alter the list of suggestions with a hook, please read carefully [the Registry on steroids Alter API file](https://github.com/drupol/registryonsteroids/blob/7.x-1.x/modules/registryonsteroids_alter/registryonsteroids_alter.api.php) to understand how to implement and use it.

## Future of Atomium ##

Now that Registry on steroids has a much better and upgraded mechanism to alter the Drupal theme registry, Atomium has been updated and it's now much lighter.

In less than one week, the new [Atomium branch 7.x-3.x](https://github.com/ec-europa/atomium/tree/7.x-3.x) will be updated and will be fully working with Registry on steroids.

In the end, Atomium will be a simple Drupal theme that uses templates instead of theme functions to render any Drupal element.
The advantages of using templates instead of functions:

- You can enable the theme debug of Drupal core and spot which template is used, anywhere in your page, you cannot do that when using functions to render element.
- You can extend templates really easily thanks to Registry on steroids Alter.
- You have a nice inheritance mechanism in the phase callbacks (preprocess/process) thanks to Registry on steroids.

## Strange things ##

During the making of Registry on steroids, I noticed weird things in the Drupal theme layer.

I will explain here one of the weirdest thing, thing that I didn't find why it's done this way. I haven't found a proper explanation yet, do not hesitate to let me know in the comment if you know why.

As you know now, there are two ways to render a theme hook:

* With a template
* With a function

The issue is that when using a function to render your hook theme, Drupal will skip some phase callbacks.

Here's the ordered list of `preprocess` callbacks that Drupal will execute if your theme hook is using a template:

* `template_preprocess()`
* `template_preprocess_HOOK()`
* `[MODULES_IF_ANY]_preprocess()`
* `[MODULES_IF_ANY]_preprocess_HOOK()`
* `[THEME_ENGINE]_preprocess()`
* `[THEME_ENGINE]_preprocess_HOOK()`
* `[BASE_THEME_IF_ANY]_preprocess()`
* `[BASE_THEME_IF_ANY]_preprocess_HOOK()`
* `[THEME]_preprocess()`
* `[THEME]_preprocess_HOOK()`

Now, if it's using a function, here's the list:

* `template_preprocess()`
* `template_preprocess_HOOK()`
* `[MODULES_IF_ANY]_preprocess_HOOK()`
* `[THEME_ENGINE]_preprocess_HOOK()`
* `[BASE_THEME_IF_ANY]_preprocess_HOOK()`
* `[THEME]_preprocess_HOOK()`

As you can see, some `preprocess` callbacks are skipped. All the callbacks ending with `_preprocess` basically, except [template_preprocess()](https://api.drupal.org/api/drupal/includes%21theme.inc/function/template_preprocess/7.x) which is executed manually in the [theme()](https://api.drupal.org/api/drupal/includes!theme.inc/function/theme/7.x) function.

_Crazy isn't it ?_

In Atomium and Registry on steroids, we had to reproduce that behavior in order to not break existing contrib modules.
