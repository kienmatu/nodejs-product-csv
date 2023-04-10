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

My machine's specifications:

```bash
OS: Ubuntu 22.10 x86_64 
Host: Latitude 5420 
Kernel: 5.19.0-38-generic 
Uptime: 57 mins 
Packages: 2956 (dpkg), 16 (snap) 
Shell: zsh 5.9 
Resolution: 1920x1080 
DE: GNOME 43.1  
CPU: 11th Gen Intel i7-1185G7 (8) @ 4. 
GPU: Intel TigerLake-LP GT2
Memory: 8181MiB / 31491MiB 
```

### Benchmark v1

Branch: `feat/v1-import-and-export-normally`

The first version i just focusing on implementing a lightweight API.
Then it just contains sample endpoints, apply main techniques like: connection pooling, bulk insert, caching file.

#### TEST 10s with 5 connections and csv file of 1000 rows

Running 10s test `@http://localhost:8080/api/products/import`
5 connections

| Stat    | 2.5%  | 50%   | 97.5% | 99%   | Avg      | Stdev   | Max   |
|---------|-------|-------|-------|-------|----------|---------|-------|
| Latency | 29 ms | 31 ms | 44 ms | 48 ms | 33.28 ms | 4.78 ms | 74 ms |

| Stat      | 1%      | 2.5%    | 50%     | 97.5%   | Avg     | Stdev | Min     |
|-----------|---------|---------|---------|---------|---------|-------|---------|
| Req/Sec   | 18      | 18      | 26      | 28      | 25.7    | 2.69  | 18      |
| Bytes/Sec | 5.02 kB | 5.02 kB | 7.25 kB | 7.82 kB | 7.17 kB | 750 B | 5.02 kB |

Req/Bytes counts sampled once per second.

of samples: 10

262 requests in 10.01s, 71.7 kB read

---

#### TEST 10s with 5 connections and csv file of 10000 rows

Running 10s test `@http://localhost:8080/api/products/import`
5 connections

| Stat    | 2.5%   | 50%     | 97.5%   | 99%     | Avg        | Stdev     | Max     |
|---------|--------|---------|---------|---------|------------|-----------|---------|
| Latency | 980 ms | 1569 ms | 1995 ms | 1995 ms | 1553.07 ms | 196.48 ms | 1995 ms |

| Stat      | 1%    | 2.5%  | 50%   | 97.5%   | Avg   | Stdev | Min   |
|-----------|-------|-------|-------|---------|-------|-------|-------|
| Req/Sec   | 1     | 1     | 3     | 4       | 3     | 1     | 1     |
| Bytes/Sec | 279 B | 279 B | 837 B | 1.12 kB | 837 B | 279 B | 279 B |

Req/Bytes counts sampled once per second.

of samples: 10

35 requests in 10.02s, 8.37 kB read

---

#### TEST 10s with 5 connections get Products

Running 10s test `@http://localhost:8080/api/products`
5 connections

| Stat    | 2.5%  | 50%   | 97.5%  | 99%    | Avg      | Stdev    | Max    |
|---------|-------|-------|--------|--------|----------|----------|--------|
| Latency | 29 ms | 32 ms | 102 ms | 189 ms | 36.75 ms | 21.02 ms | 203 ms |

| Stat      | 1%      | 2.5%    | 50%     | 97.5%   | Avg     | Stdev   | Min     |
|-----------|---------|---------|---------|---------|---------|---------|---------|
| Req/Sec   | 75      | 75      | 152     | 155     | 134     | 28.73   | 75      |
| Bytes/Sec | 8.68 MB | 8.68 MB | 17.5 MB | 17.9 MB | 15.5 MB | 3.31 MB | 8.67 MB |

Req/Bytes counts sampled once per second.
of samples: 10

1k requests in 10.01s, 155 MB read

