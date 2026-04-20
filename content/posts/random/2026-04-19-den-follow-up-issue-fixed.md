---
date: 2026-04-19
tags:
  - Infrastructure As Code
  - Nix
  - Den
  - Configuration Management
title: "Den Framework Follow-up: Issue Fixed !"
images:
  - /images/PXL_20260412_084121757-EDIT.jpg
image_copyrights: "Da-dedup... da-dedup... da-dedup, dedup, dedup... Local street tag art, April 2026"
draft: false
---

9 days ago, I published [Evaluating Den - A Dendritic Configuration
Framework]({{< ref "2026-04-10-evaluating-den-a-dendritic-configuration-framework" >}}), where I described a real
modelling issue I hit while evaluating [`vic/den`](https://github.com/vic/den) framework for my infrastructure.

Today, on April 19, 2026, less than 10 days later, that issue is now fixed. I was not expecting such a quick turnaround,
and I am very happy to share the story, again.

The concrete fixes landed in [`vic/den#468`](https://github.com/vic/den/pull/468), and it was made possible by the deep
internal refactor from [`vic/den#462`](https://github.com/vic/den/pull/462), which reworked Den's resolution core around
[`vic/nix-effects`](https://github.com/vic/nix-effects).

This is a great moment for the framework: [Jason](https://github.com/sini), the author of both PRs, not only fixed the
bug but fundamentally evolved the core engine, just that.

TLDR: this is exactly the kind of open-source feedback loop you hope to see but rarely get this fast.

<!--break-->

## What Was Broken

In the previous post, I showed a `1 -> N` topology where aspects containing both `nixos` and `homeManager`
configurations were forwarded to multiple users.

That created duplicate host module declarations when the same aspect reached resolution through overlapping paths. As an
example, when multiple users include the same aspect that emits host-level options, those options were emitted multiple
times:

```console {lineNos=inline}
error: The option `boot.kernelPackages' is defined multiple times while it's expected to be unique.
```

## What Changed

PR [`vic/den#468`](https://github.com/vic/den/pull/468) introduces **module-level deduplication for host-aspects overlap
support**.

The key idea is excellent:

- Named aspects now carry a stable identity key on collected modules (pattern: `<class>@<identity>`)
- Deduplication happens across independent resolve paths when those keys match
- Anonymous or synthetic aspects are intentionally excluded from this keying so legitimate repeated anonymous includes
  can still coexist

Visually, this is the difference:

```goat {caption="Before: overlapping paths could re-emit the same host-level module and collide"}
               +--------------+
               | Host (Igloo) |
               +--------------+
                 ^          ^
                 |          |
                 |          |
                 |          |
    +------------.-+      +-.------------+
    | User (Alice) |      |  User (Bob)  |
    +--------------+      +--------------+
      ^      ^                 ^       ^
      |      '-----------.     |       |
      |                  |     |       |
      |          .-------|-----'       |
      |          |       |             |
    +-.----------.--+ +--.-------------.-+
    | Aspect (Base) | | Aspect (Desktop) |
    +---------------+ +------------------+
```

Result: host-level options can be emitted twice and collide.

_Wait, isn't Nix supposed to be declarative ?_ Yes, but the previous engine was effectively building a giant set of
definitions by traversing a tree. When two paths included the same aspect, the engine "saw" two different instructions
to define the same option. Without a reliable way to identify that these were actually the same logical instruction, it
had no choice but to error out.

```goat {caption="After: named module emissions are keyed, then deduplicated"}
       Path A [via alice]                   Path B [via bob]
  +------------------------+           +------------------------+
  | emit nixos@base        |           | emit nixos@base        |
  | key = "nixos@base"     |           | key = "nixos@base"     |
  +------------.-----------+           +-----------.------------+
               |                                   |
               '---------------.   .---------------'
                               |   |
                               v   v
                  +--------------------------------+
                  |       classCollector           |
                  |  seen "nixos@base" already ?   |
                  +----.------------------.--------+
                       |                  |
                 first time           duplicate
                       |                  |
                       v                  v
                +--------------+       +-----------+
                |   keep it    |       |  discard  |
                +------.-------+       +-----------+
                       |
                       v
             +--------------------+
             |  single module     |
             |  in final output   |
             +--------------------+
```

This fix was made possible by a large Den core rewrite in PR [`vic/den#462`](https://github.com/vic/den/pull/462).

That refactor moved resolution from legacy tree-walking into an
[effects-based pipeline](https://en.wikipedia.org/wiki/Effect_system), powered by
[`vic/nix-effects`](https://github.com/vic/nix-effects), which provides a _freer-monad effect layer in pure Nix with a
dependent type checker_. Do not be afraid of the jargon, I will explain what that means later, keep on reading!

Practically, this architectural shift made it much easier to express resolution concerns as composable handlers
(include, transition, constraints, collection, tracing), and to introduce robust deduplication behavior, precisely the
issue I had in my previous post.

Or said differently: [`vic/den#468`](https://github.com/vic/den/pull/468) is the fix users see,
[`vic/den#462`](https://github.com/vic/den/pull/462) is the groundwork that made this class of fix much cleaner to
implement.

### A Tiny Mental Model

Think of each step as: "I need `X`, here is what to do next with `X`".

With a very simple function:

```text
Function: makeWelcomeCard
Needs: personName, cityName
Result: "Welcome {personName} to {cityName} !"

Computation requests personName
  then requests cityName
  then builds the final sentence
```

The function itself does not know where `personName` or `cityName` come from. It just declares what it needs.

The handler is the part that answers, for example:

- personName = "Alice"
- cityName = "Brussels"

Then the same computation returns:

```text
Welcome Alice to Brussels !
```

This is exactly the algebraic-effects split:

- Computation: declares operations it needs
- Handler: interprets those operations

That separation lets Den encode concerns like constraints, transitions, tracing, and collection independently.

## What Is A Freer Monad, Practically ?

In practice, the useful mental model is: **algebraic effects with handlers**. If that still sounds abstract, think about
ordering food:

1. You request what you need (for example: "one coffee")
2. The kitchen decides how to fulfill it and sends the result back

Effects generalize that pattern. A computation can say "I need a hostname" or "I emit class `nixos`" then handlers
decide how to answer and how to continue.

Now it is true that if you are not into effect systems, "freer monad" can sound scary, but the practical idea is
straightforward. Instead of directly executing logic while recursively walking a tree:

1. You first build a _description_ of computations as effect requests plus continuations
2. Then you run that description through handlers that decide behavior

Briefly, a **free monad** is the classic way to model this idea: you represent a program as data first, and interpret it
later. In other words:

1. Build the program structure without executing effects immediately
2. Keep composition pure and testable
3. Run it later with an interpreter/handler that gives operational meaning

But here, Den uses a **freer monad** style, which is a more flexible variant that allows for more direct composition and
easier handling of effects without needing to build an explicit data structure for the entire program upfront.

In practice, you do not need to memorize the category theory ! Just understand that for Den, "_freer_" means each effect
handler can be implemented independently (like a plugin) without coordinating through a centralized, monolithic
interpreter. This is exactly what made extensions like the deduplication handler (`ctx-seen`) easier to add.

Why "_freer_" ? Historically, it comes from being "_more free_", in particular by making extensible effects easier to
model with fewer practical constraints in the representation. The name was popularized by the 2015 paper
[Freer Monads, More Extensible Effects by Oleg Kiselyov and Hiromi Ishii](https://dl.acm.org/doi/10.1145/2804302.2804319).

In the context of Den, the resolver no longer hardcodes every decision in one recursive traversal. It emits operations
like:

- `emit-include`: triggers the resolution of a sub-aspect
- `emit-class`: contributes a NixOS/Home-Manager module
- `register-constraint` / `check-constraint`: handles exclusion logic
- `chain-push` / `chain-pop`: tracks the "provenance" of an inclusion
- `into-transition`: walks context transitions
- `ctx-seen`: deduplicates context stages

And dedicated handlers decide what each means operationally. This is powerful because control flow becomes _data_.

```goat {caption="Legacy recursive style VS effects pipeline"}
                              |
  Legacy recursive walk       |  Effects pipeline
------------------------------+--------------------------
  resolve(aspect):            |  comp = aspectToEffect(aspect)
    for include in includes:  |  run(comp, handlers):
      resolve(include)        |    on emit-include --> recurse/skip
    collect classes           |    on emit-class   --> collect
    apply transitions         |    on into-transition --> dispatch
                              |    on check-constraint --> gate
                              |
```

### Analogy #1: Tree Traversal

A tree is a natural structure to see this clearly, since tree traversal is a concept most programmers have already
encountered at some point... _I hope_.

Imagine a tree where each node can contribute data, and children are traversed recursively:

```goat {caption="Same tree, two execution models"}
              +---------+
              |  root   |
              +--.---.--+
                /     \
               /       \
              v         v
         +--------+  +--------+
         | left   |  | right  |
         +--------+  +--------+

                   |
  Recursive model  |  Effects model
-------------------+----------------------------------------
  visit(root)      |  send visit(root)
    collect(root)  |     --> handled by traversalHandler
    visit(left)    |     --> resume continuation
    visit(right)   |     send collect(root)
                   |      --> handled by collectorHandler
                   |      --> resume continuation
                   |     send visit(left)
                   |      --> handled by traversalHandler
                   |     send visit(right)
                   |      --> handled by traversalHandler
                   |
```

Both can traverse the same tree and produce the same final result. The difference is where control lives:

- Recursive model ([Visitor Pattern](https://en.wikipedia.org/wiki/Visitor_pattern)): the traversal policy is hardcoded
  inside `visit()`. This is the traditional, imperative way to walk a data structure.
- Effects model ([Event-based](https://en.wikipedia.org/wiki/Event-driven_programming)): the computation is essentially
  "event-based". It encodes the next steps via continuations, while handlers interpret effects and influence behaviour
  through state, forwarding, or even aborting.

That means you can change behaviour (deduplication, tracing, filtering, transition rules) by simply swapping or adding
handlers, instead of rewriting the entire traversal logic.

### Analogy #2: Parsers

If you come from a background in XML or HTML parsing, another excellent analogy is the difference between **DOM** and
**SAX** parsers:

- [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) parsers build and traverse an entire in-memory tree (much
  like the legacy recursive model).
- [SAX parsers](https://en.wikipedia.org/wiki/Simple_API_for_XML) are event-based, they stream through the document and
  fire events as they encounter elements.

Den's new effect-based resolver behaves more like **a SAX parser**. It emits signals (events) that are handled
incrementally.

And the best part ? This architectural shift yielded a staggering **~5 speedup** compared to the previous imperative
tree-walking implementation !!!

### Analogy #3: The Middleware Pattern

Another analogy, and it will be the last one, is HTTP middleware stacks. If you have worked with them, the pattern
should feel familiar.

In a middleware pipeline, each layer receives a request, optionally transforms it, and decides whether to pass it down
to the next layer or short-circuit and return a response early:

```goat {caption="Middleware pipeline VS effects handler chain"}
                         |
  HTTP middleware stack  |  Effects handler chain
-------------------------+----------------------------
  Request                |  send "emit-class"
     |                   |        |
     v                   |        v
  [Auth middleware]      |  [classCollector handler]
     |  pass / abort     |        |  resume / abort
     v                   |        v
  [Logging middleware]   |  [tracingHandler]
     |  pass / abort     |        |  resume / abort
     v                   |        v
  [Route handler]        |  [constraintHandler]
     |                   |        |
     v                   |        v
  Response               |  collected modules
                         |
```

Both allow you to compose independent concerns (logging, auth, deduplication) without mixing them into the core logic.

The key difference is scope: middleware operates on a single linear request/response cycle, while algebraic effects can
express more complex patterns like branching, tree traversal, shared mutable state between steps, and custom control
flow, all without changing the computation itself.

But the mental model is the same. If you are comfortable with middlewares, you already understand the core intuition
behind algebraic effects.

This is powerful because control flow becomes _data_. When control flow is data, you can add or swap behaviour without
rewriting the entire resolver. That is exactly the kind of flexibility that made the deduplication fix in
[`vic/den#468`](https://github.com/vic/den/pull/468) cleaner to express.

### Why This Helps With The Overlap Bug

The overlap bug was fundamentally about _how collected modules from different paths are reconciled_.

In an effect pipeline, that reconciliation can live in collection/identity handlers and state, instead of being tangled
with traversal mechanics.

```goat {caption="Effectful collection with keyed dedup"}
 +------------------+      send emit-class      +---------------------------+
 | aspectToEffect() | ------------------------> | classCollector handler    |
 +------------------+                           | state: map[key] -> module |
            ^                                   +-------------+-------------+
            |                                                 |
            |                                                 | key = class@identity
            |                                                 |
            |                                                 v
            |                                +---------------------------------+
            |                                | if key exists: keep only one    |
            |                                | else: insert                    |
            |                                +----------------+----------------+
            |                                                 |
            '---------------------- resolve-complete <--------'
```

So the technical win is not just "deduplication was added". The deeper win is **architectural**: Den now has a
resolution model where this kind of policy is easier to implement, reason about, and evolve.

## Community Moment

On top of being a really cool technical achievement, another aspect of this story is the open-source social feedback
loop in action.

I [validated the fix](https://github.com/vic/den/pull/468#pullrequestreview-4134967944) proposed by
[`@sini`](https://github.com/sini), reviewed by [`@theutz`](https://github.com/theutz), and was merged not so long
after.

Victor wrote me privately today and I share this with his permission, because it captures exactly why I love open
source:

> "I really love that Den is no longer just me... I came back from day-of-rest and found a PR by sini, approved by
> theutz and validated by you saying this fixes your blog post. I love this."

That message made my day. Thank you to everyone who contributed to this great project.

Another great part of this refactor is that it is **backward compatible**. While the "guts" of Den were swapped out,
existing aspects and configurations stay exactly the same. You just get a smarter resolver that handles overlapping
topologies better.

One thing that might come back soon thanks to this fix is **builtin bidirectionality**. Vic mentioned that since we can
now reliably deduplicate host-level modules, we might be able to let host-aspects contribute user-level classes (like
`homeManager`) to all its users automatically, without people having to use any manual bridge batteries. This would be a
massive ergonomic win for complex setups.

## Does This Remove The Modelling Challenge ?

No, and that is important.

The fix resolves the concrete overlap/duplication failure I documented. That is a real improvement for users and
ergonomics.

But my previous core argument still stands:

- Frameworks can reduce accidental complexity
- They cannot erase essential policy complexity

You still need to model ownership boundaries and activation semantics explicitly when your topology becomes non-trivial.
The difference now is that Den's core engine will handle this much more gracefully.

## Updated Evaluation

After this week, my evaluation of Den is stronger than before:

- The framework is technically ambitious and keeps improving quickly
- The architecture is becoming more explicit and more extensible
- The community process is already healthy: users report, contributors fix, maintainers enable and guide
- I am planning to finalise and merge [`drupol/infra#124`](https://github.com/drupol/infra/pull/124) very soon so I can
  start using Den by default for my own infrastructure.

In infrastructure tooling, correctness is critical. In open source, responsiveness is critical. Seeing both in action in
under 2 weeks is impressive.

## Closing Thoughts

I wrote the previous post to document a real limitation I encountered. I am writing this one because the limitation is
now fixed.

That is the full story we should tell:

- Report problems clearly, in other words, avoid the [XY problem](https://en.wikipedia.org/wiki/XY_problem)
- Reduce them to reproducible models, provides a failing test case, that helps maintainers understand the issue
  concretely
- Validate fixes publicly, so everyone can learn from the process and see the improvement in action
- Credit the people who did the work, because open source is a team sport and we should celebrate wins together

Huge thanks again to [Victor](https://github.com/vic), [Jason](https://github.com/sini),
[Michael](https://github.com/theutz), you rocks ! [For sure 😎 !](https://www.youtube.com/watch?v=zOQI49l6hfo)

Back to finalising [`drupol/infra`](https://github.com/drupol/infra)...
