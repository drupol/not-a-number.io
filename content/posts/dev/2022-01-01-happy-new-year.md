---
date: 2022-01-01
images:
  - /images/bxl-landscape.jpg
image_copyrights: A view of Brussels
tags:
  - php
  - open-source
  - nixos
title: Happy new year!
---

2022 has just started and I'll take the opportunity to summarize what happened in 2021.

I will use different binoculars or point of view, here they are:

* **Open-source**: Stuff related to open-source contributions
* **Work**: Stuff related to work
* **Random**: Stuff related to Nixos

This post might be a bit longer than usual, fear not and hang on tight!

<!--break-->

## Open-source

### marcosh/lamphpda

In my previous post, I briefly wrote about [Functional programming and PHP 8][0].
The delay previous post and this one has been very long most probably because I
continued learning functional programming by myself.

One of my personal happiest achievement in 2021 was to understand the
fundamentals and basics of [monads][88] (*or hopefully I believe I understand them*).

Understanding monads is a goal that I had in mind since quite a long time,
without having the time to really understand them.

There's a lot of literature and videos about monads on the Internet,
and now that I understand them a bit better, I can safely say that there is
actually not any single tutorial that I would recommend to anyone willing to
learn them, without actually scaring them.

Do you remember the infamous definition: "*A monad is just a monoid in the category of endofunctors*" ?

Me neither!

And as if that wasn't enough yet, once you figure them out,
you lose the ability to explain them! It seems that [Douglas Crockford][2]
was right!

Anyway, if you really dare to understand them a bit better, I found
[this youtube video][4] from [Brian Beckman][6] very nice.

Obviously, watching tutorials and videos helps but the best way to
understand them is to dive into a project using monads... or contribute
to a projects implementing monads with your favorite programming
language. And that's precisely what I did!

I started looking for a PHP package implementing monads, there are
many. After analyzing them, I decided to go with [marcosh/lamphpda][7]
from [Marco Perone][8].

I chose this package because Marco is involved into functional programming (FP),
PHP and has a strong background in mathematics. Besides his great teaching skills
and patience, he understand not only the code, but most of the mathematical
background needed for implementing monads.
He's also the organiser of [Functional Fest][10],
a group of FP enthusiasts hosting regular conferences with awesome
guests and speakers.

I started by creating [a couple of pull-requests][12] and using the package
in my own projects.

I used monads for handling Doctrine repository queries in Symfony
and in the end, created an open-source package that everyone can use.
You can find everything in [loophp/repository-monadic-helper][14].

The next task that I'm planning to do to keep on learning, is to refactor
[loophp/tin][48] using [marcosh/lamphpda-validation][50], a validation package
based on [marcosh/lamphpda][7].

### loophp/collection

My other project [loophp/collection][16] is still being actively maintained,
and I was quite surprised when I saw that the project was about to reach the
five hundred stars milestone, just before New Year's Eve !

{{< tweet user="drupol" id="1476149761573113856" >}}

And we did it, just in time !

{{< tweet user="drupol" id="1476270775128756225" >}}

The version 6 is currently stable and there is already a couple of things
going on for the next major release, the version 7.
Besides the usual new features, optimizations and bugfixes, the most important
change for me is that I got rid of PHPSpec and completely replaced it with
[PHPUnit][18], see the monster [PR][20].

I will not compare the frameworks here, I'll leave it to the readers of this
blog. From now on, I will now use PHPUnit by default in all my projects.

Switching to PHPUnit allowed me to completely refactor some tests. Testing
is now faster and clearer.
However in order to do that, I had to make sure that it was possible to compare
two types of iterables.

However, there is currently no PHPUnit assertions to assert that two iterables
are *the same*. This is why [loophp/phpunit-iterable-assertions][22] was written.
This is a PHPUnit plugin which provides new assertions to assert that two
iterables are *the same*.

Asserting that two iterables are the same means that for each item in both
iterables, key and value are the same.
Also, the iterables should have the same amount of items.

Creating such a PHPUnit plugin requires the use of a very special iterator, a [`ClosureIterator`][90].
The `ClosureIterator` iterator is also the heart of [loophp/collection][16].
I hate duplicated classes and code, so I created a very simple
package [loophp/iterators][24] containing the "*missing*" PHP iterator and a
couple of others. That package is now a dependency of [loophp/collection][16]
and [loophp/phpunit-iterable-assertions][22], no more duplicated code!

While writing that package, I found something very cool that I want to share.

Every PHP developers are (*or should be?*) aware that SPL Generators are not "*rewindable*".
Once they are consumed, it's not possible to loop over them once again.
And sometimes it would be very useful if we could!

Think about making database queries, in order to go easy on the memory and
instead of *shoving* the whole resultset containing millions of record
in an array, you use an Generator, yielding result by result upon user request,
through a loop. Sadly, you can only iterate it once. If you want to iterate
a second time, you'll have to make a new query. Which is very bad.

One way to fix that would be to cache results in a local cache and use it.
This means the caching implementation must be done in "*userland*".
Using custom code for that means that it will most probably have an impact
on performance. Imagine it could be done in PHP, **natively**!

Enter [`CachingIterator`][26], and *underrated* native PHP iterator.

Thanks to this core iterator, I built a very fast and stateless
[`IteratorAggregate`][28] that uses an existing iterator, of any kind and
do the caching.

In order to compare the performance of that very special iterator,
I did benchmarks with [phpbench/phpbench][30] against [azjezz/psl][32],
a *state-of-the-art* PHP package aiming to ease PHP developers against
all the kind of inconsistencies in PHP.
It provides many good things and is actively maintained.

And the benchmarks are amazing, it's blazing fast!

{{< figure src="/images/Screenshot_20220102_234445.png" caption="Comparing caching iterators" link="/images/Screenshot_20220102_234445.png" >}}

* [`SimpleCachingIteratorAggregate`][40]: Iterator keys **are** ignored
* [`CachingIteratorAggregate`][44]: Iterator keys **are not** ignored
* [azjezz/psl iterator implementation][34]: Iterator keys **are not** ignored

Of course, results have to be mitigated because the
[azjezz/psl iterator implementation][34] implements a *userland*
stateful iterator implementing [`Countable`][36] and [`SeekableIterator`][38]
interfaces and thus, does a bit more than [my current implementation][40]
which is based on [`Generator`][42]... which is also stateful, but directly
handled by PHP and not in *userland*.

I guess you know that, unlike PHP arrays, an iterator can have any kind of
type for keys. Which means that you can use not only `int` or `string` but really
any kind of type like `bool`, `array` or even other `object`.

Knowing that, the [`SimpleCachingIteratorAggregate`][40] ignores the keys while
the [`CachingIteratorAggregate`][44] does not. And the numbers are talking.
The later implementation is more than twice slower than the first one,
but still almost twice faster than [azjezz/psl][32].

When I discovered this, I contacted [Saif Eddin Gmati][46] the
[azjezz/psl][32]'s creator, and since then, he improved his own version
making it from thirty times to twice slower, a tremendous improvement.
He also gave me some tips for my own iterators, thanks to him !!!

### WOPI

Recently, I've been asked to build a Symfony bundle to allows users to
edit office documents online, such as having a full featured document editor
embedded in a backend.

Fortunately for me, it turns out that there is some kind of standard
protocol for that: [WOPI][52] by... Microsoft! (*Never though I'd write this word on my blog*).

After a long period of studying the protocol, having contact with
the [Collabora Online][62] developers, and tests, a couple of packages has been
released:

* [champs-libres/wopi-lib][54]: A standard and framework agnostic PHP library to facilitate the implementation of the WOPI protocol.
* [champs-libres/wopi-bundle][56]: A bundle providing routes and glue code between Symfony and a WOPI connector.

As those package are the first in the PHP world, I was invited to talk about
these new things during [the COOL Days][64]. It was a very nice experience.

### Miscellaneous

*The other day* while working with Symfony, I noticed that the Symfony
container was not creating aliases for services having interface(s).

That is indeed the default behavior and at first sight, it seems logic.
We don't want to have the container full of aliases that we won't never use.
However, I like the idea of having aliases of my services so I could inject
them based on the parameter name, everywhere and without effort.

I was so curious that I opened [a proposal on Symfony][58] and created a proof
of concept bundle [loophp/service-alias-autoregister-bundle][60]. The thread
has been very interesting and it opened my eyes.

I doubt that this bundle will ever be used now, but I'll leave it on
Github, maybe it might give ideas to some other people later.

On another subject, I haven't participated to [Advent Of Code][94] because
of some many things going on at the same time. However, I followed it
actively. I believe that even without participating it is a very good exercise
to read the challenges and the different solutions. For my part, I followed
[Larry Garfield][96] and [Bartosz Milewski][98].
Larry was using PHP with a complete functional approach while Bartosz used
Haskell. It was super interesting to see the approach of both developers
and their solutions to each challenge. Find their Advent Of Code repository
[here][100] and [here][102] respectively. Hats off!

## Work

Life's at work has been also affected and working from home is the
default rule for now on.

Despite that, we made quite a bunch of nice things, especially this one:

{{< tweet user="EU_DIGIT" id="1459147953461940226" >}}

This session has been given at work and published on Github in open-source at
[ecphp/session--composition-and-inheritance][66]. Anyone can now contribute to
the content of the presentation.

There will be more and more initiative like this one in the future thanks to

{{< tweet user="EU_DIGIT" id="1468550654792814593" >}}

The future at European Commission is bright and I'm looking forward to it!

## Random

### This blog

In October, I switched from Disqus to [Giscus][92], a comments system powered by
GitHub Discussions. Let visitors leave comments and reactions on your website via
Github.

I love the Github simplicity and as soon as I saw this amazing project, I
switched to it. It's lighter and faster. Sad things, I lost all the existing
comments made with the previous comments system.

### My laptop

It's been now a couple of month that I'm using [Nixos][68] as a daily driver.

After being more than 10 years running [Gentoo][70], I decided to give a try to
something else.

The main reason is that my laptop, a "*good old*" Lenovo x260, was extremely slow
on Gentoo. I couldn't find why but I think it was related to the default Gentoo
kernel which is not really tailored for desktop but merely for servers... and to
be completely honest, after a couple of bad experiences while recompiling
the kernel, I was a bit fed up.

So, I was about to order a new Lenovo X13 Gen 2 when I tried Nixos... and I'm
still using my "*good old*" laptop today. And even if I change my mind and
want to buy the Lenovo X13 gen 2... it's no more available in Belgium.

It turns out that I'm definitely in love with Nixos. It's clean, clear and damn fast.

Learning Nixos and the Nix language is not an easy thing because the documentation
is sadly not the best part of the *distro*, but once you get the hang of it,
it's amazing.

Everything is done on Github, in **one** single repository: [NixOS/nixpkgs][86].

I started to hack my first package "Symfony CLI" for Nixos and I successfully, not
without pain, submitted [my first Nixos PR][72]. And by the way, at the time the
Symfony CLI command line tool was closed source and now [it has been open-sourced][74]!

I also built a tool that I'm now using by default everyday: [loophp/nix-shell][76].
It provides a development environment for PHP, with all the required tools.
You can choose with which version of PHP you want to work with from PHP 5.6 to 8.1,
and a few seconds later, you're ready to hack!

Since Nixos and these tools are built with reproductibility in mind, the
"*flake.lock file*" have to be updated from time to time.
I created a project that allows you to let [Dependabot][78], a Github bot, update
your project automatically through pull-requests.
That project is used in all my projects having a [flake file][80], and are updated
automatically, find it here: [loophp/flake-lock-update-workflow][82].

[Flakes][80] is the big upcoming feature for Nixos, it's not fully stable yet, but
it's pretty usable everyday.
Just like a `composer.lock` file in a PHP application, flakes create a `flake.lock`
file in a project. It allows users to be aligned with the software versions and
make sure that anyone can reproduce the same environment anywhere.

In that state of mind, I published my laptop configuration at [drupol/nixos-x260][84].
If for some reason my laptop dies, I can spawn a new one
with the same configuration in less than one hour. Of course, personal files would
not be restored, but hopefully I do have backups somewhere else!

## 2020 too

Dear readers,

I wish you all a super nice and creative year, full of happiness, joy and... coding!

[0]: {{< ref "2021-07-13-functional-programming-and-php-8" >}}
[2]: https://www.youtube.com/watch?v=dkZFtimgAcM
[4]: https://www.youtube.com/watch?v=ZhuHCtR3xq8
[6]: https://twitter.com/lorentzframe
[7]: https://github.com/marcosh/lamphpda
[8]: https://marcosh.github.io/
[10]: https://www.functionalfest.it/
[12]: https://github.com/marcosh/lamphpda/pulls?q=is%3Apr+author%3Adrupol+
[14]: https://github.com/loophp/repository-monadic-helper
[16]: https://github.com/loophp/collection
[18]: https://phpunit.de/
[20]: https://github.com/loophp/collection/pull/227
[22]: https://github.com/loophp/phpunit-iterable-assertions
[24]: https://github.com/loophp/iterators
[26]: https://www.php.net/cachingiterator
[28]: https://www.php.net/iteratoraggregate
[30]: https://github.com/phpbench/phpbench
[32]: https://github.com/azjezz/psl
[34]: https://github.com/azjezz/psl/blob/2.0.x/src/Psl/Iter/Iterator.php
[36]: https://www.php.net/seekableiterator
[38]: https://www.php.net/countable
[40]: https://github.com/loophp/iterators/blob/main/src/SimpleCachingIteratorAggregate.php
[42]: https://www.php.net/generator
[44]: https://github.com/loophp/iterators/blob/main/src/CachingIteratorAggregate.php
[46]: https://github.com/azjezz
[48]: https://github.com/loophp/tin
[50]: https://github.com/marcosh/lamphpda-validation
[52]: https://docs.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/
[54]: https://packagist.org/packages/champs-libres/wopi-lib
[56]: https://packagist.org/packages/champs-libres/wopi-bundle
[58]: https://github.com/symfony/symfony/issues/44184
[60]: https://github.com/loophp/service-alias-autoregister-bundle
[62]: https://www.collaboraoffice.com/
[64]: https://www.collaboraoffice.com/community-news/developers-day-september-30th/
[66]: https://github.com/ecphp/session--composition-and-inheritance/
[68]: https://nixos.org/
[70]: https://gentoo.org/
[72]: https://github.com/NixOS/nixpkgs/pull/126356
[74]: https://symfony.com/blog/announcing-the-open-sourcing-of-the-symfony-cli
[76]: https://github.com/loophp/nix-shell/
[78]: https://github.com/dependabot
[80]: https://nixos.wiki/wiki/Flakes
[82]: https://github.com/loophp/flake-lock-update-workflow
[84]: https://github.com/drupol/nixos-x260
[86]: https://github.com/NixOS/nixpkgs
[88]: https://en.wikipedia.org/wiki/Monad_(functional_programming)
[90]: https://github.com/loophp/iterators/blob/main/src/ClosureIterator.php
[92]: https://giscus.app/
[94]: https://adventofcode.com/2021
[96]: https://peakd.com/hive-168588/@crell/aoc2021-review
[98]: https://twitter.com/BartoszMilewski
[100]: https://github.com/Crell/aoc2021/
[102]: https://github.com/BartoszMilewski/AoC2021/
