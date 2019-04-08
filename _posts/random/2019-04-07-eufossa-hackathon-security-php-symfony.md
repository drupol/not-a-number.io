---
layout: post
category : random
title: "First EU-FOSSA Hackathon about security, PHP, Symfony and API Platform"
tags : [php, symfony, eufossa, api-platform, security, hackathons, eu]
image: /assets/images/posts/20190407_153342.jpg
image_copyrights: 'Image by <a href="https://twitter.com/michaelcullumuk/status/1114890379013316609/photo/1">Michael Cullum</a>'
---
{% include JB/setup %}

During the first weekend of April 2019, a [hackathon](https://en.wikipedia.org/wiki/Hackathon) was held in [Silverquare Triomphe venue](https://silversquare.eu/location/triomphe/) in Brussels.

The organizer, [the European Commission](https://ec.europa.eu/), and a community of carefully selected developers participated to a hackathon in an amazing place.

The goal of having such an amount of skills contained in one single place, is to participate to the [EU-FOSSA hackathon](https://eufossahackathon.bemyapp.com/) that
[the European Commission](https://ec.europa.eu/) organised and funded.

<!--break-->

[![Nicolas Grekas, Fabien Potencier and Mario Campolargo](/assets/images/posts/IMG_20190407_164259.jpg){:width="800" class="img-thumbnail"}](/assets/images/posts/IMG_20190407_164259.jpg)

## The event

[EU-FOSSA](https://ec.europa.eu/info/news/eu-fossa-bug-bounties-full-force-2019-apr-05_en) stands for EU-Free and Open Source Software Auditing project, a project which is managed by the European Commission's Directorate General for Informatics, the [DIGIT](https://ec.europa.eu/info/departments/informatics_en).

<blockquote class="blockquote text-justify">
The EU-FOSSA project is organising in parallel a bug bounty for the PHP Symfony software.
Hackers can get rewards of up to EUR 15.000 for critical bugs they find.
There is even a 20% bonus added to the prize if the hackers provide a fix for the bug they report.
</blockquote>

While the security was the focus during this weekend, [API Platform](https://api-platform.com/) and [Symfony framework](https://symfony.com/) was the main topic of this first successful hackathon.

The European Commission pulled out all the stops for this event, every participant received a very nice welcome gift composed of (_take a breath_):
* A Raspberry Pi version 3B,
* A case for it (_the best one I've seen so far_)
* A very nice PHP elephant - thanks [Nicolas Grekas](https://github.com/nicolas-grekas) !
* 2 t-shirts
* A few badges and stickers for swag

[![Welcome pack, photos by Robert Czarny](/assets/images/posts/D3dRZmmWwAAu3OI.jpg){:width="800" class="img-thumbnail"}](/assets/images/posts/D3dRZmmWwAAu3OI.jpg)

## The participants

During two days, participants coming mostly from Europe, but surprisingly also from Switzerland, Morocco, Russia and even US and Cuba, were having a complete programme with meetings, goals and tasks.

Those 50 selected developers were personally invited a month before the event and most of them were PHP heads, driving the PHP world and shaking the trends since a couple of years.

I will take the opportunity to personally thanks again [Jean-François Hovinne](https://linkedin.com/in/jfhovinne) for inviting me to the event.
A big up to the all the other organizers, it was perfect.

I was and I am glad to be part of this.

Needless to say that I was extremely happy to have a talk with people that I knew for years, as a Github or Slack pseudonyms, or even through `composer install` command logs!

[![Group photo, by Michael Cullum](/assets/images/posts/20190407_153342.jpg){:width="800" class="img-thumbnail"}](/assets/images/posts/20190407_153342.jpg)

## The goals

Basically, the task was to browse the [Symfony's issue queue](https://github.com/symfony/symfony/issues), pickup an issue, then ensure that the issue gets fixed and closed.
Often, those issues are linked to a pull request, so knowing the Symfony framework and obviously PHP was a must during these two days.

On my side, I worked on 4 issues. I closed 1 issue and submitted one PR.
I started a second one but I wasn't able to reproduce the reported issue, so the issue was closed.
I started a third one but I couldn't reproduce what was reported, then the original reporter replied and we closed the issue.
The last one was the same.

Each issue being worked during the hackathon was tagged with the tag: "&#11088; EUFOSSA Hackathon", [have a look at how much issue were taken care of](https://github.com/symfony/symfony/issues?q=label%3A"⭐%EF%B8%8F+EUFOSSA+Hackathon"&utf8=✓).

The [first issue I worked on](https://github.com/symfony/symfony/pull/30906) was quite controversial because apparently it came back quite a few times and nobody never agreed on how to fix it.
But after some back and forth discussions with [Hamza Amrouche](https://github.com/Simperfit), [Nicolas Grekas](https://github.com/nicolas-grekas), [Fabien Potencier](https://github.com/fabpot) and [Grégoire Pineau](https://github.com/lyrixx), we finally agreed on something.

Then, Nicolas G. and Fabien P. made the review and the PR was merged, in less than an hour.

To be honest, I rarely seen such a reactivity in Open Source, I like it very much.

## The venue

[Silversquare Triomphe](https://silversquare.eu/location/triomphe/) is [situated near the new Chirec hospital, near the ULB, and at 900 meters away from the Etterbeek station](https://www.openstreetmap.org/relation/3226514).

It's the old Levis (clothes) building, a huge building where all the floors were completely "refactored" to become a co-working place.

The place has been designed by [Lionel Jadot](http://www.lioneljadot.com/), a belgian interior designer.

I was feeling quite at home it the building, it was warm, cosy and welcoming.

Despite the fact that the floor was pretty busy and what I particularly liked is the fact that it was very quiet, conducive for working.
Sound isolation panels were everywhere, properly integrated in the decoration, completely part of it.

As I was with my colleagues: [Vitor Da Costa](https://github.com/voidtek), [Diogo Vargas](https://github.com/dxvargas), [Jean-François Hovinne](https://github.com/jfhovinne) and last but not least, my wingman [Robert Czarny](https://github.com/netlooker), we started to work in a booth, surrounded by cork wood barks.

[![Perfectly balanced and focus as it should be](/assets/images/posts/D3eW-VnX4AERXM8.jpg){:width="800" class="img-thumbnail"}](/assets/images/posts/D3eW-VnX4AERXM8.jpg)


Then some of us moved on the sofa placed on the stairs. Sounds weird ? Check [the photos album](https://photos.app.goo.gl/8e7cWwHnurVhWJWe8) :-)

We couldn't find the time to feel hungry and didn't feel the need to go out for anything, we had very good meals and drinks, it was awesome.

[![Yummy!](/assets/images/posts/IMG_20190406_123113.jpg){:width="800" class="img-thumbnail"}](/assets/images/posts/IMG_20190406_123113.jpg)

## The numbers

On Sunday late afternoon, we were invited to a meeting, the last one, for the closing remarks.

In less than 48 hours, around **80 issues** were closed and around **80 PRs were merged**.

In less than 48 hours, we achieved around **2 months of work**. Can you imagine?

[![Symfony's hackathon insight](/assets/images/posts/symfony-3-days-insight.png){:width="800" class="img-thumbnail"}](/assets/images/posts/symfony-3-days-insight.png)

Working on something through Github, emails or even chat is great, but hackathon is definitely more efficient.

Despite the fact that it requires a lot of energy, every single person that was there was quite pleased, a lot of smiles, a lot of good energy and vibes in the whole building.

## The outcome

This is the first hackathon since quite a long time, I was usually doing hackathons during Drupalcon.

This first hackathon will be remembered as my first entry in the Symfony world where my first PR was merged, hopefully not the last.

Then, I had the chance to talk with Fabien in my car, while I was driving back to my home, as I was passing by the station, I gave him a lift.

I asked him a couple of questions regarding the new [Symfony's HttpClient](https://github.com/symfony/http-client) and the adoption of PSRs. It was quite an interesting discussion.

## Monday morning

I came to work with a smile on my face, exhausted but my motivation batteries charged to the maximum, I can't wait to work with this amazing framework again and with this very nice community.

[![BFF](/assets/images/posts/IMG_20190407_165411.jpg){:width="800" class="img-thumbnail"}](/assets/images/posts/IMG_20190407_165411.jpg)

Thanks and see you probably to the next during [the 4 and 5 of May](https://eufossahackathon.bemyapp.com/).

## Useful links
* [Matthias Pigulla's blog post](https://www.webfactory.de/blog/symfony-eu-fossa-hackathon-brussels-2019)
* [Robert Czarny and Jean Francois Hovinne's blog post](https://eufossa.github.io/symfony-hackathon-2019/)
* [My photos album](https://photos.app.goo.gl/8e7cWwHnurVhWJWe8)
* [Twitter #FOSSHackathons hashtag](https://twitter.com/search?q=%23FOSSHackathons)
* [Maxime Veber's (@Nek-) photos album](https://photos.app.goo.gl/RBphJV3Jf5AwCMSq6)