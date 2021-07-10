# Sample CBS
Sample Core-banking system for use in Smart Contract testing.

Table of Contents

- [Sample CBS](#sample-cbs)
- [Introduction](#introduction)
- [APIs](#apis)
	- [Config params](#config-params)
	- [Balance params](#balance-params)
- [/api/balance](#apibalance)


# Introduction

There are 2 APIs available. 

1. Config API
2. Balance check API

Both APIs are GET calls so it can be run from a browser.

# APIs

| Method | API | Description |
|-|-|-|
| GET | `/api/config` | Displays the current config |
| GET | `/api/config` with [Config params](#config-params) | [Config params](#config-params) can be passed to set the running configuration |
| GET | `/api/balance` with [Balance params](#balance-params) | Returns the balance in the account number specified in the [Balance params](#balance-params) |

## Config params

| Param | Description |
|-|-|
| `slow` | The delay in response for the balance API in ms. Default *100* |
| `status` | The status of the account. Default value *Active* |
| `balance` | Balance to be set. Default value *100* |
| `incr` | Increment value for balance. Default value *0* |


## Balance params

| Param | Description |
|-|-|
| `accountNumber` | Account number |
| `country` | Country | 
| `currency` | Currency | 

# /api/balance

This API returns a JSON in the following format, 

```json
{
  "accountNumber": "accountNumber",
  "balance": 600, // The calculated balance.
  "country": "country",
  "currency": "currency",
  "status": "Active" // The status that was set by the config API
}
```