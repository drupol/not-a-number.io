---
date: 2021-04-07
images:
  - /images/daffodils.jpg
image_copyrights: Image from Pol Dellaiera
tags:
  - php
  - prime numbers
  - python
  - iterator
title: AFUP interview
---

I will soon give a talk at [AFUP](https://event.afup.org/afup-day-2021/afup-day-2021-lille/programme/)
regarding the [loophp/collection](https://github.com/loophp/collection) library that I built.

I've been asked to make an [interview](https://event.afup.org/afupday2021-interview-pol-dellaiera/)
and I had to reply to some questions.

This blog post is the english translation of this interview.

1.  **When we read \"Lazy Collection\", we think \"Doctrine
    Collection\". Could you tell us more why your library
    loophp/collection is different?**

    The package `doctrine/collections` is one of the reason I started to
    get interest into collections. However, the real trigger was a *pull
    request* from [Joseph
    Silber](https://github.com/laravel/framework/pull/29415) on the
    Laravel framework, le 5 Août 2019. I carefully analysed and tested
    it and I started to write my own library, mainly to to learn, test
    and have a better understanding on the new concepts, I also improved
    some of them.

    That said, it's true, collections libraries, there are
    [many](https://packagist.org/?query=collection&type=library&tags=collection)
    and at every sauce, and *curry* sauce is quite uncommon!

    The library provided by Doctrine is mainly used by Doctrine. The
    result of a `SELECT` SQL query are ofen *wrapped* with an instance
    of that collection.

    This allows, among some other things, to easily apply filtering,
    sorting functions and so on. This is very practical because the
    result of a query is an object, an instance of the collection, and
    therefore there is an easy way to see the methods which are attached
    to it, for example, with the IDE and thus to manipulate the data.

    To come back to your original question now, `doctrine/collections`
    is not *lazy* and therefore very different from `loophp/collection`.

    Each method call is executed instantly regardless of the size of the
    initial data set. Without counting the layer which manages the
    `expressions`, we could practically reduce this library to a
    *simple* array manipulation utility.

    And so yes, there is therefore a fundamental difference between
    `doctrine/collections` and `loophp/collection`.

    Example, following a request from a service or a database, we
    retrieve in the collection `$collection` millions of digital
    identifiers.

        $results = $collection
            ->filter(fn (int $int) => 0 === $int % 2) // Filter even identifiers
            ->map(fn(int $int) => 'document' . $int . '.pdf') // Rename to filename
            ->filter(fn(string $doc) => file_exists('/doc/' . $doc)) // Filter unexistent files
            ->map(fn(string $doc) => file_get_contents($doc)); // Fetch the file content

        foreach ($results as $v) {} // Iterate the results

    This snippet will:

    1.  Before starting the *foreach* loop,

    2.  Traverse the collection to filter it based on its parity,

    3.  Create a temporary results array,

    4.  Traverse the array to rename into filenames,

    5.  Create a temporary results array,

    6.  Traverse the array to filter it based on the file existence,

    7.  Create a temporary results array,

    8.  Traverse the array to fetch the file contents,

    9.  Create a final temporary resulting array.

    10. Iterate.

    Now, let's do the same with a *lazy* collection instance.

    1.  Do nothing before starting the *foreach* loop,

    2.  As soon as the iteration starts\...,

    3.  If the current element is even, then rename it,

    4.  if the file exists, then fetch its content,

    5.  Send the current result to the user.

    6.  Iterate.

    The fundamental difference is clearly highlighted here. With a
    traditional collection, the data collection will be traversed
    several times, and intermediate variables will be created while with
    a *lazy* collection, the data will only be traversed once and no
    intermediate variable will be created.

    To put it simply, a *lazy* code will be more lenient with the use of
    allocated memory than with a traditional code.

    To conclude, a traditional collection will favor a **consecutive**
    execution while a *lazy* collection, a **transversal** execution.

    It is thus among others this technique which is used in
    `loophp/collection`.

    The result of one or more operations is
    *executed/compiled/performed/call-it-whatever-you-want* only when we
    iterate over the results, never before (*except for a few exceptions
    out of context*).

    So that's why the adjective *lazy* takes on its full meaning,
    everything is always done at the *last moment*, a bit like me when I
    had to study, always at the last minute!

    Hence also the fact that regardless of the volume of initial data,
    the library will only take care of a small part at a time and will
    stop only when it has finished going through them.

    Finally, to quickly get back to Doctrine, maybe one day there will
    be a way to inject the possibility of using another collection
    library\... *who knows*?

2.  **We at AFUP love curry, sweet, smoked \... sorry? What? Ah! Is
    curry a style of writing code? Can you explain to us what this style
    is?**

    I love curry too, both in my dishes and in the code, if not more!

    The term comes from the name of the American mathematician Haskell
    Curry, yes, Haskell like the programming language!

    The following definition explains it very well: The *curryfication*
    is the transformation of a function with **multiple** arguments to a
    function with **one** argument (*unary function*) which returns a
    function on the rest of the arguments.

    Let's take a trivial example: the `implode ()` function. This
    function is called *binary* and we must succeed in transforming it
    into a function called *unary*.

    ::: {.center}
    *But how is this possible? To be carried out, this function will
    always need 2 arguments!*
    :::

    The *curryfication* of this function would therefore amount to
    creating a new function *unary* which admits the first argument
    `$separator`, which in turns, returns a function which admits the
    second argument `$strings` and which in turns returns the final
    result. Example:

        $implode = fn(string $separator) => fn(array $strings) => \implode($separator, $strings);

    And voila! We can now easily create as many *unary* functions as we
    want. For example, we want a function that *implode* with a hyphen
    or a comma:

        $implodeWithDash = $implode('-');
        $implodeWithComma = $implode(',');

    Which can be used like this:

        $input = ['a','b','c'];
        $implodeWithDash($input); // a-b-c
        $implodeWithComma($input); // a,b,c

    That said, nothing prevents us from also using our new `$implode`
    function like a traditional one:

        $implode(';')(['g','h','i']); // g;h;i

    The advantage of this technique invented in the 70s (*not so old!*)
    makes it easier to compose operations developed using several other
    functions. It also makes it easier to rewrite code, write less code
    as well as write less imperative and more declarative code, more
    functional programming oriented.

    Now, to come back in the context that matters to us today, namely
    the *lazy* collections and more especially `loophp/collection`.

    I have used this technique almost everywhere. Indeed, when you pass
    arguments in the class constructor, there is a good chance that
    these arguments will be kept in memory via properties. And so, in
    order to reduce the memory footprint and reduce the size of the
    code, I *spiced up* my code using the *curryfication*.

    It taught me a lot of things and the greatest gift was being
    interested in functional programming, it opened me up eyes on a
    myriad of fabulous concepts. This is how I started learning the
    *Haskell* language, and I was able to put into practice concepts
    that are generally used in functional languages with contribution in
    the PHP code, and in particular in `loophp/collection`.

    Implicitly, I was more efficient in my way of programming, of using
    the *function-first, data-last* technique or to discover tacit
    programming (or *point-free-style*).

    The use of these techniques allowed me to be very strict at the
    typing level and thus facilitate the static analysis.

3.  **Pol, you are Belgian: can you tell us about the community of
    developers in Belgium? Do you have the equivalent of AFUP,
    opportunities to meet?**

    Indeed, I am Belgian with Italian origin and I consider myself a
    European. It's probably my work environment at the European
    Commission which has accentuated this way of seeing things. From
    what I remember I already felt it like that from a young age, my
    parents did their job well.

    At the start of my career, I got involved a lot in the Drupal
    community for which I do not contribute any longer. I went to the
    four corners of the planet to attend conferences and workshops.

    Very recently and for multiple reasons, I reoriented my career in
    order to focus on a more *corporate* and professional use of PHP,
    without Drupal. I do not regret my choice, except that I miss my old
    colleagues, especially in this atypical time.

    Belgium is full of PHP devs and generally they are never without a
    job! Many of them work at the European Commission, there is a lot of
    activity around Drupal. Coming from these regions, I know almost all
    of them and I greet them warmly!

    For the gender distribution, the world of development seems to be a
    world of men, the only *female* developers I know can be counted on
    the fingers of one hand, I greet them also at the same time!

    From a strictly personal point of view, I have never felt any
    discomfort from anyone regarding the gender, I have the impression
    that so few women are present because of old ways and customs.
    Changes in mentalities are still to be made to get out of the
    preconceived patterns of the past. Even if a lot of effort has been
    made, the water will still have to flow under the bridges, to erase
    the prejudices and deconstruct in some heads that women, just like
    men, can be what they want and not only good at the tasks that have
    always been assigned to them since the dawn of time. And of course,
    this is also true for men who wish to get into trades mainly
    represented by women such as nurses, nursery nurses and so on.

    Regarding a community similar to AFUP, I only know [PHP
    Benelux](https://www.phpbenelux.eu/) and I attend meetings
    regularly. I must admit that I am very envious of the effervescence
    and communities that I can see in your country.

    And finally, about 6 years ago and I decided to relocate and I
    completely stopped traveling and getting involved so much to try in
    order to devote myself to my renovation projects.

    Since then, I slowly take the fold, hence my submission of a
    presentation or I thank you already for having it chosen, I can't
    wait to present it to you all.
