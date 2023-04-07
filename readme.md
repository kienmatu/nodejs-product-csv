# NODEJS PRODUCT CSV IMPORTER API

#### AUTHOR: KIEN DINH

## INTRODUCTION

I want to make a sample API to import CSV file.
Then improve its performance by applying some advanced techniques.

## INSTRUCTIONS

### Generate sample CSV files:

RUN:

```bash
node csv-generator.js
```

## Benchmark
I use [autocannon](https://github.com/mcollina/autocannon) for load/ stress testing, just use the nodejs ecosystem :>.

Remember to chmod the execution permission:

```bash
chmod +x ./bench/v1.bash
```
### Benchmark v1
Branch: `feat/v1-import-and-export-normally`

The first version i just focusing on implementing a lightweight API. 
Then it just contains sample endpoints, apply main techniques like: connection pooling, bulk insert, caching file.
