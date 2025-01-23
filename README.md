<h1 align="center">
  moneroc - XMR Churner
  <br>
</h1>

<div align="center">
  <h3>The proper way to churn Monero</h3>
</div>

# Description
`moneroc` is a tool designed for automating the process of churning Monero (XMR) funds across multiple accounts in the same wallet using the monero-wallet-rpc. It allows you to create new accounts, transfer XMR between them, and perform churn operations repeatedly, with configurable parameters for the amount of times you want to perform a churn.

# Features
* **Dynamic Range Calculation**: `moneroc` automatically calculates the range of atomic units (AMU) to send based on the total balance of the account (main account 0).
* **Account Creation & Transfer**: `moneroc` automatically creates new monero accounts and transfers a random amount of XMR within a specific range between them.
* **Churn Automation**: Configurable churn range to randomly perform transfers between accounts for a set number of times.
* **RPC Interface**: `moneroc` interacts with your (local) Monero node(s) through the RPC interface, allowing local/remote communication with Monero wallets.
* **Delays**: Random (30-60 minutes delay range) delays between each operation because after each churn, 8-10+ hours pass, and decoy addresses start to appear, making it difficult for anyone monitoring the process to detect patterns, trace, or link activities.

# Requirements
* Your OWN (local - will explain why later on why local node is needed) Monero node with the JSON-RPC interface enabled (default is `http://127.0.0.1:18082/json_rpc`).
* bun - https://bun.sh/ for running the tool.

# Installation
All `moneroc` requires to install is bun.sh, execute the following:
  ```
   git clone https://github.com/antichainalysis/xmr-churner.git
   cd xmr-churner
   curl -fsSL https://bun.sh/install | bash
   bun install
   ```

# Usage
To run `moneroc`, execute the following command:
```
bun run main.ts --rpc-url <RPC_URL> --churnRange <min,max>
```
* `--rpc-url` or `-rpc`: The RPC URL of your Monero node (defaults to `http://127.0.0.1:18082/json_rpc`).
* `--churnRange` or `-cr`: A comma-separated range (e.g., 3,7) that specifies how many times to perform the churn operation. The tool will randomly select a number within this range (defaults to `3,7`).

Example:
```
bun run main.ts --rpc-url http://127.0.0.1:18082/json_rpc --churnRange 3,7
```

# How It Works
1. **Initial Balance Check**: The tool checks the balance of the main Monero account (0) you need to make sure all your funds you want to churn are sitting in account 0.
2. **Range Calculation**: Based on the total balance, the tool will calculate the range of atomic units (AMU) to be distributed.
3. **Account Creation**: It creates a new Monero account and sends a random amount of XMR to that account.
4. **Churn Loop**: The tool loops over existing accounts, performing the churn operation for a random number of iterations within the defined `churnRange`.
5. **Delays**: Random (30-60 minutes delay range) delays between each operation because after each churn, 8-10+ hours pass, and decoy addresses start to appear, making it difficult for anyone monitoring the process to detect patterns, trace, or link activities.
