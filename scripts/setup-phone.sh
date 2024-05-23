#!/bin/sh

# This sets up a new phone by removing bloatware, changing some settings and installing CheapShot.
# The script should be idempotent and can be run multiple times without causing issues, so it can also be used to update the app on the connected phone.
./scripts/remove-bloat.sh
cd app || exit 1
make build && make install
cd ..
