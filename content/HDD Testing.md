---
title: HDD Testing
lastmod: 2023-05-27T21:59:19-05:00
---
# HDD Testing
THIS NEEDS FORMATTING

Introduction
Don't skip this section. It may be boring, but it will give you the background and reason why I say
certain things later. This article is written for platter drives, although much, but not all, applies to the
SSD drives too.
There are surprisingly very few studies published on platter drive failures. Google did one, Backblaze
has made several informative blog posts, and there was one published on usenix. But that's it other than
some scattered forum postings. If there are any good studies on SSD drives, they are well hidden. What
I have seen is mostly anecdotal stories which say, unlike plater drives, SSD drives tend to just up and
die without warning. Firmware issues are responsible for some of those failures. I could find nothing on
hybrid drives.
S.M.A.R.T
All modern drives have built in software built right into the drive's firmware for monitoring their
health, known as Self-Monitoring, Analysis, and Reporting Technology system, or SMART for short. It
is designed to monitor the health and performance of the hard drive and help predict impending failure.
It's also arguably the best tool for the job currently available. However, it is far from perfect. Google's
mammoth hard drive study found about 40% of the failed drives had no indicators from SMART that
the drive was bad1. Still a 60-63% chance of detecting a bad drive beats everything else out there and is
therefore widely used.
Technically, SMART is an optional part of the ATA standard, and some USB devices do not support
SMART. Virtual disks do not support SMART either, although the physical disk(s) they are hosted on
will. Hardware RAID controller support is hit or miss, although software RAID controllers generally
do support SMART. SMART tools may not work on SCSI or SAS drives since they may not use ATA
command sets.
Sectors
A sector is just a set number of bytes on the hard drive. The hard drive will have two types of sectors
and it is easy to get them mixed up. There are logical sectors, commonly 512 bytes in size, and physical
sectors. The size of the physical sector varies depending on the model of the drive and manufacturer,
but will always be, at minimum, the same size as the logical sector. The biggest difference I've seen so
far are drives with logical sectors of 512 bytes and physical sectors of 4096 bytes, or an 8:1 ratio. Some
drives have a 1:1 ratio2.
This is important in understanding the results from several tools such as badblocks, hdparm, and even
the hard drive's own self tests. The SMART attributes are often in physical sectors3, while badblocks,
hdparm, the self tests, and error log (all of which are described later) are in logical sectors.
1
http://static.googleusercontent.com/external_content/untrusted_dlcp/research.google.com/en/us/archive/disk_failures.pd
f
2
Some disk cloning software, including Clonezilla, can't clone drive to drive if the drives have different ratios.
3
Often, but not always. There is no hard and fast rule I can find, other than drives with a 1:1 ratio don't have this issue.
Introduction
Page 4 of 32
Thus you could run a badblocks command and have it find previously undiscovered 8 bad sectors, but
have the attributes bad sector count go up only by 1. This is not a mistake by either tool, but a drive
with an 8:1 ratio of logical to physical sectors. Of course those 8 [logical] bad sectors could be spread
out among more that 1 physical sector, so the attributes bad sector count could really change by
anywhere from 1 to 8.
Automatic Acoustic Management
Automatic Acoustic Management, or AAM for short, is a standard a few drives support. It allows for
the drive to run quieter at the price of reduced performance. The decimal values range from 0, the
quietest but worse performance to 254, the loudest but best performance. Usually a value of 0 really
means AAM is not supported, and the quietest value is really 128.
Most drives aren't noisy even at 254, and they are in a case which further deadens the noise. If AAM is
supported, I recommend setting the value to 254. If a modern drive really is noisy, especially new
noises, that's usually an indication it's time to backup your data, NOW!
Reading, Writing, and Error Types
Hard Errors
When a hard drive writes to a sector, it tries to write the data and a checksum. The hard drive itself
doesn't do much checking to make sure the data it was instructed to write is actually correct, just that it
succeeded. If the write doesn't succeed, then it is usually because the sector on the platter itself is
damaged and permanently unusable. This sector will be automatically reallocated by the drive's
firmware and the sector permanently marked as off-limits. This is a hard error and results in a
reallocated sector.
As Dan Lukes put it, “change of such number is more important than absolute value. But it doesn't
mean that absolute value is meaningless at all. There is no defined causality between this value and
drive's health. We can estimate only.”
While a bad sector or two doesn't make a drive bad, it is a warning sign. If the count of hard
errors/reallocated sectors is climbing, it's time to get whatever data you care about off the drive and
replace it. There seems to be no real consensus about when to call the drive bad, but I use 5 or more
reallocated sectors a limit. Even if you want to set the limit higher, each reallocated sector will decrease
the drive's performance as the drive heads have to jump around quite a bit more. A slow computer is
sometimes caused by a large number of reallocated sectors on the hard drive.
Soft Errors
Sometimes a write command will think it's succeeded, but the checksum will not match the data. There
are a number of reasons why this might occur. The most common is the hard drive suddenly loosing
power in the middle of write. Usually this is an electrical problem, and can be caused by weather, a
drunk hitting a power pole, a squirrel committing suicide by transformer, someone plugging in a space
heater and blowing a fuse, etc. Once I saw this caused by a user who had the computer plugged into a
power strip and they thought the way to turn off the computer is by turning off the power strip.
Introduction
Page 5 of 32
Because there is no validation of the data by the write, a write test will never find soft errors. Only
upon an attempt to read the sector will the data and checksum be verified. If either of these don't match,
that is a soft error. The drive's firmware will mark this as a pending sector. It will try again if requested
to read the sector. Hopefully, some time in the future the read will succeed and the sector will be un-
marked as pending, but don't count on it.
The only real way to clear a pending sector is to write to it. If the write succeeds, then it may be just a
soft error. The bad news is some data was lost, the amount being the size of the logical sector(s). The
good news is the hard drive itself is not bad. A program, a data file, or even the operating system may
be bad due to data loss, but the hard drive is not.
The reason you must write to clear a pending sector is because the drive has no idea what the data and
checksum should look like. If it could read both, and they matched, the sector wouldn't be a pending
sector. The next write operation to that sector tells the drive what data should be there.
Because soft errors are data errors, it is possible to intentionally create these.
Medium Errors
Sometimes though, you will encounter the most insidious of the three errors, what I like to call a
medium error. This is when the sector doesn't hold it's magnetic charge, for long. In this case, the sector
can be written to, and even read back from successfully. However, the sector looses the data after a
short time. I've encountered some that loose the data within a minute or two of writing. These errors
masquerade as soft errors, but are really hard errors. Because the write will succeed, the sectors will
never be reallocated and at best will be pending sectors. Files will be corrupted, seemingly for no
reason4. A drive that can't reliably store data is a bad drive.
How do you tell medium errors from soft errors? The sure way is to write to sector (details later), read
it right away, wait 5-10 or more minutes, then try to read it again. Did the second read fail but the first
succeeded? If so, you are looking at a medium error.
A less precise way is to look at the number of pending sectors. For true soft errors, the number will
usually be only 1 or 2, but in the case of the user turning off the computer via the power strip who did
admit to it, the pending count was 8. I have seen a hybrid drive with 72 pending sectors (8:1 ratio)
where all of those where soft errors. Any pending sectors number, on a regular platter drive, higher than
10 is likely to be medium errors or hard errors that haven't been reallocated yet. The best way to tell is a
full, destructive write test with badblocks, but you can also test for them with hdparm (see below).
4
Some cases of bitrot may be caused by medium errors. See the first page of http://arstechnica.com/information-
technology/2014/01/bitrot-and-atomic-cows-inside-next-gen-filesystems/ for more info on bitrot.
Accessing SMART Data with smartmontools
Page 6 of 32
Accessing SMART Data with smartmontools
There several free and paid tools for reading the smart data. None of these tools actually generate the
data or do any tests. They merely read the data the drive's firmware provides and tell the drive to run its
own tests then report back the results. Because of this, you can really use any one you want to read the
data. They all, in theory and generally in practice, provide the same numbers.
The best of the tools in my opinion is smartmontools (http://sourceforge.net/projects/smartmontools/). It is
free, open source, and runs on Windows, Linux, BSD, Mac, and probably a few other operating
systems.
I recommend using Linux to test with smartmontools. Use of smartmontools on Mac is not
recommended. SAT relies on SCSI pass-through I/O-control which is missing on Mac OS X. There is a
driver that supports some USB and Firewire devices on Mac OS X. On Windows, you need full admin
rights. Messages about missing admin rights will be printed if Windows does not allow full raw R/W
access to the disk. Full R/W access is required for the ATA pass-through I/O-controls used to access
SMART info. If a disk is used by certain programs, such as a Virtualbox VM, Windows apparently
locks raw R/W access from other programs (a good thing), in which case even admin rights are not
effective for this disk. Further, two other tools used below are Linux only. Those not familiar with
Linux, and root, may wish to read the crash course on Linux in the appendix before continuing.
While smartmontools is command line only, there is a graphical interface available called
GSmartControl (http://gsmartcontrol.berlios.de/home/index.php/en/Home). If you are using
GSmartControl, you are really using smartmontools. I recommend you use GsmartControl if possible,
although the tutorial and screenshots below will all be using the command line smartmontools on
Linux. The reason is I haven't found a free live CD with a reasonably current version of smartmontools
AND GSmartControl.
Smartmontools has a quite extensive set of options. Only some of those will be discussed below.
A recent version, at least as of 04/13/2014, can be found on several live CD's, including:
•
ALT Linux Rescue (http://en.altlinux.org/Regular#non-desktop): A no frills live cd. It is
command line only, but includes all the tools you'll need. The 64bit version does UEFI boot,
making it very useful for testing Windows 8 computers.
•
Knoppix (http://knopper.net/knoppix/): Both the CD and DVD include all the tools. This does
have a graphical interface, including a web browser, so you can surf the web while waiting for
the test to finish. If you use the graphical interface to get a terminal, you'll need to sudo -i to get
root. If you boot straight to the console, you are root.
•
Clonezilla (http://knopper.net/knoppix/): Built mainly for backing and restoring whole drives, or
even cloning them, it does include all the hard drive testing tools. When given the choice
between starting clonzilla or entering the shell, choose the shell, then cmd. You'll need to sudo
-i to get to root.
•
Gparted (http://gparted.org/livecd.php): Built mostly for manipulating partitions, it still has all
the tools you'll need for hard drive testing. You'll need to sudo -i to get root.
Testing with smartmontools
Page 7 of 32
Testing with smartmontools
Determining Disk Drives
The first task is to determine the name(s) of the devices to feed to smartmontools. Most often,
especially for computers with only one drive, it will be /dev/sda. But what if there is more than one
drive? What if there are
USB drives attached?
While smartmontools has
the ability to scan for valid
targets
(smartctl --scan)
this really only gives you
list of names5. A [usually]
better method is the fdisk
scan: fdisk -l where the
l stands for list partitions.
This will print out the
drives, their names, the size,
and even the partitions on
the drive. Often the size
will be enough to tell you
which drive is which. This
will give you an error if you
use it on a Windows 8/GPT
drive, but the error is harmless, and it still gives you the drive name. The partition names, such as
/dev/sda1 are not needed, and other than as a source of the drive name (the partition name minus the
number, i.e. /dev/sda10 <-partition, /dev/sda <-drive), they can be ignored. For GPT partitions, don't
rely on fdisk to give you the correct partitions, but it will give you the correct drive name.
Perform Tests
The next step is to start the tests running. The tests run in the background, and you can examine the
other SMART data while the test is running. Every drive that supports SMART will have at least two
tests it supports, short and long (also called extended). Some drives will have a third, but that isn't
covered here. Always start with the short test. If that fails, then you must address that failure. There is
no reason to wait the hour+for the long test if the short test will tell you something.
The tests are read-only and will not damage any data. However, it is recommended to run these while
load on the hard drive is low. Some operating systems will crash if the drive doesn't respond within a
5
In the case of hard drives behind a hardware raid controller, the smartctl --scan option can sometimes tell you the names
of the individual drives. For example, megaraid disks can be /dev/bus/8 -d sat megaraid,0 rather than /dev/sda. Further,
it can ID the type of drive. SCSI/SAS drives may not support ATA/SATA SMART attributes.
Figure 1: fdisk -l showing two drives, /dev/sda and /dev/sdb.
Testing with smartmontools
Page 8 of 32
certain time, and since these tests are run by the drive's firmware, the operating system has no idea
what's going on. A live CD is a safe way to run these tests for non-critical systems.
To run the test, you will use the program
called smartctl (think smart control)
then tell it to run a test (-t for test),
which test (short or long) then which
drive. So in the case of /dev/sda, the
command for the short test would be:
smartctl -t short /dev/sda .
The long test is sometimes referred to as
the extended test. Some drives support
additional tests beyond the short and
long. If you want to inspect the real state
of the whole drive, you should run
extended/long self test.
The smartctl immediately exits after giving you some info about the test. You can now look at the other
attributes while this is running in the background. smartctl doesn't actually run the tests, it just tells the
hard drive's firmware to run the tests.
If a drive's attributes look good (see below), and it passes the short test, it's probably a good drive.
Ideally, it would be better to run the long test, but sometimes time is just too limited to do that. For
servers, I would strongly recommend running at least the extended test before a new hard drive goes
into service. Having a production server go down will cost far more than an hour or two of testing.
The tests need to run. Don't neglect them. Without running the tests, you may not have current
attributes.
One misconception about these tests is a that a failure means the drive is bad. It does not! The
tests stop at the first sector they can't read. A failed test does not test the entire drive. If that sector is a
soft error, it is fixable, and the drive is still perfectly usable. Further testing is required. Don't fail a
drive based on a single soft error.
Occasionally, you'll run into a drive where smart is supported, but disabled (DUMB, DUMB, DUMB!).
To turn it on, assuming the drive is /dev/sda, simply issue the command:
smartctl -s on /dev/sda
Looking at the SMART data
To see the actual SMART data, there are several different commands you can give smartctl, but I'm
only going to cover one, the one that gives you all the extended info. Assuming the drive you want to
look at is /dev/sda:
smartctl -x /dev/sda |less
There are several section of information the command will give you. The extra part, |less , is needed
because there is so much info it will scroll off the screen otherwise. The pipe, |, is generally found on
the \ key. The less is similar to the more command from DOS, but less does more. Less allows you to
scroll up and down, while more only allows scrolling down. Press q to quit less.
Figure 2: Running a short SMART test.
Testing with smartmontools
Page 9 of 32
Note that -x requires the drive support 48 bit commands. Most modern drives do, but older drives may
not. If so, try -a instead. It gives less info, but only requires 16 bit commands and will be better
supported. However, the -x is recommended as the old self-test log (-l selftest, -a) was only designed
for 28-bit LBA addresses. Some drive's firmware will return a bogus (32-bit) value for > 28-bit LBAs.
Identity
The first tab of the
details page is a
description of the hard
drive. Several lines are
particularly
important/useful here:
•
Serial Number.
If you ever have
a computer with
2 drives, both
the same size
and model
number, and
one fails (for
whatever
reason) and the
other passes,
this is how you
can tell them apart when you go to replace the bad one. Credit goes to DL for this idea.
•
Sector Size: This was covered earlier. When using badblocks, you'll want the logical sector size.
•
In Smartctl Database: If this is no, then the attributes page will likely have unknown attributes.
Most of the SMART parameters are the same across manufacturers though, and the VALUE and
TRESHOLD parameters are shown and failure is indicated correctly. You can always update the
drive database to try to get more info.
•
ATA Verison/ATA Standard: Versions 8 are SATA drives, 1-6 IDE. Version 7 is usually SATA,
but I have seen an IDE drive with version 7.
Recent versions of smartmontools will tell you if the drive supports AAM as well as the current value
and, for some drives, the max SATA speed the drive supports. If smartmontools returns Error
SMART Status command failed, do not trust the rest of the results.
Read Smart Data Section
There is little useful testing/health information here you can't get from other sections. This will give
you the estimated time to run the short and long SMART tests, and it also tells you the status of the last
SMART test run, or it's progress if still running.
Figure 3: The SMART info
Attributes
Page 10 of 32
Attributes
Most drives will pass or fail based
on the information here. Knowing
how to read this section is critical!
There are several columns you need
to pay attention to.
The first is the name of the
attributes. Some attributes are
important, some, less so. If the drive
is not in the database, you will
likely see unknown attributes for
some items. This will make the
page slightly less informative. The
Failed column is only somewhat
important. The other columns will
tell you whether or not to be
concerned.
Often, by the time something has failed (except temperature), the drive is dead. For example, the drive
in the figure has used only 2% of it's life at 16,455 hours according to the threshold6. At that rate, the
threshold says the drive will last about 93.9 years. So why, Mr. Manufacturer, did you only warranty it
for 3 years if your drive is so long lasting???
The next 4 columns are where you should be focusing your attention. The drive's firmware will take the
real value, otherwise known as the raw value, and convert it to an 8 bit number (0-255) using some
algorithm. This is becomes the normalized value column, and a max value for any attribute can range
from 100-255, depending on the drive. Some attributes max value will be 100, while others could be
255, or in the UDMA CRC attribute in the picture above, 200. It depends.
The worst column is simply the lowest value the normalized column has every reached. The threshold
column is the value at which the drive determines if that attribute has failed or not. If the normalized
column is at or below the threshold, there is a failure.
The normalized and threshold are useful to look at to see if they are within a few points of each other. If
so, that's a very strong indicator you should retire that drive before it fails. If the attribute is unknown,
then the normalized and threshold columns are the only guides you have for that attribute. In general,
however, the only column you'll really pay attention to is the raw value. The important attributes,
referring ONLY to the raw values, are:
•
Reallocated Sectors – Ideally this should be zero. One or two bad sectors doesn't make a bad
drive, but once this value on platter drives, not SSDs, hits 5, it's time to replace.
•
Power On Time – A few drives don't record this “correctly”, so you'll have to get the real
number from the self test logs (see below). Here is where having the drive in the database is the
most useful. If the drive isn't in the database, this number may be incorrect. For most drives,
this is in hours. After about 26,500 hours, (~3 yrs) the odds of the drive dying within the next
6
Yes, it did start at 100, not 255.
Figure 4: SMART Attributes
Attributes
Page 11 of 32
year are 11.8%7, and they go up after that. This is a “How good are your backups?” time if you
want to continue using the drive. Once this hits about 43,350, replace the drive even if you like
to gamble. The drive's odds of complete failure within the next year are unacceptably high.
Platter drives are mechanical devices, and they will wear out eventually. You can also use this,
with confirmation from a short test, to tell if the “new” drive you just bought really is new, or a
used drive falsely sold as new. Some drives have firmware bugs, such as Intel 330 Firmware
300i and Intel 520 Firmware 400i, and will not report a correct value here.
•
Spin-up Retry Time – This should be zero. Anything higher indicates a drive motor problem. If
the motor dies, your hard drive dies. Replace.
•
Reallocation Event Count – This, in theory, gives you information about whether the
Reallocated Sectors are a 1-time event, or occurring over time. Either way, this indicates a
problem, but you'll not fail a drive based on this.
•
Current Pending Sector Count – Ideally, this should be zero. Anything else means you have to
do some more testing. The pending sectors could be soft, medium, or hard errors. You can't tell
from the SMART data. If this is more than zero, the SMART tests will usually fail. Don't waste
time running them unless you need the correct power on time.
•
Offline Uncorrectable – Think of this as a second Current Pending Sector Count. Same rules
apply. However, this is updated only on offline data collection, so fixes to pending sectors won't
be reflected here right away. It could take hours to days for this to clear.
•
UDMA CRC Error Count – A count higher than 1 or 2 often indicates the data cable has a
problem. I suggest replacing the cable.
Error Log
Scroll down past the General
Purpose Log Directory and you'll
come to the error log. Starting with
ATA-6, there is an extended log (-x),
and log entries there may not be recorded in the regular log (-a). Some drives log only to the extended
log, and some only to the normal log, and some to both. To see the normal log, you'll have to use a
different command, again, assuming the drive is /dev/sda:
smartctl -a /dev/sda
Either way, this is not as useful as you might think. This records past failures to read sectors. These are
logical sectors, not physical. It does not tell you whether or not the sectors were soft, medium, or hard
errors, and does not decrease or erase entries should the sector be fixed, i.e. a soft error, or a hard error
that gets reallocated.
The most useful thing it does tell you is the sector number and the power on time it occurred. Is it a
recent error, or something that happened some time ago? It is not unusual to see multiple entries with
the same sector number. The drive keeps trying to read a pending sector, and each failed read generates
an error.
7
http://blog.backblaze.com/2013/11/12/how-long-do-disk-drives-last/
Figure 5: The error log. This one is empty.
Attributes
Page 12 of 32
Self Test Logs
Mildly useful, this will tell you if any of the drive's self tests have been run, when, and the result.
Obviously, if the current power on time is within a few hours of the last test that completed
successfully, there is no point in running the same test again unless you've attempted to fix a pending
sector(s). The lifetime hours column is the real power on hours for drives that don't record that value
properly in the attributes. If need be, run the short test and look here for the hours.
If the test fails, it records only the first logical sector it couldn't read. That's because it stops with the
first logical sector it can't read. This is useful in case you don't have the time to do a full hard drive
scan, and need to determine what type of error that sector represents.
Do remember that this only logs SMART tests. If you use a non-SMART test, such as the badblocks
test described later, it will not show up in the log.
Figure 6: A Self Test Log with a failure.
Other Testing Tools
Page 13 of 32
Other Testing Tools
hdparm
hdparm is a Linux tool to tweak some hard drive parameters. Being a Linux tool, the name is case
sensitive, and is always lower case. The switches/options are also case-sensitive and some are upper
case, and some lower case. Do not get them mixed up. It is command line only. There are many
switches/options, but only a few are
covered here. Also, using it on a drive
that is in use can be dangerous. Always
work on a drive that is off-line. A live
CD is a great choice.
The first command is hdparm -M
<drive> where <drive> is /dev/???,
usually /dev/sda for computers
with only 1 drive. See page 7 above
for how to determine the drive name.
This queries whether or not AAM is
supported. Usually, it will be not supported or give a value of zero, which means disabled or not really
supported. If the value is less than 254, run the same command again, but with 254 to set the drive for
the best performance, hdparm -M 254 <drive>
The next command is a read sector
command. If one of the SMART
tests fails, it will tell you which
[logical] sector failed in the self test
logs. It also tells you the [logical]
sector the drive had problems with
in the error logs. If you want to
check out just this sector, hdparm
can do this. The command is:
hdparm --read-sector <sector number> <drive>
where the <sector number> is what you got from SMART. There are two dashes before the read-
sector. For example: hdparm --read-sector 6005456 /dev/sda .
If the read is successful, you will get an output of the sector's content, in hex. If the read fails, you will
get an I/O error. Because this is a read-only test, it is safe to run. You can try this several times to see if
the sector comes back, but don't count on it.
The read will succeed sometimes if the error in the SMART error log was transient. The error could be
a soft error that has already been overwritten. It could also be you made a mistake in typing in the
sector number. Double check that you have the correct number. I have seen the read succeed when the
short test had just failed that sector. In that case, it turned out to be a medium error.
Figure 7: AAM is supported on one drive, but not the other.
Figure 8: A successful read. Only part of the data is shown.
Other Testing Tools
Page 14 of 32
The final hdparm command is the dangerous write sector command. As the name implies, this will
write all zeros to the sector, destroying any data there, and corrupting anything, usually a file, using that
sector. Never run this without checking the read status first if you care about the data on the drive.
If the sector is unreadable, then you've already lost the data that is there. Writing to the sector can tell
you what type of error you are looking at, hard, soft, or medium. Typing in the wrong sector number
can destroy data. To prevent that accident, always use the read test first. If that fails, use the Linux
command history by hitting the up arrow. This will bring the read command back. Now edit that
command, leaving the sector number, and drive, intact. Now you are 100% sure the command won't
destroy the wrong sector.
The command for writing, using the above example is almost the same as the read command except
--read-sector becomes --write-sector. You have to also add one more option or it will refuse to write, the
yes-i-know-what-i-am-doing. Here's an example:
hdparm --write-sector 6005456 --yes-i-know-what-i-am-doing /dev/sda
After you have written to the sector, try to read it again. Can you? If so, refresh the SMART attributes
and re-run the SMART test that failed. Does it succeed, or does it, more likely, fail with another sector?
As Douglas Gilbert and Bruce Allen put it, “...bad blocks are often social...”. You may have more work
to do.
Other Testing Tools
Page 15 of 32
badblocks
While hdparm can offer laser precision, badblocks is more flexible and faster. It is also a good
alternative hard drive test/burn-in tool. Like hdparm, it is a Linux command line tool, case-sensitive,
and should only be used on offline drives (or partitions). badblocks will refuse to do tests on drives that
are in use. You can override this behavior, but as the authors of badblocks put it, “...if you think you're
smarter than the badblocks program, you almost certainly aren't.”
There are some switches/options I recommend using in every badblocks command:
•
-b <size> where <size> is the logical sector size the drive uses, usually 512, which can be
obtained from the SMART identity page. While testing has shown this results in slightly slower
tests, it also means the math on some tests below just got a lot simpler.
•
-s shows the progress of the test.
•
-v gives the errors encountered. This can be combined with -s as shown in the examples
below.
badblocks can, as optional parameters, take the last block to test and the starting block to test. The order
is a bit strange, as last block to test comes first, then the first block to test. The last block is not optional
if you want to use the first block too.
This has the interesting side effect that knowing the test progress (via -s) and the block size used (see
-b), you can stop and resume the test later the read and non-destructive write tests. So for example, if
you have to, due to company policy, have to shut off the computer you are testing on for the night, you
don't have to start the test over from the beginning in the morning.
To run the basic, read-only test using badblocks:
badblocks -sv -b 512 <drive>
<drive> is the same what you would use in hdparm. You'll get some output. One line of the output is
the number of blocks. For example, if the line is From block 0 to 385985390 then the last
block (for a block size of 512) is 385985390. Let's say you had to stop the test at 69.4%. Then to
resume, the starting block is, rounded down:
0.694 * 385985390 = 267873860.66 so round down to 267873800
Then you can resume the test with the command:
badblocks -sv -b 512 <drive> 385985390 267873800
This is also useful if you need to test a range of blocks. Say you ran a short SMART test and it told you
it couldn't read block 267873860, and the drive has logical blocks of 512 bytes. Since “bad blocks are
often social”, it would be a good idea to test the blocks surrounding that block. Some claim ± 100
blocks is enough, although I currently prefer ±1000. So after recording the current SMART pending
sectors, I would run:
badblocks -sv -b 512 <drive> 267874860 267872860
Remember that badblocks takes last block first, so the numbers above are in the correct order. This
would test 2000 512-byte blocks with the bad block detected by SMART in the middle of that cluster.
If that found more unreadable, possibly soft errors, it will tell you. Now recheck SMART and see how
Other Testing Tools
Page 16 of 32
the pending sector count has changed. For reasons I haven't figured out, sometimes badblocks will have
trouble with a sector, while hdparm will read it without problem.
Besides the read-only test, badblocks can do two other tests, the non-destructive write (-n), and the
destructive write (-w). The non-destructive write test will attempt to write a known pattern of data to
the drive, then read it back, stressing the drive and making sure everything is good. It is generally safe8
to run this on a drive with data you care about. However, because it has to backup and re-arrange the
drive's existing data as it goes, it is slow, very slow. Further, it will never clear pending sectors, as it
will not destroy existing data and pending sectors by definition are existing sectors that can not be read.
I almost never use this test.
The destructive write test is, as the name suggests, destructive to data. Get any data you care about
backed up before you run this test! You won't get it back after you run this test. Professional data
recovery services couldn't get it back after this test. If allowed to run to completion, it writes four
different hex patterns to every sector on the drive, then reads them back. If they match, the write and
read, the drive is almost certainly good. This will clear pending sectors. It is also slower than the read
test, but faster than the non-destructive test. You'll want to run this on the highest speed controller you
can.
The four hex patterns the destructive test uses, 0xaa, 0x55, 0xff, and 0x00 may seem random, until you
translate them into binary. Each bit9 on the hard drive can have only 2 values, 0 or 1. If you translate the
hex patterns into binary, they become
•
0xaa – 10101010
•
0x55 – 01010101
•
0xff – 11111111
•
0x00 – 00000000
The tests alternate the bits, making sure each bit on the surface platter can hold both states. If you still
have pending sectors after this test is complete, then the drive suffers from medium errors and should
be discarded. This test can also cause the drive to reallocate sectors. Be sure and check the SMART
attributes when finished.
An example command to run a write test on the drive /dev/sda using 512 byte sectors would be:
badblocks -sv -w -b 512 /dev/sda
Given the time and opportunity, I recommend running this test on all new drives before putting them
into service. Passing this test won't guarantee a drive is good, but you'll have gone about a far as you
can in making sure the drive isn't bad.
The destructive write test can be resumed, but the technique is different than for the other tests.
Because the destructive tests does a complete write, then a complete read, realistically, you can only
resume at the 25%, 50%, or 75% mark.
For those patterns that are fully complete, writing and reading, you can skip doing them again, but
specifying the remaining patterns to do using the -t switch, one switch per pattern left. For example if
8
Key word: Generally. If the drive is failing, it has a limited lifespan left. Always check the SMART attributes first!
9
A byte is 8 bits. So a 512 byte sector is 512*8 or 4096 bits.
Other Testing Tools
Page 17 of 32
0xaa is finished, but 0x55 is not, then using the same example drive above, the command to start with
the 0x55 pattern and run the rest of the test is:
badblocks -sv -w -b 512 -t 0x55 -t 0xff -t 0xaa /dev/sda
Which is better: badblocks or the SMART tests?
It depends, but in general, badblocks. As a first pass, always run the SMART short test. It can find
problems the quickest. Why wait two days for a badblocks non-destructive test to finish when you
could have your answer in a few minutes with the SMART short test?
Since SMART does not have any write tests, only the read-only tests can really be compared. The one
to use depends on how you are testing. Since the SMART tests are done by the drive themselves, they
won't be affected (assuming they start) by drive controller errors, memory errors, cable errors, or CPU
errors, while badblocks can be affected by all of these. So if you are testing a drive outside of the
system it will eventually go into, you could get a failure due to problems that have nothing to do with
the drive. This can also be the cause of why the results from badblocks and hdparm occasionally differ
on the same sector10. On the other hand, if the drive is in the system that will be its home, the presence
of these problems needs to be found, so you want to do the badblocks test.
Time is another consideration. Because the SMART test is done by the drive itself, it is immune to
slowdowns caused by other components in the computer you are using. Just as a chain is only as strong
as its weakest link, a badblocks test is only as fast as the slowest component. If the drive is the slowest
component, then badblocks and SMART will run at the same speed (in theory). In all other cases,
SMART will win.
Some SCSI/SAS drives, some usb controllers, and some rare ATA controllers, do not support SMART,
but badblocks will work on those drives, making the choice easy.
The final consideration is how the drive is being tested. Some drive controllers, especially USB
bridges, will send a standby command sent to the drive after some time of no I/O inactivity. This will
cause the SMART long test to abort. A post by Christian Franke suggests running a script to access the
drive every minute or so, such as the following Linux script (by Christian Franke), where the X in
/dev/sdX should be changed to the appropriate drive letter:
while true; do
dd if=/dev/sdX iflag=direct count=1 of=/dev/null
sleep 60
done
10 Most of the time they differ because you didn't specify the correct block size in your badblocks test. By default,
badblocks uses a block size of 1,024, while drives are ususally 512 or 4,096 bytes.
Appendix A: Crash Course in Linux
Page 18 of 32
Appendix A: Crash Course in Linux
Case-sensitive
Unlike Windows, Linux is case sensitive. The command smartctl is not the same as SMARTCTL, or
Smartctl. If you type the wrong case, you'll likely get an error. Assume, unless otherwise specified,
that all commands are lower case only.
This also applies to switches and drive names. For example, smartctl -x /dev/sda is a
different command then smartctl -X /dev/sda . The first gives you the SMART info, while the
second aborts a self test.
Because commands are case-sensitive, the names of the programs mentioned in this guide are always
lower case, even when they begin a sentence. This is intentional and not a typo.
Terminals
You'll do most of the hard drive testing in a terminal, also called console. For live CD's without an
GUI, such as ALT Linux, you'll immediately see a console prompt when the boot-up is finished. For
live CD's with a GUI, such as Knoppix, you can open one from the menu or shortcut. If given the
choice between a regular console or a root console, for hard drive testing, choose the root console.
Normally you would choose the regular.
Most Linux systems feature multiple virtual consoles. If not in a GUI, you can switch between them by
pressing ALT-F1, ALT-F2, etc. Most have 5 consoles, so ALT-F5 is as high as you can go. If in a
GUI, the switch command is CTL-ALT-F1, or CTL-ALT-F2, etc. To switch back to the GUI, try
ALT-F7.
Root
“God, root, what is difference?”11 Root is the master user account on
Linux. It is roughly equivalent to Administrator on Windows, only
more powerful. Root has access to everything. For this reason, it is
strongly recommended that normal everyday Linux users do not use
the root account. Mistakes happen, but as root, they can be far more
damaging.
However, to run most of the tests recommended above, you'll need full access. This means root. Some
distributions, such as ALT Linux drop you into a terminal as root. Others you have to become root. You
can try su , and if asked for a password, toor or <blank> are popular ones on Live CDs. If that fails, try
the sudo -i command.
You'll know you are root as the prompt symbol for root is #, while a normal user has the symbol $.
Usually the prompt will say root as well.
11 From http://ars.userfriendly.org/cartoons/?id=19981111
Figure 9: Yep, I'm root. The #
sign and the name confirm it.
Appendix A: Crash Course in Linux
Page 19 of 32
History and Searches
One nice thing about the Linux terminal is you have access to recent commands typed. By pressing the
up arrow key, you can go back through the commands you have typed. For a Live CD, that will usually
be every command you've typed in that terminal. Once you've found the command you want, using the
arrow keys, delete, and backspace, you can edit the command.
The command history also has a search feature. Start by typing CTL-r then type any part of the
command you're looking for. If the first one that matches isn't the one you can either press CTL-r
again, or type more of the command. The search does not support editing the search string, so if you
make a mistake, press CTL-c and try again. Press enter to accept the command, or use the arrows keys
to start editing the command.
Switches
Linux programs use switches to take arguments. The switches come in one of two forms, a space dash
(<space>-) followed by a letter, or a space and two dashes (<space>--) then a word. Often, but not
always there will be two forms of a switch, the single letter and the word. For example, many linux
programs have:
•
-V for getting version information, and
•
--version for getting version information
Some switches need arguments (see Appendix B for an example). Those switches that use two dashes
need an equal sign or space between the word and the argument, while a single letter switch needs a
space before the argument.
Some single letter switches that don't need an argument can be combined. If in doubt, you can try
looking at the program's help. There are three ways to get it:
•
The man page. Type man <name of program> and this will give you lots of info. Not all
live CD's have these.
•
Just type the name of the program and press enter. This will, most of the time, give you a brief
help page.
•
Try -h which is the standard for help. So, <name of program> -h will usually bring up
the help page.
Less
Sometimes the output of a command, such as smartctl -x <drive name> is longer than one
page. The less command (all lower case) allows you to see the output one page at a time, and even
scroll back. It is similar to the more command, but less does more (pun intended).
By itself, less displays nothing. It has to be fed text to display. One way, but not the only way, is to pipe
the output of a command to less using the pipe character | . On your keyboard, it will not be a solid line,
but have a break in the middle. Using the example command above, piping the output of smartctl to
less would be smartctl -x <drive name> |less .
Appendix A: Crash Course in Linux
Page 20 of 32
Once you see the output in less, you can use the arrow keys to scroll up and down, or the page up and
page down keys to scroll up or down one page at a time. The spacebar allows you to scroll down one
page at a time. Press q to quit less.
Appendix B: Updating smartmontools DB
Page 21 of 32
Appendix B: Updating smartmontools DB
While having an out of date smartmontools database isn't a huge deal, for those wishing to update it,
the process is a simple one. The database is simply a comma separated text file, although with a .h
extension.
The new file can be downloaded from http://sourceforge.net/apps/trac/smartmontools/wiki/Download
(scroll down to the “Update the drive database” section). Just be sure you click on the link for the
version you have and be sure to click on the text file link, not the “viewed using the new repository
browser” link. Save this file. Don't rename it.
Now you have to get it into your live environment. The easiest way is to save the file to flash drive.
Most live CD's will now require you to mount the drive. A few will do this automatically, and most
installed Linux distros will do this automatically as well.
First, you will need to create a mount point12, otherwise known as a directory. The directory should be
empty. By tradition, the directory is usually /mnt/<some name> or /media/<some name> and
you can give it any name you want that isn't already taken. Often the name is the partition name for the
drive (see page 7, above). So if the flash drive is /dev/sdc (some flash drives are formated so they don't
have partition numbers), the command would be:
mkdir /mnt/sdc
Next you actually mount the drive. The command, assuming the drive is again /dev/sdc would be:
mount -t auto /dev/sdc /mnt/sdc
Now you have two options, copy the file and overwrite the existing one once you find it, or just add a
switch to the command to look at the smart data, telling smartctl where the config file is. The switch is
--drivedb=<filename with path>
So if the file is on /mnt/sdc, then the basic command to list all the SMART info from page 8 above
would become:
smartctl --drivedb=/mnt/sdc/drivedb.h -x /dev/sda |less
12 Windows also has mount points, and they work almost the same as Linux, but that is beyond the scope of this guide.
Appendix C: Testing with GSmartControl
Page 22 of 32
Appendix C: Testing with GSmartControl
Much of what follows is a repeat of the smartmontools tutorial above. But in case a good live CD does
become available, here's how to do the testing with GsmartControl.
Main Page
When you first start up GSmartControl, it will
scan for a list of drives. It will show all drives,
include DVD drives and flash drives, or, as seen
in the screen shot, a phone with accessible
memory. In this case, I have selected a Hitachi
drive. The drive information tells me it is referred
to by Linux as /dev/sda, it is 1TB, and the
manufacturer and model number. You can hover
over the drive to see if SMART is supported or
not. Occasionally, it will be supported, but
disabled (DUMB, DUMB, DUMB!).
To get more information and to run tests, right
click on drive and select details. You can also
toggle SMART on and off from the menu. It
might be tempting to jump straight to the tests,
and that's OK, but for now, look at details first.
Be warned that just because it says the basic health check passed does not mean the drive is good and
you can rest easy. There can very well be signs of impending failure in the details, but it will still say
passed.
Identity
The first tab of the details page is a description of the hard drive. Several lines are particularly
important/useful here:
•
Serial Number. If you ever have a computer with 2 drives, both the same size and model
number, and one fails (for whatever reason) and the other passes, this is how you can tell them
apart when you go to replace the bad one. Credit goes to DL for this idea.
•
Sector Size: This was covered earlier. When using badblocks, you'll want the logical sector size.
•
In Smartctl Database: If this is no, then the attributes page will likely have unknown attributes.
Most of the SMART parameters are the same across manufacturers though, and the VALUE and
TRESHOLD parameters are shown and failure is indicated correctly. You can always update the
drive database to try to get more info.
•
ATA Verison/ATA Standard: Versions 8 are SATA drives, 1-6 IDE. Version 7 is usually SATA,
but I have seen an IDE drive with version 7.
Figure 10: Main Page of GSmartControl
Appendix C: Testing with GSmartControl
Page 23 of 32
One way GSmartControl differs from smartmontools is smartmontools will give you some additional
information. If you click the Output button at the bottom, later versions of smartmontools will tell you
if the drive supports AAM as well as the current value and, for some drives, the max SATA speed the
drive supports.
At the bottom of the page is a refresh button. This will re-read all the info in all the tabs from the drive.
This is useful if you use other tools, described later, to poke and prod sectors on the hard drive.
Attributes
Most drives will pass or fail based
on the information here. Knowing
how to read this tab is critical!
There are several columns you
need to pay attention to.
The first is the name of the
attributes. Some attributes are
important, some, less so. If the
drive is not in the database, you
will likely see unknown attributes
for some items. This will make
the page less informative. The
Failed column is only somewhat
important. The other columns will
tell you whether or not to be
concerned. Often by the time
something has failed (except
temperature), the drive is dead. For GSmartControl, if you hover the mouse pointer over an attribute
name, it will give you some background information.
The Failed column isn't too important. The other columns will tell you whether or not to be concerned.
The next 4 columns are where you should be focusing your attention. The drive's firmware will take the
real value, otherwise known as the raw value, and convert it to an 8 bit number (0-255) using some
algorithm. This is becomes the normalized value column, and a max value for any attribute can range
from 100-255, depending on the drive. Some attributes max value will be 100, while others could be
255, or in the UDMA CRC attribute in the picture above, 200. It depends.
The worst column is simply the lowest value the normalized column has every reached. The threshold
column is the value at which the drive determines if that attribute has failed or not. If the normalized
column is at or below the threshold, there is a failure.
The normalized and threshold are useful to look at to see if they are within a few points of each other. If
so, that's a very strong indicator you should retire that drive before it fails. In general, however, the
only column you'll really pay attention to is the raw value. The important attributes, referring ONLY to
the raw values, are:
•
Reallocated Sectors – Ideally this should be zero. One or two bad sectors doesn't make a bad
drive, but once this value on platter drives, not SSDs, hits 5, it's time to replace.
Figure 11: The attributes tab
Appendix C: Testing with GSmartControl
Page 24 of 32
•
Power On Time – A few drives don't record this correctly, so you'll have to get the real number
from the self test logs (see below). For the rest, this is in hours. After about 26,500 hours, (~3
yrs) the odds of the drive dying within the next year are 11.8%13, and they go up after that. This
is a “How good are your backups?” time if you want to continue using the drive. Once this hits
about 43,350, replace the drive even if you like to gamble. The drive's odds of complete failure
within the next year are unacceptably high. Platter drives are mechanical devices, and they will
wear out eventually.
•
Spin-up Retry Time – This should be zero. Anything higher indicates a drive motor problem. If
the motor dies, your hard drive dies. Replace.
•
Reallocation Event Count – This, in theory, gives you information about whether the
Reallocated Sectors are a 1-time event, or occurring over time. Either way, this indicates a
problem, but you'll not fail a drive based on this.
•
Current Pending Sector Count – Ideally, this should be zero. Anything else means you have to
do some more testing. The pending sectors could be soft, medium, or hard errors. You can't tell
from the SMART data. If this is more than zero, the SMART tests will usually fail. Don't waste
time running them unless you need the correct power on time.
•
Offline Uncorrectable – Think of this as a second Current Pending Sector Count. Same rules
apply.
•
UDMA CRC Error Count – A count higher than 1 or 2 often indicates the data cable has a
problem. I suggest replacing the cable.
Capabilities
There is no useful testing/health information here you can't get from the other tabs in GsmartControl.
Error Log
Not as useful as you might think. This
records past failures to read sectors. These
are logical sectors, not physical. It does not
tell you whether or not the sectors were soft,
medium, or hard errors, and does not
decrease or erase entries should the sector be
fixed, i.e. a soft error.
The most useful thing it does tell you is the
sector number and the power on time it
occurred. Is it a recent error, or something
that happened some time ago? Further, it is
not unusual to see multiple entries with the
same sector number.
For smartmontools, you will need either the
-a or -x flag. Starting with ATA-6, there is an
13 http://blog.backblaze.com/2013/11/12/how-long-do-disk-drives-last/
Figure 12: The Error Log
Appendix C: Testing with GSmartControl
Page 25 of 32
extended log (-x), and log entries there may not be recorded in the regular log (-a). Near as I can tell,
GsmartControl only shows the regular log.
Self Test Logs
Mildly useful, this will tell you if
any of the drive's self tests have
been run, when, and the result.
Obviously, if the current power on
time is within a few hours of the
last test that completed
successfully, there is no point in
running the same test again. The
lifetime hours column is the real
power on hours for drives that don't
record that value properly in the
attributes. If need be, run the short
test and look here for the hours.
If the test fails, it records only the
first logical sector it couldn't read.
This is useful in case you don't
have the time to do a full hard drive
scan, and need to determine what
type of error that sector represents.
Do remember that this only logs
SMART tests. If you use a non-
SMART test, such as the badblocks
test described later, it will not show
up in the log.
Perform Tests
This is the tab where you tell
GSmartControl/smartmontools to
run the tests14. There will be two or
three test options depending on the
drive. Always start with the short
test. If that fails, then you must
address that failure. There is no
reason to wait the hour or more the
long test takes if the short test will
tell you something.
14 Actually, neither program does any testing. They merely tell the drive's firmware to run the manufacturer's built-in tests.
The drive does the actual testing, and reports the results back to the program.
Figure 13: The Self-test Logs
Figure 14: The Perform Self Tests Tab
Appendix C: Testing with GSmartControl
Page 26 of 32
The tests are read-only and will not damage any data. However, it is recommended to run these while
load on the hard drive is low. Some operating systems will crash if the drive doesn't respond within a
certain time, and since these tests are run by the drive's firmware, the operating system has no idea
what's going on. A live CD is a recommended way to run these tests for non-critical systems.
If a drive attributes look good, and it passes the short test, it's probably a good drive. Ideally, it would
be better to run the extended test, but sometimes time is just too limited to do that. For servers, I would
strongly recommend running at least the extended test before a new hard drive goes into service.
Having a production server go down will cost far more than an hour or two of testing.
The tests need to run. Don't neglect them. Without running the tests, you may not have current
attributes.
One misconception about these tests is a that a failure means the drive is bad. It does not! The
tests stop at the first sector they can't read. A failed test does not test the entire drive. If that sector is a
soft error, it is fixable, and the drive is still perfectly usable. Further testing is required. Don't fail a
drive based on a single soft error.