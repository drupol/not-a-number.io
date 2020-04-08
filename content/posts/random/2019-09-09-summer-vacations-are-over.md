---
date: 2019-09-09
images: 
  - /images/2019-09-09-summer-vacations-are-over.jpg
image_copyrights: Cala Goloritzé, Baunei, Sardinia
tags:
  - library
  - random
  - work
title: Summer vacations are over?
---
When I was a student, it was easy to remember when holidays were coming.
Now that I'm working since more than a decade, it's harder to remember and distinguish those period sometimes!

That said, I have to say that the pace at work is different and this is how I remember that I should take some days off.

Working in a multi cultural environment means that people are going back to their roots for holidays.

And that means that there are less people available at the office.

However, on my side and since the last blog post in April, the word "_holidays_" was kind of meaningless !

<!--break-->

## Why no more blog post

In June, I've started to work in a new team with new colleagues, a completely different project, different office, 
different location and a completely different atmosphere and state of mind.

I will be more focusing on PHP development rather than Drupal, and it's a good thing.

Of course, I will continue to maintain [my modules](https://www.drupal.org/u/pol) and [the maintenance of Drupal 7](https://groups.drupal.org/node/521072),
but I won't be an active contributor as I used to be during past years.

In just two months, we delivered our first successful project based on [Symfony](https://symfony.com/)/[API Platform](https://api-platform.com/) and the client is so far super happy.

So quite a lot of changes in my professional environment lately and I'm already very glad of the outcome.

## However...

I haven't left aside my creativity when it comes to development, and here are the packages I've been making lately.

* [PHP OS Info](https://github.com/drupol/phposinfo)
* [PHP Launcher](https://github.com/drupol/launcher)
* [PHP Collection](https://github.com/drupol/collection)
* [Composer Packages](https://github.com/drupol/composer-packages)
* [Belgian national number faker](https://github.com/drupol/belgian-national-number-faker)

### PHP OS Info

Get information of the current operating system where PHP is running on.

There are many packages that does that already but most of them are based on the use of the variable `PHP_OS` that 
contains the operating system name PHP was built on.

However, `PHP_OS` might be sometimes not very accurate, then using `php_uname()` might be a better fit for detecting the
operating system, we only use it as a fallback.

PHP OS Info uses `php_uname()` and a static list of existing operating systems, and then from there, tries to deduct the
operating system family.

The project has been already adopted by [the Acquia BLT project](https://packagist.org/packages/acquia/blt) and [vaimo/composer-patches](https://github.com/vaimo/composer-patches).

### PHP Launcher

This library let you launch a file or a resource with the your default OS application.

I actually needed this small library while making the GraphViz exporter in [PHPTree](https://github.com/drupol/phptree).

### PHP Collection

Collection is a functional utility library for PHP.

It's similar to [other available collection libraries](https://packagist.org/?query=collection) based on regular PHP
arrays, but with a lazy mechanism under the hood that strives to do as little work as possible while being as flexible
as possible.

Collection leverages PHP's generators and iterators to allow you to work with very large data sets while keeping memory
usage as low as possible.

For example, imagine your application needs to process a multi-gigabyte log file while taking advantage of this
library's methods to parse the logs.
Instead of reading the entire file into memory at once, this library may be used to keep only a small part of the file
in memory at a given time.

On top of this, this library:
 * is [immutable](https://en.wikipedia.org/wiki/Immutable_object),
 * is extendable,
 * leverages the power of PHP [generators](https://www.php.net/manual/en/class.generator.php) and [iterators](https://www.php.net/manual/en/class.iterator.php),
 * uses [S.O.L.I.D. principles](https://en.wikipedia.org/wiki/SOLID),
 * doesn't depends or require any other library or framework.

Except a few methods, most of methods are [pure](https://en.wikipedia.org/wiki/Pure_function) and return a
new Collection object.

This library has been inspired by the [Laravel Support Package](https://github.com/illuminate/support) and
[Lazy.js](http://danieltao.com/lazy.js/).

### Composer packages

Composer Packages is a Composer plugin for getting information about installed packages in your project.

It could be very useful for anyone who wants to build a package discovery system, crawling the filesystem is then not
needed.

Thanks to [Bob den Otter](https://github.com/bobdenotter), it has been adopted from the beginning by [the Bolt community](https://bolt.cm/) for [the bolt/core project](https://github.com/bolt/core).

### Belgian national number faker

Belgian national number generator using [fzaninotto/faker](https://github.com/fzaninotto/Faker).

I guess there are nothing to say here :-)

## And now ?

I will continue to focus on my own projects, going to prepare myself for the next [EUFOSSA hackathon](https://eufossa.github.io/oss-hackathon-2019/) organized by the European Commission,
on the 5 and 6 of April ([the first one was about Symfony]({{< ref "2019-04-07-eufossa-hackathon-security-php-symfony" >}})).

I'm also pushing on the [PHP CS Fixer](https://github.com/FriendsOfPhp/PHP-CS-Fixer) project for [some changes](https://github.com/FriendsOfPHP/PHP-CS-Fixer/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc+author%3Adrupol), I hope they will get in very soon.

Also, the projects [drupol/php-conventions](https://github.com/drupol/php-conventions) and [drupol/drupal-conventions](https://github.com/drupol/drupal-conventions) are still actively maintained and since
[PSR-2 has been deprecated](https://github.com/php-fig/fig-standards/pull/1184) in favor of PSR-12, those packages has already been updated.
