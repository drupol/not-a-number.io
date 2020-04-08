---
date: 2019-02-21
images:
  - /images/IMG_20190217_111322-01.jpeg
image_copyrights: Image from Pol Dellaiera
tags:
  - php
  - data structure
  - inheritance
  - final
title: PHP, composition and inheritance
---
I've been contributing to a couple of trending php libraries recently and during the analysis and the making of the patches,
noticed that many libraries were using PHP not in the way I was used to.

Many of those libraries are having '`final`' classes.

* Why using `final` classes everywhere, what is the advantage?
* As I'm not using final classes in my own projects, am I wrong since the beginning?

This article will try to bring an explanation to this.

<!--break-->

Just like [Marco Pivetta (@ocramius)](https://ocramius.github.io/blog/when-to-declare-classes-final/) or [Tomas Votruba](https://www.tomasvotruba.cz/blog/2019/01/24/how-to-kill-parents/) wrote on their respective blogs,
this article will basically explain the use of the `final` keywords.

Libraries like [PHP Infection](https://github.com/infection/infection), [PHPSpec](https://github.com/phpspec/phpspec), [PHP-CS-Fixer](https://github.com/friendsofphp/php-cs-fixer) are using [final classes](http://php.net/manual/en/language.oop5.final.php) almost everywhere.

When you use the word `final` for a class, it means that your class will not be able to extend another one.

That means that you forbid anyone to create a class that extend your class.

The goal of creating classes is to use the amazing inheritance mechanism, why would we forbid that ?!
At first, that sounds stupid, but in the end, it's not that bad.

By doing so, you enforce users to use a proper dependency injection mechanism if they really need to use the parent class.

Since a couple of months, I'm starting use more and more [`composition` over `inheritance`](https://en.wikipedia.org/wiki/Composition_over_inheritance).

Composition is in the end much more flexible than inheritance and dependency injection is a valid way to compose a class.

However, there is a simple solution if you really need to extends a final class.

As you cannot extend a final class, the only way is to inject the final class as argument in the constructor of your class.

{{< gist drupol d14338d776503d38c432b4b757a59326 >}}

If I want to use it in my own class, as I cannot extend it, the only way to use it is to inject it in the constructor.

{{< gist drupol 5955f5f606504f8dcec415d6bdced4b1 >}}

Then, I can chose to expose or not some of it's methods, a bit like [the proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern).

On the other hand, using this construction method could be a way to fill the gap on how to have a class _extending_
multiple objects.

In my article about [How to use PHP Traits]({{< ref "2018-10-30-how-to-use-the-php-traits" >}}) I wrote a bit about it
the fact that it is not possible to inherit from multiple classes at the same time... *using inheritance*.

When you have a good composition mechanism, this is fully possible.

Let's say we have two classes:

{{< gist drupol c3fd71977cc5c6cd1bf23270ba907fae >}}

and

{{< gist drupol fe03e45da90a9ea94defa350655716c9 >}}

If you want to create a new class that potentially could use methods from `Foo` and `Bar`:

First, create an interface for each parent classes, this step is optional but greatly encouraged.

{{< gist drupol 125dde22e15c7b2a24ed5160a1bb2ea6 >}}

and

{{< gist drupol ddd03836a344aab0599f39620fa568fe >}}

Then, create your custom class:

{{< gist drupol 118b4f6d6bb2c1dde2ca3cebd99bb0a8 >}}

Then, that's it ! You'll be able to use methods from objects `Foo` and `Bar` in your own custom class, and expose some
of them if needed.

That said, inheritance is not something to throw away.

Inheritance is something to use, but keep in mind that if you want an ultimate flexibility, composing your classes
with dependency injection mechanism is the key.

You might end-up writing more code but in the end, you'll have a better control on your classes and what to expose or
not to the public.
