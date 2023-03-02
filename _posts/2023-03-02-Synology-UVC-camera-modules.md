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

On my Intel Apollolake Synology (DS718+), my Logitech C270 UVC webcam did not load, when plugging it into USB.
Turns out UVC support is not built into the default Synology kernel.

## Get Synology kernel sources and toolchain
- Synology archive: [https://archive.synology.com/download/](https://archive.synology.com/download/)
- Synology Linux-4.4.x fork for Apollolake: [https://global.synologydownload.com/download/ToolChain/Synology%20NAS%20GPL%20Source/7.0-41890/apollolake/linux-4.4.x.txz](https://global.synologydownload.com/download/ToolChain/Synology%20NAS%20GPL%20Source/7.0-41890/apollolake/linux-4.4.x.txz)
- Synology GCC 12 toolchain for Apollolake: [https://global.synologydownload.com/download/ToolChain/toolchain/7.2-63134/Intel%20x86%20Linux%204.4.302%20%28Apollolake%29/apollolake-gcc1220_glibc236_x86_64-GPL.txz](https://global.synologydownload.com/download/ToolChain/toolchain/7.2-63134/Intel%20x86%20Linux%204.4.302%20%28Apollolake%29/apollolake-gcc1220_glibc236_x86_64-GPL.txz)

## Setup cross compiler

- Extract the GCC toolchain and `cd` to whereever you have it extracted
- Then:
  ```sh
  export CC=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-gcc
  export LD=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-ld
  export RANLIB=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-ranlib
  export CFLAGS=-I`pwd`/x86_64-pc-linux-gnu/include
  export LDFLAGS=-L`pwd`/x86_64-pc-linux-gnu/lib
  export CXX=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-g++
  export AR=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-ar
  export NM=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-nm
  export STRIP=`pwd`/x86_64-pc-linux-gnu/bin/x86_64-pc-linux-gnu-strip
  
  export PATH=`pwd`/x86_64-pc-linux-gnu/bin/:$PATH
  ```

## Linux menuconfig

- Extract the Linux 4.4.x kernel sources and `cd` into that directory.
- Modify the the default apollolake config at `synoconfigs/apollolake`, and add:
  ```Kconfig
  CONFIG_VIDEO_V4L2=m
  CONFIG_CONFIG_MEDIA_CAMERA_SUPPORT=y
  CONFIG_USB_VIDEO_CLASS=m
  CONFIG_LOCALVERSION="+"
  ```

That last LOCALVERSION setting is needed to allow the module to load on DSM7.1 versions.

## Compile kernel modules
You're ready to compile the kernel modules now.
- Run: `CROSS_COMPILE=x86_64-pc-linux-gnu- make modules -j20`
This will build all kernel modules using 20 parallel processes.

## Copy over the required kernel modules to the Synology

Once done, copy over the required kernel modules to the Synology (using ssh or the file browser or ...)

You'll need:
`videobuf2-memops.ko` `videobuf2-vmalloc.ko` `videobuf2-core.ko` `videobuf2-v4l2.ko` `videodev.ko` `v4l2-common.ko` and `uvcvideo.ko`

## Load the modules on the running Linux kernel

- ssh into your Synology server
- cd to wherever you copied the kernel modules on your Synology
- Then run:
```sh
insmod videobuf2-memops.ko
insmod videobuf2-vmalloc.ko
insmod videobuf2-core.ko
insmod videobuf2-v4l2.ko
insmod videodev.ko
insmod v4l2-common.ko
insmod uvcvideo.ko
```

- Check if the modules loaded correctly, using `dmesg`. Look for `Linux video capture interface: v2.00`.

## Plug in a UVC webcam
Now plug in a UVC webcam, and check if it's detected using `dmesg`. E.g.:
  ```
  [1839456.436728] uvcvideo: Found UVC 1.00 device USBDevice (046d:0825)
  [1839456.534937] input: USBDevice as /devices/pci0000:00/0000:00:13.1/0000:02:00.0/usb3/3-2/3-2.1/3-2.1:1.0/input/input2
  [1839456.546939] usbcore: registered new interface driver uvcvideo
  ```

## Enjoy

Happy camming!
