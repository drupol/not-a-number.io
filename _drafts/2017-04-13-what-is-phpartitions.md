---
layout: post
category : dev
title: "What is PHPartition?"
tags : [php, partition, library]
image: /assets/images/posts/cake_cutting.jpg
image_copyrights: 'Image from <a href="https://commons.wikimedia.org/wiki/File:U.S._Marine_Corps_Maj._Thomas_Siverts,_the_executive_officer_of_the_1st_Battalion,_9th_Marine_Regiment,_cuts_a_birthday_cake_during_a_cake-cutting_ceremony_Nov._11,_2013,_at_Camp_Leatherneck,_Helmand_province_131111-M-WA264-009.jpg">Wikimedia commons</a>.'
---
{% include JB/setup %}

Again in December 2016, I started to wrote a PHP library: [PHPartition](https://packagist.org/packages/drupol/phpartition).

The idea behind this library was simple. I was looking for a way to create $$ n $$ subsets of a set of items. Each of these subsets must have the same sum or when it's not possible, the delta of the sum difference of each subsets must be minimized.

This problem is a famous well known problem in Mathematics, called: "_the partition problem_".

<blockquote class="blockquote">
Although the partition problem is NP-complete, there is a pseudo-polynomial time dynamic programming solution, and there are heuristics that solve the problem in many instances, either optimally or approximately.
For this reason, it has been called "<i>the easiest NP-hard problem</i>".
<footer class="blockquote-footer"><cite><a href="https://en.wikipedia.org/wiki/Partition_problem">Wikipedia</a></cite></footer>
</blockquote>

There are different algorithms existing for doing that.