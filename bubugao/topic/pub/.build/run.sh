#!/bin/sh -e

WORK_DIR="$1"
SCRIPT_DIR=`cd $(dirname $0); pwd -P`

rm -rf $WORK_DIR/js/lib
