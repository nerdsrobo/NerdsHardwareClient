# Nerds Hardware Client

![Screenshot](https://raw.githubusercontent.com/nerdsrobo/NerdsHardwareClient/refs/heads/master/NerdsHardwareClientPreview.png)

**An application for connecting to FTC hardware using Android Debug Bridge.**

## Features
 - Cross-platform
 - Possibility to disconnect from the hardware
 - Integrated FTC Dashboard

---

**Linux WiFi detection workability:**
To make WiFi detection work on linux, download `wireless-tools`. Install it, using your package manager, e. g. on Ubuntu: `sudo apt install wireless-tools`, on Arch: `sudo pacman -S wireless-tools`, etc.

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
Runs an app with hot reload on */renderer* part. To update the electron */main* part, rewrite cmd

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
