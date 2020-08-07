---
date: 2020-08-10
images: 
  - /images/IMG_20200718_211804-01.jpeg
image_copyrights: Image from Pol Dellaiera
tags:
  - php
  - lazy collection
title: Lazy collection oddities
---

A year ago I started to write [a lazy collection library]({{< ref "2019-09-09-summer-vacations-are-over" >}}) for PHP.

I haven't written a specific article about it despite the fact that I would have wanted to, mostly by lack of time.

Almost a year ago and 318 commits later, I published the release 2.0.0 last week.

<!--break-->

A year ago, I came across a [pull request made against the Laravel framework](https://github.com/laravel/framework/pull/29415).

Writing a lazy collection library was something that I had in mind since a couple of months ago, and that pull request
has revived my motivation to write one. After understanding what was happening in that pull request, I started to write
my own library.

There are already [some collection libraries in PHP](https://packagist.org/?query=collection&tags=collection), but I
wanted to do something more complete, fully tested and  typed, with a good documentation.

I did countless iterations because I was not happy of the result and I felt that I could improve things.

Writing such library also put me on the path of functional programming even more, and I also lost quite a lot of time
learning new things from that amazing field.

So far, writing this package has been my greatest source of personal learning in the programming world.
It opened my eyes to a lot of things that I had no idea before.

I suggest to the readers to also read [this post](https://josephsilber.com/posts/2020/07/29/lazy-collections-in-laravel)
from Joseph Silber, the author of the Laravel pull request, it's a great article about lazy collections.

This post is not about how to use PHP Collection, but merely about the oddities that I wasn't expecting to find while
coding it.

# Oddity #1

There are some question on StackOverflow on how to "dedup" (deduplicate) an array. How to remove duplicated values from
an array.

There are many ways to do that, the most obvious example with [array_unique()](https://php.net/array-unique) is the following.

```php
<?php

$input = ['a', 'b', 'c', 'a', 'd', 'b'];

$filtered = array_unique($input);

// [
//    0 => 'a',
//    1 => 'b',
//    2 => 'c',
//    4 => 'd',
// ]
```

There is also another fancier way that you might use, by issuing twice the [array_flip()](https://php.net/array-flip)
function.

```php
<?php

$input = ['a', 'b', 'c', 'a', 'd', 'b'];

$filtered = array_flip(array_flip($input));

// [
//    3 => 'a',
//    5 => 'b',
//    2 => 'c',
//    4 => 'd',
// ]
```

We can directly notice that the keys are different, but the values are the same as the previous example.

What is happening here?

Let's break down the calls and print the arrays in between:

```php
<?php

$input = ['a', 'b', 'c', 'a', 'd', 'b'];

$filtered = array_flip($input);

// [
//    'a' => 3,
//    'b' => 5,
//    'c' => 2,
//    'd' => 4,
// ]

$filtered = array_flip($filtered);

// [
//    3 => 'a',
//    5 => 'b',
//    2 => 'c',
//    4 => 'd',
// ]
```

The first call to `array_flip()` will exchange keys with values and vice versa.
As you may have noticed, there are multiple times the letter `a`, at index `0` and `3`.
`array_flip()` will then use the latest known key for letter `a` in the input array: `3`.

The same process is applied for each remaining array values.

From there, we can deduct that:

```php
<?php

$input = ['a', 'b', 'c', 'a', 'd', 'b'];

$filteredWithArrayFlip = array_values(array_flip(array_flip($input)));
$filteredWithArrayUnique = array_unique($input);

// We can deduct that:
// $filteredWithArrayFlip === $filteredWithArrayUnique;
```

Ok, all of this are great but it doesn't bring any added values to PHP, and on top of that, there's a lot of chance that
using `array_values()`, then twice `array_flip()` will be slower than just using `array_unique()`.

On top of that, those functions made for arrays, there is no support for other iterable types like Traversable,
Iterators and Generators.

When using a lazy library such as the one I wrote, you can use any kind of iterable types, by default.

```php
<?php

$input = static function(): \Generator {
  yield 'a';
  yield 'b';
  yield 'c';
  yield 'a';
  yield 'd';
  yield 'b';
};

$collection = Collection::fromIterable($input())
  ->flip();

// Loop over it
foreach ($collection as $key => $value) {
  // 'a' => 3
  // 'b' => 5
  // 'c' => 2
  // 'd' => 4
}

// Or just convert it into an array (the same as iterator_to_array($collection))
$array = $collection->all();

// [
//    'a' => 3,
//    'b' => 5,
//    'c' => 2,
//    'd' => 4,
// ]
```

If you do the flip() operation twice, what would be the result? Let's try... 

```php
<?php

$input = static function(): \Generator {
  yield 'a';
  yield 'b';
  yield 'c';
  yield 'a';
  yield 'd';
  yield 'b';
};

$collection = Collection::fromIterable($input())
  ->flip()
  ->flip();

// Loop over it
foreach ($collection as $key => $value) {
  // 0 => 'a'
  // 1 => 'b'
  // 2 => 'c'
  // 3 => 'a'
  // 4 => 'd'
  // 5 => 'b'
}

// Or just convert it into an array (the same as iterator_to_array($collection))
$array = $collection->all();

// [
//   0 => 'a'
//   1 => 'b'
//   2 => 'c'
//   3 => 'a'
//   4 => 'd'
//   5 => 'b'
// ]
```

**WOW !** (_That was my first reaction._) **#Facepalm** (_That was my second reaction_)

And it turns out that this behavior is absolutely logic, I just wasn't used to it yet.

As a lazy collection is like a stream, elements are not evaluated all at once, but one by one.

This is something that someone using a lazy collection should pay attention to.

This is also a good test to see if a library is really a lazy or not.

# Oddity #2

As you all may know, keys in arrays are either integers or strings.

I don't know if you ever needed such things in your project, but sometimes it would be nice to be able to use any kind
of type as keys in an array.

It is possible in PHP since version 5.1, by using the [\SplObjectStorage](https://www.php.net/manual/en/class.splobjectstorage.php) class.

However, it is still not possible with regular arrays, and it will not be possible anytime soon.

When using a lazy collection library, using any kind of keys is possible.

```php
<?php
$input = static function () {
    yield ['a'] => 'a';
    yield new \StdClass() => 'b';
    yield true => 'c';
};

$collection = Collection::fromIterable($input());

foreach ($collection as $k => $v) {
    var_dump($k);
    var_dump($v);
}
```

This collection library let you use any kind of type for keys: integer, string, objects, arrays, ... anything!

This library could be a valid replacement for [\SplObjectStorage][SplObjectStorage] but with much more features.

This way of working opens up new perspectives, another ways of handling data, different ways to think about data
structure.

# Oddity #2

Have you thought about how to sort a lazy collection when it contains duplicated keys ?

```php
<?php

$input = static function(): \Generator {
    yield 'a' => 'a';
    yield 'b' => 'b';
    yield 'c' => 'c';
    yield 'a' => 'a';
    yield 'd' => 'd';
    yield 'b' => 'b';
};

$collection = Collection::fromIterable($input())
    ->sort();

print_r($collection->all());

// [
//   'a' => 'a',
//   'b' => 'b',
//   'c' => 'c',
//   'd' => 'd',
// ]
```

At first sight, it looks like the sort() is a *degenerative* operation.
It seems that it has lost some values during the process.
The input had `6` items, the output has `4`.

Actually, the problem comes from the `all()` operation.
The `all()` operation is basically a shortcut to `iterator_to_array()`.

In order to highlight the issue, I will **normalize** the result. Normalizing the collection will replace keys with
integers.

```php
<?php

$input = static function(): \Generator {
    yield 'a' => 'a';
    yield 'b' => 'b';
    yield 'c' => 'c';
    yield 'a' => 'a';
    yield 'd' => 'd';
    yield 'b' => 'b';
};

$collection = Collection::fromIterable($input())
    ->sort()
    ->normalize();

print_r($collection->all());

// [
//   0 => 'a',
//   1 => 'a',
//   2 => 'b',
//   3 => 'b',
//   4 => 'c',
//   5 => 'd',
// ]
```

This is a bit better, but we've lost the keys during the process. Is there a way to retrieve the result, without loosing
any information ?

This is obviously possible by just looping over the collection object:

```php
<?php

$input = static function(): \Generator {
    yield 'a' => 'a';
    yield 'b' => 'b';
    yield 'c' => 'c';
    yield 'a' => 'a';
    yield 'd' => 'd';
    yield 'b' => 'b';
};

$collection = Collection::fromIterable($input())
    ->sort();

foreach ($collection as $key => $value) {
    //   'a' => 'a'
    //   'a' => 'a'
    //   'b' => 'b'
    //   'b' => 'b'
    //   'c' => 'c'
    //   'd' => 'd'
}
```

There is an alternative, probably better:

```php
<?php

$input = static function(): \Generator {
    yield 'a' => 'a';
    yield 'b' => 'b';
    yield 'c' => 'c';
    yield 'a' => 'a';
    yield 'd' => 'd';
    yield 'b' => 'b';
};

$collection = Collection::fromIterable($input())
    ->sort()
    ->wrap();

print_r($collection->all());

// [
//   0 => ['a' => 'a'],
//   1 => ['a' => 'a'],
//   2 => ['b' => 'b'],
//   3 => ['b' => 'b'],
//   4 => ['c' => 'c'],
//   5 => ['d' => 'd'],
// ]
```

By using the wrap operation at the end, we make sure to not lose any values when converting into a regular array.

The `wrap()` operation has also its opposite: `unwrap()`.

When you use the `sort()` operation, it relies on the [ArrayIterator::uasort()](https://www.php.net/manual/en/arrayiterator.uasort.php) underneath.
But the `sort()` operation has all the logic to wrap all values prior and then unwrap them once they are sorted.

That was something hard to figure out at first, which in the end seemed completely logic.
