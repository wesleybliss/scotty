# Scotty

> Crossplatform screenshot tool built with Vue2 & Electron

## What?

As in, _beam me up_? Idk, Shotty was already taken.

## Why?

Because I love the Gnome Screenshot app, but it doesn't auto upload to Dropbox. Also I was curious about how to drag & crop a section of an HTML5 canvas element (now I know).

## Known Issues

* Dropbox connects, and works fine when run in dev, but doesn't work in release mode. Could be some permissions, or maybe Electron related.

## Build Setup

``` bash
# install dependencies
npm i
npm i -g gulp

# serve with hot reload at localhost:8080
# -t (or --target=) option is optionnal and override the default webpack target (https://webpack.github.io/docs/configuration.html#target)
npm start [-- -t {target}] # or `npm run dev`

# launch electron and open a window at localhost:8080
# you must have run the `npm run dev` command in an other terminal window
# -s option is optionnal is used to add settings over the default settings
npm run electron [-- -s {settings}]

# build for production with minifications and package the app.
npm run build
npm run build:darwin
npm run build:linux
npm run build:win32
npm run build:all # All platforms, all architectures
npm run build:no-package # Standalone build
# Note: use the -t (or --target=) option to override the default webpack target (https://webpack.github.io/docs/configuration.html#target). For example `npm run build -- -t web`.

# package a portable binary for a specific platform from the available build.
npm run package # package for you current platform
npm run package:darwin
npm run package:linux
npm run package:win32
npm run package:all # All platforms, all architectures
```
