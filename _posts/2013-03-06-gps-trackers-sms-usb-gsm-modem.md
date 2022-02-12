---
title: "GPS trackers + SMS + USB GSM Modem + Java + JavaScript + Google Maps"
categories:
  - Blog
tags:
  - gps
  - modem
  - tracking
---
Ok,
What have I been up to lately, technically speaking?

Mostly, two things: The STM32F4-Discovery board which is a cheap and awesome developmentboard by STMicroelectronics boasting an ARM Cortex-M4 and an on-board JTAG-dongle so to speak: That opens a lot of interresting perspectives. But I'll talk about that in a next blogpost.

The second thing is a combinations of the following technologies: GPS trackers + SMS + USB GSM Modem + Java + JavaScript + Google Maps.
The idea is to have live tracking of about 20 GPS-trackers on a Google Map. This would serve as central intelligence center in a big real-life "hunting" game we're preparing at the moment to play with about 100 youngsters in the city of Tongeren. It will be called "Nacht van de Jacht", for those interrested :).
The set-up I thought of was the following: We bought about 20 Chinese GPS trackers that are sending their position in an SMS to a central phone number every 3 minutes or so. These SMSes are received by an USB Modem I had lying around (Vodaphone 3g modem when I was in Australia, actually it's a Huawei E169). A Java program should then fetch the messages from the modem, and push then to a MySQL database.
This modem has 3 virtual COM ports which allow access to the modem through AT-commands. (Great resource: http://www.developershome.com/sms/atCommandsIntro.asp). This allows fetching incoming messages through this interface. I was not going to write the whole stack, and I heard of the SMSLib project before. (http://smslib.org/) I downloaded this, together with the RXTX library allowing COM-port access from Java from Linux, OSX, Windows, BSD, ... (http://rxtx.qbang.org/wiki/index.php/Main_Page) and wrote a first try-out project in NetBeans (http://netbeans.org/).
It's been a while since i've used Java, or the Netbeans IDE, but I must say, I got quick results. After some debugging, adding polling to the RXTX <-> SMSlib interface because of the Virtual COM port, I could read SMS messages from my USB GSM Modem.
The second part is a webpage, that will query this MySQL database through PHP, formatting this into a JSON string being passed to some JavaScript running in the client's browser. This JavaScript (Mainly jQuery (http://jquery.com/)) will then parse the JSON, and display the data on a Google Map, using the Google Maps JavaScript API (https://developers.google.com/maps/documentation/javascript/reference).

Right now I have written a Java app that fetches incoming SMS messages from the USB GSM Modem, and can talk to the MySQL server. I also have a webpage that parses a (fixed for now) JSON-string's data and plots these on a Google Maps.
Next up:
1. Pushing the incoming messages to MySQL.
2. Querying MySQL from PHP and passing this data in a JSON string to the JavaScript part.

Not that far away any more...
