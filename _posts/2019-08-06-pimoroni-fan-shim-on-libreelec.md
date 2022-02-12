---
title: "RPi4: Using the PiMoroni Fan Shim on LibreElec including the LEDs!
"
categories:
  - Blog
tags:
  - raspberrypi
  - libreelec
  - opensource
---


I recently bought a brand new Raspberry Pi 4, and wanted to try Kodi on it.
There is only one Kodi-distribution which has more or less decent support for RPi 4 at the moment, and that's LibreElec (although still Alpha).

Since the RPi 4 is famously overheating and throttling without a fan or at least a heatsink, I got a PiMoroni Fan Shim. Nice piece of hardware, but their library cannot run on LibreElec, because they do not support installing python libraries through pip etc... On LibreElec, the whole rootfs is a read-only squashfs image.

So there's no way you can install the Pimoroni python library on LibreElec, but I found an alternative:
I found Phil Randal's blog at [http://www.philrandal.co.uk/blog/archives/2019/07/entry_214.html](http://www.philrandal.co.uk/blog/archives/2019/07/entry_214.html),
where he described how to get at least the Fan portion of the Fan Shim working on LibreElec.

I decided to build on that, and port the LED functionality to LibreElec as well, without the need for "pip install" or anything not supported.

First, you need to install the Raspberry Pi Tools addon in LibreElec.
1. Addons
1. Install from repository
1. Libreelec add-ons
1. Program add-ons
1. Raspberry Pi Tools.
Then, use these script below to have Fan + LED control on your LibreElec RPi4.

Save it as /storage/fanshim.py and make executable: \
`$ chmod +x /storage/fanshim.py`

Then edit /storage/.config/autostart.sh so it contains the line: \
`nohup /storage/fanshim.py &`

Reboot your Pi 4 for it to take effect.

You can find the code here:
[https://gist.github.com/maximevince/2257338ea8f97dfdea7dd91656443352](https://gist.github.com/maximevince/2257338ea8f97dfdea7dd91656443352)

```python
#!/usr/bin/env python
#
# place command below in /storage/.config/autostart.sh
#   nohup /storage/fanshim.py &
#
# By Maxime Vincent (maxime [dot] vince [at] gmail [dot] com)
#
# Based on:
# http://www.philrandal.co.uk/blog/archives/2019/07/entry_214.html
# https://forum-raspberrypi.de/forum/thread/43568-fan-shim-steuern/
# and:
# https://github.com/pimoroni/fanshim-python/blob/master/examples/automatic.py
#
import atexit
import colorsys
import argparse
import time
import sys
import subprocess

sys.path.append('/storage/.kodi/addons/virtual.rpi-tools/lib')
import RPi.GPIO as GPIO

FAN = 18
DAT = 15
CLK = 14
PIXELS_PER_LIGHT = 4
DEFAULT_BRIGHTNESS = 3
MAX_BRIGHTNESS = 3

pixels = [[0, 0, 0, DEFAULT_BRIGHTNESS]] * PIXELS_PER_LIGHT
fan_enabled = False

parser = argparse.ArgumentParser()
parser.add_argument('--off-threshold', type=float, default=55.0, help='Temperature threshold in degrees C to enable fan')
parser.add_argument('--on-threshold', type=float, default=65.0, help='Temperature threshold in degrees C to disable fan')
parser.add_argument('--delay', type=float, default=2.0, help='Delay, in seconds, between temperature readings')
parser.add_argument('--verbose', action='store_true', default=False, help='Output temp and fan status messages')
parser.add_argument('--noled', action='store_true', default=False, help='Disable LED control')
parser.add_argument('--brightness', type=float, default=255.0, help='LED brightness, from 0 to 255')

args = parser.parse_args()

def init():
    # For FAN
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(FAN, GPIO.OUT)
    # For LED
    GPIO.setup(DAT, GPIO.OUT)
    GPIO.setup(CLK, GPIO.OUT)
    atexit.register(_exit)
    set_light(0, 0, 0)
    return()

def set_pixel(x, r, g, b, brightness=None):
    """Set the RGB value, and optionally brightness, of a single pixel.

    If you don't supply a brightness value, the last value will be kept.

    :param x: The horizontal position of the pixel: 0 to 7
    :param r: Amount of red: 0 to 255
    :param g: Amount of green: 0 to 255
    :param b: Amount of blue: 0 to 255
    :param brightness: Brightness: 0.0 to 1.0 (default around 0.2)

    """
    if brightness is None:
        brightness = pixels[x][3]
    else:
        brightness = int(float(MAX_BRIGHTNESS) * brightness) & 0b11111

    pixels[x] = [int(r) & 0xff, int(g) & 0xff, int(b) & 0xff, brightness]


def set_light(r, g, b):
    """Set the RGB colour of an individual light in your Plasma chain.

    This will set all four LEDs on the Plasma light to the same colour.

    :param r: Amount of red: 0 to 255
    :param g: Amount of green: 0 to 255
    :param b: Amount of blue: 0 to 255

    """
    for x in range(4):
        set_pixel(x, r, g, b)

    """Output the buffer """
    _sof()

    for pixel in pixels:
        r, g, b, brightness = pixel
        _write_byte(0b11100000 | brightness)
        _write_byte(b)
        _write_byte(g)
        _write_byte(r)

    _eof()


# Emit exactly enough clock pulses to latch the small dark die APA102s which are weird
# for some reason it takes 36 clocks, the other IC takes just 4 (number of pixels/2)
def _eof():
    GPIO.output(DAT, 0)
    for x in range(36):
        GPIO.output(CLK, 1)
        time.sleep(0.0000005)
        GPIO.output(CLK, 0)
        time.sleep(0.0000005)

def _sof():
    GPIO.output(DAT, 0)
    for x in range(32):
        GPIO.output(CLK, 1)
        time.sleep(0.0000005)
        GPIO.output(CLK, 0)
        time.sleep(0.0000005)

def _write_byte(byte):
    for x in range(8):
        GPIO.output(DAT, byte & 0b10000000)
        GPIO.output(CLK, 1)
        time.sleep(0.0000005)
        byte <<= 1
        GPIO.output(CLK, 0)
        time.sleep(0.0000005)

def _exit():
    set_light(0, 0, 0)
    GPIO.cleanup()

def set_fan(status):
    global fan_enabled
    changed = False
    if status != fan_enabled:
        changed = True
	GPIO.output(FAN, status)
    fan_enabled = status
    return changed

def watch_temp():
    global fan_enabled
    cpu_temp = get_cpu_temp()
    if fan_enabled == False and cpu_temp >= args.on_threshold:
	print("Enabling fan!")
        set_fan(True)
    if fan_enabled == True and cpu_temp <= args.off_threshold:
	print("Disabling fan!")
        set_fan(False)
    return();

def get_cpu_temp():
    return float(subprocess.check_output(['vcgencmd', 'measure_temp'])[5:-3])

def get_cpu_freq():
    return float(subprocess.check_output(['vcgencmd', 'measure_clock', 'arm'])[14:-1])/1000000

def update_led_temperature(temp):
    temp -= args.off_threshold
    temp /= float(args.on_threshold - args.off_threshold)
    temp = max(0, min(1, temp))
    temp = 1.0 - temp
    temp *= 120.0
    temp /= 360.0
    r, g, b = [int(c * 255.0) for c in colorsys.hsv_to_rgb(temp, 1.0, args.brightness / 255.0)]
    set_light(r, g, b)

try:
    init()
    while True:
        t = get_cpu_temp()
        f = get_cpu_freq()

        if args.verbose:
            print("Current: {:05.02f} Target: {:05.02f} Freq {: 5.02f} On: {}".format(t, args.off_threshold, f, fan_enabled))

        watch_temp()

        if not args.noled:
            update_led_temperature(t)

        time.sleep(args.delay)

except KeyboardInterrupt:
    pass
```

Enjoy!
