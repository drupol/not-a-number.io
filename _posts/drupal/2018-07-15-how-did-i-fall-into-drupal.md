---
layout: post
category : random
title: "How did I fall into Drupal"
subtitle: How it all began
tags : [drupal, personal, career]
schema: BlogPosting
image:
image_copyrights: ''
redirect_from:
  - /2018/how-i-fall-into-drupal
---

{% include JB/setup %}

I started to use Drupal ~13 years ago. It was the end of life of version 4.5 at the time.

As I love photography, I first tried to use Drupal to publish my photos. I remember at the time, the struggle to integrate [Gallery2](http://galleryproject.org/) and Drupal… aaah time flies.

As always, I was motivated to learn it. The community was huge, active and responsive… and on the top of that, it’s a product out of my beloved country.
To be honest, I gave up many times by lack of time, but also because my PHP knowledge was not really high. I felt that there was a great potential but I was frustrated to not be able to handle it properly.

<!--break-->

Drupal 5 came out, then 6 and I started to do small websites for friends (_we all started like this, isn't it ?_) and then for small customers here and there, etc etc.

Fosdem 2009, for the first time I stumble upon Dries and I even have a picture with him, I asked him a couple of questions, I was so happy to meet him in person!

From that time I started to attend most of the Drupal events in my area… then in Europe… then in the USA, I went from Munich to Portland, met amazing people and have amazing souvenirs.

Then my career took a wrong turn and I had to give up Drupal before starting again just before the release of the long-awaited Drupal 7.
During 2 years, I did some Drupal sites for customers in my area and also started to customize the sites with custom modules.

That wrong turn turns out to be actually one of the best thing that happened in my career.
I had the chance to be recruited by a consultancy company and I started to do Drupal not only for my pleasure but for work as well.

During this amazing first Drupal job, I had the chance to meet my first mentor and now friend [Pierre Buyle](https://www.drupal.org/u/pbuyle), a real living encyclopedia. He helped me to complete my lack of Drupal knowledge. From there, I started to write modules on my own. First for public companies, then as open-sourced contrib module.
At the moment I started to write modules, I found it so enjoyable that I completely gave up site-building, even nowadays, I don't remember when is the last I did some site-building.

10 years later, I wrote ~30 custom and open-sourced modules and I’m still enjoying my work, my colleagues and all the good things that working with Drupal can bring. I gave conferences [in Paris](https://www.dailymotion.com/video/x11k3wr), London, Portland, Brussels...

I think working in such a big community and project is a motivation booster and opens a nice new career perspective for a developer. 

However, those who know me personally are probably aware that I had to stop travelling these last years for personal reasons.
This is why I've been a bit "out-of-sync" with Drupal 8 and I still need to catch up many things. So many things have changed... and I accumulated so many technical debts!

So, Drupal 8 came out and I still need to catch up the ongoing train. I succeeded to convert some of my old modules to it and so far so good, there is nothing to say, I like it very much.

I'm now working as a consultant for the European Commission, I’m mostly working on [OpenEuropa](https://github.com/openeuropa/openeuropa), which is the new version of [NextEuropa](https://github.com/ec-europa/platform-dev), but based on Drupal 8.

One year ago, before OpenEuropa even existed, I’ve been given the task to write a new theme that is going to be the base for all current and future Drupal 7 sites at European Commission.
I was not so keen at first but I knew that the theme layer in Drupal 7 and 8 (_yes, the theme layer in Drupal 8 needs some changes!_) has room for improvements.

So, I wrote [Atomium]({% post_url 2017-07-10-a-word-about-atomium %}) and [Registry on steroids]({% post_url 2018-07-10-registry-on-steroids %}) with the help of my colleagues and the community. I wrote also [Language Selection Page](https://drupal.org/project/language_selection_page) for Drupal 7 and Drupal 8, and [Administration Language Negotiation](https://drupal.org/project/administration_language_negotiation) (as a POC first), now both of them are used on [the First Minister site](https://premier.be), on [the Belgian Monarchy site](https://www.monarchie.be/) and now for OpenEuropa at European Commission.

Besides Drupal and as you can probably see on my blog, I like to learn things related to Sciences and sometimes write PHP packages that helps me understand the theory, like [PHPermutations](https://packagist.org/packages/drupol/phpermutations) and [PHPartition](https://packagist.org/packages/drupol/phpartition).

I also like to learn new frameworks, recently I’ve learned Symfony 4 and made an online application: [SNCBAlerts](https://twitter.com/sncbalerts) (_a twitter account and a Telegram bot_) this funny application is only hosted on Github and automatically deployed by Heroku as soon as I commit/push something.

In the context of work, I wrote [pCAS](https://github.com/openeuropa/pcas) for authenticating users against a CAS server. It can be used by Drupal 7, Drupal 8 and some users are using it internally with their software in Laravel.

I also like to push the boundaries of Drupal 7 as far as possible. I wrote packages that are used everyday by our continuous integration workflow. I explain those in details in this [blogpost]({% post_url 2017-11-10-reaching-and-overpassing-the-Drupal-limits %}).

I also like to experiment and push the boundaries of my own knowledge in PHP by doing packages like [Anonymize](https://packagist.org/packages/drupol/anonymize) or [DynamicObjects](https://packagist.org/packages/drupol/dynamicobjects). I think those libraries are not used by anyone but they helped me to discover and understand a huge amount of new things.

# Why I applied for the Drupal 7 maintainership? #

As you may know now, I [applied](https://www.drupal.org/project/drupal/issues/2982027) for being a maintainer of Drupal 7.

Drupal 7 is still there, even if the trends is decreasing and I’m a bit tired of the lack of responsiveness in the queue and statements like “_Drupal 7 is dead, use Drupal 8_”.

Even this statement is technically true, in the real life, there are still a lot of people and companies that are using it.

So, my goal is to revive the forgotten Drupal 7 and to be responsive and an active maintainer for it.

I want to take care of it for the time being and to provide support for it.

I'll be available on the usual Slack channels or on IRC under the name of @drupol, feel free to have a chat, I speak English, French, Dutch and Italian.

My priorities during with this new role are:

* Review and test patches that are waiting, with a priority to the patches that are backported from Drupal 8,
* Backport new patches,
* Complete and update the Drupal 7 inline Documentation (PHPDoc, etc etc),
* Update the code style.

I'd like to introduce a couple of new things as well:

* Updating PHP function declarations by updating parameters types,
* Improve and optimize the theming layer,
* [Make Drupal pass PHPCS, update the coding standard](https://www.drupal.org/project/drupal/issues/2985991),
* _more to come here very soon_...