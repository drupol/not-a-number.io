---
date: 2025-05-01
tags:
  - Infrastructure As Code
  - Home Manager
  - Nix
  - Flake Parts
  - Configuration Management
title: Refactoring My Infrastructure As Code Configurations
images:
  - /images/124550633-EFFECTS.jpg
image_copyrights: Blocks, building blocks everywhere
draft: false
---

The [`drupol/nixos-x260`](https://github.com/drupol/nixos-x260) repository
[began](https://github.com/drupol/nixos-x260/commit/c14c90c2dbf6fa861eabaea23467561be9cda63b) as a simple and practical
way to manage the configuration of my Lenovo ThinkPad X260 laptop, hence the (bad) name. Unsurprisingly, I quickly
became hooked on the [NixOS](https://nixos.org/) Linux distribution, and before long, I was running it on every machine
I owned... first at home, then even at work (shhht!). As the obsession grew, so did the project. It naturally expanded
to support a wide variety of systems: from a simple Intel-based laptop, to a Raspberry Pi router tucked away in the
basement, and even an old [iMac from 2012](https://github.com/NixOS/nixos-hardware/pull/1089). Each machine came with
its own quirks and specific requirements. Like many personal setups, what started as a clean and elegant solution
gradually evolved into a tangled web of host-specific hacks and duplicated logic.

For a long time, I kept postponing a proper rewrite, procrastinating
["like a boss"](https://www.youtube.com/watch?v=NisCkxU544c). I was daunted by the scale of the work and, frankly,
didn't yet have a clear vision (or the knowledge?) to pull it off. The ideas I had in mind were just out of reach.

But eventually, the moment came. I decided to start over. From scratch. No more excuses.

## The Case for Declarative Infrastructure

{{< figure src="/images/Screenshot_20250501_093909.png" caption="Source: Dellaiera, P. (2024). Reproducibility in Software Engineering. https://doi.org/10.5281/zenodo.12666898" class="img-fluid" >}}

When it comes to managing systems at scale, not all approaches are created equal. Over time, three primary models of
configuration management have emerged. Each of them with their strengths, limitations, and implications for
reproducibility and maintainability.

#### Divergent Configuration Management

This is the most traditional and error-prone approach (illustrated in Figure 15). Systems are configured manually by
individuals, leading to _configuration drift_ as changes accumulate over time without central oversight. What starts as
a uniform setup quickly turns into a collection of inconsistently configured machines, each with its own quirks and
undocumented changes. Reproducing these environments becomes nearly impossible, and **unpredictability becomes the
norm**.

#### Convergent Configuration Management

In this model illustrated in Figure 16, tools like [Ansible](https://www.redhat.com/en/ansible-collaborative),
[Puppet](https://www.puppet.com/), or [Terraform](https://developer.hashicorp.com/terraform) aim to bring systems back
into alignment with a desired state. While this improves consistency, it rarely guarantees it. Machines may "converge"
towards a shared configuration, but subtle variations and feedback loops can persist. It is an improvement over
divergence, but **not a cure** for non-determinism.

#### Congruent Configuration Management

This is the strictest and most reproducible model (illustrated in Figure 17). Systems are declared immutably, and their
configurations are enforced to be _identical_ from the outset. Drift is prevented rather than corrected. This is the
philosophy behind tools like Nix and Guix, which aim to provide deterministic, declarative environments that can be
reliably rebuilt and reproduced. While congruent systems can be less flexible for rapidly-changing needs, they offer
**unmatched** confidence in consistency and reproducibility.

So now you might wonder why go through all this trouble, why maintain a repository just to manage a few personal
machines? The answer is simple: **consistency, reproducibility, and peace of mind**. With NixOS, every machine is
configured declaratively, from A to Z, meaning I describe the desired state, and Nix ensures it gets there, reliably and
repeatably, following a **congruent configuration model**.

Unlike traditional Linux distributions where system configuration often involves manual tweaks and hard-to-track changes
(Divergent model, Figure 15), NixOS treats everything as code. This allows me to:

- Roll back broken changes instantly
- Rebuild any machine from scratch with a single command
- Share and reuse configuration across machines
- Track every change in version control
- Avoid "_it works on my machine_" problems entirely

This repository isn't just a bunch of
"{{<abbr title="Normally used to denote hidden files for configuration">}}dotfiles{{</abbr>}}", it is the **source of
truth** for my infrastructure. Whether it is a laptop, a desktop, or a headless server aggregating the dust in the
basement, I know exactly how it is configured, what services it runs, and how to reproduce it elsewhere.

## Why Start Over?

As the number of machines grew, maintaining host-centric configurations quickly became insufficient. Each host had its
own folder, its own system and home files, and often its own bespoke logic, even when the underlying requirements were
identical. Structuring everything hierarchically through folders seemed like a good idea at first, but it soon became a
burden. This approach simply did not scale. Adding a new machine or tweaking a shared setting meant copy-pasting or
rewriting the same patterns, and I hate repeating code. In fact, repetition in any programming language is often a
symptom of **poor design**.

More fundamentally, the original structure was organised around _where_ things applied (e.g. `imac`, `router`, `x280`,
`x13`) rather than _what_ they did (e.g. `desktop`, `dev`, `vpn`, `ssh`, `ai`, `virtualisation`). This design decision
had long-term implications, limiting modularity and reusability across the configuration.

## Goals for the Rewrite

- **Modularisation**: Create features organised by functionality rather than by host

  I want to be able to define features once and reuse them across different machines. This will make it easier to
  maintain the configuration and reduce duplication. The idea is to group configuration files by their purpose, and not
  by the machine they apply to. This will make it easier to share and reuse code across different machines.

- **Automatisation**: The loading of modules and configuration files

  Enough of dealing with manual file imports, I want to avoid manual loading of modules and configuration files. The
  system should automatically discover and load everything it needs dynamically.

- **Consistency**: Embrace a declarative and consistent approach to both NixOS and
  [Home Manager](https://github.com/nix-community/home-manager)

  I want to be able to declare my system and user configurations in a consistent way, using the same patterns and
  conventions across both NixOS and Home Manager. This will make it easier to understand and maintain the configuration.

- **Standardisation**: Modules can be reused across machines and configurations

  I want each module to be independent blocks, reusable across different machines and configurations. This will reduce
  code duplication and facilitate the maintenance.

- **Maintainability**: Facilitate the onboarding of new systems and their maintenance

  I want to make it simple to add new systems and maintain existing ones. This means reducing overall complexity,
  improving readability, and making it easier to understand how everything fits together.

## What Changed?

The [pull request](https://github.com/drupol/nixos-x260/pull/83) that introduced this change is a bit of a monster, but
it had to be. The massive diff is largely due to the introduction of
[NixOS Facter](https://github.com/nix-community/nixos-facter) and the inclusion of `facter.json` files. The large number
of files is also a result of splitting the configuration into smaller, more focused modules living in their own files.

Some parts of the old codebase still need to be migrated. I have temporarily moved them into a `_to_migrate` directory
and plan to refactor them gradually. Migration is tedious and slow. One of the reason is that I need to generate the
`facter.json` files on each machine while it is running. A few systems, like the Raspberry Pi router I had, have since
been decommissioned, so I no longer have access to it... but I still want to keep the configuration around, just in
case.

### Flipping the Configuration Matrix

The new version adopts a fundamentally different approach: **the configuration is now structured around features, not
hostnames**. It is a shift in the axis of composition, essentially an **inversion of configuration control**. What may
seem like a subtle change at first has profound implications for flexibility, reuse, and maintainability.

{{< figure src="/images/old-config.svg" caption="" class="img-fluid" >}} ->
{{< figure src="/images/new-config.svg" caption="" class="img-fluid" >}}

Instead of asking "what does the `<insert-machine-name-here>` need?", I now ask "which features does this machine
require?"

This shift enables:

- A feature like desktop support, VPN, SSH, or AI services to be implemented once as a reusable module
- All modules to live under a unified `modules/` directory, loaded automatically, once, no manual glue logic
- System declarations can possibly remain per host like the previous pattern, but most logic is now shared, reused, and
  easily maintained

## How It Works

This project is built using [`flake.parts`](https://flake.parts), a modular and composable framework for structuring Nix
flakes. Unlike traditional monolithic flake setups, `flake.parts` allows me to break down the configuration into
logical, reusable parts, each focused on a specific concern (e.g., formatting, NixOS modules, Home Manager modules).
This keeps the flake configuration clean and scalable, and more importantly, promotes maintainability, extensibility,
and collaboration.

The first step is enabling the [`modules` feature](https://flake.parts/options/flake-parts-modules.html) in
[`flake.parts`](https://flake.parts/), which allows you to define and aggregate modular custom configurations.

I define two types of modules:

- `nixos` modules for system-level configuration, for NixOS machines only
- `homeManager` modules for user-level configuration, for NixOS machines, but not only, could be applied to any machine
  running Home Manager

Together with [`vic/import-tree`](https://github.com/vic/import-tree), these modules are automatically discovered and
loaded. They are then aggregated by `flake.parts` into a single attribute set, which is used to build the final
configuration.

For example, here is a custom `flake.parts` module. It defines the fonts configuration for both the `dev` and `desktop`
features. No Home Manager configuration is defined here.

```nix
{
  flake.modules = {
    nixos.dev = { pkgs, ... }: {
      fonts.packages = with pkgs; [
        dina-font
        monaspace
      ];
    };

    nixos.desktop = { pkgs, ... }: {
      fonts.packages = with pkgs; [
        aporetic
      ];

      fonts.fontconfig = {
        defaultFonts = {
          monospace = [ "Aporetic Sans Mono" ];
          sansSerif = [ "Aporetic Sans Mono" ];
          serif = [ "Aporetic Sans Mono" ];
        };
      };
    };
  };
}
```

In the next example module, the module defines the `dev` and `desktop` Home Manager features. It does not define any
NixOS configuration.

```nix
{
  flake.modules = {
    homeManager.dev = {pkgs, ...}: {
      home.packages = with pkgs; [
        go
        php
        python3
        rustc
      ];
    };

    homeManager.desktop = {
      programs.firefox.enable = true;
    };
  };
}
```

Once in the `modules/` directory, these modules are automatically picked up by
[`vic/import-tree`](https://github.com/vic/import-tree) in the main `flake.nix` file:

```nix
{
  description = "My Nix infrastructure at home";

  inputs = {
    #...
  };

  outputs = inputs: inputs.flake-parts.lib.mkFlake { inherit inputs; } (inputs.import-tree ./modules);
}
```

> Note: This is the only place where `import-tree` is used !

The aggregated files are then merged into `config.flake.modules.nixos` by [`flake.parts`](https://flake.parts), thanks
to its built-in [`modules` feature`](https://flake.parts/options/flake-parts-modules.html). This merged configuration is
ultimately used to build the NixOS configurations, a core capability enabled by Nix flakes.

```nix
{
  inputs,
  lib,
  config,
  ...
}:
let
  prefix = "nixosConfigurations/";
in
{
  flake.nixosConfigurations = lib.pipe (config.flake.modules.nixos or { }) [
    (lib.filterAttrs (name: _: lib.hasPrefix prefix name))
    (lib.mapAttrs (
      name:
      let
        hostname = lib.removePrefix prefix name;
      in
      {
        name = hostname;
        value = inputs.nixpkgs.lib.nixosSystem {
          modules = [ config.flake.modules.nixos.${hostname} ];
        };
      }
    ))
  ];
}
```

Importantly, the file that declares this logic is itself also a [`flake.parts`](ttps://flake.parts/) module! Every file
in the project becomes a reusable building block, regardless of its location or filename. One of the major advantages of
this approach is that it enables the definition of multiple configurations within the same file. I can now declare both
NixOS and Home Manager modules side by side, and they will be automatically discovered and loaded without additional
wiring. Although I do not currently take full advantage of this, the flexibility is built-in and could prove valuable in
future scenarios.

To go one step further, it would be ideal to define a list of features for each machine and have both the system and
home configurations automatically assemble themselves accordingly. Look no further ! This is precisely the role of the
custom `loadNixosAndHmModuleForUser` function built for this project.

```nix
{
  inputs,
  ...
}:
{
  flake.lib = {
    loadNixosAndHmModuleForUser =
      config: modules: username:
      assert builtins.isAttrs config;
      assert builtins.isList modules;
      assert builtins.isString username;
      {
        imports = (builtins.map (module: config.flake.modules.nixos.${module} or { }) modules) ++ [
          {
            imports = [
              inputs.home-manager.nixosModules.home-manager
            ];

            home-manager.users.${username}.imports = [
              (
                { osConfig, ... }:
                {
                  home.stateVersion = osConfig.system.stateVersion;
                }
              )
            ] ++ builtins.map (module: config.flake.modules.homeManager.${module} or { }) modules;
          }
        ];
      };
  };
}
```

Finally, a host machine can declare its configuration as such:

```nix
{
  config,
  ...
}:
let
  modules = [
    "base"
    "x13"
    "bluetooth"
    "desktop"
    "dev"
    "displaylink"
    "games"
    "git"
    "sound"
    "vpn"
    "virtualisation"
  ];
in
{
  flake.modules.nixos."nixosConfigurations/x13" = config.flake.lib.loadNixosAndHmModuleForUser config modules "pol";
}
```

And _voila!_

The same pattern has been also successfully applied to another project of I did at work
[`ecphp/devs-profile`](https://code.europa.eu/ecphp/devs-profile/), a project offering user profiles, each packed with
command-line programs and configurations designed specifically for developers. Perhaps I will write a blog post about it
one day, but for now, I am happy to share that the same modular approach has been successfully applied there as well.

## Lessons Learned

The biggest challenge in this rewrite was learning to organise modules by purpose rather than by name. It required
unlearning the reflex to group files by machine. Instead, everything is now named for what it does: `desktop`,
`networking`, `shell`, `media`, `ai`, and so on.

This turns the repository into a toolkit. Each feature simply declares where it should be applied. Each module is a
building block that can be combined with others to create one or multiple custom configurations in the same files or
spread across multiple files.

## Trade-Offs

- Steeper learning curve

  Even after contributing to the [`flake.parts`](https://flake.parts/) framework through
  [a module](https://github.com/drupol/pkgs-by-name-for-flake-parts), it took me a while to fully grasp how
  [`flake.parts`](https://flake.parts/) works, not just in terms of its syntax, but also in understanding how the pieces
  fit together to build a clean and extensible structure. It is definitely the best Flake framework and it is simply out
  of this world! The power it offers is undeniable, but it requires a mindset shift and a solid understanding of the
  underlying model.

- Ongoing and time-consuming migration

  Migrating the existing host-centric setup to the new functionally-driven model has been a slow and occasionally
  painful process. Not everything has been ported yet, and some machines are still waiting for their facter.json files
  to be generated. I am progressing gradually as I need those systems, but it is definitely a long-term effort.

## Future Work

1. Continue maintaining and refining the repository

   While the new structure represents a significant improvement, I am not yet fully satisfied with it. There is still
   work to be done, particularly around completing the migration of older configurations to the new modular model. I
   have several ideas in mind for improvements, but they will require time and careful implementation.

2. Expose Home Manager configurations for composability

   One area I would like to explore further is how to expose individual Home Manager modules so they can be composed
   into reusable profiles. This would allow for the creation of more complex, user-specific setups without duplicating
   code. Each module should be exposed through the flake interface, enabling profile-based composition. I know it is
   technically possible, but I haven't yet figured out the right approach. This definitely warrants deeper
   investigation.

3. Create a Nix starter template to help newcomers to adopt this approach.

   I would like to build a lightweight, beginner-friendly template to help others adopt this modular approach to
   managing NixOS and Home Manager configurations. The goal is to offer a clean starting point that does not overwhelm
   new users, while promoting good practices and reducing the learning curve. It is a small contribution that could have
   a meaningful impact for those just getting started.

4. Rename the project

   The current name `drupol/nixos-x260` no longer reflects the scope or intent of the repository. It originated with my
   Lenovo ThinkPad X260, but the project has evolved far beyond a single machine. I would like to choose a name that
   better represents its purpose.

## Inspiration

I would like to thank [Shahar "Dawn" Or (mightyiam)](https://github.com/mightyiam) for
[pioneering](https://discourse.nixos.org/t/pattern-every-file-is-a-flake-parts-module/61271) this approach. My
repository is inspired by his work.

## Conclusion

This rewrite brings the project into a new era. It is cleaner, more scalable, and far easier to extend. Shifting from a
naming-based layout to a functionality-oriented one has made a world of difference.

Feel free to suggest improvements or ideas. I am always open to suggestions and would love to hear your thoughts on this
project. The project [`drupol/nixos-x260`](https://github.com/drupol/nixos-x260) is open-source and available on GitHub,
so feel free to check it out and contribute if you want.
