---
date: 2017-11-10
images:
  - /images/326044514_cedf60b870_b.jpg
image_copyrights: Image from [FlickR](https://www.flickr.com/photos/98063470@N00/326044514).
tags:
  - php
  - experiments
  - drupal
  - symfony
title: Reaching and overpassing the Drupal 7 limits
---
As I wrote in [my previous post]({{< ref "2017-09-20-PHP-experimentations" >}}), the last months were pretty busy.

And it's still the case.

I've been assigned new tasks at work and if you know me a bit now, you probably know that I like to do things properly.

So, the task I've been asked to do is to analyze and rewrite the custom authentication system of [NextEuropa](https://github.com/drupol/platform-dev), the Drupal 7 platform used at the European Commission.

<!--break-->

## Introduction

To give a bit of context about NextEuropa, there are around 175 websites using it.
One team to develop "_the Core team_" which I'm part of and one team to maintain it "_the Core support team_".

9 developers, from 29 to 44, we are aged on average around 38.2 years old.

Some of us have different backgrounds, not necessarily in IT, not necessarily in PHP.
Some of us have from 1 month to 12 years of "_Drupal-ing_" behind.

We can say that we are a bunch of passionate developers and even if sometimes we do not agree, we are in overall a very good and charming team.

Unfortunately, even if sometimes coding and finding the best way to reach the goal and meet all the expectations is hard,
dealing with all points of view and habits of the colleagues can be even more complex, but this is why work is called '_work_' I guess.

And a part of the a developer's job is to let others know why a decision in the development of a project has been made,
but it's also his job to explain why it wasn't.

In the following projects, I mostly worked alone, and sometimes it was a bit hard to introduce new development concepts to my colleagues.

But it's part of my job to let them know that we should use this tool because of this or that.

Anyway, for those who might say: "_Again a Drupal 7 post_", "_Drupal 7 is dead, wake up!_", I would reply that I'm aware of it since a long time ago, so please, bear with me.

The thing is that we are still working with D7 at work... and I have to accomodate.
Nevertheless, I promise to my readers that the next blog post will not be about Drupal 7, nor Drupal 8.

## Technical part

So recently, I've started to check out how was working the custom authentication in NextEuropa.

Basically, the authentication is relying on a [CAS](https://en.wikipedia.org/wiki/Central_Authentication_Service) server that authenticate the user credentials.

Nowadays, CAS authentication is not that widespread on the net, [OpenID](https://en.wikipedia.org/wiki/OpenID) and [oAuth](https://en.wikipedia.org/wiki/OAuth) has taken most of the seats.

Technically, it's not hard to understand how it works, I will try to explain it.

When a user wants to authenticate on NextEuropa, the user is redirected to the CAS server called ECAS, it's a customized version of a CAS server, renammed ECAS.
The redirection URL must contain a "_service url_" parameter. It will be needed to redirect the user to when the authentication is done.

So, when the user arrives on ECAS, he has to provide a valid username and password.

When authenticated, ECAS redirect the user to the "_service url_" sent as parameter, but with a unique specific token in a `GET` parameter: `ticket`.

At this point the user is authenticated on ECAS, but not on the site he comes from.

In order to do that, the site will need to send an internal request(_server side_) to ECAS with the `ticket` received as a `GET` parameter.

This is a one-time token ticket and it can only be used once to authenticate the user.

If the internal request to authenticate the user has been successful, you can grant access to the user, he's authenticated on both sides.

So, basically that's it, it's one of the way to use the CAS protocol. There are other ways, but I won't go further here, maybe in another blog post.

## Development

At the European Commission, when we start to develop something new, we like it to be reliable, maintainable, sustainable and testable.

That's a lot, but with the latest years progress in PHP and all those libraries around, it's fully possible.

Prior doing this, we also like to check on the net if something similar could do the job properly.

Unfortunately, in our case there were no library that could help us doing such a task.

We took the decision to write our own authentication library, that's how **EuLogin** was born.

I started to write EuLogin as a PoC to test if everything was ok.

Unfortunately, I was unable to test the library properly because ECAS, for security reason, can only authenticate specific European Commission websites AND any site on http://127.0.0.1/, all the others are blocked for obvious security reasons.

The challenges around this project are: 

- Find a way to test the library quickly without the need to setup a particular development environment.
- Let my colleagues hook into the development quickly, but just cloning the repository and without creating specific webserver configuration.
- Make it fully "_testable_" on Travis, at each commit.

"_But how to test a library that's relying on an external service ???_"

The idea is the following.

How about including a client app '_Symfony demo client app_' that can be started with the very useful internal web server of PHP.

By default, the url of the app would be `http://127.0.0.1:8000/`, this way I can test the ECAS authentication without updating our own personal dev environments.

I can setup a very basic client application(_or site_) and I can authenticate on ECAS in just one minute.

## Where pCAS is coming from

Days after days, I improved the library, then improved the demo client app, then reiterate that process many times... until...

Until I found out that the every components of library was so abstracted that it could fit for authenticate to any CAS server, not only to ECAS from the European Commission, by just updating the YAML config file.

This is how the EuLogin got renamed in **[pCAS](https://github.com/drupol/pcas)**.

## Emotional lift

Frustrated of not being able to test the library without an Internet connection, I started to think about a way to work on this, without being connected.

Just like I did the client app '_Symfony demo client app_', I did a server app '_Symfony demo server app_'.

The server app has to be started just like the client app.

By doing this, an Internet connection is no more needed to test the library and write proper tests.

Of course, the server has to "_mock_" the behavior of a real CAS server and it was not hard to implement.

## Drupal integration

As NextEuropa is in Drupal 7, I needed to provide a proof of concept that pCAS could be integrated with it.

I wrote a very simple Drupal 7 module... and I was surprised that I had issue.

### Session 

Drupal 7 is relying on the database to store the user session. pCAS is relying on files, the default.

As pCAS's session component can be customized, I wrote a Symfony's session service that uses the Drupal API for handling sessions.

And _voila_!, you can find [drupal7 Session Services](https://github.com/drupol/drupal7_session_services)([Packagist](https://packagist.org/packages/drupol/drupal7_session_services)) and uses the Drupal session in pCAS, set and get session variables and share them with Drupal.

### Logging

Drupal 7 has its own very useful logging system through the watchdog API, but pCAS is using any [PSR-3 logging system](http://www.php-fig.org/psr/psr-3/).

This is how I wrote [drupal7 PSR3 Watchdog](https://github.com/drupol/drupal7_psr3_watchdog)([Packagist](https://packagist.org/packages/drupol/drupal7_psr3_watchdog)).

This small bridge library to use Drupal's watchdog as a logger in any PHP library, using PSR-3 standard.

It also provides an already made logger for [Monolog](https://github.com/Seldaek/monolog), the "_de-facto_" standard library when it comes to logging in PHP.

### HTTP requests

Drupal 7 uses it's own unique function to do HTTP requests, pCAS is relying on [HTTPlug](http://httplug.io/) and uses [PSR-7](http://www.php-fig.org/psr/psr-7/) everywhere.

At work, countless of discussions arises because of HTTPlug and its use. Understanding the basis of abstraction in developments is a key to understand its real value.

In NextEuropa, we're trying "_to eat our own dog food_" and for many other reasons we try to avoid including external libraries, just what we need.

Instead of relying on an external libraries like [Guzzle](https://github.com/guzzle/guzzle), we could use Drupal's internal function for doing requests... unfortunately, it's not using PSR-7 and thus, unusable in pCAS (_and almost anywhere else by the way_).

So, the idea was already in my head... let's build another bridge library that could use the Drupal's internal function for requests and use PSR-7 for its Request and Response messages.

This is how I wrote [drupal7 HTTP Client](https://github.com/drupol/drupal7_http_client)([Packagist](https://packagist.org/packages/drupol/drupal7_http_client)).

When it's installed in Drupal 7 and if you use HTTPlug, then you do not need any external library to do HTTP requests.

## To summarize

By doing all of this, I did something I wanted to do since a long time ago: learn the depths of [Symfony](http://symfony.com/) and see how deep we can go.

I've also learned Symfony Flex and I really enjoy it, it's so clear, fast and clean ... I can't think of any other framework to start new projects now.

"_green-development_", "_eco-programming_"; call it whatever you want, is very important and code re-usability is the key for an overall better code quality.

At work, reusability is a way to raise the average common knowledge across the team and allows us to focus on improving them step by step instead of going all azimut.

It forces us to improve our code and to contribute back to our beloved Open Source community.
