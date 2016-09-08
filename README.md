# Sync Click

A program for clicking on multiple desktops at the same time over the internet with one simple shortcut.

## Download
[Windows](https://github.com/jf908/Sync-Click/releases/download/v1.2.0/SyncClick-win32-x64.zip) |
[Mac](https://github.com/jf908/Sync-Click/releases/download/v1.2.0/SyncClick-darwin-x64.zip) |
[Linux](https://github.com/jf908/Sync-Click/releases/download/v1.2.0/SyncClick-linux-x64.tar.gz)

Note for Linux users - libappindicator1 must be installed for the tray to work.

## How to Use

One computer must host the server while the others connect to it.
The host must press <kbd>CTRL + I</kbd> to click on all computers at once.
Port forwarding is required; the default port is 7777 but that can be configured.

## Purpose

You might ask yourself, why would you need to syncronize clicks between computers?

So I ask, have you ever tried watching a video with a friend and wanting it to be perfectly in sync?

That's right with this lightweight (if you disregard the fact that this is an electron app) program you can do it with one simple press of <kbd>CTRL + I</kbd>.

## Development

### Setup

Install [necessary depedencies](https://github.com/octalmage/robotjs#building) and node-gyp

```
npm install
npm run setup
npm run rebuild
```

### Run

`npm start`

### Build for your OS

`npm run build`