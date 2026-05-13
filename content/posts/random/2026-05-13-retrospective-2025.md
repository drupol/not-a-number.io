---
date: 2026-05-13
tags:
  - retrospective
title: Retrospective 2025
images:
  - /images/PXL_20250906_173345772.PANO.jpg
image_copyrights: Zurich, viewed from Üetliberg
draft: false
---

2025 was not a year of rupture like 2024. It was something else: a year of consolidation, clarification, and, at times,
quiet stubbornness.

Many of the transitions that had started the year before continued to unfold. I was still working at the intersection of
software engineering, reproducibility, open source, and public-sector IT, but this year gave me more space to connect
those threads together. It also gave me more reasons to do so. The more I looked around, the more I felt the same thing
over and over again: complexity is still wildly underestimated as a source of cost, fragility, and institutional
dysfunction.

So, in one way or another, a lot of my year revolved around pushing in the opposite direction: making things clearer,
smaller, more reproducible, more explicit, and hopefully a bit more sane.

## Reproducibility, still not optional

If there is one theme that continued to shape my year more than any other, it was reproducibility.

After finishing my [Master's thesis on reproducibility in software engineering] in 2024, I had the opportunity in 2025
to continue turning that work into something more practical and more transmissible. One of the real highlights of the
year was contributing to teaching activities at the University of Mons and helping introduce students to the topic more
formally.

That meant a lot to me.

Reproducibility is one of those concepts that sounds almost too obvious to defend. Of course we should be able to
rebuild what we build and what we ship. Of course environments should be consistent. Of course deployments should be
predictable. Of course results should be verifiable. And yet, in practice, much of the software industry still behaves
as though these were optional luxuries rather than the foundations of trustworthy engineering.

The more I work on the subject, the more I think the problem is not technical first. It is cultural.

Reproducibility demands discipline, humility, and delayed gratification. It asks teams to invest effort now so that
someone, perhaps someone else, can understand, verify, maintain, or rebuild the system later. That is not always
rewarded. In many environments, the incentives still favour speed, improvisation, and the comforting illusion that "it
works on my machine" is close enough to success.

It is not.

{{< figure src="/images/fa5.jpg" caption="I have no idea what I am doing!" width=1024 >}}

A process that cannot be repeated under controlled conditions is not robust: **it is bricolage** (_fricklerhandwerk_ in
german if you prefer). A build that only works in one CI runner configured through tribal knowledge is not reliable. A
deployment that depends on hidden or global state, manual corrections, or a specific laptop blessed by the gods of local
configuration is not engineering. It is theatre with a successful first act.

I found myself returning to this point again and again in 2025, in code, at work, in writing, in discussions, and in
teaching. Reproducibility should not be a niche concern. It is deeply connected to reliability, security, onboarding,
supply-chain integrity, auditability, and cost control. It is one of the rare engineering properties that makes almost
everything else easier.

## Teaching, learning, and trying to pass it on

One thing I particularly appreciated in 2025 was the chance to remain connected to the university.

Being able to share some of what I had learnt, particularly around reproducibility, deployment, and tooling, felt like a
natural continuation of the work I had already started in previous years. I have become increasingly convinced that
these topics deserve a far more central place in software engineering education. Students learn to code, which is good.
They sometimes learn algorithms, architecture, and a bit of testing, which is also good. But the practical reality of
deploying and operating systems that are maintainable, verifiable, and reproducible often remains oddly peripheral.

That gap matters.

Because in the real world, a large part of software engineering is not about writing new code at all. It is about
understanding constraints, choosing tools carefully, reducing accidental complexity, documenting decisions, managing
dependencies, and making sure someone else can still operate the thing when you are gone or merely on holiday.

I tried, in my own modest way, to make that visible.

## Open source as engineering discipline

{{< figure src="/images/retrospective-2025-stats.svg" caption="Statistics generated using [`staabm/oss-contribs`](https://github.com/staabm/oss-contribs)" width=1024 >}}

Open source continued to take an important place in 2025, as it has for a long time now. But more and more, I see it not
just as a model of distribution or collaboration, but as a discipline in itself.

Open source changes the way you build things when you take it seriously. **It forces a different kind of explicitness**.
It nudges you towards clearer interfaces, better documentation, simpler assumptions, and more reusable abstractions. Not
automatically, of course. There is plenty of chaotic open source too. But at its best, open source encourages a kind of
engineering honesty that is still sadly missing in many closed institutional environments.

Throughout 2025, I continued contributing to and maintaining various projects, but one of the most personally meaningful
developments was publishing my first Rust open-source project: [`markdown-code-runner`].

The project started in April from a very concrete need: I wanted a tool that could help fix and normalise the syntax of
code examples in the [NixOS manual] and [Nixpkgs manual]. The first version was meant to be a Python project, because
that would have been the obvious and comfortable choice. But I quickly rewrote it in Rust, partly for performance,
partly because I wanted to learn Rust properly by building something useful rather than by only reading about it, and
partly because I found the Python ecosystem useful but increasingly messy.

It became a small command-line tool that processes Markdown files, detects code blocks, executes them via configurable
commands, and optionally rewrites the document with the results. A fairly simple idea on paper. But, as is often the
case, the "simple" tools end up being the ones that force you to think properly.

Working on it pushed me to improve the design several times: parsing, placeholder substitution, command execution, error
accumulation, multi-threading, test coverage, AST-based rewriting, configuration design, and the general tension between
flexibility and clarity. I genuinely enjoyed that process. It was one of those projects where the size stayed modest,
but the lessons were real.

The most satisfying part was that it did not remain only a personal learning exercise. Once the tool existed, it was
adopted in the Nix documentation through [`NixOS/nixpkgs#397142`], and all Nix code in the manuals could then be
formatted consistently with the Nix formatter. That is exactly the kind of outcome I like in tooling: a small, specific
program that quietly removes a class of inconsistency from a project.

In numbers, the year was still very active, but in a slightly different way than the previous one. I had 405 pull
requests merged on GitHub in 2025, making it my second-highest year after the 422 merged pull requests of 2024. The
interesting detail in the graph is that this did not come from touching more and more projects. Quite the opposite: the
number of projects I contributed to dropped from 44 in 2024 to 28 in 2025.

Part of that decrease also came from the professional transition described later in this retrospective: changing career
direction takes time and energy, and I had less of both available for broad open-source exploration.

That says something useful about the shape of the year. After the broad spread of 2024, 2025 was more concentrated. Most
of that activity was focused on [`NixOS/nixpkgs`], with [315 merged pull requests] there alone, followed by work in my
own repositories, some university-related repositories, and a few smaller projects such as [`trix`], which also helped
me continue learning Rust. It was less a year of expanding the surface area of my open-source activity than a year of
spending more sustained effort on fewer places.

The raw number is not the interesting part, though. What I found more meaningful was the kind of work behind it. A large
share of those contributions was maintenance work: package updates, refactorings, build fixes, small cleanups, support
for newer Nix idioms, dependency reductions, and security-related updates. It is the kind of work that rarely looks
spectacular from the outside, but which quietly improves the ecosystem for everyone who depends on it.

Later in the year, I also worked on other small tools at work, including a Bash utility to validate whether a Git branch
keeps a linear history. That, too, came from a very ordinary but very persistent frustration: too many teams still treat
Git history as expendable clutter instead of shared technical documentation. I care about commits being readable. I care
about branches making sense. I care about pull requests being understandable without archaeological excavation. These
details matter more than people sometimes admit.

More broadly, 2025 reinforced my taste for tools that privilege explicitness over ~~magic~~ implicitness, composition
over hidden behaviour, and boring predictability over fashionable cleverness.

## Nixpkgs as maintenance (free) work

Around 75% of my open-source contributions this year happened in [`NixOS/nixpkgs`], with [315 merged pull requests].

Some of it continued the work I had started around PHP packaging. I kept improving the PHP builders through changes such
as support for `lib.extendMkDerivation` ([`NixOS/nixpkgs#385830`]), DRY improvements, various fixes and later a broader
stability pass on the builder.

That work was satisfying precisely because it was not only about PHP. It was about making packaging interfaces clearer,
more override-friendly, less surprising, and easier to maintain by people who did not have all the historical context in
their head. That is one of the things I like about [`NixOS/nixpkgs`]: even a small packaging improvement can encode an
engineering lesson, and once merged, that lesson becomes part of the shared toolbox.

I also spent time on more general [`NixOS/nixpkgs`] maintenance: moving packages towards the `finalAttrs` pattern,
removing unnecessary dependencies, updating tools I care about, and fixing issues where packages dragged in more of the
world than they should. One concrete example was the work in [`NixOS/nixpkgs#439122`], where a change reduced the
closure size (sum of the size of the application and all its dependencies). I did that for a couple of other packages as
well after noticing at work that some dependencies were being pulled in unnecessarily and could be removed.

Outside of [`NixOS/nixpkgs`], as part of my effort to learn [Rust], I also contributed to [`trix`], mostly around
Nix-oriented cleanup, formatting behaviour, overlays, refactoring, and small usability improvements.

## Nix, governance fatigue, Nixcon

But 2025 was also the year when I had to be more honest with myself about the Nix community.

Technically, I still believe Nix is one of the most important pieces of software infrastructure we have. My conviction
there did not weaken. If anything, the more I work on reproducibility, supply chains, deployment, and long-term
maintenance, the more obvious the value of Nix becomes.

The community side, however, became much harder to ignore.

Over the last few years, and very visibly again in 2025, the Nix project went through repeated governance and community
crises: lack of leadership, conflicts around sponsorship, the role of companies connected to the military-industrial
complex, transparency inside the Steering Committee, moderation accountability, public accusations, resignations,
election campaigns, private Matrix gossip, and endless threads where technical work disappeared behind political and
interpersonal escalation.

I do not think these problems are unique to Nix. Most of them are social rather than technical, and in that sense open
source communities are also projections of the world around them. They reproduce many of the same tensions we see
elsewhere: mistrust, polarisation, moral exhaustion, fragmented attention, and **the temptation to treat every
disagreement as proof of bad faith**.

That is also why I do not believe those problems can be solved through aggression, humiliation, or performative
violence, whether verbal or institutional. Some conflicts require boundaries, and some behaviours need consequences, but
a community is not repaired by making escalation its default language. It takes time, patience, restraint, and the slow
rebuilding of trust between people who still have to share the same project after the thread is closed.

There is something important to say here, and it also applies to anyone I interact with online without knowing them in
real life. I will be blunt: I do not care about your private life. I do not care where you are living or about your
sexual orientation, your personal identity, your kinks, or whether you wear cat ears in your spare time. What matters to
me, in the context of an online project, is whether we can make the project successful together for everybody who
depends on it and contributes to it, and hopefully useful to humanity as a whole. That is also why I usually avoid
sharing too much details about my own private life online. I firmly believe that the details of my personal life or
kinks are nobody else's business, and I do not think a software project benefits from forcing that kind of intimacy into
its technical spaces.

I am not going to relitigate every episode in detail. That would not be useful, and I am not interested in turning this
retrospective into a timeline of grievances. But I cannot pretend it had no effect on me.

For a long time, my _relationship_ with Nix was simple: contribute, review, help people, improve, repeat. That was
healthy. It gave me a concrete way to participate in a project I deeply cared about. But the more community energy got
absorbed by conflict, the more I felt my own attention being pulled into places where very little was built and very
little was clarified.

That was not an abstract feeling. I had already written something similar in the
`Nix Community Survey 2024 Results: Gender distribution`
([1](https://discourse.nixos.org/t/nix-community-survey-2024-results-gender-distribution/55489/109),
[2](https://discourse.nixos.org/t/nix-community-survey-2024-results-gender-distribution/55489/129)) discussion, where I
said that I had never observed any form of discrimination and that too much energy was being spent on a thread that
could have been spent on documentation, the website, or pull-request reviews. I later found myself making a related
point in the [`Anduril's threat is existential`] thread: no matter how much time people spend trying to persuade each
other about non-technical questions, the basic reality of open source remains hard to escape. These conversations may
sometimes be necessary, but they are not free. They ask for time, attention, restraint, and emotional energy from
contributors who often came to the project to build and maintain software.

The same pattern showed up around symbolic project branding. The [`NixOS/nixos-homepage#1775`] discussion started from a
simple question that several people had raised in one form or another, and for which some were treated very harshly,
even banned: what did the temporary Pride logo mean, and was NixOS now taking social or political stances ? To me, the
problem was not the logo swap itself, but **the absence of an initial explanation when it was changed**. For such an
international project, changing the public logo is a strong symbol, and not everyone, myself included, necessarily has
the right cultural frame of reference, the same interpretive grid, or enough awareness of the context, timing, and
intended message behind such a change. It could have been me asking such a question,... and eventually banned.

August 20 2025, the breaking point, I had to step back and it happened in [`NixOS/nixpkgs#435310`].

I stopped trying to follow every discussion. I made my [GitHub profile] private from that point on. I left toxic private
Matrix spaces where the main product had become gossip, speculation, and ideological positioning. I became more
selective about the threads I read and the discussions I entered. I also reconsidered how much responsibility I wanted
to carry inside the project. Contributing code is one thing, remaining emotionally available for every drama is another.

Because I was not happy with how things had unfolded, especially the lack of communication and transparency, I opened
[`NixOS/nixos-homepage#1830`] a few days later, together with the [`Ukraine logo Discourse thread`]. I proposed a
Ukrainian flag variant and tried to frame the question around consistency, process, and transparent criteria. If the
project was willing to use its public branding to support causes, then it should at least be able to discuss how such
support is decided and whether the same logic could apply to support Ukraine (_or any other cause_). Unsurprisingly, it
still became another discussion about intent, representation, neutrality, solidarity, and what a technical project
should publicly signal.

The Discourse thread made the same problem even more visible. Some contributors argued that symbolic support should not
happen on an ad hoc basis, that the project logo was not the right venue, or that a technical community should unite
around good software rather than public statements on causes. Others argued that human rights and community safety were
already part of the project's social reality. What also struck me was that some of the comments came from sporadic
contributors, or from people relatively distant from the day-to-day technical work of the project. It sometimes felt as
if controversy had its own gravity, attracting people who seemed far more interested in circling the mess than in
cleaning anything up. I tried to keep the discussion focused on process and consistency, but the thread still moved
towards personal interpretation of motives, including the suspicion that the Ukraine proposal was really a way to attack
the rainbow logo. The thread was eventually locked before NixCon, with an explicit note that the topic and moderation
could be discussed in person there, which I did.

When working collaboratively in an open-source project or anywhere else, whatever decisions we make, there will always
be people who disagree with them. The important part is whether we are able to accept compromise, accept that we cannot
always agree, and still be at peace with ourselves while collaborating on a project where our own ideas will not always
be the ones that prevail. That is how a project keeps moving forward together. Some people are willing to make that
effort. Others, clearly, are not.

The uncomfortable part is that I broadly agree with the principle that an open-source project should either remain
neutral in order to avoid ranking causes, or have a clear and consistent process for deciding which symbolic gestures it
makes. The Ukraine proposal was partly a way to test that consistency and see whether the community had a principled
answer. My conclusion was that the answer was much less clear than it should have been.

By late August, the situation had affected me enough that I contacted the [`NixOS mediation initiative`] for help, a
great initiative by [Numtide]. On 25 August 2025, I sent a request describing the strain caused by the community
situation and asking for guidance on how to react and how to move forward. Two days later, I had a conflict-coaching
call about it. I appreciated the time Ross took to understand my point of view and help me find a way to cope with it.
It definitely helped.

Then came [`NixCon 2025`], in [Rapperswil-Jona, Switzerland], from 5 to 7 September. I went there for two reasons. The
first was simply that I wanted to visit Switzerland, since I had never had the chance to visit that amazing country
before. The second was that I wanted to chat with as many contributors as possible after the drama and cancellation
attempts I had faced online. I enjoyed my time there much more than I expected. The venue was breathtaking, actually,
the best venue for IT conferences I ever went! The technical talks and hallway conversations were interesting, but what
mattered most to me was the chance to have direct, face-to-face discussions with people about what had happened, how
they saw the situation, and how the project could move forward without letting online conflict consume everything. The
Nix community I met _in person_ was not the same community I had come to know _online_. People were much kinder, more
nuanced, and easier to talk to face to face, and it became obvious to me that the online Nix community is not
representative of the Nix project as a whole. Those conversations did not solve everything, of course, but they reminded
me that the community is not reducible to its worst threads.

After NixCon, in [`NixOS/branding#33`], I materialised the proposal by adding Ukrainian branding derivations. Even
there, I had to address rumours about why the proposal existed in the first place. That is precisely the kind of thing I
mean: once a project starts making symbolic gestures without a clear process, contributors can end up spending a
surprising amount of time explaining motives, defending consistency, and maintaining conversations that are not about
the software itself.

Taken together, all of this changed my relationship with the project, but it did not make me want to abandon it. **It
made me change the shape of my involvement**.

I kept contributing where I felt the work was concrete, useful, and aligned with why I joined the project in the first
place: reproducibility, packaging quality, better tools, lower maintenance cost, and a more predictable contributor
experience. But I became much less willing to donate attention to drama. Attention is a finite resource, and open source
already consumes enough of it when things are going well.

That said, the whole experience also made me think more seriously about governance. A project cannot scale on technical
excellence alone. It needs clear processes, fewer grey zones and ambiguity, explicit responsibilities, accountable
moderation, conflict-of-interest handling, transparent decision-making, and enough institutional restraint to avoid
turning every disagreement into an existential battle. Without that, even a technically brilliant project can become
exhausting to inhabit.

I still want Nix to succeed. I still want more people to use it, understand it, contribute to it, and benefit from it.
But 2025 made one thing very clear to me: **I have to choose my battles more carefully**. My energy is better spent on
systems, tools, documentation, reviews, and reproducible infrastructure than on trying to keep up with every social
drama around the project, politics, trying to argue through every ideological battle, or trying to mediate between
factions.

That is not indifference. **It is self-preservation**, and perhaps also a more mature form of contribution.

## Rust, Typst, Nix, JJ…

My day-to-day tooling continued to evolve in 2025, though not radically. More like a process of gradual refinement.

[Typst] remained firmly established in my workflow and has long since replaced LaTeX for nearly everything I need. It
continues to hit that sweet spot between power and sanity that too few tools manage to reach.

[Nix] also remained central to how I think about environments, packaging, and infrastructure. At this point, I can say
it again without hesitation: when the problem is dependency management, environment consistency, deployment
predictability, or build reproducibility, Nix does not merely help a little. It **removes entire classes of nonsense**.
Not all of them, sadly, but enough to keep me convinced.

I also kept using [`JJ`] daily, and the feeling did not fade. Quite the opposite. The more I use it, the more I feel
that traditional Git ergonomics are needlessly hostile in ways we have collectively normalised. [`JJ`] still feels to me
like: _a version-control system designed by people who actually wanted humans **to succeed**_.

And then there was [Rust].

I would not pretend that Rust is simple. It is not for me at least, yet ! But I increasingly appreciate the type of
difficulty it imposes. It is often the kind that forces you to think clearly rather than letting you postpone the
consequences of vagueness. In a software world increasingly saturated with convenience-first ecosystems and poorly
governed dependency swamps, that feels refreshing... and challenging, that the least I can say.

## Complexity is not free

Professionally, 2025 continued some of the familiar patterns that had already become visible in 2024 and that I
described in the previous [Retrospective 2024]({{< ref "2025-03-21-retrospective-2024" >}}).

**It was also the year when, afer 10 years, I finally left [DIGIT] to join [DG EAC]**.

Leaving [DIGIT] was not just a change of acronym or office. It felt like closing a chapter that had become increasingly
difficult to inhabit in a healthy way. I had learnt a lot there, and I do not want to reduce the experience to
frustration. But by early 2025, it was clear to me that I needed a different environment: one where my energy could be
spent less on surviving accumulated organisational complexity and more on architecture, maintainability, engineering
practice, and the kind of long-term technical work I actually care about.

Joining [DG EAC] (Directorate General of Education, Youth, Sport and Culture) gave that professional year a different
shape. It did not magically remove the usual constraints of large public-sector IT, but it did give me a renewed sense
of direction. The move put me closer to architecture and DevSecOps work, and closer to questions I find meaningful: how
systems are structured, how teams make technical choices, how shared platforms evolve, and how public institutions can
build software capacity without surrendering clarity or control.

That contrast also sharpened some of my observations.

I kept working in environments where technical quality often has to push its way through organisational inertia,
fragmented decision-making, poor standardisation, and a great deal of accidental complexity. That may sound harsh, but I
do not think it is unfair.

What struck me again and again was how often complexity is treated as though it were an unavoidable background condition
rather than an actively produced cost. But complexity is not free. **Every workaround has a price**. Every undocumented
assumption has a price. Every duplicated script, every inconsistent convention, every hidden dependency, every strange
release process, every overengineered YAML pipeline stitched together with imperative shell fragments in three different
languages, all of it has a price.

And the larger the organisation, the easier it becomes to absorb that waste without confronting it directly.

That, to me, is one of the deepest dangers in large institutional environments: **inefficiency can become so pervasive
that it starts to look normal**. Sometimes, even the maintenance of technical debt starts to feel normal too, as if
keeping systems difficult to understand can become beneficial to someone trying to secure their own comfortable
position.

So, as much as I could, I kept trying to work in the other direction: reducing duplication, making code easier to reason
about, improving typing, refactoring away unnecessary inheritance, making behaviour more explicit, tightening
development practices, and generally pushing for systems that can be understood without requiring a _priesthood_.

It is not glamorous work, I know, but at least it feels useful, I feel useful.

## Public-sector IT, digital sovereignty, institutional amnesia

Throughout 2025, I kept reflecting on digital sovereignty, and I mean it in a sense much broader than simply "_hosting
location_".

For me, digital sovereignty is about control, intelligibility, auditability, and the practical ability to act on the
systems we depend on. It is about not building critical public infrastructure on layers of opaque dependencies,
outsourced assumptions, and proprietary constraints that no one fully understands or can meaningfully challenge. It is
about ensuring that public institutions retain not just access to software, but agency over it.

This concern only grew stronger as questions around supply chains, SBOMs, dependency tracking, compliance, and the
[Cyber Resilience Act] continued to become more relevant. The same basic question kept surfacing in different forms: _do
we actually know what we are running, how it was built, what it depends on, and whether we could rebuild or replace it
if needed ?_

Too often, the honest answer remains: **not really**.

And this is where open source, reproducibility, and declarative infrastructure start to converge in a very practical
way. They are not just technical preferences. They are preconditions for autonomy.

I remain convinced that public institutions should be leading here. They should be setting the standard for
transparency, maintainability, interoperability, and vendor independence. They should be investing in shared building
blocks, reusable tooling, open governance, and long-term digital capacity. Too often, though, they still end up
reproducing the very dependency patterns they ought to be resisting.

This is particularly frustrating because the talent exists. The resources exist. The need certainly exists. What is
often missing is continuity, coordination, and the willingness to treat engineering choices as strategic choices rather
than procurement side effects.

## Local Linux User Group

One thing I appreciated more in 2025 was the value of smaller, more grounded communities.

I remained active in open-source circles and continued engaging with people around reproducibility, Nix, packaging, and
infrastructure. I also spent time helping keep local technical communities alive, because I increasingly think these
spaces matter more than we sometimes admit.

One concrete expression of that was organising the first [BeNix meetup in Nivelles] on 7 November 2025. It was
intentionally small and friendly: a few short presentations, pizza, drinks, open discussion, and enough room for both
curious beginners and more experienced Nix users. The venue was kindly offered by [Le Phare], which made the whole thing
feel local in the best possible sense.

That evening mattered to me because it made the Nix community feel concrete again. I like in-person meetups precisely
for that reason: they show you the real community, the one made of people who show up, listen, ask questions, help each
other, and are willing to be present with the full complexity of a conversation. That is very different from the
disembodied version of community that sometimes appears online, where some people seem mostly interested in criticising
every imperfection with maximum intensity and very little personal courage. It is also a useful reminder that the most
vocal people are not necessarily representative of the project. A large part of the contributor base is quieter, more
practical, and far less interested in turning every disagreement into a public spectacle.

There is also a very different quality to explaining Nix, Linux, devshells, wrappers, and reproducibility to people
sitting in the same room than there is to arguing about abstractions online. It brings the subject back to practice:
what people are trying to build, what they do not understand yet, what friction they hit, and what small examples can
suddenly make a difficult idea usable.

Remote collaboration is useful. Shared repositories are useful. Chat tools are useful. But none of these fully replaces
what happens when people meet, exchange ideas informally, have a coffee, eat pizza and chips, sketch nonsense on a
napkin, argue over a toolchain, or discover during a side conversation that they have been solving the same problem in
parallel for half a year.

Some of the healthiest technical energy I felt in 2025 came from precisely those kinds of interactions, and this is also
the reason why I like going back to the office.

## Life

2025 was not just about code, drama, teaching and infrastructure.

It was also the year when Nakano passed away, in August. After losing Izumi at the very end of 2023, saying goodbye to
Nakano less than two years later was another quiet and painful marker in the year. He had been part of the house, part
of its routines, and part of the small ordinary presence that makes daily life feel anchored. His absence stayed with me
more than I expected.

{{< figure src="/images/IMG_20200626_162159.jpg" caption="Nakano <3" width=1024 >}}

Part of the year was also spent dealing with very concrete, local, human issues closer to home: neighbourhood tensions,
technical nuisances, mediation, documentation, exchanges with public actors, and all the strange little situations where
evidence, communication, patience, and endurance matter more than ideology.

One example became especially present towards the end of the year: the recurring noise from a neighbour's heat pump
behind our house. It had already been a long-running issue, but the breakdown of a temporary compromise around late 2025
made it much harder to ignore. I found myself documenting facts, gathering measurements, talking with neighbours,
contacting the relevant actors, and trying to keep the process constructive despite the fatigue that comes with a
problem that invades daily life in such a physical way, simply because it is impossible to sleep with the noise it
produces at night, around 55 dB(A) while the limit in Belgium is 40 dB(A) at night.

{{< figure src="/images/noise-station.png" caption="An overview of the sound pressure levels taken from my bedroom window during the night" width=1024 >}}

Oddly enough, these experiences reinforced some of the same beliefs: opaque systems generate mistrust, poor
communication prolongs conflict, hidden assumptions make resolution harder, documentation helps, precision helps, calm
persistence helps. And when institutions fail to engage seriously with the people affected by a problem, frustration
compounds very quickly.

Whether in software or daily life, I kept seeing the same pattern: systems become hostile when they stop being
intelligible to the people who must live with them.

## Writings

I also kept writing in 2025, and the older I get, the more I think writing is one of the best antidotes to conceptual
laziness.

A lot of professional environments are dominated by ephemeral communication: meetings, chats, vague announcements,
improvised decisions, disconnected tickets. Writing pushes in the opposite direction. It forces sequencing. It forces
explicitness. It reveals weak arguments. It exposes missing links. It gives ideas enough structure to be challenged
properly.

Over the year, I wrote and revised material on reproducibility, software engineering, public-sector IT, and work more
generally. Some of it remained private, some of it became public, and some of it is probably still waiting for me to
stop polishing it.

But in all cases, the purpose was similar: to understand what I really think, and to say it a bit more clearly than the
surrounding noise usually allows.

I am increasingly convinced that careful writing is itself a technical skill.

## Looking forward

If I had to summarise 2025 in one sentence, I would say this:

**It was a year of trying to align practice with principles.**

Not perfectly. Not without frustration. Not without contradictions either. But more deliberately than before.

I continued defending reproducibility, open source, simplicity, and digital sovereignty not because they are fashionable
talking points, but because I have seen, repeatedly, what happens when they are absent. Costs rise. Fragility rises.
Dependency rises. Confusion rises. And after a while, people start adapting to avoidable dysfunction as though it were
an immutable law of nature.

I do not think it is.

I still believe we can build software ecosystems that are more understandable, more maintainable, more transparent, and
more respectful of both users and developers. I still believe public institutions have both the opportunity and the
responsibility to lead by example. I still believe teaching matters, open communities matter, documentation matters, and
that reducing complexity is one of the most valuable forms of engineering labour there is.

So that is what I want more of in 2026: fewer buzzwords, more rigour; fewer black boxes, more understandable systems;
fewer isolated efforts, more shared building blocks; fewer theatrical transformations, more real engineering.

**And, ideally, just a little less nonsense disguised as innovation**.

{{< alert type="warning" header="Disclaimer" >}}

1. The views expressed in this post are my own and do not necessarily reflect those of my employer or any institution I
   am affiliated with. This reflection is based on personal experience and observations.
2. I used a very old refurbished server hosted in my basement to fix the typos of this text using different open-source
   [LLM](https://en.wikipedia.org/wiki/Large_language_model), using [Ollama](https://ollama.com) and
   [Open-WebUI](https://github.com/open-webui/open-webui).
3. This post was produced using a controversial assistive technology known as a "physical keyboard", configured with a
   US layout. I understand this may be disappointing to purists and I apologise in advance to anyone who believes real
   writing must be done manually, preferably with a goose feather and no autocomplete.

{{< /alert >}}

[`NixOS/nixpkgs`]: https://github.com/NixOS/nixpkgs
[`trix`]: https://github.com/aanderse/trix
[DIGIT]: https://commission.europa.eu/about/departments-and-executive-agencies/digital-services_en
[DG EAC]: https://commission.europa.eu/about/departments-and-executive-agencies/education-youth-sport-and-culture_en
[typst]: https://typst.app
[Nix]: https://nixos.org
[`JJ`]: https://github.com/jj-vcs/jj
[`NixOS/nixpkgs#385830`]: https://github.com/NixOS/nixpkgs/pull/385830
[`NixOS/nixpkgs#397142`]: https://github.com/NixOS/nixpkgs/pull/397142
[BeNix meetup in Nivelles]: https://discourse.nixos.org/t/nix-meetup-nivelles-belgium-2025-11-7/71431
[`markdown-code-runner`]: https://github.com/drupol/markdown-code-runner
[`staabm/oss-contribs`]: https://github.com/staabm/oss-contribs
[`NixOS/nixpkgs#435310`]: https://github.com/NixOS/nixpkgs/pull/435310
[`NixOS/branding#33`]: https://github.com/NixOS/branding/pull/33
[`NixOS/nixos-homepage#1830`]: https://github.com/NixOS/nixos-homepage/issues/1830
[`NixOS/nixos-homepage#1775`]: https://github.com/NixOS/nixos-homepage/issues/1775
[`NixOS mediation initiative`]: https://nixos-mediation.org/
[`NixCon 2025`]: https://2025.nixcon.org/
[Numtide]: https://numtide.com
[GitHub profile]: https://github.com/drupol
[`Ukraine logo Discourse thread`]:
  https://discourse.nixos.org/t/proposal-update-the-nixos-logo-for-ukrainian-flag-day-23-august/68375
[Cyber Resilience Act]: https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act
[Le Phare]: https://le-phare.be/
[315 merged pull requests]:
  https://github.com/NixOS/nixpkgs/pulls?q=is%3Apr+author%3Adrupol+merged%3A2025-01-01..2025-12-31+sort%3Aupdated-desc+
[Master's thesis on reproducibility in software engineering]: https://doi.org/10.5281/zenodo.12666898
[`Anduril's threat is existential`]: https://discourse.nixos.org/t/andurils-threat-is-existential/70811/3
[Rust]: https://rust-lang.org/
[`NixOS/nixpkgs#439122`]: https://github.com/NixOS/nixpkgs/pull/439122
[Nixpkgs manual]: https://nixos.org/nixpkgs/manual/
[NixOS manual]: https://nixos.org/nixos/manual/
[Rapperswil-Jona, Switzerland]: https://www.openstreetmap.org/query?lat=47.223383&lon=8.816531#map=19/47.223456/8.816644
