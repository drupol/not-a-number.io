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

A year ago, I started to write [a lazy collection library]({{< ref "2019-09-09-summer-vacations-are-over" >}}) for PHP.

I haven't written a specific article about it despite the fact that I would have wanted to, mostly by lack of time.

Almost a year ago and 318 commits later, I published [the release 2.0.0](https://github.com/loophp/collection/releases/tag/2.0.0) last week.

<!--break-->

It all started a year ago, when I came across a [pull request made against the Laravel framework](https://github.com/laravel/framework/pull/29415).

Writing a lazy collection library was something that I had in mind, and that pull request has revived my motivation to
write one. After understanding what was happening in that pull request, I started to write my own library.

There were already [some collection libraries in PHP](https://packagist.org/?query=collection&tags=collection), but I
wanted to do something more complete, fully tested and  typed, with a good documentation.

I did countless iterations because I was not happy of the result and I felt that I could improve and optimize things.

Writing such library also put me on the path of functional programming even more, and I also lost quite a lot of time
learning new things from that amazing field.

So far, writing this package has been my greatest source of personal learning in the programming world.
It opened my eyes to a lot of things that I had no idea before.

I suggest to the readers to also read [this post](https://josephsilber.com/posts/2020/07/29/lazy-collections-in-laravel)
from **Joseph Silber**, the author of the Laravel pull request, it's a great and probably the best article about lazy
collections.

This post is not about how to use my library, but merely about the oddities that I wasn't expecting to find while
coding it.

I have summarized here only a few, there are more, but these are the 3 that I recall the most.

# Oddity #1

There are some question on StackOverflow on how to "dedup" (deduplicate) an array.
Basically it means: "_How to remove duplicated values from an array_".

There are many ways to do that, the most trivial example is with [array_unique()](https://php.net/array-unique).

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

**What is happening here?**

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

Furthermore, those functions are made for arrays, there is no support for other iterable types like Traversable,
Iterators and Generators.

With [loophp/collection](https://github.com/loophp/collection), you can use any kind of iterable types, by default.
In the following examples, I will use a Generator, because it's convenient in this particular example.

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

I've always been used to use regular array in PHP and predict the result and I wasn't expecting such a result, at first.

And it turns out that this behavior is absolutely logic, I just wasn't used to it yet.

You can notice that flipping twice a lazy collection returns the original collection, completely unaltered!

Think of a lazy collection as a stream, elements are not evaluated all at once, but one by one.

This is something that someone using a lazy collection should pay attention to and this is also a good test to see if a
library is really lazy or not.

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
  // $k = ['a'], $v = 'a'  
  // $k = StdClass, $v = 'b'  
  // $k = true, $v = 'c'  
}
```

This collection library let you use any kind of type for keys: _scalar_, _objects_, _arrays_,... _anything_!

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
    ->sort()
    ->all();

// [
//   'a' => 'a',
//   'b' => 'b',
//   'c' => 'c',
//   'd' => 'd',
// ]
```

At first sight, it looks like the `sort()` is a *degenerative* operation.
It seems that it has lost some values during the process.
The input had `6` items, the output has `4`. But this is wrong.

Actually, the problem comes from the `all()` operation.
The `all()` operation is basically a shortcut to `iterator_to_array()`.

When converting the collection into an array, values having same keys are lost during the process.

In order to circumvent the issue, you can **normalize** the result. Normalizing the collection will replace keys with
integers, without duplicates.

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
    ->normalize()
    ->all();

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

But there is another alternative, probably better:

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
    ->wrap()
    ->all();

// [
//   0 => ['a' => 'a'],
//   1 => ['a' => 'a'],
//   2 => ['b' => 'b'],
//   3 => ['b' => 'b'],
//   4 => ['c' => 'c'],
//   5 => ['d' => 'd'],
// ]
```

By using the `wrap()` operation at the end, we make sure to not lose any values when converting into a regular array.

When you use the `sort()` operation, it relies on the [ArrayIterator::uasort()](https://www.php.net/manual/en/arrayiterator.uasort.php) underneath.
But the `sort()` operation has all the logic to wrap all values prior and then unwrap them once they are sorted.

That was something hard to figure out at first, which in the end seemed completely logic.
