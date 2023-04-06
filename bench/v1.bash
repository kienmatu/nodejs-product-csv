#!/bin/bash
set -eu

# Get the directory of the script file
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cat "$SCRIPT_DIR/sample-csv/products-100-rows.csv"
autocannon http://localhost:8080/api/products/import -m POST \
  -i "$SCRIPT_DIR/sample-csv/products-100-rows.csv" \
  --duration 10 --connections 10 \
  --headers "Content-Type: application/csv;charset=utf-8"
