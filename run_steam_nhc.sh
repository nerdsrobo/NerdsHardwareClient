#!/bin/bash

export STEAM_RUNTIME=0

cd "$(dirname "$0")"

unset LD_PRELOAD
unset LD_LIBRARY_PATH

chmod +x ./nerds-hardware-client

./nerds-hardware-client