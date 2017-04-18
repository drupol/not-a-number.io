---
layout: post
category : dev
title: "What is PHPermutations?"
tags : [php, combinatorics, library]
schema: BlogPosting
image: /assets/images/posts/Rubiks-Cube.jpg
image_copyrights: "Image by <a href='https://www.flickr.com/photos/wwarby/11913013374/in/photostream/'>William Warby</a>."
---
{% include JB/setup %}

In December 2016, I started to write a PHP library called [PHPermutations](https://packagist.org/packages/drupol/phpermutations) to handle permutations and combinations of an array of items.
The array items can be any type of object: integers, arrays, strings or objects, the library will still continue to work without any trouble.

But before continuing, let me remind you what are the differences between a permutation and a combination.

<!--break-->

<blockquote class="blockquote text-justify">
The notion of permutation relates to the act of arranging all the members of a set into some sequence or order.
<footer class="blockquote-footer"><cite><a href="https://en.wikipedia.org/wiki/Permutation">Wikipedia</a></cite></footer>
</blockquote>

<blockquote class="blockquote text-justify">
A combination is a way of selecting items from a collection, such that, unlike permutations, the order of selection does not matter.
<footer class="blockquote-footer"><cite><a href="https://en.wikipedia.org/wiki/Combination">Wikipedia</a></cite></footer>
</blockquote>

The formula to find the number of permutations of $$ n $$ items among $$ r $$ items is written:
 
$$ P(n, r) = \frac{n!}{(n-r)!}$$

When the element order does matter, it is a permutation.

The formula to find the number of combinations of $$ n $$ items among $$ r $$ items is written:

$$ C(n, r) = \frac{P(n, r)}{r!} = \frac{\frac{n!}{(n-r)!}}{r!} = \frac{n!}{r!(n-r)!} $$

When the element order does not matter, it is a combination.

---

#### Real life example 1

Let's say you have a card game composed of 10 different cards and you would like to know how many permutations and combinations of 10 cards you can do with it.

In this case, this is $$ P(10, 10) = \frac{10!}{(10-10)!} = 3628800 $$

In this case, this is $$ C(10, 10) = \frac{10!}{10!(10-10)!} = 1 $$

So, with 10 cards, you'll be able to make 3628800 permutations and only 1 combination.

#### Real life example 2

Let's say you have a card game composed of 9 different cards and you would like to know how many permutations and combinations of 6 cards you can do with it.

In this case, this is $$ P(9, 6) = \frac{9!}{(9-6)!} = 60480 $$

In this case, this is $$ C(9, 6) = \frac{9!}{6!(9-6)!} = 84 $$

So, with 9 cards, you'll be able to make 60480 permutations and 84 combinations of 6 cards.

---

To give you an idea of how the function is growing, we can use the _[Big O Notation](https://en.wikipedia.org/wiki/Big_O_notation)_.

The Big O notation characterizes functions according to their growth rates. Different functions with the same growth rate may be represented using the same O notation.

In this case, the order is $$ O(n!) $$, results are growing quickly for small input values.

And if you have to store huge results arrays, you might end up with the infamous:

`Fatal error: Allowed memory size of 134217728 bytes exhausted (tried to allocate 54 bytes)`

This is why in order to avoid those errors, I only used [PHP Generators](https://secure.php.net/manual/en/language.generators.overview.php) and [Iterators](https://secure.php.net/manual/en/class.iterator.php) in PHPermutations.

<blockquote class="blockquote text-justify">
A generator allows you to write code that uses foreach to iterate over a set of data without needing to build an array in memory, which may cause you to exceed a memory limit, or require a considerable amount of processing time to generate. Instead, you can write a generator function, which is the same as a normal function, except that instead of returning once, a generator can yield as many times as it needs to in order to provide the values to be iterated over.
<footer class="blockquote-footer"><cite><a href="https://secure.php.net/manual/en/language.generators.overview.php">php.net</a></cite></footer>
</blockquote>

Moreover, the notable difference with other combinatorics library is that you can use an extra parameter $$ r $$ (_the length_), that allows you to
compute permutations and combinations of any particular size.

Last but not least, PHPermutations includes tests for most of its functionalities.
Tests are not my cup of tea, however, I tried to be as much complete as possible with those.

Every time the sources are modified, [Travis](https://travis-ci.org/drupol/phpermutations), the continuous integration service, tests the library against those tests, this way you are aware if the changes you introduce are valid.

If you'd like to review [PHPermutations](https://github.com/drupol/phpermutations) or think that things should be done in another way or just found a bug, please, let me know or submit a pull request on Github, I'm quite reactive.
