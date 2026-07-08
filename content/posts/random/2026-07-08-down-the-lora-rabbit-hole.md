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
[SenseCap Tracker T1000E](https://meshtastic.org/docs/hardware/devices/seeed-studio/sensecap/card-tracker/), and that
was it ! My curiosity was well and truly piqued. I have been exploring the world of
[LoRa](https://en.wikipedia.org/wiki/LoRa) networks ever since, and what a journey it has been. I thought it was a good
time to write down my experiences, so here's a look at how a curiosity turned into some kind of full-blown obsession.

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
- A RAK4631 core module sitting nicely on a
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
not to an upgrade to a beefy 10000mAh battery is on the to-do list in the upcoming days... but let's be honest, given
the heatwave we have been experiencing in Belgium in June, there hasn't been much of a problem. The node has been
running flawlessly for weeks now.

{{< figure src="/images/Screenshot_20260708_081237.png" caption="The meshtastic node mounted on the Velux window, on a very gloomy day" width=1024 >}}

## Falling into the Reticulum Abyss

As if Meshtastic wasn't enough to keep me occupied, I stumbled upon the [Reticulum project](https://reticulum.network/).
And... oh boy, that was an absolute game-changer. It is a proper bottomless pit of fascinating tech.

I have been buying and mounting devices left, right, and centre, running tests everywhere I can. It has been an absolute
blast getting to grips with how it all routes and communicates.

{{< figure src="/images/Screenshot_20260708_081342.png" caption="A RAK19003, two RAK19007 and a RAK13800 module (ethernet)" width=1024 >}}

After wrapping my head around the basics, the concepts, and the terminology, I managed to set up a small Reticulum
network at home.

After that, I started investigating how to make a public Reticulum node that would contribute to the wider Reticulum
network. To do that, a couple of requirements had to be met to meet the NixOS standards, further explained in the next
section.

In practice, anyone can run a Reticulum node, and no specific hardware is required: running the `rnsd` daemon with a
proper configuration is enough to contribute to the network. Once you have a node up and running, you can also run the
`lxmd` daemon (from the [LXMF project](https://github.com/markqvist/LXMF)) to provide a local messaging service for your
Reticulum network. This allows you to send and receive messages from other Reticulum nodes. The `lxmd` daemon is also a
great way to test your Reticulum node and see if it is working properly.

As if all of this were not enough, I decided to build a public LoRa gateway to contribute to the Reticulum network.
Reticulum is a mesh network after all, and the more nodes there are, the better the network becomes! :D

So I decided to buy a new set of things:

- A
  [RAK4631 core module](https://store.rakwireless.com/products/wisblock-core-module-rak4631?_pos=1&_sid=309676b3c&_ss=r&variant=43884035080390)
  sitting on a
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
- Another [window suction mount](https://hexaspot.com/products/velux-window-suction-mount), I have 2 Velux windows, so I
  can have 2 nodes up and running at the same time !

I initially bought these devices because I had seen ethernet support land in a
[PR](https://github.com/attermann/microReticulum_Firmware/pull/48). Sadly, the PR has been closed and I am unable to use
the ethernet module with the most up-to-date firmware as of today. I hope one day proper ethernet support will be
landing into `microReticulum`, but for now, I am stuck with using the serial interface to connect to my Reticulum node.

I love the [Reticulum](https://github.com/markqvist/Reticulum/) project, but I am a bit sad to see so much fragmentation
in its ecosystem. There are many different implementations of [Reticulum](https://github.com/markqvist/Reticulum/)
itself, and many different implementations of [RNode](https://github.com/markqvist/RNode_Firmware), the Reticulum
firmware to install on a chip. Unlike Meshtastic, there is no central repository, and there is no central place to find
all the different implementations of RNode. I hope that in the future, the Reticulum project will be able to unify the
ecosystem and provide a more cohesive experience for users.

Reticulum works very differently from Meshtastic, and it is a bit more complex to set up because the physical device
does not own the user identity; instead, the identity is generated by the Reticulum software itself running on your
device. This paradigm shift is great, but it requires a bit more work to set up. As an example, it is harder to set up
an autonomous Reticulum node on your roof simply because RNode alone is not very useful without `rnsd`, the Reticulum
Network Stack daemon.

That said, there is an alternative firmware called
[`microReticulum`](https://github.com/attermann/microReticulum_Firmware) that allows you to run a Reticulum node on a
microcontroller. It is promising, and it is the one I use. Once deployed on your chip, it lets you run a Reticulum node
without the need for a computer, because the daemon runs on the chip itself. This is similar to the way Meshtastic
works, but not exactly the same. A node powered by `microReticulum` acts as a transport node, routing packets for other
Reticulum nodes on the LoRa mesh.

One of the biggest frustrations I had was seeing a bit of smoke come out of one of my RAK boards just after plugging in
the new 10000mAh battery. I was so excited to see my Reticulum node up and running that I did not check the polarity of
the battery, a rookie mistake. Needless to say, I learned my lesson.

So, after a broken board, a few other broken expectations and attempts, a lot of tinkering... I finally managed to get
my Reticulum node up and running.

{{< figure src="/images/Screenshot_20260708_080940.png" caption="The Reticulum roof node being assembled with a 10000mAh battery" width=1024 >}}

The roof node acts as a transport node for the LoRa mesh and can communicate with another node connected to a local
server at home, which is bridged to the internet. This allows me to seamlessly connect the LoRa network with the wider
Reticulum network over the internet.

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

My wish list for the future of Reticulum is to have a more unified ecosystem, with an alternative implementation of
Reticulum in a compiled language, and a more unified set of applications that can be used to communicate over Reticulum.

I also hope for better hardware support, especially for the ethernet module, and better support for the
[RAK1906](https://store.rakwireless.com/products/rak1906-bme680-environment-sensor) telemetry module. I sincerely hope
the [`microReticulum`](https://github.com/attermann/microReticulum) project will continue to grow and evolve, and that
it will become a more robust and reliable implementation of Reticulum for microcontrollers.

## Giving Back

I have always believed that if you are going to use open-source projects heavily, you ought to give something back when
you can. Since Nix is my daily driver, I focused my efforts there.

For Meshtastic, I introduced [firmware builds](https://github.com/NixOS/nixpkgs/pull/465275). It is also now entirely
possible to build the firmware straight from source ([see PR #466509](https://github.com/NixOS/nixpkgs/pull/466509)).

For Reticulum, the work is ongoing but very exciting. I currently have two new modules (rnsd and lxmd) in the works
([see PR #530406](https://github.com/NixOS/nixpkgs/pull/530406)). Introducing these modules required the introduction of
a [new formatter for Nix code](https://github.com/NixOS/nixpkgs/pull/531952) so that the configuration files for
Reticulum (using [`configobj`](https://configobj.readthedocs.io/) format) could be generated from Nix code. It was a
very exciting development, as it was the first time I had to write a custom formatter for Nix code. Lastly, I have also
contributed by adding various tools and implementations of Reticulum like
[Reticulated](https://github.com/NixOS/nixpkgs/pull/532198), [Leviculum](https://github.com/NixOS/nixpkgs/pull/531781),
[Reticulum-go](https://github.com/NixOS/nixpkgs/pull/527991),
[rs-reticulum](https://github.com/NixOS/nixpkgs/pull/529207), [rs-lxmf](https://github.com/NixOS/nixpkgs/pull/530244),
[lxmf-rs](https://github.com/NixOS/nixpkgs/pull/529099), ...

## What's Next?

Honestly, I am having the time of my life messing about with all this. There is always a new device to test, a new
configuration to try, a new RNode firmware version to deploy... or another bit of code to package in Nix.

If you are on the fence about getting into LoRa, consider this your sign to just go for it. Grab a couple of nodes _(it
is not that expensive... erm, wait!)_, set them up, and see where the rabbit hole takes you!
