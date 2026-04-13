---
date: 2026-04-10
tags:
  - Infrastructure As Code
  - Home Manager
  - Nix
  - Den
  - Aspect-Oriented Programming
  - Configuration Management
  - Software Architecture
title: "Evaluating Den - A Dendritic Configuration Framework"
images:
  - /images/mike-imura-pattern.png
image_copyrights: Mike Imura's Non-Periodic pattern (https://arxiv.org/abs/2506.07638)
draft: false
---

I am currently rewriting again my infrastructure repository, now renamed
[`drupol/infra`](https://github.com/drupol/infra), and documenting the work on an ongoing draft pull request:
[`#124`](https://github.com/drupol/infra/pull/124).

After [my previous rewrite]({{< ref "2025-05-01-refactoring-my-infrastructure-as-code-configurations" >}}) based on a
_feature-first_ mindset, I wanted to push the architectural concept further using
[`vic/den`](https://github.com/vic/den), a Nix framework built around aspects, context transformations and
[_dendritic_](https://github.com/mightyiam/dendritic) pattern.

The short version: Den is impressive, genuinely powerful, and intellectually satisfying. However, while experimenting
with it in a real infrastructure, I ran into an architectural constraint that feels deeper than any specific framework.

This post explores that specific problem: a collision of cardinality, scope, and ownership in declarative configuration.

<!--break-->

## Why Den Looked Like the Right Next Step

[Den](https://github.com/vic/den) models "[_dendritic_](https://github.com/mightyiam/dendritic)" configuration as:

- [Aspect-oriented](https://en.wikipedia.org/wiki/Aspect-oriented_programming) configuration (handling cross-cutting
  features)
- Context pipeline transformations (e.g., mapping `host` -> `user`, with optional reverse relationships)
- Per-class outputs (`nixos`, `homeManager`, and others)

This maps beautifully to how I think about modular infrastructure.

If a feature is `desktop`, I want to define it **once**, then have it intelligently influence **all relevant
configuration domains**. At first glance, this is exactly what Den enables.

## A Minimal Example

To illustrate the problem, let's look at a minimal example.

```goat {caption="Topology of a simple dendritic configuration with 1 host, 1 user and 2 aspects"}
                                +-------------------+
                                |   Host (igloo)    |
                                |     - nixos       |
                                +-------------------+
                                  |       |       |
                    .-------------'       |       '-------------.
           includes |                owns |            includes |
                    v                     v                     v
          +---------------+       +---------------+       +------------------+
          | Aspect (base) |       |  User Aspect  |       | Aspect (desktop) |
          | - nixos       |       |    (alice)    |       | - nixos          |
          | - homeManager |       +---------------+       | - homeManager    |
          +---------------+         |           |         +------------------+
                                    |           |
                         includes   |           |   includes
                      .-------------'           '-------------.
                      |                                       |
                      v                                       v
             +-----------------+                 +-----------------+
             | Built-in Aspect |                 | Built-in Aspect |
             |   define-user   |                 |   primary-user  |
             +-----------------+                 +-----------------+
```

This is not my actual configuration, but a simplified version that captures the essence of the issue.

```nix {lineNos=inline}
{
  lib,
  den,
  ...
}:
{
  # Enable HomeManager for all users by default
  den.schema.user.classes = lib.mkDefault [ "homeManager" ];

  # Define a host `igloo` with one user `alice`
  # This implicitly creates the `igloo` and `alice` aspects, which we can then extend
  den.hosts.x86_64-linux.igloo.users = {
    alice = { };
  };

  # Extend the `alice` aspect that includes user definition and primary user role
  den.aspects.alice = {
    includes = [
      # These aspects are built-in, see: https://den.oeiuwq.com/guides/batteries/
      den.provides.define-user
      den.provides.primary-user
    ];
  };

  # Extend the `igloo` aspect that includes `base` and `desktop`, plus some NixOS options
  den.aspects.igloo = {
    includes = with den.aspects; [
      base
      desktop
    ];

    nixos = {
      boot.loader.grub.enable = false;
      fileSystems."/".device = "/dev/null";
    };
  };

  # Define the `base` aspect that includes both Home Manager and NixOS options
  den.aspects.base = {
    homeManager = {
      home.stateVersion = "25.11";
    };

    nixos =
      { pkgs, ... }:
      {
        boot.kernelPackages = pkgs.linuxPackages_latest;
        system.stateVersion = "25.11";
      };
  };

  # Define the `desktop` aspect that includes both Home Manager and NixOS options
  den.aspects.desktop = {
    homeManager = {
      programs.firefox.enable = true;
    };

    nixos = {
      services.desktopManager.plasma6.enable = true;
    };
  };
}
```

Conceptually, this delivers exactly what aspect-oriented configuration promises:

- One conceptual feature (e.g., `base`, `desktop`)
- Multiple configuration targets (e.g., `nixos`, `homeManager`)

In practice, this is where the friction begins.

## Propagation Scope

If we evaluate the configuration above, we hit an immediate snag:

```console
$ nix build .#nixosConfigurations.igloo.config.system.build.toplevel

error: The option `home-manager.users.alice.home.stateVersion' was accessed but
has no value defined. Try setting the option.
```

The `home.stateVersion` defined in the `base` aspect is not propagating to the user `alice`.

Fear not ! Den anticipates this and provides a mechanism to establish a
[mutual provider relationship](https://den.oeiuwq.com/guides/mutual/#denprovidesmutual-provider):

```diff
@@ -7,6 +7,11 @@
   # Enable HomeManager for all users by default
   den.schema.user.classes = lib.mkDefault [ "homeManager" ];

+  # Allows you to define mutual configurations by letting you to define named
+  # aspects under `.provides.` to create explicit relationship between users and
+  # hosts. See https://den.oeiuwq.com/guides/mutual/#denprovidesmutual-provider
+  den.ctx.user.includes = [ den._.mutual-provider ];
+

@@ -24,10 +29,12 @@
   # Extend the `igloo` aspect that includes `base` and `desktop`, plus some NixOS options
   den.aspects.igloo = {
-    includes = with den.aspects; [
-      base
-      desktop
-    ];
+    provides.to-users = {
+      includes = with den.aspects; [
+        base
+        desktop
+      ];
+    };
```

Basically, this means that the `base` and `desktop` aspects included in the `igloo` host aspect will now be forwarded to
the users of that host, making the `homeManager` configuration available to `alice` as expected:

```goat {caption="Topology of the configuration with mutual provider forwarding ('to-users' relationship)"}
                                    +------------------+
                                    |   Host (igloo)   |
                                    |     - nixos      |
                                    +------------------+
                                      |      |       |
                   .------------------'      |       '------------------.
          includes |                    owns |                 includes |
                   v                         v                          v
  +------------------+              +------------------+              +------------------+
  |  Aspect (base)   |              |   User Aspect    |              | Aspect (desktop) |
  | - nixos          |              |     (alice)      |              | - nixos          |
  | - homeManager    |------------->|                  |<-------------| - homeManager    |
  +------------------+   to-users   +------------------+   to-users   +------------------+
                                      |              |
                           includes   |              |   includes
                      .---------------'              '---------------.
                      |                                              |
                      v                                              v
            +-----------------+                            +-----------------+
            | Built-in Aspect |                            | Built-in Aspect |
            |   define-user   |                            |  primary-user   |
            +-----------------+                            +-----------------+
```

A mixed aspect like `base` naturally contains both:

- **Host-level concerns (`nixos`)**: kernel packages, state versions, GPU drivers,...
- **User-level concerns (`homeManager`)**: shell aliases, desktop apps, user packages,...

This exposes a classic OS design problem: **the separation of Mechanism and Policy**.

The framework provides the _mechanism_ to pass configurations between contexts. But it cannot dictate the _policy_. If
an aspect is attached at the host level (`igloo` includes `base`), what exactly should happen for the users ? Do _all_
users get the `homeManager` payload ? Only some users ? Only the primary user ? Only users matching a specific role ?
`<you-name-it>` ?

The framework requires you to encode this intent. But as we scale, encoding this intent creates a deeper structural
issue, leading to more complex and less intuitive models.

## From 1->1 to 1->N

With a host and 1 user, forwarding host-selected aspects to users is trivial. The evaluation behaves exactly as
expected:

```console
nix-repl> nixosConfigurations.igloo.config.home-manager.users.alice.home.stateVersion
"25.11"

nix-repl> nixosConfigurations.igloo.config.home-manager.users.alice.programs.firefox.enable
true
```

The breaking point appears when we move from a `1->1` topology to a `1->N` topology. Let's add a second user, `bob`, to
the `igloo` host:

```diff
@@ -12,10 +12,11 @@
   # hosts. See https://den.oeiuwq.com/guides/mutual/#denprovidesmutual-provider
   den.ctx.user.includes = [ den._.mutual-provider ];

-  # Define a host `igloo` with one user `alice`
-  # This implicitly creates the `igloo` and `alice` aspects, which we can then extend
+  # Define a host `igloo` with users `alice` and `bob`.
+  # This implicitly creates the `igloo`, `alice` and `bob` aspects, which we can then extend
   den.hosts.x86_64-linux.igloo.users = {
     alice = { };
+    bob = { };
   };

@@ -27,6 +28,13 @@
     ];
   };

+  # Extend the `bob` aspect that includes user definition
+  den.aspects.bob = {
+    includes = [
+      den.provides.define-user
+    ];
+  };
```

The graph topology now looks like this:

```goat {caption="Topology of the configuration with 1 host, 2 users and 2 aspects, including mutual provider forwarding"}
                                        +-------------------+
                                        |   Host (igloo)    |
                                        |     - nixos       |
                                        +-------------------+
                      includes            |       |       |         includes
                  .-----------------------'       |       '----------------------.
                  |                          owns |                              |
                  |                       .-------+-------.                      |
                  v                       |               |                      v
  +------------------+                    v               v                    +------------------+
  |  Aspect (base)   | to-users  +--------------+   +--------------+  to-users | Aspect (desktop) |
  | - nixos          |---------->| User (alice) |   |  User (bob)  |<----------| - nixos          |
  | - homeManager    |-.         +--------------+   +--------------+   .-------| - homeManager    |
  +------------------+ |              |       ^       ^   |            |       +------------------+
                       | to-users     |       |       |   |            |
                       '--------------|-------|-------'   |            |
                                      |       |           |  to-users  |
                                      |       '-----------|------------'
                                      |                   |
                             .--------+--------.          |
                   includes  |                 |          | includes
                             v                 v          v
                  +-----------------+      +-----------------+
                  | Built-in Aspect |      | Built-in Aspect |
                  |  primary-user   |      |   define-user   |
                  +-----------------+      +-----------------+
```

But evaluation now fails with:

```console
error: The option `boot.kernelPackages' is defined multiple times while it's expected to be unique.

Definition values:
  - In `/nix/store/...-source/modules/igloo.nix, via option den.aspects.base.nixos'
  - In `/nix/store/...-source/modules/igloo.nix, via option den.aspects.base.nixos'

Use `lib.mkForce value` or `lib.mkDefault value` to change the priority on any of these definitions.
```

{{< alert type="info" header="Not Invented Here" >}}

In software engineering, this is analogous to [the Diamond Problem](https://en.wikipedia.org/wiki/Multiple_inheritance),
exacerbated here by a cardinality mismatch.

In data modelling, this is analogous to a SQL
[join fan-out](https://discuss.google.dev/t/the-problem-of-sql-fanouts/119220): a host is unique (cardinality `1`), but
after joining through users (cardinality `N`) it gets duplicated, and when projected back to host scope it collides with
itself.

{{< /alert >}}

Because `boot.kernelPackages` is defined in the `base` aspect, and both `alice` and `bob` receive the `base` aspect from
the host, they both attempt to feed that host-level `nixos` configuration back up the evaluation graph.

In this demo, `base` and `desktop` are active on both the host path and the forwarded user paths, which is why a unique
host-level option can collide when cardinality moves from 1->1 to 1->N.

Visually, the evaluation graph looks like this:

```goat {caption="Evaluation graph with 1 host, 2 users and 2 aspects, showing the collision of host-level options when forwarded to multiple users"}
               +--------------+
               | Host (Igloo) |
               +--------------+
                 ^          ^
                /            \
               /              \
              /                \
  +--------------+          +--------------+
  | User (Alice) |          |  User (Bob)  |
  +--------------+          +--------------+
      ^      ^                 ^       ^
      |      '-----------.     |       |
      |          .-------|-----'       |
      |          |       |             |
      |          |       |             |
    +---------------+ +------------------+
    | Aspect (Base) | | Aspect (Desktop) |
    +---------------+ +------------------+
```

The host (cardinality of 1) receives the identical configuration twice from the users (cardinality of N), creating a
collision.

To fix this, we must make ownership boundaries explicit by splitting the mixed aspect into dedicated host and user
variants, as follows:

```goat {caption="Topology of the configuration with explicit ownership boundaries (split aspects) to resolve the 1->N collision"}
                                                +----------------+
                                                | Host (igloo)   |
                                                |   - nixos      |
                                                +----------------+
                        to-users                   |  |  |  |  |                 to-users
          .----------------------------------------'  |  |  |  '-------------------------------------.
          |                       includes            |  |  |        includes                        |
          |                 .-------------------------'  |  '------------------------.               |
          |                 |                            |                           |               |
          |                 v                     .------+------.                    v               |
          |       +-----------------+             |     owns    |            +--------------------+  |
          |       |Aspect(base-host)|             v             v            |Aspect(desktop-host)|  |
          |       | - nixos         |    +--------------+ +--------------+   | - nixos            |  |
          |       +-----------------+    | User (alice) | |  User (bob)  |   +--------------------+  |
          v                              +--------------+ +--------------+                           v
  +-----------------+                       ^      |  ^     ^      |   ^                       +--------------------+
  |Aspect(base-user)|-----------------------'      |  |     |      |   '-----------------------|Aspect(desktop-user)|
  | - homeManager   |------------------------------|--'     '------|---------------------------| - homeManager      |
  +-----------------+                              |               |                           +--------------------+
                                           .-------+--------.      |
                                  includes |                |      | includes
                                           v                v      v
                                +------------------+    +------------------+
                                | Built-in Aspect  |    | Built-in Aspect  |
                                |   primary-user   |    |   define-user    |
                                +------------------+    +------------------+
```

And the complete corresponding configuration now looks like this:

```nix {lineNos=inline}
{
  den,
  lib,
  ...
}:
{
  den.ctx.user.includes = [ den._.mutual-provider ];
  den.schema.user.classes = lib.mkDefault [ "homeManager" ];

  den.hosts.x86_64-linux.igloo.users = {
    alice = { };
    bob = { };
  };

  den.aspects.alice = {
    includes = [
      den.provides.define-user
      den.provides.primary-user
    ];
  };

  den.aspects.bob = {
    includes = [
      den.provides.define-user
    ];
  };

  den.aspects.igloo = {
    includes = with den.aspects; [
      base-host
      desktop-host
    ];

    provides.to-users = {
      includes = with den.aspects; [
        base-user
        desktop-user
      ];
    };

    nixos = {
      boot.loader.grub.enable = false;
      fileSystems."/".device = "/dev/null";
    };
  };

  den.aspects.base-host = {
    nixos =
      { pkgs, ... }:
      {
        boot.kernelPackages = pkgs.linuxPackages_latest;
        system.stateVersion = "25.11";
      };
  };

  den.aspects.base-user = {
    homeManager = {
      home.stateVersion = "25.11";
    };
  };

  den.aspects.desktop-host = {
    nixos = {
      services.desktopManager.plasma6.enable = true;
    };
  };

  den.aspects.desktop-user = {
    homeManager = {
      programs.firefox.enable = true;
    };
  };
}
```

While this definitely solves the evaluation error, **it defeats the primary goal of aspect-oriented configuration**.

We no longer have a single, cohesive atomic cross-cutting feature. We have returned to rigidly separated data silos,
making the model more verbose and arguably less intuitive, potentially making the use of a framework less worthwhile.

## The Contextual Meaning of Features

This reveals an underlying truth: "Features" do not exist in a vacuum. In a multi-user environment, `base` or `desktop`
are not simple boolean toggles. Their meaning mutates depending on the bounded context they evaluate in.

As soon as a host has more than one user or another similar pattern, "including an aspect/feature" ceases to be a simple
import. It becomes a domain-modelling problem.

## Accidental vs. Essential Complexity

In his paper ([10.1109/MC.1987.1663532](https://doi.org/10.1109/MC.1987.1663532))
[_No Silver Bullet_](https://en.wikipedia.org/wiki/No_Silver_Bullet), Fred Brooks divides software engineering
difficulties into **Accidental Complexity** (clunky syntax, boilerplate) and **Essential Complexity** (the inherent
difficulty of the problem domain).

Frameworks like [Den](https://github.com/vic/den) brilliantly solve **accidental complexity**. They provide:

- Composition primitives: aspect inclusion, context transformations, and mutual providers
- Context-aware dispatch: allowing you to route configurations based on user roles, host types, or any custom context
  stage
- Modular organisation and deduplication patterns: defining features once and reusing them across contexts

But no framework can solve the **essential complexity** of policy:

- Who fundamentally _owns_ a feature ?
- How should a host-level capability cascade to multiple heterogeneous users ?
- Where do exceptions live ?

These are architectural decisions. They depend entirely on your specific infrastructure use case, your team constraints,
and your security posture. A framework cannot infer the "right" propagation rule because a universal rule does not exist
(yet ?).

## A Note About Den

I want to be explicitly clear: this post is not a criticism of [Den](https://github.com/vic/den), nor of
[Victor Borja](https://github.com/vic), its author.

> Victor has been consistently responsive, helpful, and genuinely friendly throughout my experiments. His work on Den is
> incredibly solid, and I appreciate his dedication enough to sponsor him on GitHub. (He is also the author of
> [`vic/import-tree`](https://github.com/vic/import-tree), which powers all my projects by default).

My goal here is to highlight a fundamental class of modelling constraints that _any_ framework will inevitably encounter
when reconciling host-level (`nixos`) and user-level (`homeManager`) boundaries at scale.

## Practical Consequences

My [previous rewrite]({{< ref "2025-05-01-refactoring-my-infrastructure-as-code-configurations" >}}) taught me to pivot
from _host-first_ to _feature-first_. Den confirms this is the right direction and provides superior building blocks to
achieve it, for sure 😎 !

At the same time, it made a deeper truth highly visible:

> Aspect-oriented composition improves how we express configuration, but it does not eliminate the need to strictly
> define ownership boundaries between entities.

The hard part of [IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code) is no longer "how to write this or that
module". The hard part is deciding which entity has the authority to control activation semantics.

To resolve this in practice, engineers usually adopt one of these strategies:

- Splitting Aspects: Separating mixed features into explicit host and user variants (sacrificing cohesion), defeating
  the primary goal of aspect-oriented configuration.
- Capability Gating: Adding metadata to users to gate user-level activation (adding overhead).
- Role-Driven Forwarding: Building custom context layers to route configurations based on roles.
- Convention over Configuration: Dictating rules like "Hosts include infrastructure features; users include experience
  features"

All of these are **valid**. None of them are **free**. Each strategy forces you to encode _policy_.

## The Real Evaluation Criterion

I started this migration asking: _"Which framework should I use ?"_ I now realise the better question is: _"Which
framework makes my policy decisions explicit, easily adaptable, and maintainable in the long run ?"_

Den scores exceptionally high here. It gives me enough control to model my intent precisely, right down to custom
context stages and dispatch strategies. But it is not a _silver bullet_ (_No pun intended !_). It does not absolve the
engineer of the responsibility to define ownership and map out cardinality boundaries.

## Conclusion

This rewrite is still in progress, and I still have open questions before merging PR
[`#124`](https://github.com/drupol/infra/pull/124).

The main takeaway so far is a timeless engineering lesson:

- Frameworks have the potential to reduce accidental complexity.
- Frameworks cannot remove essential complexity.

In configuration management, that essential complexity is almost always found at the boundaries: host vs. user,
mechanism vs. policy, and cohesion vs. specificity.

I am still exploring the most elegant shape for these boundaries in my own setup. If you have faced similar
trade-offs—whether with Den, flake-parts, or another framework: **I would love to hear how you modeled them**.
