---
title: "Lock-ups and freezes w/ an STM32F4Discovery board with ST-Link v2, OpenOCD and GDB"
categories:
  - Blog
tags:
  - debugging
  - openocd
  - opensource
  - gdb
  - stm32
---

This post is especially an outing of my joy now that I have finally resolved my issue debugging the STM32F4xx using OpenOcd.

There exist many blogpost, tutorials, manuals about setting up an STM32F4Discovery + OpenOcd + gdb combo.
I won't explain how to do it here, but it is an awesome, powerful and very cheap set-up.

I chose the STM32F4Discovery board as the demo board for my course on embedded C, because it's cheap, full of features and has on-board debugging hardware.

Writing a custom crt0, I ran into problems however. Stepping through the early init code, assembly instruction per assembly instruction, gdb would just lock-up, freeze, at random moments. Not always on the same instruction, not always at the same moment. I could also set a breakpoint on a certain line, then type 'c' to continue, and the debugger would never break, or even respond to a Ctrl+C.

Furthermore, using st-util, from the texane github (https://github.com/texane/stlink) would work.It's awefully slow (especially when using the split layout in gdb-tui, that disassbles on-the-fly)

Digging up a mailinglist message from about a year ago (http://www.mail-archive.com/openocd-devel@lists.sourceforge.net/msg01605.html) I finally found the solution to the problem.

The STM32F4 features a `DBGMCU` register,
which by default will leave the debug function of the mcu in an unpowered state when in standby, stop or sleep mode.

Changed my openocd.cfg file to:
```
 #Include configs from openocd  
 source [find board/stm32f4discovery.cfg]  
 source [find mem_helper.tcl]  
 # Disable power-saving for debug circuitry  
 $_TARGETNAME configure -event reset-init {  
   # allow debugging during sleep/stop/standby modes:  
   # set DBG_SLEEP, DBG_STOP and DBG_STANDBY bits in DBGMCU_CR  
   mmw 0xe0042004 0x7 0x0  
 }  
```

Then, additionally, it is very important to reset the board in a clean way.
For this, issue a "monitor reset halt" command. I automated it by adding it to my `.gdbinit` file:
```
 tar ext :3333
 monitor halt
 file out/main.elf
 load out/main.elf
 monitor reset halt
 stepi
```
This config will make gdb(tui) automatically connect to openocd, then stop the cpu, flash the ELF file, load symbols from the elf file, reset the mcu in a clean way and then step to the first instruction to be executed.
This leaved the cpu halted, at the first assembly instruction. From there, you can set-up breakpoints, or just hit 'c' to start running. 

Once I had taken care of both these topics, gone was my trouble!

Happy debugging!


