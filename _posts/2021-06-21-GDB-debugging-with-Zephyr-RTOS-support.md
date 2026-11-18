---
title: "GDB debugging with Zephyr RTOS support"
categories:
  - Blog
tags:
  - jtag
  - swd
  - gdb
  - zephyr
  - debugging
---

* Build Zephyr project with `DEBUG_THREAD_INFO` (2.6.x) or `OPENOCD_SUPPORT` (2.5.x and lower)
* Use (or build) an openocd version that supports Zephyr RTOS [https://github.com/zephyrproject-rtos/openocd](https://github.com/zephyrproject-rtos/openocd).
  On Arch Linux you can use https://aur.archlinux.org/packages/openocd-zephyr-git
* Configure your openocd to look for Zephyr symbols:
  `openocd-zephyr -f openocd.cfg -c "nrf52.cpu configure -rtos Zephyr"`
* Run gdb, and let it connect to openocd:
  `arm-none-eabi-gdb build/zephyr/zephyr.elf -ex 'target remote :3333'`
* Et voila:
  [![GDB with Zephyr support](/assets/images/zephyr_gdb.png)](/assets/images/zephyr_gdb.png)

