---
date: 2026-10-25
tags:
  - GitLab
  - OpenTofu
  - HCL
  - Nix
title: GitLab, OpenTofu, HCL and Nix
featureimage: images/PXL_20260818_114642350-16x9.jpg
images:
  - images/PXL_20260818_114642350-16x9.jpg
featureimagecaption: Geometric facade of a modern office building
draft: false
---

{{< abbr title="Too Long; Didn't Read" >}}TL;DR{{</>}}: _I use [OpenTofu] and [Terranix] to manage [GitLab] settings as
code, so changes can be reviewed in [Git] and manual edits do not quietly become the new normal._

[OpenTofu] started as a community fork of [Terraform]. They share the same basic idea: describe the desired state in
code, then let a provider bring the real service closer to it through its
{{< abbr title="Application Programming Interface" >}}API{{</>}}. Their paths are starting to differ, but the workflow
in this article should make sense to anyone familiar with either tool. It gives us a reviewable history of what we asked
the service to do, alongside a way to compare that with what it is actually doing.

I use [Terranix] to write that configuration in [Nix] and generate the input [OpenTofu] expects. This post focuses on
[GitLab], but the point is broader: keep service settings (e.g., [AWS], [GitHub], ...) in [Git], and let plans and
automation expose changes before they turn into unexplained differences in the live system.

Managing a few [GitLab] projects by hand is _OKayish_. Managing hundreds of repositories, users and permissions is a
different story.

## The problem: ClickOps drift and inconsistent projects

Each [GitLab] project can have its own settings, including permissions, memberships, protected branches, merge request
approval rules and custom hooks.

> [!NOTE]
> Even finding all those settings can be a challenge. After years of using the GitLab
> {{< abbr title="User Interface" >}}UI{{</>}}, I still come across settings pages I have never seen before,
> _#truestory_. At this point, I suspect the settings menu unlocks new levels with each release !

![I have no idea of what I am clickopsing meme](/images/i-have-no-idea-of-what-i-am-clickopsing.jpg)

Managing these settings by hand through [GitLab]'s web interface is what I would call "_ClickOps_": clicking through the
interface to change live settings. This is an _imperative_ approach: somebody uses [GitLab]'s web interface to make
changes, one action at a time. A _declarative_ approach is the opposite: it describes the desired configuration, and
automation works out how to apply it to [GitLab].

_ClickOps_ makes changes **hard to track**. Well, not quite true: there might be some [audit events], depending on the
system and its available features. But these do not necessarily provide a complete, versioned record. To illustrate
this, there is no way in [GitLab's audit event log] to know when a repository has been created and by whom.

![Infrastructure As Click - Always Has Been](/images/infrastructure-as-click-always-has-been-meme.jpg)

> [!CAUTION]
> Those reluctant to adopt a more "_GitOps-oriented approach_" might argue that ClickOps is quicker, and they might be
> right. The idea behind Infrastructure as Code ({{< abbr title="Infrastructure as Code" >}}IaC{{</>}}) is to keep the
> desired configuration in version control, where changes can be reviewed, approved and reverted, making the process
> transparent, traceable and auditable.

At scale, the complexity grows linearly with each added [GitLab] project or group and the work becomes ~~much harder~~
totally impossible: every project brings its own settings to track and keep consistent.

I see at least two problems here:

- **ClickOps causes configuration drift**: the live settings can diverge from the record of what we intended.
- **Projects become inconsistent**: settings or security policies that should be shared can vary from one repository to
  another.

In an enterprise setting, such inconsistencies can violate organisational policy. Since [GitLab] does not provide a
general way to disable edits in its web interface, teams need controls over who can make changes and regular checks to
detect and correct drift.

![Forms, settings, buttons everywhere meme](/images/forms-settings-buttons-everywhere.jpg)

{{< alert icon="comment" >}}
How do you know whether all projects follow the same security policies ? Who changed a particular permission, and why ?
When did they change it ? How can you reproduce a configuration ? How do you detect settings that have changed outside
the agreed process ? Most of all, how do you keep track of each and every single user and their memberships ?
{{< /alert >}}

## From ClickOps to DevOps

Based on [Wikipedia's definition], DevOps is the **integration and automation** of software development and information
technology operations.

For this [GitLab] use case, that means **treating operational settings just like application code**. The goal is not
simply to replace clicks with a script, but to make changes repeatable and traceable **through automation**.

{{< alert icon="comment" >}}
So how could we put that into practice ?
{{< /alert >}}

The most direct option would have been to do some scripting and call [GitLab's API] using
{{< abbr title="Representational State Transfer" >}}REST{{</>}} (e.g., with [`curl`]). That would work for a few
settings, but [GitLab's API] is large. The script would soon need to handle many resource types,
{{< abbr title="Application Programming Interface" >}}API{{</>}} details and edge cases. We would also need to build our
own mechanism to compare the desired configuration with the live state and keep track of that state. Reimplementing that
machinery did not seem worthwhile, reinventing the wheel is pointless especially when better tools already exist.

[GitLabForm] was the next option I evaluated. It worked for the proof of concept, but it did not offer the resource
lifecycle and planning workflow we wanted.

> [!TIP]
> GitLabForm was not available in Nix,
> I fixed this along the way in [NixOS/nixpkgs#573811]

The natural next step was [Terraform]/[OpenTofu] with the [GitLab provider]. The provider is maintained by [GitLab]
itself, which made it an **obvious** and **natural** choice for this project.

> [!NOTE]
> [OpenTofu], a fork of [Terraform], is used throughout the rest of this article. I prefer [OpenTofu] because it offers
> a [fully open-source alternative], stricto sensu according to the [Open Source Initiative]
> ({{< abbr title="Open Source Initiative" >}}OSI{{</>}}) definition.

It gave us several benefits:

- A stateful model of managed resources
- A plan showing proposed changes before applying them
- Dependencies between resources
- Provider schema validation
- The ability to import existing resources without recreating them
- Fully supported and integrated in [GitLab] through [state management] and [merge request reporting] features, out of
  the box

[OpenTofu] can read configuration written in [HashiCorp Configuration Language]
({{< abbr title="HashiCorp Configuration Language" >}}HCL{{</>}}) or in its equivalent
{{< abbr title="JavaScript Object Notation" >}}JSON{{</>}} syntax.

## Composing large configurations with HCL

[HCL] is perfectly capable of describing a resource, and offers variables, expressions, conditionals and reusable
modules. Where I felt the friction was one level up: assembling a configuration maintained by several people. [HCL]
gives us iteration over data and module boundaries, but those abstractions need to be designed in advance and connected
explicitly. A resource also has one declaration point and another file cannot simply add a few fields to it. I wanted to
split ownership across files, share defaults and catch conflicting definitions early, without first building a separate
framework to glue all those pieces together.

{{< alert icon="comment" >}}
I guess you already know where I am going ?
{{< /alert >}}

This is a job for a language that can compose values and reuse functions. [Nix] is one way to do it, alongside options
such as [CUE], [KCL], [Jsonnet] or [Nickel]. [Nix] was already part of our everyday tooling, which made it a natural
option to consider. More importantly, its [Nix module system] gives me the merging and override behaviour I was missing,
and [Terranix] turns that result into [OpenTofu] configuration.

![Nix VS HCL, distracted boyfriend meme](/images/nix-hcl-distracted-boyfriend-meme.jpg)

[Nix] gives us functions, abstractions, composition and a [module system] for building the configuration before
[OpenTofu] runs. It can also make the tooling environment reproducible: we can pin the tools and versions used to
evaluate the modules and run [OpenTofu], ensuring the same behaviour in
{{< abbr title="Continuous Integration">}}CI{{</>}} and on a developer's machine.

That's where [Terranix repository] enters. It uses the [Nix module system] to compose [Terraform]-compatible
configuration in [Nix]:

```goat {caption="Configuration flow from Nix modules to the GitLab API"}
+---------------+         +-----------------------------+
| Configuration +-+       | Terranix                    |
| (nix files)   | +-+ --> | evaluates Nix modules       | ------+
+-+-------------+ | |     | using the Nix module system |       |
  +-+-------------+ |     +-----------------------------+       |
    +---------------+                                           v
                                                        +----------------+
                                                        | config.tf.json |
                                                        +----------------+
                                                                |
                          +-----------------+                   |
+------------+            | OpenTofu        |                   |
| Gitlab API | <--------- | With            | <-----------------+
+------------+            | Gitlab Provider |
                          +-----------------+
```

1. [Nix] describes the configuration we want
2. [Terranix] evaluates the [Nix] modules
3. A `config.tf.json` {{< abbr title="JavaScript Object Notation" >}}JSON{{</>}} configuration files is built
4. [OpenTofu] reads this file directly, compares the configuration with the current state and creates a plan
5. [OpenTofu] communicates with the [GitLab API]

I really like this division of work. **[Nix] handles configuration composition. [OpenTofu] handles resource lifecycle
management.** For me, the real game changer is **using [Nix] as a configuration generator**: it gives us flexibility and
simplicity.

{{< alert icon="comment" >}}
Not convinced ? Read on...
{{< /alert >}}

Consider a simplified [GitLab] project declaration in [HCL]:

{{< tabs >}}

{{< tab label="project-example.tf" icon="code" >}}

```hcl {lineNos=inline}
resource "gitlab_project" "example" {
  name             = "example"
  description      = "Example project"
  namespace_id     = 123
  visibility_level = "private"
}
```

{{< /tab >}}

{{< /tabs >}}

Imagine that one team manages basic project details, another manages repository settings, and the security team sets
memberships. In [HCL], splitting a single resource across files requires designing module interfaces and wiring inputs
and outputs yourself, with all the accompanying boilerplate.

{{< alert icon="comment" >}}
If you need more configuration to organise your configuration than to define the configuration, that may be a sign of
poor design or a poor choice of technology.
{{< /alert >}}

With [Terranix]'s [NixOS-style module system], several modules can contribute definitions to the same resource directly
once those modules are included in the evaluation.

### Composing a resource across multiple files

Suppose we have a file called `project.nix`, another file, `project-settings.nix`, can contribute additional properties
to the very same resource, and yet another file `project-example-settings.nix` can override the default description:

{{< tabs >}}

{{< tab label="project.nix" icon="code" >}}

```nix {lineNos=inline}
{ lib, ... }:
{
  resource.gitlab_project.example = {
    name = "example";
    path = "project-foobar";
    description = lib.mkDefault "Example project";
    visibility_level = "private";
  };
}
```

{{< /tab >}}

{{< tab label="project-settings.nix" icon="code" >}}

```nix {lineNos=inline}
{
  resource.gitlab_project.example = {
    topics = [
      "devsecops"
      "automation"
    ];

    issues_enabled = true;
  };
}
```

{{< /tab >}}

{{< tab label="project-example-settings.nix" icon="code" >}}

```nix {lineNos=inline}
{
  resource.gitlab_project.example.description = "Managed declaratively with Nix and OpenTofu !";
}
```

{{< /tab >}}

{{< /tabs >}}

When these files are included in the same [Terranix] module evaluation, the [Nix module system] merges their
declarations into **one configuration**, applying option types and priorities rather than relying on file load order.

### Semantic merging and conflict detection

The [Nix module system] uses option types to combine definitions. Depending on the type, it can join lists, merge
attribute sets by key or report a conflict. If two or more modules give the same option different values at the same
priority, [Nix] reports an error rather than choosing one value silently.

These rules help when managing a large configuration. They let us set defaults, add custom settings and find conflicts
early.

{{< alert icon="comment" >}}
A conflict found before deployment is just a potential future incident that got cancelled.
{{< /alert >}}

### Using a module fixed-point

{{< alert icon="comment" >}}
Just FYI, This is one of my favourite features of the Nix language.
{{< /alert >}}

[HCL] expressions can refer to values in an [OpenTofu] configuration, such as variables and resource attributes.
[Terranix] adds another useful mechanism: each [Nix] module receives a `config` parameter with the "_fixed-point_" of
the combined module evaluation. Modules can inspect this shared configuration to decide which definitions to contribute.

> [!NOTE]
> The [module system] computes `config` as a **fixed-point** of all module definitions. This means a module can use the
> final value of an option, even when another module defines or overrides it. [Nix]'s [lazy evaluation] makes this kind
> of recursive configuration possible: **expressions are evaluated only when their values are needed**.

Here, `project.nix` declares a project and sets `archived` to `false` by default. In the separate
`branch-protection.nix` module, the `main` branch is protected only if the project's final configuration says it is
still active:

{{< tabs >}}

{{< tab label="project.nix" icon="code" >}}

```nix {lineNos=inline}
{ lib, ... }:
{
  resource = {
    gitlab_project.example = {
      name = "example";
      path = "project-example";
      archived = lib.mkDefault false;
    };
  };
}
```

{{< /tab >}}

{{< tab label="branch-protection.nix" icon="code" >}}

```nix {lineNos=inline}
{ config, lib, ... }:
{
  resource = {
    gitlab_branch_protection.project_example_main =
      lib.mkIf (!config.resource.gitlab_project.example.archived)
        {
          branch = "main";
          # lib.tf.ref is provided by Terranix and explained further down
          project = lib.tf.ref "gitlab_project.example.id";
        };
  };
}
```

{{< /tab >}}

{{< /tabs >}}

Because the modules share the final configuration, `branch-protection.nix` can read the project's resolved `archived`
value. If another module sets `archived = true`, that value overrides the default and [Nix] leaves out the branch
protection resource.

[HCL] also has conditional expressions and supports [`count`] and [`for_each`] for conditional resources, but it lacks a
[Nix-style module system] with a shared fixed-point `config` parameter or [`lib.mkIf`]. In [HCL], you must wire the
condition explicitly through variables, expressions or module inputs.

The difference becomes **clearer** when a policy must apply to **every project matching its final settings**. Say the
security team wants a strict approval rule on every active private project, regardless of which file declares it. In
[HCL], [`for_each`] can create the rules, but it needs a collection to iterate over:

{{< tabs >}}

{{< tab label="strict-approval-rules.tf" icon="code" >}}

```hcl {lineNos=inline}
variable "projects" {
  type = map(object({
    id         = string
    visibility = string
    archived   = bool
  }))

  default = {
    application = {
      id         = "12345"
      visibility = "private"
      archived   = false
    }
    documentation = {
      id         = "23456"
      visibility = "public"
      archived   = false
    }
    legacy = {
      id         = "34567"
      visibility = "private"
      archived   = true
    }
  }
}

resource "gitlab_project_approval_rule" "strict" {
  for_each = {
    for name, project in var.projects : name => project
    if project.visibility == "private" && !project.archived
  }

  project            = each.value.id
  name               = "Strict policy"
  approvals_required = 2
}
```

{{< /tab >}}

{{< tab label="strict-approval-rules.nix" icon="code" >}}

```nix {lineNos=inline}
{ config, lib, ... }:
let
  # `projects` contains the `gitlab_project` resources where:
  #  - visibility level is private
  #  - is not archived
  projects = lib.filterAttrs (
    _: project: project.visibility_level == "private" && !project.archived
  ) config.resource.gitlab_project;
in
{
  resource.gitlab_project_approval_rule = lib.mapAttrs' (
    name: _:
    lib.nameValuePair "strict_${name}" {
      project = lib.tf.ref "gitlab_project.${name}.id";
      name = "Strict policy";
      approvals_required = 2;
    }
  ) projects;
}
```

{{< /tab >}}

{{< /tabs >}}

In `strict-approval-rules.tf`, the [HCL] example is valid, but `var.projects` is a separate inventory that must stay
in sync with the `gitlab_project` resources. [HCL] cannot build that map by enumerating independent project resource
declarations across the root module: resource references let us read a known resource's attributes, but they do not
expose a collection of all resources of that type.

{{< alert icon="comment" >}}
So now we have to maintain an inventory of the projects _and_ the projects themselves. What could possibly go wrong ?
{{< /alert >}}

By contrast, `strict-approval-rules.nix` uses [Terranix] to filter `config.resource.gitlab_project` directly and
generate one approval rule for each match.

Because `config` holds the merged project definitions (*including values contributed or overridden by other modules*)
there is no separate project inventory to maintain and no duplication, making it more natural and less error-prone in
the long run. This example shows a clear boundary between the languages: [HCL] can parameterise and iterate over data
**we provide**, while the [Nix module system] can derive new resources **from its composed configuration**.

### Building higher-level abstractions

Beyond splitting individual resources across files, the [Nix module system] lets us define our own **typed,
domain-specific options** using [`lib.mkOption`]. Instead of repeating low-level declarations (e.g., `gitlab_project`,
`gitlab_branch_protection`, `gitlab_project_approval_rule`, ...) for hundreds of repositories, we can expose a
higher-level interface tailored to our organisation's policies.

For example, a module can define a custom `my_org.projects` option that expands a concise project declaration into all
the underlying [OpenTofu] resources required by our security standards:

{{< tabs >}}

{{< tab label="group-foobar/project-plop/default.nix" icon="code" >}}

```nix {lineNos=inline}
{
  my_org.projects.plop = {
    group = "foobar";
    complianceProfile = "strict";
    defaultMembers = [
      {
        username = "alice";
        accessLevel = "developer";
      }
      {
        username = "basile";
        accessLevel = "reporter";
      }
    ];
  };
}
```

{{< /tab >}}

{{< /tabs >}}

Behind the scenes, another [Nix] module reads `config.my_org.projects` and generates the corresponding [GitLab] project,
protected branches, merge request approval rules and default project memberships. The module must also declare the
`my_org.projects` option and the shape of its values. Here is a simplified example that declares the option and
generates the underlying resources:

<details>
<summary>The Nix module in details</summary>

```nix {lineNos=inline}
# modules/project-policy.nix
{ config, lib, ... }:
let
  projects = config.my_org.projects or { };
  strictProjects = lib.filterAttrs (_: project: project.complianceProfile == "strict") projects;
in
{
  config.resource = {
    # See: https://search.opentofu.org/provider/gitlabhq/gitlab/latest/docs/resources/branch_protection
    gitlab_branch_protection = lib.mapAttrs' (
      name: _project:
      lib.nameValuePair "${name}_main" {
        allowed_to_merge = [ { access_level = "maintainer"; } ];
        allowed_to_push = [ { access_level = "no one"; } ];
        branch = "main";
        project = lib.tf.ref "gitlab_project.${name}.id";
      }
    ) strictProjects;

    # See: https://search.opentofu.org/provider/gitlabhq/gitlab/latest/docs/resources/project
    gitlab_project = lib.mapAttrs' (
      name: project:
      lib.nameValuePair name {
        name = name;
        namespace_id = lib.tf.ref "gitlab_group.${project.group}.id";
        path = name;
        visibility_level = "private";
      }
    ) projects;

    # See: https://search.opentofu.org/provider/gitlabhq/gitlab/latest/docs/resources/project_approval_rule
    gitlab_project_approval_rule = lib.mapAttrs' (
      name: _project:
      lib.nameValuePair "${name}_strict" {
        approvals_required = 2;
        name = "Strict policy";
        project = lib.tf.ref "gitlab_project.${name}.id";
      }
    ) strictProjects;

    # See: https://search.opentofu.org/provider/gitlabhq/gitlab/latest/docs/resources/project_membership
    gitlab_project_membership = lib.listToAttrs (
      lib.concatLists (
        lib.mapAttrsToList (
          projectName: project:
          map (
            member:
            lib.nameValuePair "${projectName}_${toString member.username}" {
              access_level = member.accessLevel;
              project = lib.tf.ref "gitlab_project.${projectName}.id";
              user_id = lib.tf.ref "data.gitlab_user.${member.username}.id";
            }
          ) (project.defaultMembers or [ ])
        ) projects
      )
    );
  };

  options.my_org.projects = lib.mkOption {
    default = { };
    description = "Projects defined through the organisation's project interface.";

    type = lib.types.attrsOf (
      lib.types.submodule {
        options = {
          complianceProfile = lib.mkOption {
            default = "standard";
            description = "Project compliance profile.";

            type = lib.types.enum [
              "standard"
              "strict"
            ];
          };

          defaultMembers = lib.mkOption {
            default = [ ];
            description = "Members to add to the project by default.";

            type = lib.types.listOf (
              lib.types.submodule {
                options = {
                  accessLevel = lib.mkOption {
                    description = "Project access level for this member.";

                    type = lib.types.enum [
                      "guest"
                      "reporter"
                      "developer"
                      "maintainer"
                    ];
                  };

                  username = lib.mkOption {
                    description = "GitLab username to add to the project.";
                    type = lib.types.str;
                  };
                };
              }
            );
          };

          group = lib.mkOption {
            description = "Name of the existing GitLab group.";
            type = lib.types.str;
          };
        };
      }
    );
  };
}
```

</details>

For this example, `group` names an existing `gitlab_group` resource, and `defaultMembers` is an optional list of
usernames and access levels. The rule protects `main` from direct pushes and allows maintainers to merge approved merge
requests. Developers can push to unprotected working branches and [GitLab] does not restrict those pushes to the
branch's creator. Teams get a small, validated vocabulary for common patterns, which lowers the cognitive load:
contributors can use the organisation's project options without learning every provider resource [Terranix] can expose.
They can still use raw `resource.*` attributes whenever a project needs something bespoke.

{{< alert icon="comment" >}}
At last, a cosy place to put all those opinions about how a project should be configured or to turn every managerial
whim into a typed Nix option, or both !
{{< /alert >}}

> [!IMPORTANT]
> This abstraction layer also directly addresses one of the biggest friction points when adopting [Nix]: **the learning
> curve**. Colleagues and project maintainers do not need to understand module fixpoints, evaluation semantics or deep
> [Nix] language internals to contribute. For their everyday needs, declaring a new repository or onboarding a member
> looks just like writing a clean, **self-documenting data structure**.

## Organising hundreds of repositories

The way we organise files has another benefit: the source tree can mirror the [GitLab] group and project hierarchy, making
it easy to find the settings for a given project.

```text
src/
├── default.nix
├── user.nix
└── group-foobar/
    ├── group.nix
    └── project-plop/
        ├── project.nix
        ├── project-membership.nix
        ├── branch-protection.nix
        └── approval-rules.nix
```

The [Nix module system] does **not** require a fixed directory
structure. We can organise modules by team, project or responsibility, then compose them into **one configuration**.

In this setup, `src/default.nix` automatically discovers all `.nix` files in the tree and imports them into a single
Terranix evaluation. Adding a new project or splitting a file requires no boilerplate registration: **directories
organise files for humans, but they do not create separate configuration scopes**. By contrast, [OpenTofu] loads [HCL]
files from a single directory into the root module, while nested directories form separate modules that must be wired
and called explicitly.

{{< alert icon="comment" >}}
Directories are for humans. Thankfully, Nix does not care where I put things.
{{< /alert >}}

As a result, moving or renaming a file does not change the [OpenTofu] resource address as long as the resource
declaration remains the same, and adding or removing files does not require any specific binding either.

> [!IMPORTANT]
> While this kind of **opinionated structure conveys semantics**, it can be reorganised to adapt to the problem at
> hand, match the functional needs and grow organically.

## Bringing existing GitLab resources under management

An existing [GitLab] instance may already contain hundreds of repositories, groups and user memberships. Creating them
by hand is not practical. For an initial migration, scripts can query the [GitLab API] and generate [Nix] declarations
alongside [OpenTofu] `import` blocks.

For example, with `project.nix` and `project-import.nix`:

{{< tabs >}}

{{< tab label="project.nix" >}}

```nix {lineNos=inline}
{
  resource = {
    gitlab_project.my_project = {
      name = "My project";
      path = "my-project";
    };
  };
}
```

{{< /tab >}}

{{< tab label="project-import.nix" >}}

```nix {lineNos=inline}
{
  import = [
    {
      id = "my-group/my-project";
      to = "gitlab_project.my_project";
    }
  ];
}
```

{{< /tab >}}

{{< /tabs >}}

> [!WARNING]
> [OpenTofu] uses these `import` declarations to add existing objects to its state. Keeping them in clear and separate
> identifiable files makes cleanup trivial once imported.

{{< alert icon="comment" >}}
These `*-import.nix` files are scaffolding: useful to get started, satisfying to delete.
{{< /alert >}}

Such scripts are run once to bootstrap the configuration, **not as a routine synchronisation tool**. Keep the generated
resource declarations in [Git] and make later customisations in separate files. After the initial migration, every
change goes through a [merge request workflow] before [GitLab CI] applies the configuration with [OpenTofu].

## GitOps, plans and drift detection

The [OpenGitOps principles] describe 4 properties of a GitOps system: its desired state is declarative, versioned and
immutable, pulled automatically, and continuously reconciled.

The generated `config.tf.json` file is **never committed to [Git]**, keeping build artifacts out of version control so
the repository remains clean. Instead, the [GitLab CI pipeline] evaluates the Nix modules and renders `config.tf.json`
**on the fly**. The [pipeline] then validates the generated configuration (via `tofu validate`), creates [OpenTofu]
plans posted as comments on merge requests, and applies changes from the default branch after merge (via `tofu apply`).
[OpenTofu] stores its [state] in [GitLab's HTTP backend], with state locking to prevent concurrent modifications.

[Scheduled pipelines] also check for **configuration drift**. If someone changes **a managed setting** by hand in the
[GitLab] web interface, a later run detects the difference, sends a notification and restores the settings.

{{< alert icon="comment" >}}
Worry not, the UI is still there. It just stopped being the source of truth.
{{< /alert >}}

> [!IMPORTANT]
> The configuration repository is more than a backup, it is our **single source of truth**: the Nix files define the
> settings GitLab should use, making project policies and user access easy to review and audit.

Despite that, I really wish [GitLab] had a way to prevent editing settings through its UI. That would simplify
management by moving from a ["convergent" to a more "congruent" configuration model].

## A match made in heaven

After we had built this system, I read [An Introduction to OpenTofu Symbol Libraries]. Just like [Nix] with [flakes]
(_OK the pun was easy!_), Symbol Libraries are an **experimental [OpenTofu] feature** that lets teams define reusable
functions, types and values in [HCL]. The article's {{< abbr title="Domain Name System" >}}DNS{{</>}} example defines an
[HCL] record type and a function that formats its records.

The equivalent [HCL] and [Nix] examples below formats the same record during [Terranix] evaluation:

{{< tabs >}}

{{< tab label="HCL" icon="code" >}}

```hcl {lineNos=inline}
typedef "dns_recordset" {
  type = object({
    name    = string
    type    = string
    ttl     = number
    records = list(string)
  })
}

function "format_dns_recordset" {
  type = string

  parameter "recordset" {
    type = symbols::dns_recordset()
  }

  locals {
    entries = [for record in param.recordset.records :
      "record_set ${param.recordset.name} is a ${param.recordset.type} with a ttl of ${param.recordset.ttl} and entry \"${record}\""
    ]
  }

  return = join("\n", local.entries)
}
```

{{< /tab >}}

{{< tab label="Nix" icon="code" >}}

```nix {lineNos=inline}
let
  recordset = {
    name = "Example";
    type = "A";
    ttl = 500;
    records = [ "10.10.10.10" ];
  };

  formatDnsRecordset =
    dns:
    builtins.concatStringsSep "\n" (
      map (
        record:
        "record_set ${dns.name} is a ${dns.type} with a ttl of ${toString dns.ttl} and entry \"${record}\""
      ) dns.records
    );
in
{
  locals.formatted_recordset = formatDnsRecordset recordset;
}
```

{{< /tab >}}

{{< /tabs >}}

Which [Terranix] renders as a static [OpenTofu] local before [OpenTofu] even runs:

```hcl {lineNos=inline}
locals {
  formatted_recordset = "record_set Example is a A with a ttl of 500 and entry \"10.10.10.10\""
}
```

The 2 snippets above run at different stages: the [HCL] snippet defines a reusable type and formatter evaluated by
[OpenTofu], whereas the [Nix] snippet computes the value ahead of time during [Terranix] evaluation. That example
resonated with me. **Seeing [OpenTofu] add reusable functions and types to [HCL] reinforces my view that configuration
at scale often needs the expressive tools of a general-purpose language**.

> [!WARNING]
> Unlike the [HCL] example with `typedef`, the [Nix] language itself has no built-in type system for functions or
> values. Type checking is only available when defining [Nix module options] (e.g., via [`lib.mkOption`]).

Because [Nix] runs first, it cannot inspect values that only become known during an [OpenTofu] plan or apply. For those,
we emit an [OpenTofu] reference expression with `lib.tf.ref` (as seen in the earlier branch-protection example):

{{< tabs >}}

{{< tab label="HCL" icon="code" >}}

```hcl {lineNos=inline}
resource "gitlab_branch_protection" "main" {
  project            = gitlab_project.example.id
  branch             = "main"
  push_access_level  = "maintainer"
  merge_access_level = "developer"
}
```

{{< /tab >}}

{{< tab label="Nix" icon="code" >}}

```nix {lineNos=inline}
{ lib, ... }:
{
  resource.gitlab_branch_protection.main = {
    project = lib.tf.ref "gitlab_project.example.id";
    branch = "main";
    push_access_level = "maintainer";
    merge_access_level = "developer";
  };
}
```

{{< /tab >}}

{{< /tabs >}}

**This is not a reason for everyone to stop using [HCL]**. Symbol Libraries suit teams that want reusable logic inside
[OpenTofu]. [Nix] and [Terranix] suit teams that want to compose configuration before [OpenTofu] runs, with a pinned and
reproducible tooling environment.

## Final thoughts

Moving away from _ClickOps_ transformed how we manage [GitLab] on a daily basis. Creating a new repository, onboarding a
team member or rolling out a stricter branch-protection policy across hundreds of projects is now a small, readable
merge request rather than a series of manual clicks.

![You click, I commit, we are not the same meme](/images/you-click-i-commit-we-are-not-the-same.jpg)

Combining **[Nix]**, **[Terranix]** and **[OpenTofu]** gives us the best of both worlds:

- **[Nix] and [Terranix]** bring a powerful module system, semantic merging, early conflict detection and custom domain
  abstractions, without forcing a rigid directory layout.
- **[OpenTofu]** brings battle-tested state management, execution plans, drift detection and a rich ecosystem of
  providers.

Every permission, project setting and group membership now lives in [Git]. Reviewed by peers, validated in
{{< abbr title="Continuous Integration">}}CI{{</>}} and continuously reconciled against live state.

{{< alert icon="comment" >}}
Convinced now ? If not, then I did not explain myself well :smile: !
{{< /alert >}}

## Acknowledgements

Many thanks to [Simon Shine] and "*Bobbeh*" for reviewing an early draft and sharing their feedback. Any opinions or
mistakes that remain are mine.

[OpenTofu]: https://opentofu.org/
[Terranix]: https://terranix.org/
[GitLab]: https://gitlab.com/
[Terraform]: https://www.terraform.io/
[AWS]: https://registry.terraform.io/providers/hashicorp/aws/latest
[GitHub]: https://registry.terraform.io/providers/integrations/github/latest/docs
[Nix]: https://nixos.org
[Wikipedia's definition]: https://en.wikipedia.org/w/index.php?title=DevOps&oldid=1376615260
[GitLab's REST API]: https://docs.gitlab.com/api/rest/
[GitLab API]: https://docs.gitlab.com/api/rest/
[GitLab's API]: https://docs.gitlab.com/api/rest/
[GitLab CI]: https://docs.gitlab.com/ci/pipelines/
[GitLab CI pipeline]: https://docs.gitlab.com/ci/pipelines/
[GitLab's HTTP backend]: https://docs.gitlab.com/user/infrastructure/iac/terraform_state/
[state management]: https://docs.gitlab.com/user/infrastructure/iac/terraform_state/
[audit events]: https://docs.gitlab.com/user/compliance/audit_events/
[GitLab's audit event log]: https://docs.gitlab.com/user/compliance/audit_events/
[pipeline]: https://docs.gitlab.com/ci/pipelines/
[Scheduled pipelines]: https://docs.gitlab.com/ci/pipelines/schedules/
[`curl`]: https://curl.se/
[GitLabForm]: https://github.com/gitlabform/gitlabform/
[NixOS/nixpkgs#573811]: https://github.com/NixOS/nixpkgs/pull/573811
[state]: https://opentofu.org/docs/language/state/
[GitLab provider]: https://search.opentofu.org/provider/gitlabhq/gitlab/latest
[fully open-source alternative]: https://opentofu.org/manifesto/
[Open Source Initiative]: https://opensource.org/osd
[HCL]: https://github.com/hashicorp/hcl
[merge request reporting]: https://docs.gitlab.com/user/infrastructure/iac/mr_integration/
[HashiCorp Configuration Language]: https://github.com/hashicorp/hcl
[CUE]: https://cuelang.org/
[KCL]: https://www.kcl-lang.io/
[Git]: https://git-scm.com/
[Nickel]: https://nickel-lang.org/
[Jsonnet]: https://jsonnet.org/
[Terranix repository]: https://github.com/terranix/terranix
[Nix module system]: https://nix.dev/tutorials/module-system/index.html
[`count`]: https://developer.hashicorp.com/terraform/language/meta-arguments/count
[`for_each`]: https://developer.hashicorp.com/terraform/language/meta-arguments/for_each
[`lib.mkIf`]: https://nix.dev/tutorials/module-system/deep-dive.html
[Nix module options]: https://nix.dev/tutorials/module-system/index.html
[module system]: https://nix.dev/tutorials/module-system/index.html
[NixOS-style module system]: https://nix.dev/tutorials/module-system/index.html
[Nix-style module system]: https://nix.dev/tutorials/module-system/index.html
[lazy evaluation]: https://en.wikipedia.org/wiki/Lazy_evaluation
[`lib.mkOption`]: https://noogle.dev/f/lib/mkOption/
[merge request workflow]: https://docs.gitlab.com/user/project/merge_requests/authorization_for_merge_requests/
[OpenGitOps principles]: https://opengitops.dev/
[An Introduction to OpenTofu Symbol Libraries]: https://opentofu.org/blog/2026/09/17/symbol-libraries-introduction/
[flakes]: https://nix.dev/concepts/flakes.html
[Simon Shine]: https://simonshine.dk/

["convergent" to a more "congruent" configuration model]: {{< ref "2025-05-01-refactoring-my-infrastructure-as-code-configurations#the-case-for-declarative-infrastructure" >}}
