---
title: "Nice Spectrum Analyser... but does it run DOOM?"
categories:
  - Blog
tags:
  - doom
  - siglent
  - spectrumanalyser
  - opensource
---

There's been quite some talk about the excellent Siglent SS 3021X Spectrum Analyser. It's a great piece of entry-level hardware, especially for the pricepoint.
See:
* [https://www.siglent.eu/siglent-ssa3021x-spectrum-analyser.html](https://www.siglent.eu/siglent-ssa3021x-spectrum-analyser.html)
* and: EEVblog's review/comparison: [https://www.youtube.com/watch?v=gkLciTsjGZg](https://www.youtube.com/watch?v=gkLciTsjGZg)

It's also quite hackable:
[https://iw0ffk.wordpress.com/2017/01/29/hacking-the-spectrum-analyzer-siglent-ssa-3021x/](https://iw0ffk.wordpress.com/2017/01/29/hacking-the-spectrum-analyzer-siglent-ssa-3021x/)

You can login over telnet using: `root/ding1234` as login/password.

`dmesg`, `cat /proc/cpuinfo` and friends tell a lot about this device.
It seems it's based on an am335x chipset from TI.
http://www.ti.com/processors/sitara/arm-cortex-a8/am335x/overview.html

The framebuffer is accesible throught /dev/fb0

Mmm.. let's run DOOM on this thing!

Fetch the same toolchain Siglent used to compile software for this spectrum analyser:
https://releases.linaro.org/archive/13.03/components/toolchain/binaries/

Compile my minimal DOOM fork meant for easy porting to framebuffers:
```
$ git clone https://github.com/maximevince/fbDOOM
$ cd fbDOOM/fbdoom
$ make CROSS_COMPILE=arm-linux-gnueabi-hf-
```

Copy fbdoom over to the Siglent (e.g. using USB stick, or busybox wget, first crosscompile dropbear, ...)

Play!
Only auto-playing demo for now, I haven't actually implemented any of the input controls (no keyboard or mouse)

Some footage here:
[https://www.youtube.com/watch?v=ztVI7r7C-1w](https://www.youtube.com/watch?v=ztVI7r7C-1w)
