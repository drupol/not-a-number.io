---
layout: post
category : dev
title: "PHP, composition and inheritance"
tags : [php, data structure, inheritance, final]
image: /assets/images/posts/IMG_20190217_111322-01.jpeg
image_copyrights: 'Image from Pol Dellaiera'
---
{% include JB/setup %}

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

```php
final class Foo {}
```

If I want to use it in my own class, as I cannot extend it, the only way to use it is to inject it in the constructor.

```php
final class Bar {
    public function __construct(Foo $foo);
}
```

Then, I can chose to expose or not some of it's methods, a bit like [the proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern).

On the other hand, using this construction method could be a way to fill the gap on how to have a class _extending_
multiple objects.

In my article about [How to use PHP Traits]({% post_url 2018-10-30-how-to-use-the-php-traits %}) I wrote a bit about it
the fact that it is not possible to inherit from multiple classes at the same time... *using inheritance*.

When you have a good composition mechanism, this is fully possible.

Let's say we have two classes:

```php
class Foo {
    public function izumi();
}
```

and

```php
class Bar {
    public function nakano();
}
```

If you want to create a new class that potentially could use methods from `Foo` and `Bar`:

First, create an interface for each parent classes, this step is optional but greatly encouraged.

```php
class Foo implements FooInterface {}
```

and

```php
class Bar implements BarInterface {}
```

Then, create your custom class:

```php
class FooBar implements FooInterface, BarInterface {

  public function __construct(FooInterface $foo, BarInterface $bar) {}
  
  public function izumi() {
    return $this->foo->izumi();
  }

  public function nakano() {
    return $this->bar->nakano();
  }
}
```

Then, that's it ! You'll be able to use methods from objects `Foo` and `Bar` in your own custom class, and expose some
of them if needed.

That said, inheritance is not something to throw away.

Inheritance is something to use, but keep in mind that if you want an ultimate flexibility, composing your classes
with dependency injection mechanism is the key.

You might end-up writing more code but in the end, you'll have a better control on your classes and what to expose or
not to the public.
