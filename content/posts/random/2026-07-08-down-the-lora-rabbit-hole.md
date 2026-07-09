---
date: 2026-07-08
tags:
  - lora
  - meshtastic
  - reticulum
  - nixos
title: "Down the LoRa(bbit) Hole: From Meshtastic to Reticulum"
draft: false
---

It all started quite innocently, during a NixOS meetup last year. A friend of mine (_Hello Theo!_) showed off his new
[SenseCap Tracker T1000E](https://meshtastic.org/docs/hardware/devices/seeed-studio/sensecap/card-tracker/) running
[Meshtastic](https://meshtastic.org/), and that was it ! My curiosity was well and truly piqued. I have been exploring
the world of [LoRa](https://en.wikipedia.org/wiki/LoRa) and "off-grid" networks ever since, and what a journey it has
been. I thought it was a good time to write down my experiences, so here's a look at how a curiosity turned into some
kind of full-blown obsession.

<!--break-->

## Dipping My Toes into Meshtastic

To get the ball rolling, I decided to start with [Meshtastic](https://meshtastic.org/), an open-source "off-grid"
messaging platform for LoRa networks. It seemed like the perfect entry point. I picked up a pair of
[WisMesh Tags](https://store.rakwireless.com/products/wismesh-tag-meshtastic-gps-lora-tracker-ip66) just to run some
basic tests and see what all the fuss was about. During a trip to Italy, I was so impressed to see that I could
communicate with my family from the plane without any trouble. I was also receiving signals from other Meshtastic users
on the ground. Such a small device, yet it could reach so far. I was hooked. The WisMesh Tag worked brilliantly, but as
is always the way with these things, I immediately wanted more range and better network coverage.

## Building the Solar Relay Node

{{< figure src="/images/Screenshot_20260708_082439.png" caption="Delivery unboxing time! Yay!" width=1024 >}}

If I was going to do this properly, I needed to extend the Meshtastic network. This meant gathering some hardware to
build my own relay node. Here's the kit I ended up putting together:

- A [MikroTik 868 Omni Antenna](https://mikrotik.com/product/868_omni_antenna)
- A
  [RAK4631](https://store.rakwireless.com/products/wisblock-core-module-rak4631?_pos=1&_sid=309676b3c&_ss=r&variant=43884035080390)
  core module sitting nicely on a
  [RAK19003 base board](https://store.rakwireless.com/products/wisblock-meshtastic-starter-kit?_pos=1&_sid=309676b3c&_ss=r&variant=43884035080390)
- An environment sensor [RAK1906](https://store.rakwireless.com/products/rak1906-bme680-environment-sensor) to monitor
  the temperature, humidity, pressure, and air quality
- A 3000mAh battery
- A
  [Unify enclosure with a built-in solar panel](https://store.rakwireless.com/products/unify-enclosure-ip67-150x100x45mm-with-pre-mounted-m8-5-pin-and-rp-sma-antenna-ip-rated-connectors?index=93&variant=42861623771334)
- A [window suction mount](https://hexaspot.com/products/velux-window-suction-mount)

{{< figure src="/images/Screenshot_20260708_081551.png" caption="A RAK19003 and its RAK4631 core module, minimal and very efficient setup" width=1024 >}}

After some tinkering, I had my Meshtastic relay up and running. I mounted it on my Velux window with the
[window suction mount](https://hexaspot.com/products/velux-window-suction-mount), where it is happily ticking away
24/7... well, mostly... Belgium weather has other ideas :)

{{< figure src="/images/Screenshot_20260708_081303.png" caption="The meshtastic node under construction" width=1024 >}}

The Belgian weather is the real bottleneck here. On days with decent sunshine, it is flawless and runs for days. But as
anyone living in Belgium will tell you, those days are not exactly guaranteed. The 3000mAh battery is just a bit too
small to bridge the gap during our gloomy stretches, so the node occasionally drops offline from a lack of light. Worry
not because an upgrade to a beefy 10000mAh battery is on my to-do list in the upcoming days... but let's be honest,
given the crazy heatwaves we have been experiencing in Belgium lately, there hasn't been much of a problem. The node has
been running flawlessly for weeks now.

{{< figure src="/images/Screenshot_20260708_081237.png" caption="The Meshtastic node mounted on the Velux window, on a very gloomy day" width=1024 >}}

## Falling into the Reticulum Abyss

As if [Meshtastic](https://meshtastic.org/) wasn't enough to keep me occupied, I stumbled upon the
[Reticulum project](https://reticulum.network/). And... oh boy, that was an absolute game-changer. It is a proper
bottomless pit of fascinating tech.

While Meshtastic is a great project, it is a bit limited in its scope. Reticulum, on the other hand, is a full-fledged
mesh networking stack that can be used to build all sorts of applications. As an example, Reticulum can be used and have
the same feature set as Meshtastic. The possibilities are endless, and I am having a blast exploring them.

I have been buying and mounting devices left, right, and centre, and running tests everywhere I can. It has been a
fascinating process to understand how everything routes and communicates.

{{< figure src="/images/Screenshot_20260708_081342.png" caption="A RAK19003, two RAK19007 and a RAK13800 module (ethernet)" width=1024 >}}

After wrapping my head around the basics, the concepts, and the terminology, I finally managed to set up a small
Reticulum network at home.

After that, I started investigating how to make a public Reticulum node that would contribute to the wider Reticulum
network. To do that, a couple of requirements had to be met to meet the NixOS standards and practices, further explained
in the next section.

In practice, anyone can run a Reticulum node, and no specific hardware is required: running the `rnsd` daemon with a
proper configuration is enough to contribute to the network. Once you have a node up and running, you can also run the
`lxmd` daemon (from the [LXMF project](https://github.com/markqvist/LXMF)) to provide a local messaging service for your
Reticulum network. This allows you to send and receive messages from other Reticulum nodes. The `lxmd` daemon is also a
great way to test your Reticulum node and see if it is working properly.

As if all of this were not enough, I decided to build a public LoRa and TCP gateway to contribute to the Reticulum
network. Reticulum is a mesh network after all, and the more nodes there are, the better the network becomes ! :D

So I decided to buy a new set of things:

- A
  [RAK4631](https://store.rakwireless.com/products/wisblock-core-module-rak4631?_pos=1&_sid=309676b3c&_ss=r&variant=43884035080390)
  core module sitting on a
  [RAK19007 base board](https://store.rakwireless.com/products/wisblock-meshtastic-starter-kit?_pos=1&_sid=309676b3c&_ss=r&variant=43884034621638)
- An ethernet module [RAK13800](https://store.rakwireless.com/products/rak13800-wisblock-ethernet-interface) and its PoE
  module [RAK19018](https://store.rakwireless.com/products/rak19018-poe-module-for-rak13800)
- An environment sensor [RAK1906](https://store.rakwireless.com/products/rak1906-bme680-environment-sensor) to monitor
  the temperature, humidity, pressure and air quality
- A NOR flash module [RAK15001](https://store.rakwireless.com/products/wisblock-flash-module-rak15001) required for
  `microReticulum`
- A
  [Unify enclosure without solar panel](https://store.rakwireless.com/products/unify-enclosure-ip67-150x100x45mm-with-pre-mounted-m8-5-pin-and-rp-sma-antenna-ip-rated-connectors?index=93&variant=42861623738566)
- A couple of 10000mAh batteries to increase the uptime of the node during the gloomy Belgian weather
- Another [window suction mount](https://hexaspot.com/products/velux-window-suction-mount). Actually, I have 2 Velux
  windows, so I can keep 2 nodes up and running at the same time: the more, the merrier!

I initially bought these devices because I had seen ethernet support land in a
[PR](https://github.com/attermann/microReticulum_Firmware/pull/48). Sadly, the PR has been closed and I am unable to use
the ethernet module with the most up-to-date firmware as of today. I hope one day proper ethernet support will be
landing into `microReticulum`, but for now, I am stuck with using the USB serial interface to connect to my Reticulum
node.

I love the [Reticulum](https://github.com/markqvist/Reticulum/) project, but I am a bit sad to see so much fragmentation
in its ecosystem. There are many different implementations of [Reticulum](https://github.com/markqvist/Reticulum/)
itself, and many different implementations of [RNode](https://github.com/markqvist/RNode_Firmware), the Reticulum
firmware to install on a real hardware. Unlike Meshtastic, there is no central repository or central place to find all
the different implementations of RNode. I hope that in the future, the Reticulum project will be able to unify its
ecosystem and provide a more cohesive experience for users.

Reticulum works very differently from Meshtastic, and it is a bit more complex to set up because the physical device
does not own the user identity; instead, the identity is generated by the Reticulum software itself running on your
device. This paradigm shift is great, but it requires a bit more work to set up. As an example, it is harder to set up
an autonomous RNode on your roof simply because a RNode alone is not very useful without a running `rnsd` (Reticulum
Network Stack daemon) operating it.

That said, there is an alternative firmware called
[`microReticulum`](https://github.com/attermann/microReticulum_Firmware), which lets you run an autonomous RNode on a
microcontroller without relying on an external `rnsd` instance. It is a promising approach, my favorite, and it is the
one I use by default. Once deployed on your hardware, it removes the need for a separate daemon, because the Reticulum
stack runs directly on the chip. This is similar in spirit to how Meshtastic works, though the architecture is not
exactly the same. A `microReticulum`-powered node can be used as a regular RNode, but it can also be configured in TNC
mode (transport mode), where it autonomously routes packets for other Reticulum nodes on the LoRa mesh and can bridge
that mesh to the wider Reticulum network through an internet-connected gateway.

One of the biggest frustrations I had was seeing a bit of smoke come out of one of my RAK boards just after plugging in
the new 10000mAh battery. I was so excited to see my Reticulum node up and running that I did not check the polarity of
the battery, a rookie mistake. Needless to say, I learned my lesson.

So, after a broken board, a few other broken expectations and attempts, a lot of tinkering... I finally managed to get
my Reticulum node up and running.

{{< figure src="/images/Screenshot_20260708_080940.png" caption="The Reticulum roof node being assembled with a 10000mAh battery" width=1024 >}}

The roof node acts as a transport node on the LoRa mesh and communicates with another node at home, connected to a local
server over USB. That home server is then bridged to the internet, allowing me to seamlessly link the LoRa mesh with the
wider Reticulum network.

{{< figure src="/images/Screenshot_20260708_185841.png" caption="A RAK19007 with the RAK4631, RAK13800, RAK19018, RAK1906, RAK15001 modules" width=1024 >}}

On top of exploring the arcana of this project and tinkering with the hardware, I have also been exploring the various
applications that can be used to communicate over Reticulum. I have been testing [Columba](https://columba.network/),
[Ratspeak](https://ratspeak.org/), [Reticulum Mobile App](https://thatsfguy.github.io/reticulum-mobile-app/),
[Retichat](https://newendian.com/retichat), [Sideband](https://github.com/markqvist/sideband),
[Nomadnet](https://github.com/markqvist/Nomadnet), [Meshchat](https://github.com/liamcottle/reticulum-meshchat),
[MeshchatX](https://meshchatx.com/), ... Most of these implementations use the Reticulum reference implementation in
Python, and I can't wait to have better alternatives in the future. Not that Python is bad (_erm erm!_), I definitely
believe it is a great language for prototyping, but I also believe that better implementations in other languages will
be needed to make Reticulum better and much more efficient, especially on smartphones.

My wish list for the future of Reticulum is a more unified ecosystem: an alternative implementation in a compiled
language, a more coherent set of applications for communicating over Reticulum, and a clearer path for contributing to
the core project. Open source should give users the freedom to choose the implementation that best suits their needs,
but not at the expense of the project's overall health. I do not really know the details behind why the GitHub
repository for Reticulum is not open to contributions, but I hope that, in the future, it will become easier to
contribute to the project and help it grow while keeping the core stable, secure, and aligned with the vision of its
original author, [Mark Qvist](https://github.com/markqvist).

I also hope for better hardware support, especially for the ethernet module, and better support for the
[RAK1906](https://store.rakwireless.com/products/rak1906-bme680-environment-sensor) telemetry module. I sincerely hope
the [`microReticulum`](https://github.com/attermann/microReticulum) project will continue to grow and evolve, and that
it will become a more robust and reliable implementation of Reticulum for microcontrollers.

## Giving Back

I have always believed that if you are going to use open-source projects heavily, you ought to give something back when
you can. Since NixOS is my daily driver, I focused my efforts there in the Nix ecosytem.

For Meshtastic, I introduced [firmware builds](https://github.com/NixOS/nixpkgs/pull/465275). It is also now entirely
possible to build the firmware straight from source ([#466509](https://github.com/NixOS/nixpkgs/pull/466509)).

For Reticulum, the work is ongoing but very exciting. I currently have two new modules (rnsd and lxmd) in the works
([#530406](https://github.com/NixOS/nixpkgs/pull/530406)). Introducing these modules required the introduction of a
[new formatter for Nix code](https://github.com/NixOS/nixpkgs/pull/531952) so that the configuration files for Reticulum
(using [`configobj`](https://configobj.readthedocs.io/) format) could be generated from Nix code. It was a very exciting
development, as it was the first time I had to write a custom formatter for Nix code. Lastly, I have also contributed by
adding various tools and implementations of Reticulum like [Reticulated](https://github.com/NixOS/nixpkgs/pull/532198),
[Leviculum](https://github.com/NixOS/nixpkgs/pull/531781), [Reticulum-go](https://github.com/NixOS/nixpkgs/pull/527991),
[rs-reticulum](https://github.com/NixOS/nixpkgs/pull/529207), [rs-lxmf](https://github.com/NixOS/nixpkgs/pull/530244),
[lxmf-rs](https://github.com/NixOS/nixpkgs/pull/529099), [rns-proxy](https://github.com/NixOS/nixpkgs/pull/531719),
[reticulum-group-chat](https://github.com/NixOS/nixpkgs/pull/535915), ...

## What's Next?

Honestly, I am having the time of my life messing about with all this. There is always a new device to test, a new
configuration to try, a new RNode firmware version to deploy... or another bit of code to package in Nix.

If you are on the fence about getting into LoRa, consider this your sign to just go for it. Grab a couple of nodes _(it
is not that expensive... erm, wait!)_, set them up, and see where the rabbit hole takes you!
