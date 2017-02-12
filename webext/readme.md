# extension stores
- [Firefox](https://addons.mozilla.org/addon/word-cloud-generator?src=external-github)
- [Opera](https://addons.opera.com/en/extensions/details/word-cloud-generator)
- [Chrome](https://chrome.google.com/webstore/detail/word-cloud-generator/demclmhdcbofendohdngkfokmbcgickb)

# build
## system requirements

0. [yarn](https://yarnpkg.com/en/docs/install)
0. [sbt](http://www.scala-sbt.org/download.html)
0. [java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

## command

`sbt chromePackage`

**NOTE:** run from this repo's root directory

## output

`webext/target/chrome/webext.zip`

**NOTE:** path relative to this repo's root directory

## under the hood
the extension zip is built with [scala-js-chrome](https://github.com/lucidd/scala-js-chrome)
