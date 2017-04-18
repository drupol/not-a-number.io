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

<blockquote class="blockquote">
The notion of permutation relates to the act of arranging all the members of a set into some sequence or order.
<footer class="blockquote-footer"><cite><a href="https://en.wikipedia.org/wiki/Permutation">Wikipedia</a></cite></footer>
</blockquote>

<blockquote class="blockquote">
A combination is a way of selecting items from a collection, such that, unlike permutations, the order of selection does not matter.
<footer class="blockquote-footer"><cite><a href="https://en.wikipedia.org/wiki/Combination">Wikipedia</a></cite></footer>
</blockquote>

Example, you have a group composed of 2 items: $$ \{A, B\} $$.

The permutations are: $$ [A, B] $$ and $$ [B, A] $$.

The combination are: $$ [A, B] $$.

When the element order does matter, it is a permutation.

When the element order does not matter, it is a combination.

The formula to find the number of permutations of $$ n $$ items among $$ r $$ items is written:
 
$$ P(n, r) = \frac{n!}{(n-r)!}$$

The formula to find the number of combinations of $$ n $$ items among $$ r $$ items is written:

$$ C(n, r) = \frac{P(n, r)}{r!} = \frac{\frac{n!}{(n-r)!}}{r!} = \frac{n!}{r!(n-r)!} $$

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

As you can see, the number of permutations grow exponentially and if you might run out of memory if you do not use a good implementation.

This is why, in order to run without running out of memory, it has been written only using [PHP Generators](https://secure.php.net/manual/en/language.generators.overview.php) and 
and [Iterators](https://secure.php.net/manual/en/class.iterator.php).

Moreover, the notable difference with other combinatorics library is that you can use an extra parameter $$ r $$ (_the length_), that allows you to
compute permutations and combinations of any particular size.

