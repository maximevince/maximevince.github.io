---
title: "The excellent JTAGenum for Arduino"
categories:
  - Blog
tags:
  - jtag
  - arduino
  - debugging
---

As I said before, I've been fiddling with finding the JTAG port on a Verbatim PowerBay NAS.
I did not succeed (yet), but have had the chance to try out JTAGenum for Arduino.
It is an excellent JTAG pin finder (and other things too). Check it out here:
http://deadhacker.com/2010/02/03/jtag-enumeration/
The guy's description of the tool is:
1. Given a large set of pins on a device determine which are JTAG lines
2. Enumerate the Instruction Register to find undocumented functionality
3. be easy to build and apply

It's really easy to use, but it did not manage to find the JTAG pins on my device. There might be another problem, such as:
- JTAG is disabled once the device is powered up
- The pins I'm fiddling with are not JTAG pins
- I ruined the circuitry already
- I'm just not trying hard enough

Back to JTAGenum: Since Arduino IDE 1.0.1, some things have changed and so the GIT version of JTAGenum would not compile as-is. Therefor the JTAGenum sketch had to be slightly adapted. You can find my version >here<.

Furthermore, I did the 3,3v modification to my Arduino Uno, so that i'm at the same voltage levels as the NAS.I have followed this guide: http://www.ladyada.net/library/arduino/3v3_arduino.html
Only downside to this is that using the 3,3v regulator they suggested and a 1N4001 diode, you'll get a 0.7 v voltage drop from the USB's 5V -> this means about 4.3 volts left. The regulator apparently needs more than a volt to get a 3.3V output. So that I have to use an external 5V adapter now.
You could instead:
- Not use a classic 1N4001 diode, but a Schottky diode (only 0.3v voltage drop)
- Use a low dropout regulator that can correctly make 3.3 volts out of 4.3 volts
- Use a level-shifter instead of the 3.3V modification to the entire Arduino.

As you can see in the Arduino Sketch, I have not reduced the internal clock of the Arduino, it seems to work pretty well at room temperature @ 3.3 volts.
