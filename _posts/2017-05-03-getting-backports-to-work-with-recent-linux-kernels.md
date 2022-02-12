---
title: "Getting backports to work with recent linux kernel releases"
categories:
  - Blog
tags:
  - backports
  - linux
  - opensource
  - coccinelle
  - kernel
---

I have been struggling a few days now to get the fantastic "backports" project up and running on my machine (Arch Linux). Here's what I had to do:

First,
make sure you have backport checkout out, and pulled in all the required trees:

```sh
git clone git://git.kernel.org/pub/scm/linux/kernel/git/backports/backports.git
cd backports
./devel/backports-update-manager 
```


Here's what I found out:

- Make sure your PYTHON\_PATH does not contain funny stuff
- devel/pycocci expects Python 2. Arch Linux defaults to Python 3. Use a virtualenv2, or change devel/pycocci's first line to "#!/usr/bin/env python2"
- devel/pycocci crashes randomly when using different threads. I have hacked the script to make it single-threaded. EDIT: This seems to be because of Coccinelle 1.0.6. It does not occur using Cocinnele 1.0.4
- Coccinelle 1.0.6 does not work with all patches included in backports, you need version 1.0.4 with python support. (bin can be found here: http://coccinelle.lip6.fr/distrib/coccinelle-1.0.4-bin-x86-python.tgz)

After this, I was able to reproduce the latest release official backports release "backports-20160324".

Steps:
```sh
cd /path/to/coccinelle-1.0.4
ln -s spatch.opt spatch
source env.sh
cd ~/linux-next-history
git checkout next-20160324
cd ~/backports
git checkout backports-20160324
./gentree.py --verbose --clean ~/linux-next-history ~/backports/release
```

Next step is to move to more recent linux-next / wireless-testing revisions:

Using wireless-next, instead of linux-next, I have now successfully built a backports release using following git revisions:
backports: `e8ec27f6c9c5554afa00d55b663d81e0b0cebaed`
wireless-testing: wt-2017-04-24 (`2f0e53b3d84bfb1af171ad8e556875f3bcb6caa2`)

```sh
./gentree.py --verbose --clean ~/wireless-testing ~/backports/backports-wt-20170424
```


Happy backporting!
