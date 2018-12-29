---
layout: post
category : dev
title: "PHPTree, a fast tree implementation"
tags : [php, tree, data structure]
image: /assets/images/posts/green-nature-tree-91153.jpg
image_copyrights: 'Image from <a href="https://www.pexels.com/photo/wood-light-nature-forest-91153/">pexels.com</a>'
---
{% include JB/setup %}

Hopefully for most of us, holidays are here. a time for resting and thinking.

Even if I'm not attached to religion, doing a Christmas tree is a kind of tradition... cats really loves it :-)

While doing it, it got me thinking about tree based data structure. I used to play with trees into a previous project with Neo4J ([Post about Neo4J]({% post_url 2018-01-01-discovering-a-new-database-neo4j %})) and I remember that I loved it.

I used to see trees data structure at university but it's been a while, so I started to re-investigate into graphs and trees.

<!--break-->

#### A bit of theory

The term "tree" was coined in 1857 by the British mathematician Arthur Cayley.

In mathematics, and, more specifically, in graph theory, a tree is an undirected [graph](https://en.wikipedia.org/wiki/Graph_theory) in which any two vertices are
connected by exactly one path. Every acyclic connected graph is a tree, and vice versa.

Just like in Nature, there are different types of trees for data structure and the various kinds of data structures
referred to as trees in computer science have underlying graphs that are trees in graph theory,
although such data structures are generally rooted trees.

A rooted tree may be directed either making all its edges point away from the
root (in which case it is called an arborescence, branching, or _out-tree_], when its edges point towards the
root (in which case it is called an anti-arborescence or _in-tree_).

A rooted tree itself has been defined as a directed graph.

I'm just giving here a small introduction, you can find more details on this [on Wikipedia](https://en.wikipedia.org/wiki/Tree_(graph_theory)).

##### Examples

Here's a very simple data representation using a tree.

[![Another example of tree](/assets/images/posts/tree-example1.svg){:width="800" class="img-thumbnail"}](/assets/images/posts/tree-example1.svg)

12 nodes, degree 11 (_each node has maximum 11 children_], 11 leaves and height is 1.

This tree is full, every nodes other than the leaves has the same number of children.

[![An example of tree](/assets/images/posts/tree-example2.svg){:width="800" class="img-thumbnail"}](/assets/images/posts/tree-example2.svg)

12 nodes, degree 3, 8 leaves, height is 2.

This tree is complete, every level, except possibly the last, is completely filled, and all nodes are as far left as possible.

There are many configuration possible for storing data in a tree, [here's another one](/assets/images/posts/tree-example3.svg).

12 nodes, degree 1, 1 leaf, height is 11.

This tree is a degenerate (_or pathological_) tree is where each parent node has only one child node.

As you can see, graphs have its own vocabulary and classification.

A tree can be summarized with one simple definition ([from this amazing article](https://medium.freecodecamp.org/all-you-need-to-know-about-tree-data-structures-bceacb85490c))

_A tree is a collection of entities called nodes._
_Nodes are connected by edges. Each node may or may not contains some data, and it may or may not have a child node._
_The first node of the tree, usually at the top, is called the root node._

##### Tree traversal

In computer theory and algorithms, one of the most important facet of trees is the way we read them.
As a tree is a 2 dimensional data structure, we cannot read it from the top to the bottom like we would do it in a simple list, data are organized hierarchically.

That said, we must find strict ways to "traverse" them.

There are 4 well known tree traversal algorithms:

* In Order (Depth first)
* Pre Order (Depth first)
* Post Order (Depth first)
* Breadth first (Breadth first)

Usually those traversal algorithms are made for binary trees (2-ary trees), trees having maximum 2 children per node.

Find all the details and more [on Wikipedia](https://en.wikipedia.org/wiki/Tree_traversal).

#### About the library

The purpose of this post is not about trees theory but about a library I've been working on called: [PHPTree](https://github.com/drupol/phptree).

It allows you to manipulate trees, to export and import them.

PHPTree is gentle with memory thanks to PHP Iterator(_Yield, ArrayObject_), I tried to use them as much as possible.

##### Tree types

Currently, the library provides 5 different types of objects, maybe some other trees will be implemented later, depending on my availability.

* **Node**: A simple base class that can be added to another one or be used as a parent for other children.

* **N-ary node**: It extends the Node class and allows you to cap the number of children a node can have.
A K-ary or N-ary tree is tree in which each node has no more than N children. This tree does the heavy lifting for you
when adding nodes.

* **Value node**: extends the N-ary node and allows you to attach a value to the node.

* **KeyValue node**: extends the Value node and allows you to attach a key and a value to the node.

* **Trie node**: extends the KeyValue node, a [Trie tree](https://en.wikipedia.org/wiki/Trie) node. (see [example](/assets/images/posts/tree-example4.svg))

##### Tree traversal algorithms

PHPTree also implements the 4 well known tree traversal algorithms with some extra.

Many of these algorithms are made to work with 2-ary trees (binary trees), in PHPTree, they are working for all kind of trees.

I think this is something new, I was not able to find any equivalent on the internet.

##### Example with a binary tree

Let this binary tree (2-ary tree):

[![An example of tree](/assets/images/posts/tree-example5.svg){:width="800" class="img-thumbnail"}](/assets/images/posts/tree-example5.svg)

be traversed with the In-Order algorithm, the result would be:

```
O, G, P, C, Q, H, R, A, S, I, T, D, U, J, V, root, W, K, X, E, Y, L, Z, B, M, F, N
```

##### Example with another tree

Let this tree (4-ary tree):

[![An example of tree](/assets/images/posts/tree-example6.svg){:width="800" class="img-thumbnail"}](/assets/images/posts/tree-example6.svg)

be traversed with the In-Order algorithm, the result would be:

```
U, V, E, W, X, Y, F, Z, A, G, H, I, J, B, K, L, root, M, N, C, O, P, Q, R, D, S, T
```

The **InOrder** tree traversal is usually made for binary trees, PHPTree has standardized the algorithm and it can work with any type of trees.

##### Tree exporters

PHPTree gives you the opportunity to export trees in multiple formats:

* To text
* To PHP array
* To Graph
* To Ascii (just for fun)

Here's an example of how [this graph](/assets/images/posts/tree-example2.svg) is exported:

As Text:
```
[PHPTree [is [fast [to] [manipulate]] [and [trees] [data]]] [a [fun [structure]] [library]]]
```

As Ascii:

```
├─ PHPTree
└─┐
  ├─┐
  │ ├─ is
  │ └─┐
  │   ├─┐
  │   │ ├─ fast
  │   │ └─┐
  │   │   ├─┐
  │   │   │ └─ to
  │   │   └─┐
  │   │     └─ manipulate
  │   └─┐
  │     ├─ and
  │     └─┐
  │       ├─┐
  │       │ └─ trees
  │       └─┐
  │         └─ data
  └─┐
    ├─ a
    └─┐
      ├─┐
      │ ├─ fun
      │ └─┐
      │   └─┐
      │     └─ structure
      └─┐
        └─ library
```

As Array:
```php
[
  'value' => 'PHPTree',
  'children' => [
    0 => [
      'value' => 'is',
      'children' => [
        0 => [
          'value' => 'fast',
          'children' => [
            0 => [
              'value' => 'to',
            ],
            1 => [
              'value' => 'manipulate',
            ],
          ],
        ],
        1 => [
          'value' => 'and',
          'children' => [
            0 => [
              'value' => 'trees',
            ],
            1 => [
              'value' => 'data',
            ],
          ],
        ],
      ],
    ],
    1 => [
      'value' => 'a',
      'children' => [
        0 => [
          'value' => 'fun',
          'children' => [
            0 => [
              'value' => 'structure',
            ],
          ],
        ],
        1 => [
          'value' => 'library',
        ],
      ],
    ],
  ],
] 
```

As Graph:

Graph is a class from the package [graphp/graph](https://github.com/graphp/graph) of [Christian Lück](https://github.com/clue), so I won't be able to show it here.

However, this is thanks to it that we can export trees into images or dot files thanks to [Graphviz](https://www.graphviz.org/) and it's PHP package [graphp/graphviz](https://github.com/graphp/graphviz).

##### Tree importers

PHPTree also provides 2 importers:

* From text
* From PHP array

The text exporter and importer can be very useful to store/retrieve a tree into/from a database.

##### Code examples

I [posted on gist](https://gist.github.com/drupol/c20e3f1a825fae2ebfb06f888401f7dc) the code that I used to generate the trees in this post, feel free to test them as well.

Just for fun, I also made 2 trees with 10000 nodes to visually explain the difference between a tree of degree 2 and 3:

* [Tree with degree 2 and 10000 nodes](/assets/images/posts/NaryNode_2_10000.svg)
* [Tree with degree 3 and 10000 nodes](/assets/images/posts/NaryNode_3_10000.svg)

#### Conclusion

Building this library helped me understand in depth the advantage of using Iterators and Yield in my projects.

Besides the fact that doing this library was really fun, some parts were extremely hard, especially the tree traversal algorithms.

Let me know if you're going to use it and how! Feedback is very welcome.