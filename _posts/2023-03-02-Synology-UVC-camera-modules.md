---
title: "UVC webcam support for Synology NAS"
categories:
  - Blog
tags:
  - synology
  - linux
  - kernel
  - uvc
  - webcam
  - camera
---

## UVC camera not recognized

On my Intel Apollolake Synlogy (DS718+), my Logitec C270 UVC webcam did not load, when plugging it into usb.
Turns out UVC support is not built into the default Synology kernel.

## Get Synology kernel sources and toolchain
- https://archive.synology.com/download/
- https://global.synologydownload.com/download/ToolChain/Synology%20NAS%20GPL%20Source/7.0-41890/apollolake/linux-4.4.x.txz
- https://global.synologydownload.com/download/ToolChain/toolchain/7.2-63134/Intel%20x86%20Linux%204.4.302%20%28Apollolake%29/apollolake-gcc1220_glibc236_x86_64-GPL.txz

## Setup cross compiler
```bash
export CC=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-gcc
export LD=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-ld
export RANLIB=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-ranlib
export CFLAGS=-I`pwd`/x86_64-pc-linux-gnu/include
export LDFLAGS=-L`pwd`/x86_64-pc-linux-gnu/lib
export CXX=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-g++
export AR=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-ar
export NM=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-nm
export STRIP=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-strip
```

## Linux menuconfig

- CONFIG_VIDEO_V4L2=m
- CONFIG_CONFIG_MEDIA_CAMERA_SUPPORT=y
- CONFIG_USB_VIDEO_CLASS=m
- CONFIG_LOCALVERSION="+"

That last setting is needed to allow the module to load on DSM7.1 versions.

## Compile kernel modules

Run:
`CROSS_COMPILE=x86_64-pc-linux-gnu- make modules -j20`

This will build all kernel modules using 20 parallel processes.

## Copy over the required kernel modules to the Synology

You'll need:
`videobuf2-memops.ko` `videobuf2-vmalloc.ko` `videobuf2-core.ko` `videobuf2-v4l2.ko` `videodev.ko` `v4l2-common.ko` and `uvcvideo.ko`

## Load the modules on the running Linux kernel

- ssh into your Synology server
- cd to wherever you copied the kernel modules on your synlogoy

```bash
insmod videobuf2-memops.ko
insmod videobuf2-vmalloc.ko
insmod videobuf2-core.ko
insmod videobuf2-v4l2.ko
insmod videodev.ko
insmod v4l2-common.ko
insmod uvcvideo.ko
```
