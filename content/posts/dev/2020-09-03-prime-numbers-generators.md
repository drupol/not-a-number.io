---
date: 2020-09-03
images: 
  - /images/milky-way.jpg
image_copyrights: Image from Pol Dellaiera
tags:
  - php
  - prime numbers
  - python
  - iterator
title: Prime numbers generation
---

## It all started from a book

I was reading the Open Source book from [Bartosz Milewski][bartosz website]'s '[Category Theory for Programmers][Category theory for programmers]' when I saw something about
[Prime numbers][prime number wikipedia]:

> A more interesting example is a coalgebra that produces a list of
> primes. The trick is to use an infinite list as a carrier. Our starting
> seed will be the list [2..]. The next seed will be the tail
> of this list with all multiples of 2 removed. It's a list of odd numbers
> starting with 3. In the next step, we'll take the tail of this list and
> remove all multiples of 3, and so on. You might recognize the makings of
> the sieve of Eratosthenes.

In Python language, it would be written as such:

```python
def naturals(n):
    yield n
    yield from naturals(n + 1)


def sieve(s):
    n = next(s)
    yield n
    yield from sieve(i for i in s if i % n != 0)


for i in sieve(naturals(2)):
    print(i)  # 2, 3, 5, 7, 11, 13, 17, 19, ...
```

How beautiful it is, isn't it ?

I really like the simplicity of this algorithm, which is [**2000 years old**][sieve of eratosthenes].

It's crazy to think that such an algorithm and finding a formula to find Prime numbers is always on the wildest thoughts
of every scientist in the world.

_Oh you didn't get the memo_ ? Let me remind it to you then... you can win 1 million dollars if you found the solution
to that problem !

Finding how Prime numbers are distributed across Naturals is one of the [Millenium Prize problems][millenium prizes],
if you find it too easy, you can pick another one. Cheers.

### How about in PHP ?

I just did a huge refactoring in [loophp/collection][loophp/collection github] and I know that PHP is not the best
language for this thing, but I wanted to try, you know, just to check if this is possible and compare it with the
Python syntax.

At first, I had no idea on how to do it at first. I was stunned by the beauty of this algorithm and surprised to have
never seen it before.

A quick look on Github has led me to some inspiration, and I started to code something and only after two days of
searching, I came up with this:

```php
<?php 

function primesGenerator(\Iterator $iterator): \Generator
{
    yield $primeNumber = $iterator->current();

    $iterator = new \CallbackFilterIterator(
        $iterator,
        fn(int $a): bool => $a % $primeNumber !== 0
    );

    $iterator->next();

    return $iterator->valid() ?
        yield from primesGenerator($iterator):
        null;
}

function integerGenerator(int $init = 1): \Generator
{
    while (true) {
        yield $init++;
    }
}

$primes = primesGenerator(integerGenerator(2));

foreach ($primes as $p) {
    var_dump($p); // 2, 3, 5, 7, 11, 13, 17, 19, ...
}
```

It's not as nice as Python, but it does the job. Unfortunately, it fails quite rather quickly when XDebug is enabled.

### Benchmarking

I also started to investigate how I could optimize the algorithm and made further research on it.

It turns out that this is erroneously called the "[Sieve of Eratosthenes][sieve of eratosthenes]".
It should have been called the "_[Sieve of Trial Division][trial division wikipedia]_".

That algorithm as it is now, is very suboptimal, because it's not "[postponed][postponed sieve]".
Any candidate number need only be tested by Primes not above its square root.
Implementing this will give an huge speedup and/because it'll greatly [minimize the stack usage][minimize the stack usage].

In order to check the efficiency of this algorithm compared to a better version, I scaffolded a benchmarking tool.

As most of my work is Open Source, I quickly spawned a [Github repository][github repository] and created some
benchmarks, using the great [PHP Bench][phpbench/phpbench github].

I implemented three different algorithms, they are almost the same with one difference:

* **Primes1**: Simple Sieve of Trial Division ([source][source primes1])
* **Primes2**: Sieve of Trial Division + Postponed (first try) ([source][source primes2])
* **Primes3**: Sieve of Trial Division + Postponed (second try) ([source][source primes3])

```
+-------------+--------------+--------------+------------+------------+-------+
| benchmark   | subject      | mean         | mem_peak   | mem_real   | diff  |
+-------------+--------------+--------------+------------+------------+-------+
| PrimesBench | benchPrimes1 | 32,100.196μs | 2,130,696b | 4,194,304b | 1.22x |
| PrimesBench | benchPrimes2 | 31,221.970μs | 2,133,376b | 4,194,304b | 1.19x |
| PrimesBench | benchPrimes3 | 26,274.643μs | 2,156,096b | 4,194,304b | 1.00x |
+-------------+--------------+--------------+------------+------------+-------+
```

**Primes1** is the basic algorithm based on [CallbackFilterIterator][CallbackFilterIterator] where the filter callback
is: 

```
static fn (int $a): bool => (0 !== ($a % $primeNumber))
```

Basically this is just a sieve of trial division.

**Primes2** is the same as **Primes1** but the filter callback is updated to: 

```
static fn (int $a): bool => (($primeNumber ** 2) > $a) || (0 !== ($a % $primeNumber))
```

There are two conditions in this callback:

1. Any candidate number (`$a`) need only be tested by Primes not above its square root.
2. The rest of the division of `$a` by the prime number is different from zero.

**Primes3** implements a custom [CallbackFilterIterator][CallbackFilterIterator] where the [accept method][accept method]
is overridden with the same filter callback as in **Primes2**.

To my amazement, the algorithm **Primes3** is the fastest. I still don't get why it's faster than **Primes2**, but I
guess I will found out sooner or later.

It would be nice to add more algorithms and see how they behave.

If you feel like helping me and do a deep dive, feel free to [clone the repo][github repository] and try it out by
yourself, you'll see, it's fun !

[bartosz website]: https://bartoszmilewski.com/
[Category theory for programmers]: https://github.com/hmemcpy/milewski-ctfp-pdf
[sieve of eratosthenes]: https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
[postponed sieve]: http://stackoverflow.com/a/8871918/849891
[minimize the stack usage]: http://stackoverflow.com/a/14821313/849891
[millenium prizes]: https://en.wikipedia.org/wiki/Millennium_Prize_Problems
[github repository]: https://github.com/drupol/primes-bench/
[CallbackFilterIterator]: https://www.php.net/manual/en/class.callbackfilteriterator.php
[accept method]: https://www.php.net/manual/en/callbackfilteriterator.accept.php
[trial division wikipedia]: https://en.wikipedia.org/wiki/Trial_division
[prime number wikipedia]: https://en.wikipedia.org/wiki/Prime_number
[loophp/collection github]: https://github.com/loophp/collection/
[phpbench/phpbench github]: https://github.com/phpbench/phpbench
[source primes1]: https://github.com/drupol/primes-bench/blob/master/src/Primes.php
[source primes2]: https://github.com/drupol/primes-bench/blob/master/src/Primes2.php
[source primes3]: https://github.com/drupol/primes-bench/blob/master/src/Primes3.php
