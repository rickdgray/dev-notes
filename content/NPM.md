---
title: NPM
lastmod: 2023-05-27T21:56:53-05:00
---
# NPM
## Upgrading Legacy Commands
```bash
# find out what's outdated
npm outdated

# manually install a newer version
npm i package@version
npm i gulp@latest
npm i @babel/eslint-parser@12.0.0

# when you can't install something because
# of a dependency, find out why it's installed
npm ls package
npm ls color-string
```