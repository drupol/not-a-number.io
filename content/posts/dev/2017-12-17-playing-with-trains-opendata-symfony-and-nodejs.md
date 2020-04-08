---
date: 2017-12-17
images:
  - /images/Santa_Claus_waiting_for_a_train_IM1203.JPG
image_copyrights: Image by [Annely Salo](https://commons.wikimedia.org/wiki/File:Santa_Claus_waiting_for_a_train_IM1203.JPG).
tags:
  - php
  - symfony
  - opendata
  - nodejs
  - wikidata
title: Playing with trains, Opendata, Symfony and NodeJS
---
Younger, working in Brussels was not an option.

I never had a deep love for that city, never had a deep love of traffic jam... and never had love for public transportation like trains.

Despite the fact that I love driving, I can't bear staying in the car, stucked in the traffic jam, praying for the people in front of you to pass the next gear.

To be honest, I really love cars and especially driving techniques, but I hate so much traffic jam and I love so much my bicycle that I would prefer a World without car at all, and I'm dead serious when I write that.

Anyway, this post is not about personal feelings and as promised in my previous article, it will not be about Drupal at all either.

<!--break-->

## Why

It's been years that I take the train, twice per day, to go to work. From door to door, it takes me two hours, tip top.
On average, four hours per day, lost in transportation.

75% of that time is in the train... it shouldn't be so long, but [the railway line 96](https://en.wikipedia.org/wiki/Belgian_railway_line_96) is subject to many delays.
It's the most problematic line in Belgium.

The operator SNCB and the transporation minister are aware of the issues... But no actions seems to be taken since years.

Simple customers that we are are unable to get our voices heard even after many online petitions.
It looks like people from this part of the Belgium are forgotten and instead of being "_right on track_" (_[to quote the Infrabel moto](https://www.infrabel.be/en)_) are sadly, "_left on track_" (_Infrabel, please note this down for your next moto._).

## What

I usually work in the train, at least, when it's possible.

These last days and once again, my patience was on the verge of vanishing and I needed to do something to show people how bad the train service in Belgium is.

So I started to think how I could provide people a service that could send notifications when there are trains delays.
Of course, this would not solve the root issue, but maybe by showing how bad the service is, they will do something, who knows.

## Where

Before thinking concretely to what I would do, I have to check if trains data are available.

I was aware that SNCB was promoting their data openness since not so long ago... but as usual [they were doing it wrong](https://hello.irail.be/2015/09/22/nmbssncb-announces-data-sharing/), you have to register to get access to these.

[iRail](https://irail.be), a private application created by [Pieter Colpaert](https://twitter.com/pietercolpaert) is using those data and has it's own API.
There is no need to register, everything is open as in "Opendata", and that's how it should be.

I invite to read [the documentation of the iRail API](https://docs.irail.be/) and get yourself an idea with what you can do with those data, [Pieter and it's team](https://github.com/irail/) did an amazing job, I particularly love [the Hyperrail Android application](https://play.google.com/store/apps/details?id=be.hyperrail.android).

## How

I started to play with the API and it's working super fine.
I made an analysis on what are people expecting from these data, how to make the numbers, actually speak!

The goal is to be notified when there is a delay on my train. But my own train might not be someone else's train... so I needed to make a system that could work for everyone.

What we need is a system that can be customized per user.

### First things first.

The iRail API provide information about stations, vehicle, departures. It doesn't provides the delayed trains _per se_.
Fortunately, in the returned data array of a departure, there is an member `delay` holding the delay in seconds.

But what is a delay ? What defines a train delay ? How to detect a train delay ?
Given a time and date, until when should we consider a delay, a delay ? What is the validity lifespan of a delay ?

Zero if the train departure is on time, greater than zero if it's delayed. _Easy peasy lemon squeezy_.

Trains departures are associated to a station, so we need to do things in a particular order:

* 1: Find every stations and iterate on each of them,
* 2: Find every departures of every station and iterate on each of them,
* 3: Filter out trains that are on time.

Then, we need to sort the resulting dataset and do things with them.

After some work, fighting a bit with Symfony 4 (Flex), and polishing the code... I had a nice core that could send delays and alerts as Symfony events.
The core system, the one that detects the delays and send the events is closed source for now, it still needs some time and love before thinking about opensourcing it. 
However, the Twitter and Telegram gateways are available [on Github](https://github.com/SNCBAlerts) since the beginning.

## Gateways

Gateways are plain Symfony bundles and they can be added or removed from the core app within a few seconds.
I created two of them for sending messages to some platforms.

Currently, [two gateways](https://github.com/SNCBAlerts) are working and Open Source. 

More gateways are in the pipe for sure, but I first need to polish the core codebase before extending it further.

### Twitter

[Twitter](https://github.com/SNCBAlerts/sncbdelay_twitter) has been the first gateway I did. I've learned to use the Twitter API through the excellent [Twitter library from Abraham Williams](https://packagist.org/abraham/twitteroauth).

A twitter bot has been created and I encountered the first issue: _find it a name!_

I called it [SNCB Alerts](https://twitter.com/sncbalerts) and after a few minutes it was online, Twitter already decided to shut it down. _Why_ ? I reached the limit rate of the account and they were thinking I was spamming... but I wasn't!

I re-enabled it and updated the delays threshold to 600 seconds (_10 minutes_), so, hopefully Twitter will not be spammed by smaller delays. It's now up since the 6 of December and it posted 10000 tweets, almost no downtime is to be reported.

To be honest, I was a bit frustrated with this solution. I don't like the fact that I had to select only some delays but I had no other choice on this platform.
There are so many of them that they can't be published on Twitter without having a bigger threshold.

### Telegram

[Telegram](https://telegram.org) is an instant messaging application available on mobile phones and has a very nice desktop interface.

Just like many other platforms, it's possible to create bots and its [API](https://core.telegram.org/api) is **very nice** and well documented.

I started to use a [Telegram API](https://packagist.org/packages/longman/telegram-bot) and then, after a while, switched to [irazasyed/telegram-bot-sdk from Syed Irfaq](https://packagist.org/irazasyed/telegram-bot-sdk) which is actually much more advanced and mature.
The first thing I did with the API was to create a public channel and have the bot shouting everything in there.

I quickly noticed that there were so much information that it was impossible to get noticed properly, even using the search feature in Telegram. I had to find something else.
I began to think about a real interactive bot that users could query in order to get customized alerts.

So, I wrote custom commands for the [SNCB Alerts Telegram bot](https://t.me/sncbalerts_bot), and then, made it available to the public.
Users are able to manage their own alerts within the chat interface, and are notified when an alert matches their chosen keywords.

## Deployments

The application is up since the 6th of December and almost no downtime has been reported.

It's very hard to develop new features on it. Indeed, I can't test properly the app because it's relies on external services like Twitter and Telegram and
thus, adding new features might sometimes break the app during a few minutes.

As soon as an update of the app is pushed on the repository, the deployment system behind it rebuild the application from the ground using [composer](https://getcomposer.org).
Once the app is built, and if there were no errors during building, the app is deployed seamlessly, without interruption.

The system behind all of this is [Heroku](http://heroku.com), most of the features I'm using are free.
It's a very good and reliable system, however, I found it a bit expensive if one day I need more resources. We'll see.

## Goodies

Being the developer the application, I'm also an active user of it. I noticed that it would be good to subscribe to notifications related to a particular train line.
Unfortunately, that information is not provided by the train company neither by iRail, we have to find them by ourselves.

After some discussion with [Pieter from iRail](https://twitter.com/pietercolpaert), we decided to extensively use [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page).

<blockquote class="blockquote">
Wikidata is a free and open knowledge base that can be read and edited by both humans and machines.
It acts as central storage for the structured data of its Wikimedia sister projects including Wikipedia, Wikivoyage, Wikisource, and others.
The content of Wikidata is available under a free license, exported using standard formats, and can be interlinked to other open data sets on the linked data web.
</blockquote>

As every Belgium train station are in Wikipedia and thus Wikidata, I started to add line information to these stations.

In a couple of days, [thousands of edits](https://www.wikidata.org/w/index.php?title=Special:Contributions/Drupol&offset=&limit=500&target=Drupol) has been made and the result is amazing.
It is now possible to [query the Wikidata database](https://query.wikidata.org/#SELECT%20DISTINCT%20%3FiRail%20%3FsLabel%20%3Fline%20%3FlineLabel%20WHERE%20%7B%0A%20%20%3Fs%20wdt%3AP31%20wd%3AQ55488.%0A%20%20%20%20%3Fs%20wdt%3AP17%20wd%3AQ31.%0A%20%20%3Fs%20wdt%3AP2888%20%3FiRail.%0A%20%20OPTIONAL%7B%3Fs%20wdt%3AP81%20%3Fline.%20%7D%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22%20.%0A%20%20%7D%0A%7D%20order%20by%20%3FsLabel%20%3FlineLabel%0A) and get the list of stations linked to iRail with line information.

To match a train from station X to station Y to a line, I'm using the following procedure:

* 1: Find train lines associated to station X,
* 2: Find train lines associated to station Y,
* 3: Find the lines in common.

Even if the iRail team tweeted about it, thanking me for what I've done, the work is not over yet. There are less or more 600 stations in Belgium and we still need to link some data to have a full coverage.

## What's next

I first would like to continue my work on Wikidata, then working on improving overall application performance, reducing the memory footprint and invest some time in NodeJS.

Indeed, I published [my first package on npmjs.com](https://www.npmjs.com/package/irail-api). It's a very basic [NodeJS](https://nodejs.org) module made to query the [iRail API](http://docs.irail.be).
It's using [Javascript promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), something completely new to me, so new, that I'm still unable to fully grasp the advantages of it yet, I guess it's just a matter of time before I'm starting to use them everywhere.

A couple of surprises are on their way using that technology, more info in the next blog post!
