---
date: 2021-07-13
images:
  - /images/halle.jpg
image_copyrights: Image from Pol Dellaiera
tags:
  - php
  - functional programming
title: Functional programming and PHP 8
---

PHP [8.0][0] has been released since half a year now and [8.1][0] is just around the corner.

My day to day version of PHP is 7.4 and I like it. It has very nice features and I really
like the performance improvements that were made.

However, it's a week now that I'm working on a project using PHP 8 and I started to use
the new features.

This blog post will explain the stuff that I discovered during that journey.

<!--break-->

Since two years now, I'm working on a project of mine: [`loophp/collection`][2].

It started because I wanted to have a better understanding on having custom collection
in a project, but also to understand the lazy concept that we can meet here and there.

I wrote a [blog post][10] about it, also gave a talk during the [AFUP Days][3], find the talk
[here][4] and the slides [here][5].

After two years into functional programming with PHP, I noticed that `loophp/collection`
was using basic and common concepts and I wanted to abstract them in a small library
that could be used in any project which doesn't not necessary require the use of
a custom Collection. This is how I started to write [FPT][6] (**F**unctional **P**rogramming **T**oolbox).

The goal of that very specific library is to provide a stateless classes of
functional programming primitives, tailored in and for PHP.

`loophp/collection` is heavily using *currying* applications in order to avoid
creating local variables and optimize things to the maximum.

*Currying* is the process of converting a function that takes multiple arguments into a function
that takes them one at a time.
Each time the function is called it only accepts one argument and returns a function that takes
one argument until all arguments are passed.

However, it turns out that it's not that easy to satisfy every use case when designing them.

## Before PHP 8

Let's take a very basic example with the core PHP function [`explode`][7].

`explode` is a binary/ternary function which has two required parameters (`separator`, `string`)
and one optional parameter (`limit`).

Example of usage:

```php

explode(':', 'a:b:c'); // ['a', 'b', 'c']

explode(':', 'a:b:c', 2); // ['a', 'b:c']

```

Let's say now that we would like to make a *curried* version of it.

```php

// Create a curried version of core PHP function "explode"
// (optional parameters are not even taken in account)
$explode = FPT::curry()('explode');

// We can use it just like the regular core function.
$explode(':', 'a:b:c'); // ['a', 'b', 'c']

// Or we can create a new intermediary function, this is a "curried" function.
$explodeWithColon = $explode(':')

$explodeWithColon('a:b:c'); // ['a', 'b', 'c']

```

The concept of *currification* of a function is a very powerful concept.

I think this a very important concept in functional programming, if not the most important.

At first it doesn't seems very useful, but the more you use it, the more you'll
like it and understand the benefits.

Another example with `array_map`:

```php

// Define a simple callback.
$add1 = fn (int $value): int => $value + 1;

// Create a curried version of core PHP function "array_map"
// (optional parameters are not even taken in account)
$array_map = FPT::curry()('array_map');

// Create a new function which takes an array as input.
$arrayAdd1 = $array_map($add1);

// Add 1 to each item.
$arrayAdd1([1,2,3]); // [2, 3, 4]

```

Using such concept has some benefits:

* Easier composition of new functions,
* **D**on't **R**epeat **Y**ourself
* Reusability,
* Promote [*function-first, data-last*][12] concept,
* Foster [tacit programming (point-free)][11] and [ETA-reduction][22]

(*I guess I could add more benefits and expand them with a couple of lines
of explanation, but this is not the purpose of this blog post*)

Let's build another example where I'm going to highlight the limitations
of using *currification* with PHP before version 8.

The idea is to create simple callbacks that *stiched* together creates
a new function to filter out even numbers from a list of numbers.

Basically, it's a filter application and [`array_filter`][14] should do the job.

```php

// Define a simple callback
$odd = fn (int $value): bool => 1 === $value % 2;

// Create a curried version of core PHP function "array_filter"
// (optional parameters are not even taken in account)
$array_filter = FPT::curry()('array_filter');

// Create a new function which takes an array as input.
$filterOdd = $array_filter($odd); // This won't work.

```

Unfortunately, such example won't work because `array_filter`'s signature
is `array_filter(array, callable): array`. The first argument **must** be
an `array`, the second a `callable`.

A way to fix this would be to do the following:

```php

// Define a simple callback
$odd = fn (int $value): bool => 1 === $value % 2;

// Create a custom curried version of core PHP function "array_filter"
// (optional parameters are not even taken in account)
$array_filter = fn (callable $filter) => fn (array $array) => array_filter($array, $filter);

// Create a new function which takes an array as input.
$filterOdd = $array_filter($odd);

// Filter out even numbers
$filterOdd([1,2,3]); // [1, 3]

```

As we cannot use `FPT::curry()`, we have to rewrite the curried `$array_filter` function.

Sometimes parameters needs to be injected from the right to the left, sometimes
from the left to the right and sometimes they need to be injected in a complete
different way.

Imagine how many custom curried functions we would need to write if we want to
cover all the cases! It's simply not realistic. (*On top of that, we would have
to also handle the required and optional parameters, and it would be an
impossible task to cover all the use cases.*)

And this is why [PHP libraries implementing curry applications][16], you will often
find `CurryLeft` and `CurryRight` to partially solve that problem.

One way to fix it would be to create an extra function that would *flip* the parameters
of a function as such:

```php

// Define a simple callback
$odd = fn (int $value): bool => 1 === $value % 2;

// Generic flip/reverse all parameters of a n-ary callable.
$flip = fn (callable $callable): Closure => fn (...$params): mixed => $callable(...array_reverse($params));

// Create a curried version of core PHP function "array_filter"
// (optional parameters are not even taken in account)
$array_filter = FPT::curry()($flip('array_filter'), 2); // The parameter 2 must be added here.

// Create a new function which takes an array as input.
$filterOdd = $array_filter($odd);

// Filter out even numbers
$filterOdd([1,2,3]); // [1, 3]

```

This will work but using a generic ```$flip``` function having a variadic parameter ```$params``` prevent
the automatic detection of the amount of parameters to use in ```FTP::Curry()```, this is the reason
why we have to add it manually.

This is not the best solution according to me because the relevant code is becoming too much verbose.
To some extent, it's also not the best performance wise.

## After PHP 8

Since the arrival of PHP 8, [a bunch of new features][9] has reshuffled the cards and
opens up bright new perspectives.

One of this features is [named parameters][8]. Basically, you'll be able to call
any PHP function where provided parameters can be in different orders.

If we take the example of `array_filter` with PHP 7.4, you must provide an `array`
then only the `callable`.

With PHP 8 and the "named parameters" feature, it is possible to first provide the
`callable` and then the `array` as such:

```php

$odd = fn (int $value): bool => 1 === $value % 2;
$input = [1,2,3];

array_filter(callback: $odd, array: $input); // [1, 3]

```

Thanks to that amazing feature, it is now possible to provide a new Curry
application which is a bit more generic and fit for practically all use-cases.

With that "named parameters" feature, such a new *curry* application could provide
the following features and user experience:

```php

// Create a curried version of core PHP function "explode".
$explode = FPT::curry()('explode');

// Regular use.
$explode('-', 'a-b-c'); // ['a', 'b', 'c']

// Regular use with named parameters in the proper order
$explode(separator: '-', string: 'a-b-c'); // ['a', 'b', 'c']

// Curried use with named parameters in the proper order
$explode(separator: '-')(string: 'a-b-c'); // ['a', 'b', 'c']

// Regular use with named parameters in a different order
$explode(string: 'a-b-c', separator: '-'); // ['a', 'b', 'c']

// Curried use with named parameters in a different order
$explode(string: 'a-b-c')(separator: '-'); // ['a', 'b', 'c']

```

In this example, the optional parameters are not taken in account, but we could!

Indeed, some PHP functions have a different amount of parameters and required parameters.

With [`explode`][7], it has two required parameters and three parameters in total, which means
that one parameter is optional and most probably has a default value.

Our new Curry function need to be able to deal with that because such things are very
common in PHP.

```php

// Create a curried function of "explode" which must have 3 parameters
$explode = FPT::curry()('explode', 3);

// Regular use.
$explode('-', 'a-b-c', 2); // ['a', 'b-c']

// Regular use with named parameters in the proper order
$explode(separator: '-', string: 'a-b-c', limit: 2); // ['a', 'b-c']

// Curried use with named parameters in the proper order
$explode(separator: '-')(string: 'a-b-c')(limit: 2); // ['a', 'b-c']

// Regular use with named parameters in a different order
$explode(limit: 2, string: 'a-b-c', separator: '-'); // ['a', 'b-c']

// Curried use with named parameters in a different order
$explode(limit: 2)(string: 'a-b-c')(separator: '-'); // ['a', 'b-c']

```

## What about "partial" application ?

Usually when we talk about *currying*, we talk about *partial* as well.

The "partial" application is the cousin of the "curry" application.

Basically it's almost the same application except that *Currying* takes
exactly one input, whereas *partial* application takes two (*or more*) inputs.

In [FPT][6], there is no such *partial* application. It's done within the *curry*
application.

Why? Because of [variadic parameters][13]!

The `FPT::curry()` application works just like the regular and "by-the-book"
*curry* application, but thanks to variadic arguments, it's more flexible.

It let us use more than one parameter at a time and thus, mimic the behaviour
of the *partial* application.

```php

// Create a curried function of "explode" which must have 3 parameters
$explode = FPT::curry()('explode', 3);

// Create a intermediary "partial" function.
$newExplode = $explode(limit: 3, separator: '-');

$newExplode('a-b-c-d-e'); // ['a', 'b', 'c-d-e']

```

## And PHP 8.1 then?

Lately and in every mainstream programming languages, we can see that the
trend is slowly moving towards functional programming.

And PHP follow that trend, baby step by baby step.

We can see that there's a couple of [RFCs][20] that are coming and are definitely
functional programming oriented.

The last one is in date is [Partial function application][15] which was sadly not adopted.
Another one here: [First class callable syntax][19]
And another one: [Pipe operator][18]
and the last one (*already in PHP 8.0!*) with the [match expression][17].

PHP 8.1 is around the corner and I guess that the future of PHP has bright days,
especially if more functional programming features is going to added!

More functional programming in PHP means a stricter typed code, a bump into reusability,
lesser code to write, better concepts, paradigms and design patterns where
the foundations has been proved theoretically by mathematics.

## Conclusion

It's been a week that I'm working with PHP 8 and I just don't want to look back
already.

The [FPT][6] library is being updated to only support [PHP 8][21] and it's going well
so far.

``` 37 files changed, 233 insertions(+), 689 deletions(-)```

Using these new stuff from PHP 8 allowed me to remove a bunch of code and I can't wait
to do that in my other projects!

[0]: https://php.watch/versions
[2]: https://github.com/loophp/collection
[3]: https://event.afup.org/afupday2021-interview-pol-dellaiera/
[4]: https://www.youtube.com/watch?v=Kp47f8dtqoo
[5]: https://github.com/drupol/afup-day-lille-2021/releases/tag/v24-9163d2e
[6]: https://github.com/loophp/fpt
[7]: https://php.net/explode
[8]: https://php.watch/versions/8.0/named-parameters
[9]: https://stitcher.io/blog/new-in-php-8
[10]: {{< ref "2021-04-07-afup-interview" >}}
[11]: https://en.wikipedia.org/wiki/Tacit_programming
[12]: https://www.javierchavarri.com/data-first-and-data-last-a-comparison/
[13]: https://www.php.net/manual/en/functions.arguments.php#functions.variable-arg-list
[14]: https://php.net/array_filter
[15]: https://wiki.php.net/rfc/partial_function_application
[16]: https://packagist.org/?query=curry
[17]: https://wiki.php.net/rfc/match_expression_v2
[18]: https://wiki.php.net/rfc/pipe-operator-v2
[19]: https://wiki.php.net/rfc/first_class_callable_syntax
[20]: https://wiki.php.net/rfc
[21]: https://github.com/loophp/fpt/pull/12
[22]: https://wiki.haskell.org/Eta_conversion
