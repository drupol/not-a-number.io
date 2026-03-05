---
date: 2025-02-11
tags:
  - retrospective
title: Retrospective 2024
images:
  - /images/PXL_20240120_092646597.jpg
draft: false
---

Last year was quite something, I went through a lot, both personally and professionally.

To begin with, the first six months of 2024 were intense: juggling work, school, and writing my
[thesis](https://doi.org/10.5281/zenodo.13894231) simultaneously.

In June, my 3-year journey at [the university](https://web.umons.ac.be) came to a successful end. With my Master's
degree in Computer Science finally in hand and one fewer frustration. I defended
[My thesis](https://doi.org/10.5281/zenodo.12666898) on the 12th June 2024, and shortly afterwards, I made the full
source available (On [Github](https://github.com/drupol/master-thesis), on
[Codeberg](https://codeberg.org/p1ld7a/master-thesis)). Since then, it has received several minor contributions from the
community, which is great to see. The **best highlight**? I was invited to deliver both theoretical and practical
sessions for students, focusing on software deployment and, of course, reproducibility. That marked the beginning of my
formal collaboration with the [university](https://informatique-umons.be/genlog/) as a scientific volunteer in the Software Engineering team,
something I am particularly proud of.

## Open Source, still going strong

My involvement in open source continued to grow. In 2024, I contributed to 44 different projects (up from 38 in
[2023]({{< ref "2023-12-23-retrospective-2023" >}})), with 419 pull requests merged (compared to 357 in
[2023]({{< ref "2023-12-23-retrospective-2023" >}})).

{{< figure src="/images/retrospective-2024-stats.svg" caption="Statistics made using [oss-contribs](https://github.com/staabm/oss-contribs)" width=1024 >}}

I am still using [Typst](https://typst.app), and I can confidently say it has completely replaced LaTeX for me. I even
[migrated](https://github.com/drupol/cv/commit/601ea18cfc119e9572c1f11a76db2164f1c8b8f5) my
[CV](https://not-a-number.io/cv) template to Typst, and I continue to enjoy working with it. Typst strikes a perfect
balance between simplicity and power, and at this point, I genuinely do not see myself going back.

In a similar spirit of adopting tools that _just make sense_, this year also marked the adoption of a new day-to-day
tool: [`Jujutsu`](https://github.com/jj-vcs/jj), a modern
[version control system](https://en.wikipedia.org/wiki/Version_control), fully compatible with `git`. I installed it in
[September 2024](https://github.com/drupol/nixos-x260/commit/d83e98222dbd0b453a0135031a94d0749545c7ee) and have used it
daily ever since. The more I work with it, the more I feel that `git` should have been designed this way **from the
start**. Jujutsu is fast, efficient, and guess what... it is written in [Rust](https://www.rust-lang.org/)! What else
could you want? One small thing perhaps for me, I really wish to see a consensus on a feature for improved patch
identity/tracking (see
[this discussion](https://lore.kernel.org/git/CAESOdVAspxUJKGAA58i0tvks4ZOfoGf1Aa5gPr0FXzdcywqUUw@mail.gmail.com/)) in
the future, I think it would be very beneficial. Anyway, don't try it, you might like it :)

## From PHP to Python

The middle of 2024 marked a significant shift in my professional landscape. Right after finishing my exams, the "PHP
Development Competency Centre" team I had been part of for nearly 5 years was shut down without notice.

During my time there, I contributed in various capacities: helping DGs transition from
[ColdFusion](https://en.wikipedia.org/wiki/Adobe_ColdFusion) to [PHP](https://en.wikipedia.org/wiki/PHP), delivering
[internal technical sessions](https://code.europa.eu/ecphp/sessions), analysing and setting-up solutions to unify
development environments, setting up servers "in the cloud" and developing foundational tools for all PHP teams.
[Symfony](https://symfony.com/) was our go-to framework though some teams made other choices, which was perfectly fine,
showcasing the flexibility inherent in open source and after all, it was still PHP.

Since all the tools and artefacts I created are [open source](https://code.europa.eu/ecphp/), I made a conscious effort
to keep them generic and framework-agnostic. The best example is the
[`cas-lib`](https://packagist.org/packages/ecphp/cas-lib) and [`ecas`](https://packagist.org/packages/ecphp/ecas)
libraries, authentication solutions for the
[CAS protocol](https://en.wikipedia.org/wiki/Central_Authentication_Service). In those projects, I deliberately relied
only on standardised abstractions through interfaces (Thanks [PSR](https://www.php-fig.org/psr/)!). This allows the
library to be integrated into any PHP project, regardless of the framework, by requiring the _consumer of the library_
to implement these standard interfaces. This approach **shifts the responsibility** for the concrete implementation
details and integration security **to the end user**, where it belongs, while the library focuses on providing a robust,
standard-compliant core.

Alongside these efforts, I also contributed improvements and bug fixes to several of the open source projects we
depended on, **giving back** to the ecosystem that made our work possible.

Open source demands more **rigour**, but it pays off. As the saying goes:

> "_If everyone on a research team knows that everything they do is going to someday be published for reproducibility
> (hear: open source), they will behave differently from day one._" ([source](https://doi.org/10.1109/MCSE.2009.15))

Open sourcing encourages **better software**, more thoughtful abstractions and clearer documentation. While many of my
colleagues are not yet familiar with building and contributing to open source, I have had the opportunity to guide some
of them. As a result, `cas-lib` now includes support for some other PHP framework.

I also managed versioning for the PHP packages, a not so pleasant task I seriously underestimated, even with
[Semantic Versioning](https://semver.org/). In total, we open-sourced 16 projects, something I remain genuinely proud
of. Most of the authentication bundles I developed are still in use today internally but not only... they are used at
the [University of Liège](https://www.uliege.be/), and [University of Aix-Marseille](https://www.univ-amu.fr/).

At the same time, I built and maintained the [OSPO](https://en.wikipedia.org/wiki/Open_Source_Program_Office)
infrastructure running [NixOS](https://nixos.org/). Our note-taking server has been up and running without interruption
for more than 2 years now:

```console
root@note ~# uptime
 16:51:01  up 817 days  3:46,  1 user,  load average: 0.00, 0.00, 0.00
```

The entire infrastructure is version-controlled in a private Git repository, maintained collaboratively. Updating it is
as simple as bumping the `flake.lock` file and deploying via [`deploy-rs`](https://github.com/serokell/deploy-rs).
Everything is managed within a single repository: dependencies are pinned, deployments are ~~boring and predictable~~
fully bit-per-bit reproducible, upgrades are atomic and rollbacks effortless. It is as close to a dream setup as it gets, a level of transparency, security and control which is not
achieved anywhere else at work.

Another project, [`developer-profile`](https://code.europa.eu/ecphp/devs-profile/), continues to grow. Originally a
proof of concept, it was
[completely rewritten](https://code.europa.eu/ecphp/devs-profile/-/commit/95dc8d99fea98cd46cc03c6a318d460d7e3c4a03) into
a robust {{< abbr title="Command Line Interface">}}CLI{{</abbr>}} environment built around the
[Fish shell](https://fishshell.com/)
(_[also rewritten in Rust!](https://github.com/fish-shell/fish-shell/releases/tag/4.0.0)_), bundled with tools to
support developers. It is now widely used among my colleagues and beyond, and I often recommend it to those curious
about Nix and willing to pimp their command line.

Lastly, the proof-of-concept project [`ec-lib`](https://code.europa.eu/pol/ec-lib/) offers a set of reusable tools and
utilities under the `ec` namespace. Among them are enhanced [OCI](https://opencontainers.org) (Docker, Podman,...) image
builders (`ec.dockerTools.buildImage` and `ec.dockerTools.buildLayeredImage`), which extend Nix's native image-building
capabilities by automatically embedding {{< abbr title="Software Bill of Materials" >}}SBOMs{{</abbr>}} into
[OCI](https://opencontainers.org) container metadata. This approach is particularly valuable for teams that prioritise
transparency, security, reproducibility, and compliance when building containers.

So, at the end of June 2024, I moved on to a new project with a new team, a completely different tech stack, and said
goodbye to all the PHP projects I had built and maintained over the years. It felt a bit like leaving behind orphans,...
a bittersweet moment. I joined a team developing the institution's internal AI chatbot. It was a
[brownfield project](<https://en.wikipedia.org/wiki/Brownfield_(software_development)>) that was originally developed by
a [research department](https://joint-research-centre.ec.europa.eu) about a year earlier
([press release](https://commission.europa.eu/news/commission-launches-new-general-purpose-ai-tool-gptec-2024-10-22_en)).
In the team, each developer worked in a distinct operating environment, which brought a diverse set of constraints and
perspectives to the project.

#### Addressing development environment inconsistencies

One of the first issues I tackled was the inconsistency in development environments.

{{< alert >}}

At this point, you might erroneously assume that using our corporate laptops would already ensure a standardised and
suitable development setup, the reality was quite **the opposite**. Despite being centrally managed, these machines
often came with restrictive configurations and lacked the flexibility required for modern software development. As a
result, many developers, including myself, chose to use their personal laptops to bypass some of these limitations and
gain the freedom needed to work effectively. It is simple, I do not know any developers effectively using their
corporate laptop. To compensate for this unsuitability, we were eventually provided with a cloud managed Ubuntu-based
environment. This provided some relief, but came with its own constraints, which I discuss later.

{{< /alert >}}

After evaluating the options available to us, namely [Docker](https://www.docker.com/) and
[Ansible](https://github.com/ansible/ansible), I concluded that while these tools had been useful in the past, they were
no longer suitable for creating a consistent development environment across different operating systems. These
technologies are now outdated when it comes to building reproducible and reliable environments for long-term use. I
therefore chose [Nix](https://nixos.org), which turned out to be an **excellent decision**. At first, most of my
colleagues saw Nix as a {{< abbr title="Unknown Flying Object" >}}UFO{{</abbr>}}. However, after just a few weeks of
using it, it was seamlessly integrated into our workflows and became transparent in day-to-day use. Overall, they were
pleased with the results. Nix helped us save time, ensured consistency across environments, provided full transparency
over dependencies, offered isolation from host systems, and improved team collaboration. It also made **onboarding
significantly easier**, as new team members could set up a fully functional development environment in minutes, without
having to worry about system-specific configurations. We were quickly able to spin up everything we needed, including
the database, code interpreter and all essential tools, on any Linux or macOS machine. Nix gracefully **blasted to
smithereens** an entire class of problems we had previously faced (_and brought some new ones we didn't had before as
smithereens\*\* an entire class of problems we had previously faced (\_and brought some new ones we didn't have before
as well !_), and I am genuinely pleased with the outcome.

#### Enhancing code quality and maintainability

While _developing bugs and fixing features_, I focused heavily on reducing complexity and improving reliability, by
adding typing, refactoring, and writing more tests. A lot of code was duplicated to interact with the database through
repositories and reducing code duplication was also a great concern to me. I refactored the code to remove as much code
duplication as I could, used [composition in place of
inheritance]({{< ref "2019-02-21-php-composition-and-inheritance" >}}) and implemented a generic repository class. This
generic repository is using the [`Returns`](https://github.com/dry-python/returns) library which has been very useful to
implement repository methods that return something meaningful and fully typed while handling correctly all the potential
issues that could happen when working with a database. Overall, these efforts led to a smaller, cleaner, and more
maintainable codebase. That said, adopting the [`Returns`](https://github.com/dry-python/returns) library, promoting a
more functional, declarative style and robust error handling, was not without its challenges... but the outcome was
worth it.

I also contributed to improving the Git commit history by promoting the
[Conventional Commits](https://www.conventionalcommits.org/) standard. Some colleagues jokingly referred to me as a "Git
n\*\*i" for being a bit too strict about how I expected commits to be written and structured in pull requests, not the
nicest nickname, but I took it as a compliment to my consistency.

Last but not least, security was also an important concern throughout the project. I made sure to regularly update the
Python interpreter, third-party libraries, and development dependencies (e.g., [MongoDB](https://www.mongodb.com/),
[Mongo shell](https://github.com/mongodb-js/mongosh), [ruff](https://github.com/astral-sh/ruff), etc,...) on a monthly
basis. Thanks to [Poetry](https://python-poetry.org/) and [Nix](https://nixos.org), this was not a painful task. It was
quick, reproducible, and **became part of the routine**.

### Reflections on language ecosystems

Switching from PHP to Python was not difficult. I truly enjoyed Python's list/dict comprehensions, something I will miss
if I ever do PHP again. What frustrated me most was the ecosystem. Many libraries seem to exist in the
"[zero-space](http://doi.org/10.1016/j.scico.2021.102656)" ([PDF](https://decan.lexpage.net/files/SCICO-2021.pdf)), with
unclear governance or maintenance. The packaging landscape is chaotic: `pip`, `poetry`, `uv`, and `conda` all compete. I
started with `poetry`, but would now choose [`uv`](https://github.com/astral-sh/uv).

Overall, and feel free to disagree in the comments, I think Python is great for prototyping, scripting, and data
science, but I would not use it for production. It is too permissive, too slow, and parts of its ecosystem lack
maturity.

Over the year, I have realised that being a software engineer is not just about writing code (_and so on..._), but
rather **choosing the right tools**, the right libraries and the right pattern **for a given algorithm or project**. It
is not really about picking PHP, Python or whatever, but about understanding the constraints and goals of the task at
hand and, and ultimately **making the right choice**.

A major part of making that right choice is dispelling a common software engineering illusion: **the belief that
adopting a new framework or library will magically erase technical debt**.

Before adopting a shiny new tool (or library, or framework, or technology), our projects usually look something like
this: a solid chunk of business value weighed down by a clear, predictable block of homegrown technical debt (e.g.,
spaghetti code, missing tests, reinvented the wheel, lack of automatisation, etc etc).

{{< figure src="/images/Untitled-2025-11-17-2024a.svg" caption="The before: A clear view of our own custom-made technical debt." >}}

When a team gets frustrated with this, the natural reflex is to reach for an external library or a comprehensive
framework or another new tool. The expectation? That it will act as a silver bullet, sweeping away all our historical
mess and leaving only pure, pristine business logic.

{{< figure src="/images/Untitled-2025-11-17-2024b.svg" caption="The expectation: The magical library (or framework or tool) that \"solves\" almost everything." >}}

But over the years, and particularly throughout 2024, I have come to realise that we never truly eliminate complexity...
**we only change its shape**. When we replace custom code with an external dependency, we are not deleting technical
debt, we are merely trading it for "ecosystem debt". The total volume of debt often remains the same or gets a little
bit smaller, but it fragments into different, sometimes more insidious, forms.

{{< figure src="/images/Untitled-2025-11-17-2024c.svg" caption="The reality: [Tesler's law or \"the law of conservation of complexity\"](https://en.wikipedia.org/wiki/Law_of_conservation_of_complexity). The debt is still there, just distributed differently (e.g., glue code, Dependency updates (CVEs), framework limitations, vendor lock-in, etc etc)." >}}

Instead of fixing our own poorly written code, we find ourselves fighting impedance mismatches and discrepancies (e.g.,
writing complex "glue code" to force a framework to fit our specific business needs, tracking upstream breaking changes,
managing security vulnerabilities, and debugging black-box abstractions).

Ultimately, adopting a third-party tool is not a magic trick for debt reduction: **it is a governance choice**. You are
simply deciding whether you would rather maintain your own imperfect code or manage the relentless update cycles,
potential bloatware, and architectural constraints of someone else's. Since "_every single line is a liability_", the
same principle applies to every type of dependency. The key is to make these choices deliberately, fully aware of the
trade-offs and to be prepared to manage the new form of complexity that comes with it.

## Thoughts on digital sovereignty in the public sector

Throughout 2024, I found myself thinking more and more about digital sovereignty, especially in the context of public
sector. For me, it goes far beyond the question of where data is hosted. Digital sovereignty is also about transparency,
control, and the ability to fully understand and act on the software and infrastructure we depend on. It is about
knowing what runs in production, being able to audit and modify it, and reducing dependency on opaque, proprietary
ecosystems that leave little room for adaptability or scrutiny ([Public money, public code](https://publiccode.eu)).

This concern is particularly relevant today with the
[Cyber Resilience Act (CRA)](https://en.wikipedia.org/wiki/Cyber_Resilience_Act). It rightly puts a strong emphasis on
software security, lifecycle management, and the transparency of software components. But it also raises practical
challenges. Especially around how to generate, maintain, and verify
[Software Bills of Materials](https://www.cisa.gov/sbom), how to track vulnerabilities in dependencies, and how to
ensure compliance across increasingly complex supply chains.

In this context, reproducible builds, declarative infrastructure, and open development practices are not just
_nice-to-haves_, **they are key enablers of compliance**. My commitment to open source was already motivated by ideals
of robustness and reuse. But the CRA has added a new dimension: regulatory alignment. If we want to build secure,
resilient, and future-proof systems in the public sector, we need the tooling, the culture and the governance models
that support that vision.

Public institutions, in my view, have a responsibility to lead (_it is time to lead by example_) by example, not just by
complying with regulations like the CRA, but by embracing the spirit of them. This means investing in open technologies,
making software choices that prioritise transparency, autonomy, sustainability and **avoid vendor-locking at all cost**,
supporting reproducible and verifiable systems. This is not just a present-day concern... it is a battle that has been
fought (and arguably lost) before. A recent paper by [Nora von Ingersleben-Seip](https://www.noravoningersleben.com/),
["How the European Union Fell Out of Love with Open-Source Software" (2025)](https://ideas.repec.org/p/aiw/wpaper/39.html),
details how the EU's strong, pro-sovereignty stance on open source in 2004 was reversed by 2010 due to intense lobbying
from proprietary incumbents. The paper is a sobering reminder that the push for digital sovereignty is constantly at
risk from the political and economic influence of established technology giants.

## Navigating systemic challenges: frustrated by design

My experiences in 2024, particularly within a large public IT institution, brought my frustration to a _climax_ and led
to broader reflections on systemic challenges. While once considered a prestigious place for forward-thinking projects,
I have felt a growing sense of frustration. _I'll be very blunt, apologies beforehand for it_, but after more than ten
years, I have seen how administrative complexity, excessive meetings, and communication challenges can, at times,
significantly hinder progress. Over the years, I have noticed that key decisions are sometimes made without sufficient
analysis or consultation, and important decisions are not clearly documented or justified. The environment can feel
excessively bureaucratic, with vague strategic direction and ~~limited~~ no space for genuine innovation. Often, there
is no valid technical reasoning behind accepting or rejecting a decision, a tool or technology, and many projects lack
any coherent long-term strategy. Rather than leading the way in digital transformation, as we ought to be, it often
feels as though we are simply chasing trends or implementing ideas that someone dreamt up overnight, without any real
vision, justification or governance. That said, I **still believe** it has the talent, capacity and responsibility to
lead by example. If we can shift the focus from overly procedural discussions to more outcome-oriented collaboration,
things could genuinely improve.

A clear example of this lack of future-proof vision was the abrupt shutdown of the PHP team I was working in. Around
2019, we were encouraged to adopt PHP, which was, at the time, the officially recommended language for web applications.
Many of my colleagues were unfamiliar with it, but they took the time to learn, they were even offered trainings and
gradually migrated their legacy applications. It was not without difficulty, but they succeeded, supported by my team
throughout the process. However, the decision to shut down our team was made, and the consequences were clearly not
fully considered. Over the years, I had developed a substantial collection of tools and infrastructure that were widely
used internally, all of which suddenly found themselves without maintainers. Thankfully, these projects are open source
and remain accessible, but without a team to coordinate their evolution. And, unsurprisingly, one of the most important
of these projects is related to security and user authentication. Many colleagues expressed their frustration and
confusion over the decision, as it seemed to lack any clear rationale. _Faire et défaire, c'est ne rien faire!_ they
remarked. While this decision may have allowed someone to justify their precious time (_and salary!_), it left others
questioning its purpose. They valued having our team acting as a coordinating hub of the open-source development of
shared building blocks for so many applications. I completely understand their perspective and share their frustration.
{{<abbr title="In My Opinion">}}IMO{{</abbr>}}, this was a surprising decision that led to missed opportunities for
efficiency, a risk of losing domain expertise, and a challenge for meaningful collaboration across teams using shared,
open-source tools and libraries. The overall direction felt at times disjointed, lacking a clear long-term strategy,
consultation, or continuity.

A recurring technical obstacle was the absence of consistent versioning practices across teams. Very few followed
[Semantic Versioning](https://semver.org/), which led to confusion, compatibility issues, and delayed releases. I never
thought I would say this, but in our case, a [monorepo](https://en.wikipedia.org/wiki/Monorepo) could have saved us a
lot of time. I proposed this approach, but it was dismissed. Some perceived it as a step backward, with comments like
"_Yeah sure, we’ll use a monorepo like 10 years in the past!_". Rather than dismissing ideas based on trends, I think we
should assess each proposal on its practical merits, case by case.

Another major technical challenge was the mismatch between our tech stack and operational realities. Python is ideal for
rapid prototyping, but applying rigid release cycles to dynamic tools leads to friction. We had a single shared dev
environment, no per-developer sandboxes. Requesting one felt harder than scaling Everest, bare-handed and ropeless.

As already mentioned before, local development on our corporate laptops was ~~difficult~~ impossible, mainly due to the
constraints of the Microsoft operating system and limited access to necessary tools and network resources due to
internal policies.

> In this context, initiatives like [EU-OS](https://eu-os.gitlab.io/) are worth having a look, it represents a promising
> step towards improving the user, and to some extent, developer experience in a more autonomous and sovereign way.
> Investing in these efforts could help align technical workflows with European values.

To work around these limitations, we were provided with a remote Ubuntu-based environment. While using Linux is a step
forward, it also introduced its own drawbacks: relying on a US-based company for sensitive EU data and applications
(_btw, do you know what
[Recall](https://arstechnica.com/gadgets/2025/04/in-depth-with-windows-11-recall-and-what-microsoft-has-and-hasnt-fixed/)
is?_), performance bottlenecks, a sluggish user interface, the need to use a proprietary client to connect, and the lack
of SSH access. At a time where digital sovereignty is key, especially in this very special political context, this is a
concern, don't you think? This highlights the recurring challenge for public institutions to reconcile immediate
operational needs with broader strategic goals like autonomy and sovereignty.

With the wider adoption of mainstream collaboration tools from across the Atlantic, things have not always improved as
expected. While these tools are theoretically designed to enhance communication, they often result in information
overload or misalignment practically. More importantly, they seem to have **eroded the sense of human connection between
colleagues**. Cameras are rarely turned on during meetings (_that could last a whole day sometimes!_), and I have worked
with some people without ever meeting or seeing them, I do not even know what they look like. This lack of personal
contact, likely amplified by widespread teleworking, makes collaboration more transactional and less empathetic, and
gradually chips away at the team spirit that is so essential to meaningful and effective work. Despite the frustrations,
great technical discussions with colleagues kept me sane. I learnt a lot and hopefully taught a bit too. This is also
why going back to the office is important for me, I would not want to go back everyday, but I believe that keeping a
balance of &plusmn;2 days per week is sufficient. Sometimes, the best ideas come from a stupid joke, a random
conversation at the cafeteria or an after-lunch walk and I believe this helps to keep the team spirit alive.

In such a constrained environment, where technical freedom is limited and tooling is often suboptimal, **developers
cannot afford to ignore complexity**. Quite the opposite actually! They must actively **seek to reduce it**. Every layer
of indirection, every unnecessary abstraction, and every workaround adds overhead to an already fragile workflow, every
single line is a liability. **Simplicity is not just a design choice, it becomes a necessity**. In this context, good
software engineering means keeping things simple, easy to understand, and easy to maintain. When everything around is
already complex, there is no need to make the codebase even harder to work with, right?

> Simplicity is a great virtue, but it requires hard work to achieve and education to appreciate. And to make matters
> worse, complexity sells better — Edsger Dijkstra

The situation could be improved by embedding continuous learning, training, and education more organically into daily
work. Creating space for shared learning experiences such as internal workshops, technical deep-dives, or collaborative
study groups, can reignite curiosity, foster empathy, and help rebuild a stronger sense of purpose. Public institutions
have much to offer and much to learn. These doors should remain open, but that still requires the will to make it
happen.

> In November 2024, I attended [Benevol2024](https://benevol2024.github.io/), a Software Evolution workshop at the
> [University of Namur](https://www.unamur.be). It was important for me to be there since I contributed a very tiny bit
> to
> "[An Overview and Catalogue of Dependency Challenges in Open Source Software Package Registries](https://doi.org/10.48550/arXiv.2409.18884)",
> a paper that was presented for the first time by [Tom Mens](https://orcid.org/0000-0003-3636-5020). A great
> experience, and I hope to attend more. It reminded me how much could be gained by fostering closer ties between
> academic research and public institutions.

One concrete manifestation of this disconnect is visible in the way many teams have started setting up their own
infrastructure. Without alignment, shared vision, or trust in central services, they avoid the official solutions
provided by central IT services, which are perceived as **too expensive**, **too old**, **too slow to evolve**, lacking
features, or difficult to adapt to their needs. This is particularly evident in the push for unified CI/CD pipelines.
The central department invests heavily in this area, but seems to forget that before standardising the pipeline, it is
essential to standardise the projects themselves, perhaps developing them with the consistency and rigour you would
expect from an open-source project! Instead, the result is often overly complex CI pipelines where declarative YAML is
intertwined with an infinite list of imperative commands, written in a chaotic mix of programming languages. There is
absolutely no effort to abstract these scripts into concrete projects, which not only makes them impossible for
developers to run locally but also prevents any form of reuse elsewhere. This approach leads to solutions that are
overengineered, underdocumented, and reinvented from scratch in each project, ultimately increasing the
[bus factor](https://en.wikipedia.org/w/index.php?title=Bus_factor&oldid=1289359475). This _fragmentation_ leads to
duplicated effort, increased maintenance costs and inconsistent practices across institutions, ultimately working
**against the goal of long-term sustainability and collaboration**. Internally, DGs, including the central IT
department, share almost nothing of what it builds and often develop similar tools or components (e.g., multiple check
in/out applications, multiple chatbots instances, too many Gitlab instances, ...) in parallel. This presents a
significant opportunity for further harmonization and resource optimization, which could be better achieved through
improved coordination and shared efforts.

{{< alert >}}

It is **frustrating** to see so much duplication of effort and missed opportunities for collaboration in an environment
that could and should be setting the standard.

{{< /alert >}}

Instead of resisting these developments, the institution could actively **engage** with its clients and users. A shared
working group with rotating membership could collect feedback, identify needs, and propose modular, reusable solutions,
open-source when possible. This would lower maintenance costs and foster cross-DGs collaboration. But more importantly,
rather than selling expensive services, the department could shift its focus towards co-creating solutions with its
users: listening first, then building flexible, extensible tools that address real needs. This user-centred approach
would reduce redundancy, increase adoption, and make better use of shared infrastructure. By investing in horizontal
interoperability instead of vertical silos, the organization could re-establish itself not as a vendor, but as a trusted
enabler of digital public services, one that facilitates collaboration, simplifies workflows, and amplifies the impact
of internal talent. This is particularly important in an organisation that has the people, the resources, and the
potential to set an example for others.

> I believe there is still a real opportunity and **responsibility** for the institution to reclaim its role as a
> pioneer in IT.

Lastly, another challenge has been the divide between officials and contractors. One particularly **painful moment**
came when a senior official publicly attributed the institution's security problems to [*sic*]
"[stupidity by developers](https://www.politico.eu/newsletter/brussels-playbook/macron-tusk-talk-european-troops-in-ukraine/)",
a carefully chosen phrasing that, even if unintentional, was not appropriate and demoralising. As a contractor and
developer, it stung. I make mistakes, I fix them, I learn. We are humans, we all do. Growth happens when we support each
other, not when we shift blame. When mutual respect and systemic thinking are lacking, it becomes increasingly
**difficult to stay motivated and engaged**. At the same time, if we truly want to improve quality and security, perhaps
it is time we move away from blaming individuals and start engaging in a bit of **introspection** (_after all, the
institution is responsible for hiring!_). This includes taking a critical look at structural issues. Maybe the hiring
process deserves scrutiny? But what about the [recruitment office](http://epso.europa.eu/) selection mechanism? Long
criticised for failing to meet the institution's real recruitment needs
([source](https://www.brusselstimes.com/138441/eu-should-recruit-more-staff-outside-the-brussels-bubble-says-audit-report))!
If we want to build resilient teams, we should be open to improving our hiring, mentoring, and collaboration models. The
challenge is to align systems and strategies so that we can build better things together, regardless of whether we are
contractors or officials.

## Looking forward

While the issues I have described here only reflect **my own experience**, they are by no means unique to it. Similar
patterns of fragmentation, misalignment, and underutilisation of internal talent can be observed across many different
public institutions. These challenges are often systemic, rooted in legacy structures, risk-averse mindsets, and the
tension between political expectations and technical realities. Recognising this does not excuse the problems but it
does suggest that meaningful change will require collective effort, shared learning, and a willingness to reimagine how
we build, govern, and sustain digital public infrastructure across the board. You think that sounds too optimistic? I
still believe it is possible, and I hope to see public institutions move more decisively in that direction.

{{< alert type="warning" header="Disclaimer" >}}

1. This article has been published in February 2026 and immediatelly removed after less than an hour. I actually thanks
   the person who alerted me about it. I reworked it and published it again, hopefully for good this time.
2. The views expressed in this post are my own and do not necessarily reflect those of my employer or any institution I
   am affiliated with. This reflection is based on personal experience and observations.
3. I used a very old refurbished server hosted in my basement to fix the typos of this text using different open-source
   [LLM](https://en.wikipedia.org/wiki/Large_language_model), using [Ollama](https://ollama.com) and
   [Open-WebUI](https://github.com/open-webui/open-webui).

{{< /alert >}}
