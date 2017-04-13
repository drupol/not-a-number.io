---
layout: post
category : dev
title: "What is PHPartition?"
tags : [php, partition, library]
---
{% include JB/setup %}

Again in December 2016, I wrote a PHP library called [PHPartition](https://packagist.org/packages/drupol/phpartition).

The idea behind this library was simple, I was looking for a way to create $$ n $$ subsets of a set of items. Each of these subsets must have the same sum or when it's not possible, the difference between each subset must be minimized.

This problem is a famous well known problem in Mathematics, called: "_the partition problem_".

<blockquote class="blockquote">
Although the partition problem is NP-complete, there is a pseudo-polynomial time dynamic programming solution, and there are heuristics that solve the problem in many instances, either optimally or approximately.
For this reason, it has been called "<i>the easiest NP-hard problem</i>".
<footer class="blockquote-footer"><cite><a href="https://en.wikipedia.org/wiki/Partition_problem">Wikipedia</a></cite></footer>
</blockquote>

