# Nerds Hardware Client

![Screenshot](https://raw.githubusercontent.com/nerdsrobo/NerdsHardwareClient/refs/heads/master/NerdsHardwareClientPreview.png)

**An application for connecting to FTC hardware using Android Debug Bridge.**

## Features
 - Cross-platform
 - Possibility to disconnect from the hardware
 - Integrated FTC Dashboard

---

**Linux WiFi detection workability:**
To make WiFi detection work on linux, make sure `nmcli` installed

**Known bugs:**
 - On MacOS Wi-Fi detection doesnt work

## Development

A project using electron + svelte, by electron-vite

### Install

```bash
npm i
```
Installs all dependencies

### Development

```bash
npm run dev
```
Runs an app with hot reload on */renderer* part. To update the electron */main* part, rewrite `npm run dev`

### Build

```bash
# For windows
npm run build:win

# For mac
npm run build:mac

# For linux
npm run build:linux
```
To build specified OC application, recommends to use OC specified PC. On win recommends to build using admin terminal
