---
layout: post
category : dev
title: "PHP experimentations"
tags : [php, novelties, experiments]
image: /assets/images/posts/6053042920_f5d01173fb_b.jpg
image_copyrights: 'Image from <a href="https://www.flickr.com/photos/myfuturedotcom/6053042920">FlickR</a> under CC licence.'
---
{% include JB/setup %}

These last months were busy.

I mean, really busy.

First, I have some important personal projects that are ongoing since years now that are about to be concluded.
These projects takes less or more 70% of my free time since 2 years.

Then, real regular work, it's taking me also a lot of time.
There is [Atomium](https://github.com/ec-europa/atomium), the European Commission theme which is taking most of the time.

And these last days were even more full of "_busy-ness_".

Let me tell you how I get there... it's a small story...

<!--break-->

So, 3 weeks ago, I was looking for performance improvements with [Atomium](https://github.com/ec-europa/atomium). I wanted to get rid of useless loops by removing all **hook_process_hook()** calls.

These hooks were mainly used to process custom attributes added into some particular templates. As you may know, Drupal 7 provides default variables for attributes: `attributes_array`, `title_attributes_array`, `content_attributes_array` (see [_template_preprocess_default_variables()](https://api.drupal.org/api/drupal/includes%21theme.inc/function/_template_preprocess_default_variables/7.x).
This was ok for most of the templates we had, but there are some templates who requires specific attributes per item. Like, an items list, a table with rows and cells, etc etc.

How to deal with that ?

The first idea was to create a custom array that would contain all the attributes in the **hook_preprocess_hook()** call, then in the **hook_process_hook()**, a loop would have converted this array of array into an array of strings, ready to be included in its tag in the template.

This solution worked pretty well so far but it's cumbersome and, as far as I saw at work, it confuses people... but currently there are no other way in Drupal 7.

The problem with that is that you have at least 3 loops, one in the **hook_preprocess_hook()**, one in **hook_process_hook()** and one in the template, that's a lot.


Atomium is full of new concepts and I wanted to innovate again.


The idea I had was to create a single custom variable that would contains all the attributes. Those attributes would not be an array but an object that would have easy methods to add, remove and replace attributes values.

So here I was, coding a very basic Attribute object, with simple methods. I also created an Attribute container extending [\ArrayAccess](http://php.net/manual/en/class.arrayaccess.php) so it could automatically spawn attributes at will, just what I was looking for.

Implementing the Attribute object was fun, but to be honest, it was even better when I started to create the Attributes container.

With a custom implementation of the [PHP magic methods](http://php.net/manual/en/language.oop5.magic.php) [__get()](http://php.net/manual/en/language.oop5.overloading.php#object.set) and [__set()](http://php.net/manual/en/language.oop5.overloading.php#object.set), I've managed to create such a thing:

```php
$fooAttribute = $attributeContainer['foo'];
```

Where the key **foo** would not exists prior and even would spawn the object `$fooAttribute` "_automagically_".

Technically, I had no major issue while doing that and the only thing I can say is that it's a pity that we cannot "_autoload_" classes in a Drupal 7 theme, but that's not the main topic.

So, as a complete novelty in Drupal 7, I was introducing classes in Atomium, I also needed some tests. I don't like writing tests.
I asked my friend [Antonio De Marco](https://github.com/ademarco) from [Nuvole](http://nuvole.org/) to help me in this task and he wrote the tests in Atomium.

It's also him that introduced me the amazing [peridot-php/Leo](https://github.com/peridot-php/leo) assertion library for tests.


My next idea was the following, why not use an external light and simple library to handle the generation of those attributes?

I looked for one, but found none that would fits my needs, so I decided to write one. I wanted a very simple but effective library that could be used by anyone to generate any markup.

I wrote [TagAttributes](https://github.com/drupol/tagattributes) based on the concepts of [peridot-php/Leo](https://github.com/peridot-php/leo) and I learned so much things... crazy !

While doing the library on my own, I wanted to do things in the state of the art, a fully featured library that could generate tags, their attributes and their content without any troubles and of course... fully tested... and unfortunately I could not ask to Antonio to write the tests for me ;-)


So, I learned to use [PHPSpec](https://github.com/phpspec/phpspec), and I wrote all the tests of the library using it. I really enjoyed it to, much better than what I was used to know.


Leo and TagAttributes are using dynamically created methods and properties and some properties are functions, callbacks or better: Closures.

All these new concepts of programming were bubbling in my head and thanks to TagAttributes, I've decided to externalize the library to create dynamic methods and properties into its own package: [DynamicObjects](https://github.com/drupol/dynamicobjects).

There were a couple of libraries around playing with these PHP magic methods, but none were good or complete enough for what I was looking for. DynamicObjects allows you to create and manage objects methods and properties. It comes in two flavors, as a PHP Trait, or as a PHP Class that you can extend.


DynamicObjects was working pretty fine and I decided to see if its integration in peridot-php/Leo is something easy.

I requested [feedback](https://github.com/peridot-php/leo/issues/29) on the library but got none yet. So, this is "on-hold" for the moment.


As I restarted to take the train to go to work, I had some time ahead to work on this and I added some features. The first feature I added in DynamicObjects is the memoization:

<blockquote class="blockquote text-justify">
In computing, memoization is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.
<footer class="blockquote-footer"><cite><a href="https://en.wikipedia.org/wiki/Memoization">Wikipedia</a></cite></footer>
</blockquote>

I first started to include the functionality "_as-is_" in DynamicObjects and then, just like before, I made a package out of it: [PHP Memoize](https://github.com/drupol/memoize).

Of course there were [packages](https://packagist.org/?q=memoize) that can do memoization, but not like I wanted to. As the memoization is using a cache to store its data, I wanted it to be able to use a standardized cache system: [PSR-16](http://www.php-fig.org/psr/psr-16/). 


The second feature I added, was inspired by [Macroable](https://github.com/spatie/macroable), a PHP package that has the same purpose as DynamicObjects and written at the same time by a fellow colleague [Freek Van der Herten](https://github.com/freekmurze) at [Spatie](https://spatie.be).

I had the crazy idea to create a package that would convert a regular PHP class into an anonymous one, copying each of its public methods and properties into dynamic ones using DynamicObjects as hard dependency.

This is how I created the package: [PHP Anonymize](https://github.com/drupol/anonymize), also 100% tested with PHPSpec.


In less than 3 weeks, I've created 4 small different libraries and I don't know what will be the outcome of these.
Doing them was very important because it helped me keeping me busy learning new stuff related to my work. I learn very nice concepts and I think it will open the doors to a new way of writing libraries, at least, for me.
I've learned Leo, PHPSpec, the importance of closures, the bindings, and so much more...

This is exactly what I love in my work. There's so much things to discover, to build to learn, to show...
Some people are singing, dancing, painting, acting... but for me, learning new work-related stuff and writing opensource softwares, are a way to express my creativity... and as long as this will exists, I will never get fed up of what I do.


So... what's next ?


_We'll see_...