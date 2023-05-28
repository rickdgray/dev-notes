---
title: Networking
lastmod: 2023-05-27T21:57:27-05:00
---
# Networking
## Subnet Mask
More info [here](https://www.aelius.com/njh/subnet_sheet.html)

| Addresses | Hosts | Netmask | Amount of a Class C |
| --- | --- | --- | --- |
| /30 | 4 | 2 | 255.255.255.252 | 1/64 |
| /29 | 8 | 6 | 255.255.255.248 | 1/32 |
| /28 | 16 | 14 | 255.255.255.240 | 1/16 |
| /27 | 32 | 30 | 255.255.255.224 | 1/8 |
| /26 | 64 | 62 | 255.255.255.192 | 1/4 |
| /25 | 128 | 126 | 255.255.255.128 | 1/2 |
| /24 | 256 | 254 | 255.255.255.0 | 1 |
| /23 | 512 | 510 | 255.255.254.0 | 2 |
| /22 | 1024 | 1022 | 255.255.252.0 | 4 |
| /21 | 2048 | 2046 | 255.255.248.0 | 8 |
| /20 | 4096 | 4094 | 255.255.240.0 | 16 |
| /19 | 8192 | 8190 | 255.255.224.0 | 32 |
| /18 | 16384 | 16382 | 255.255.192.0 | 64 |
| /17 | 32768 | 32766 | 255.255.128.0 | 128 |
| /16 | 65536 | 65534 | 255.255.0.0 | 256 |

If you take an ip address, 192.168.0.1, and write it in decimal, you get 3232235777.

In fact, the range of ip addresses in decimal is 0 through 4294967295. Does that number look familiar? It should. It's the max value for a 32 bit unsigned number.

Now, imagine a binary tree. The root node represents ip addresses 0 through 4294967295, or 0.0.0.0 through 255.255.255.255. It is at level 0 of the binary tree. If we were to label the root node of the binary tree, we use the lower ip address, and the level of the binary tree. 0.0.0.0/0.

Next level of the binary tree. The left node represents 0.0.0.0 through 127.255.255.255. We label that node 0.0.0.0/1. The right node represents 128.0.0.0 through 255.255.255.255. We label that node 128.0.0.0/1. Again, all the 1 represents is which level of the binary tree you're on.

So, you can imagine that 0.0.0.0/1's children will be 0.0.0.0/2 and 64.0.0.0/2. And so on.

At the last level of the binary tree (33), each node represents a single ip address.

TL;DR: The entire IPv4 address space is represented via a binary tree. An IP address in CIDR notation is nothing more than the low address, and the level of the binary tree.

And, IPv6 addresses work exactly the same way.

TODO: represent as a graph