---
layout: post
category : dev
title: "What is PHPermutations?"
tags : [php, combinatorics, library]
---
{% include JB/setup %}

In December 2016, I started to write a PHP library called [PHPermutations](https://packagist.org/packages/drupol/phpermutations) to handle permutations and combinations of an array of items.
The array items can be any type of object: integers, arrays, strings or objects, the library will still continue to work without any trouble.

But before continuing, let me remind you what are the differences between a permutation and a combination.

<!--break-->

<blockquote class="blockquote">
The notion of permutation relates to the act of arranging all the members of a set into some sequence or order.
<footer class="blockquote-footer"><a href="https://en.wikipedia.org/wiki/Permutation">Wikipedia</a></footer>
</blockquote>

<blockquote class="blockquote">
A combination is a way of selecting items from a collection, such that, unlike Permutations, the order of selection does not matter.
<footer class="blockquote-footer"><a href="https://en.wikipedia.org/wiki/Combination">Wikipedia</a></footer>
</blockquote>

Example, you have a group composed of 2 items: $$ \{A, B\} $$.

The permutations are: $$ [A, B] $$ and $$ [B, A] $$.

The combination are: $$ [A, B] $$.

When the element order does matter, it is a permutation.

When the element order does not matter, it is a combination.

If you have a group of 10 items, you'll have 3628800 permutations and 1 combination.

As you can see, the number of permutations grow exponentially and if you might run out of memory if you do not use a good implementation.

This is why, in order to run without running out of memory, it has been written only using [PHP Generators](https://secure.php.net/manual/en/language.generators.overview.php) and 
and [Iterators](https://secure.php.net/manual/en/class.iterator.php).

Moreover, the notable difference with other combinatorics library is that you can use an extra parameter 'length', that allows you to
compute Permutations and Combinations of any particular size.

