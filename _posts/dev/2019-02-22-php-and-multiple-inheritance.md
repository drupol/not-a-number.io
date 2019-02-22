---
layout: post
category : dev
title: "PHP and multiple inheritance"
tags : [php, data structure, inheritance, final]
image: /assets/images/posts/IMG_20190217_111322-01.jpeg
image_copyrights: 'Image from me'
---
{% include JB/setup %}

I've been contributing to a couple of trending php libraries recently and during the analysis and the making of the patches,
noticed that many libraries were using PHP not in the way I was used to.

Many of those libraries are having '`final`' classes.

* Why using `final` classes everywhere, what is the advantage?
* As I'm not using final classes in my own projects, am I wrong since the beginning?

This article will try to bring an explanation to this.

<!--break-->

Libraries like [PHP Infection](https://github.com/infection/infection), [PHPSpec](https://github.com/phpspec/phpspec), [PHP-CS-Fixer](https://github.com/friendsofphp/php-cs-fixer) are using [final classes](http://php.net/manual/en/language.oop5.final.php) almost everywhere.

When you use the word `final` for a class, it means that your class will not be able to extend another one.

That means that you forbid anyone to create a class that extend your class.

The goal of creating classes is to use the amazing inheritance mechanism, why would we forbid that ?!
At first, that sounds stupid, but in the end, it's not that bad.

By doing so, you enforce users to use a proper dependency injection mechanism if they really need the parent class.

Since a couple of months, I'm starting use more and more `composition` over `inheritance`.

Composition is in the end much more flexible than inheritance.

Dependency injection is a valid way to compose an object.

However, there is a simple solution if you really need to extends a final class.

As you cannot extend a final class, the only way is to inject the final class as argument in the constructor of your class.

In my article about [How to use PHP Traits](({{ site.baseurl }}{% post_url 2018-10-30-how-to-use-php-traits %})) I wrote a bit about it, it's not possible to inherit multiple objects at the same time, hence "using inheritance".

When you have a good composition mechanism, this is fully possible.

Let's say we have two objects:

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

If you want to create a new objects that potentially could use methods from `Foo` and `Bar`:

First, create an interface for your parent objects, this step is optional but greatly encouraged.

```php
class Foo implements FooInterface {}
```

and

```php
class Bar implements BarInterface {}
```

Then, create your custom objects:

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

Then, that's it ! It's up to you now to implements some kind of proxy methods.

That said, inheritance is not something to throw away.

Inheritance is something to use, but keep in mind that if you want an ultimate flexibility, composing your classes
with dependency injection mechanism is the key.