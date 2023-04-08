#!/bin/bash
set -eu

# Get the directory of the script file
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

echo -e "\e[34mTEST 10s with 5 connections and csv file of 1000 rows\e[0m"

autocannon http://localhost:8080/api/products/import -m POST \
  -F '{ "file": { "type": "file", "path": "'"$SCRIPT_DIR/sample-csv/products-1000-rows.csv"'" }}' \
  --duration 10 --connections 5 \
  --maxOverallRequests 10000

echo -e "\e[34mTEST 10s with 5 connections and csv file of 10000 rows\e[0m"

autocannon http://localhost:8080/api/products/import -m POST \
  -F '{ "file": { "type": "file", "path": "'"$SCRIPT_DIR/sample-csv/products-10000-rows.csv"'" }}' \
  --duration 10 --connections 5 \
  --maxOverallRequests 1000

echo -e "\e[34mTEST 10s with 5 connections get Products\e[0m"

autocannon http://localhost:8080/api/products -m GET \
  --duration 10 --connections 5 \
  --maxOverallRequests 100000 \

