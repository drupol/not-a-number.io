---
date: 2024-01-18
images:
  - /images/galleria-umberto-napoli.jpg
image_copyrights: Gallerie Umberto, Napoli
tags:
  - random
  - algorithm
  - complexity
title: "Understanding Kolmogorov Complexity"
---

I often advocate for a straightforward yet effective rule: **the shortest solution that delivers the desired result is
usually the best**. This approach, favoring concise algorithms, not only ensures efficiency but also reduces maintenance
cost and bug susceptibility. Intriguingly, this practical principle finds its theoretical counterpart in data
compression algorithm, data analysis and machine learning through the
[Minimum Description Length](https://en.wikipedia.org/wiki/Minimum_description_length) (MDL) and the
[Kolmogorov Complexity](https://en.wikipedia.org/wiki/Kolmogorov_complexity). These concepts delve deep into the essence
of data representation and algorithmic efficiency.

The MDL principle is an invaluable tool. It is grounded in the concept of succinctly capturing information and is
essential in balancing model complexity with its explanatory power. The ideal model, according to MDL, is one that
minimizes the combined description length of the model and the data. This principle is not only pivotal in guiding model
selection but also reflects the deeper mathematical underpinnings of Kolmogorov complexity.

{{< figure src="/images/Screenshot_20240113_235324.png" width="512" class="w-100 text-center" >}}

Kolmogorov complexity is about the shortest possible description of an object within a given computational model. It
focuses on the simplest, most concise representation of data that a computer can use to reconstruct the original object.
However, it is crucial to understand that the Kolmogorov complexity is, just like the
[Halting problem](https://en.wikipedia.org/wiki/Halting_problem), inherently
[**uncomputable**](https://en.wikipedia.org/wiki/Computable_function). This means that even if we stumble upon the
shortest possible program that replicates a specific output, there's no definitive method to prove that there isn’t a
shorter program capable of achieving the same result. This uncomputability aspect of Kolmogorov complexity adds an extra
layer of fascination. It underscores a fundamental limitation in our ability to fully comprehend data representation's
simplicity, highlighting the provisional nature of our knowledge in data analysis and machine learning.

{{< figure src="/images/Screenshot_20240114_112557.png" width="512" class="w-100 text-center" >}}

Contrary to what Mortal Kombat fans might think, Kolmogorov complexity isn’t named after a final boss but after the
renowned Russian mathematician [Andrey Kolmogorov](https://fr.wikipedia.org/wiki/Andre%C3%AF_Kolmogorov), Kolmogorov
complexity offers a unique perspective on assessing data complexity. It diverges from traditional metrics by focusing on
information content rather than sheer size. This post is a very quick and dirty introduction to what Kolmogorov
complexity is, starting with its foundational principles and progressing to practical examples. Don't forget to check
out the disclaimer at the end of the post.

Let's introduce Kolmogorov complexity with the notion of _random_. What is the meaning of a random string? Let's
consider the following 64-character example strings, and evaluate together their perceived randomness:

1. `1111111111111111111111111111111111111111111111111111111111111111`
2. `1234567890123456789012345678901234567890123456789012345678901234`
3. `7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`

{{< alert type="warning" >}}The 64-character strings and their corresponding PHP code are used purely for illustrative
purposes to demonstrate the principles of Kolmogorov complexity. It is worth noting that these examples are
intentionally simplistic and not intended to represent optimal or real-world scenarios. The choice of 64 characters
serves as a convenient length for demonstration, making the concept approachable and understandable, even though in
practical applications, the length and complexity of strings might significantly vary. Furthermore, while PHP may seem
verbose in these instances, it is chosen for its simplicity and accessibility, especially for those not deeply versed in
programming. The key takeaway is not the length of the PHP code per se, but the underlying idea of Kolmogorov
complexity: the search for the simplest possible description or program that can generate a given output. Real-world
applications of Kolmogorov complexity often involve much longer strings and more intricate computations, where the
efficiency and conciseness of the description become markedly more pronounced and impactful.{{< /alert >}}

At a glance, the first string `1111111111111111111111111111111111111111111111111111111111111111` does not look like a
random string. It can be succinctly described as "_64 1's in a row_", therefore it has low Kolmogorov complexity. This
can be demonstrated in PHP. The length of the PHP code is 25 characters, significantly shorter than 64. This substantial
difference in length not only generates the entire string but also highlights its high compressibility rate, thereby
underscoring its very low randomness.

```php
echo str_repeat('1', 64); // 25 characters
```

The second string `1234567890123456789012345678901234567890123456789012345678901230` appears to be random and complex at
first glance. However, this string is a repetitive sequence of the digits from `0` to `9`. Much like the first string,
there's no much random in it and its Kolmogorov complexity is low. it can be described succinctly as "_the sequence 0 to
9 repeated 7 times and trimmed to 64 characters_". The length of the PHP code is 48 characters, which is shorter than
64, also hightlighting its high compressibility rate and therefore its low randomness.

```php
echo substr(str_repeat('1234567890', 7), 0, 64); // 48 characters
```

Here, the PHP code generates the string by repeating the sequence `1234567890`, effectively constructing the
64-characters string. The simplicity of this PHP code demonstrates that the string, despite appearing random and
complex, has a relatively low Kolmogorov complexity due to its underlying repetitive pattern. This example, along with
the previous ones, illustrates how Kolmogorov complexity is not merely about the visual complexity or length of a
string, but rather about how succinctly the string can be described or generated. The concept of randomness in
Kolmogorov complexity is closely tied to the absence of such describable patterns.

In the third key smashed example string `7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`, initially
seems to have high Kolmogorov complexity. It does not lend itself to a simple algorithmic description and therefore
appears incompressible and algorithmically random. The PHP code to generate this string, which includes the original
string itself, spans 72 characters, exceeding the original string's length. When the code to reproduce a string is
longer than the original string itself, it indicates a very low compressibility rate. This means the string cannot be
compressed further, thus suggesting its high level of randomness.

```php
echo '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'; // 72 characters
```

While all three strings have the same probabilistic chance of being randomly selected, their complexities vary. This
illustrates how randomness in Kolmogorov complexity is tied to the ability to describe patterns succinctly. This paradox
highlights that randomness transcends probability, linking instead to the presence or absence of patterns and the
succinctness of their descriptions. The shorter the description required, the less random the string is considered, as
seen with the first two strings. Conversely, a string requiring a more extensive explanation, due to lack of regular
patterns, is deemed more random, as with this very last example.

{{< figure src="/images/Screenshot_20240113_234749.jpg" width="512" class="w-100 text-center" >}}

The Kolmogorov complexity is not just about the subject itself but also about the language and tools used for its
description. Different programming languages or descriptive frameworks might have varying levels of conciseness for the
same concept. For instance, what is succinctly expressed in one language might be more verbose in another.

{{< alert style="info" >}}This can be found in the formal definition of Kolmogorov complexity:

$$ K_f(x) = \min \lbrace |p|: f(p) = x \rbrace $$

Interpreted, this formal definition states: The Kolmogorov complexity $K$ of a string $x$, relative to a Turing machine
$f$ (a programming language), is the length of the shortest program $p$ that outputs $x$ when run on $f$. {{< /alert >}}

An intriguing aspect of Kolmogorov complexity lies in its inherent uncertainty. This uncertainty stems from the
possibility that a shorter description for a given string may be discovered in a near or far future. Since the
Kolmogorov complexity is uncomputable, there's no definitive way to prove that a shorter description does not exist.

{{< figure src="/images/tim-and-eric-mind-blown.jpg" width="512" class="w-100 text-center" >}}

Knowing this, we can safely say that Kolmogorov complexity establishes an upper limit of complexity but not a lower one.
When we write a program to generate a particular output, this program serves as definitive evidence that the sequence's
Kolmogorov complexity is, at most, equal to the length of that program. However, this does not imply a minimum level of
complexity for the sequence. There is always the possibility that a shorter program capable of producing the same
sequence exists. Therefore, the true Kolmogorov complexity of a sequence remains simply unknown, with the potential for
more concise representations yet to be discovered.

The complexity assigned to data today might change as our understanding and technological capabilities evolve. This
means that while Kolmogorov complexity offers a valuable framework for assessing data complexity, its nature is
provisional. The complexity of a string reflects our current limitations and understanding, reminding us that our grasp
of data complexity is always subject to revision and improvement. From this perspective, a string is random if it is
incompressible, meaning it cannot be described by a shorter program. Conversely, a string is compressible if it can be
described by a shorter program.

{{< alert style="info" >}}Formally, this can be defined as: $$ K_f(x) \geq |x| $$

This means the Kolmogorov complexity relative to a Turing machine $f$ of a supposedly incompressible string $x$ is
always greater than or equal to the length of the string itself. In other words, the Kolmogorov complexity of a true
random string is always greater than or equal to its length. This is because the random string $x$ cannot be described
by a shorter program.{{< /alert >}}

To illustrate this, take the third example string `7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`,
initially seems highly complex. However, this string is actually the [SHA-256](https://en.wikipedia.org/wiki/Checksum)
hash of `Hello World!`. Knowing this, the string can be succinctly described as "_the SHA-256 hash of 'Hello World!'_";
reducing significantly its randomness and complexity. The length of the PHP code is now 36 characters, which is shorter
than 64.

```php
echo hash('sha256', 'Hello World!'); // 36 characters
```

The MDL principle and Kolmogorov complexity together offer profound insights into the very nature of information. MDL
provides a practical methodology for model selection in data analysis and machine learning, focusing on the balance
between simplicity and explanatory power. On the other hand, Kolmogorov complexity contributes a theoretical foundation,
underscoring the importance of succinctness and efficiency in information representation. This includes applications in
fields like data compression and number theory. The interplay between these two concepts highlights the critical
importance of considering both the chosen model and the language used for complexity assessment. As we delve further
into the intricacies of data and computation, grasping these principles thoroughly becomes ever more crucial. These
principles enhance our ability to effectively grasp and interpret the essence of information within our rapidly evolving
digital landscape.

{{< figure src="/images/fascinating.gif" link="https://www.youtube.com/watch?v=cFods1KSWsQ" caption="..., isn't it?" width="512" class="w-100 text-center" >}}

To go further into these topics, I highly recommend exploring the foundational ideas and detailed insights offered in
the following papers and resources which I used as references for this post:

- [A Brief Introduction to Kolmogorov Complexity](https://iuuk.mff.cuni.cz/~koucky/papers/kolmcomp.pdf) from
  [Michal Koucky](https://iuuk.mff.cuni.cz/~koucky/prof.html)
- [An Introduction to Kolmogorov Complexity and Its Applications](https://link.springer.com/book/10.1007/978-0-387-49820-1)
  from [Ming Li](https://pubmed.ncbi.nlm.nih.gov/?cmd=search&term=Ming+Li)
- [The Minimum Description Length Principle](https://mitpress.mit.edu/9780262529631/the-minimum-description-length-principle/)
  from Peter D. Grünwald
- [Kolmogorov complexity - a primer](https://jeremykun.com/2012/04/21/kolmogorov-complexity-a-primer/) from
  [Jeremy Kun](https://jeremykun.com/author/jeremykun/)
- [Kolmogorov complexity](https://brilliant.org/wiki/kolmogorov-complexity/) from [Brilliant](https://brilliant.org/)
- [Randomness, Information Theory, and Kolmogorov Complexity](https://medium.com/smith-hcv/randomness-information-theory-and-kolmogorov-complexity-6471e873bcd7)
  from [Ananda Montoly](https://medium.com/@anandamontoly)

{{< alert type="warning" header="Disclaimer" >}}I'm just an IT professional with a deep fascination for these kind of
concepts that resonates while writing code, sometimes without knowing that they are formally defined. My aim with this
post is to share my enthusiasm and understanding of Kolmogorov complexity and the MDL principle, hoping to spark
interest in others. While I strive for accuracy, I encourage readers to seek out more detailed and expert resources if
they wish to delve deeper into these intriguing subjects.{{< /alert >}}
