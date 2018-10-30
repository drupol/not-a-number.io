---
layout: post
category : dev
title: "How to use PHP traits?"
tags : [php, traits, coding]
image: /assets/images/posts/IMG_20181014_110212-01.jpg
image_copyrights: 'Image by Pol Dellaiera'
---
{% include JB/setup %}

Recently, I've been busy rewriting small PHP libraries like [ValueWrapper](https://github.com/drupol/valuewrapper), [HTMLTag](https://github.com/drupol/htmltag), [PHPNgrams](https://github.com/drupol/phpngrams), [DynamicObjects](https://github.com/drupol/dynamicobjects), [PHPartition](https://github.com/drupol/phpartition), [PHPermutations](https://github.com/drupol/phpermutations) and [Memoize](https://github.com/drupol/memoize).

I mostly rewrote them because of multiple things I wanted to do:

* Use [SOLID](https://en.wikipedia.org/wiki/SOLID) principle: [The Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
* Automatically generate and publish the library documentation using [APIgen](https://github.com/ApiGen/ApiGen)
* Improve the tests quality by using [PHP Infection](https://github.com/infection/infection)
* Improve the class hierarchy design when using a PHP trait and remove some limitations.

This article will explain what are traits and will try to propose, without pretension, a better way to write them.

<!--break-->

Let's start with the definition of a trait.

<blockquote class="blockquote text-justify">
Traits are a mechanism for code reuse in single inheritance languages such as PHP.
A Trait is intended to reduce some limitations of single inheritance by enabling a developer to reuse sets of methods freely in several independent classes living in different class hierarchies.
<footer class="blockquote-footer"><cite><a href="http://php.net/manual/en/language.oop5.traits.php">From php.net</a></cite></footer>
</blockquote>

When designing a software or a library, we are often busy thinking on how to make it work properly and how it could do the job as expected.
This is already a good part of the job.
When it comes to designing the library and it's classes organisation, it's another world that sometimes can take as much time as the real implementation.

* How to reduce and minimize code duplication,
* How to make sure that the inheritance hierarchy is optimal,
* Which design pattern to use,
* etc etc

Sometimes, it's possible that you'd wish your class to inherit from multiple classes, but unlike in Python (_and probably some other languages_), it's not possible in PHP (Yet?).

Of course, inheritance with multiple classes can be hard to work with, it adds complexity and has issues like the [Diamond problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem).

<blockquote class="blockquote text-justify">
The "diamond problem" (sometimes referred to as the "deadly diamond of death") is an ambiguity that arises when two classes B and C inherit from A, and class D inherits from both B and C. If there is a method in A that B and C have overridden, and D does not override it, then which version of the method does D inherit: that of B, or that of C? 
<footer class="blockquote-footer"><cite><a href="https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem">From wikipedia</a></cite></footer>
</blockquote>

Introduced in PHP 5.4, traits is a way to solve this. Basically, it allows developers to reuse horizontally the same code across independent and different classes hierarchies.

It seems to be an amazing discovery, but it's nothing new, this concept is used in languages like Scala and Perl.

A trait is a good way to provide new features to a class, it's a good way, but it has drawbacks.

Let's see with a basic example.

In the following example, we want to create a trait that compute [the greatest common divisor](https://en.wikipedia.org/wiki/Greatest_common_divisor) of 2 integers.

```php
<?php

declare(strict_types = 1);

trait GreatestCommonDivisor
{
  /**
   * Get the divisors of a given number.
   * 
   * @param int $num
   *   The number.
   *
   * @return int[]
   *   The divisors of the number.
   */
  public function factors(int $num): array
  {
    return array_filter(
      range(1, $num),
      function (int $i) use ($num) {
        return 0 === $num % $i;
      }
    );
  }

  /**
   * Get the greatest common divisor.
   * 
   * @param int ...$x
   *   The numbers.
   * 
   * @return int
   *   The greatest common divisor.
   */
  public function gcd(...$x): int
  {
    $x = array_map([$this, 'factors'], $x);
      
    $intersect = array_intersect(...$x);
      
    return end($intersect);
  }
}

```

This trait can be used in any classes just by adding:

```php
<?php

declare(strict_types = 1);

class Foo
{
  use GreatestCommonDivisor;
}

```

This will add the 2 methods to your class and you'll be able to call them.

```php
<?php 

declare(strict_types = 1);

$foo = new Foo();

$factors = $foo->factors(10);

$gcd = $foo->gcd(10, 15);
```

At this point, one may raise 2 questions.

The first one is obvious, what about name collisions ? What if the class that uses this trait has already methods having the same names ?

There is a way to avoid name collisions:

```php
use \your\namespace\GreatestCommonDivisor {
  GreatestCommonDivisor::gcd as traitGcd;
}
```

Then, in that case, if your class has already got a ```gcd()``` method, you won't have naming collisions and you'll be able to use the method ```traitGcd()```.

The second question is, what if I only want to expose the ```gcd()``` method and not the other one(s) ?

In this particular case it's not a big deal, but if you want to create a library using a trait, there are chances that you would like to expose only the relevant methods.

Unfortunately, there is no way to restrict the visibility of methods defined in a trait.
Of course, you could wrap your trait in an new object, then wrap that object in another new trait... but I think you agree with me, it's messy.

This issue raise another set of issues. Using traits usually gives you more work. Why ?

As the visibility of methods cannot be changed, you'll have to test all the methods, individually.

Testing private or protected methods could be cumbersome and in some cases, it's better to test public methods which internally uses those methods.

A way to avoid those situations is to use traits in a different way, based on an object.

See the following example, it's the same as the first example, but rewritten.

First we are going to create a single class.

```php
<?php

declare(strict_types = 1);

class GreatestCommonDivisor
{
  /**
   * Get the divisors of a given number.
   * 
   * @param int $num
   *   The number.
   *
   * @return int[]
   *   The divisors of the number.
   */
  private function factors(int $num): array
  {
    return array_filter(
      range(1, $num),
      function (int $i) use ($num) {
        return 0 === $num % $i;
      }
    );
  }

  /**
   * Get the greatest common divisor.
   * 
   * @param int ...$x
   *   The numbers.
   * 
   * @return int
   *   The greatest common divisor.
   */
  public function gcd(...$x): int
  {
    $x = array_map([$this, 'factors'], $x);
      
    $intersect = array_intersect(...$x);
      
    return end($intersect);
  }
}
```

Then a trait


```php
<?php

declare(strict_types = 1);

trait GreatestCommonDivisor
{
  /**
   * Get the greatest common divisor.
   * 
   * @param int ...$x
   *   The first number.
 * 
   * @return int
   *   The greatest common divisor.
   */
  function gcd(...$x): int
  {
    return (new GreatestCommonDivisor())->gcd(...$x);
  }
}
```

You can find the online code at: [https://3v4l.org/LCmNp](https://3v4l.org/LCmNp)

What are we doing here ?

Basically, the ```GreatestCommonDivisor``` object is wrapped in a trait, and the trait exposes only the method needed.

When this trait will be used, in any object you want, it will only provide 1 method and nothing else.

To summarize this post:

* All the traits that you create should wrap an inner class that does the job properly,
* Don't do logic in your traits,
* Do not overload traits with a lot of methods, try to keep in mind that "1 trait = 1 method",
* Carefully select which methods you want to expose in your traits,
* Unit test your objects and not your traits.
