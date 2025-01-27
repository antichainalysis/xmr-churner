<h1 align="center">
  moneroc - XMR Churner
  <br>
</h1>

<div align="center">
  <h3><a href="https://github.com/antichainalysis/xmr-churner/blob/main/writeup.md">The proper way to churn Monero</a></h3>
</div>

# Description
`moneroc` is a tool designed for automating the process of distributing funds between multiple Monero accounts and **churning** them (i.e., transferring funds between accounts multiple times) in the same wallet using monero-wallet-rpc. It interacts with the Monero RPC server to create new accounts, distribute funds, churn, and shuffle balances. The goal is to enhance the **privacy and transaction obfuscation**, making it more difficult to trace the origin and flow of funds. `moneroc` accomplishes this by leveraging **Monero's ring signature privacy** and simulating the **natural fund movements** with randomized delays between transactions.

`moneroc` is designed for:
* **Obfuscating the source of funds** by introducing multiple decoy addresses that get mixed into future transactions, utilizing **ring signatures** to obscure transaction origins.
* **Simulating real-world transaction patterns** by adding unpredictable delays and repeating churn operations over several hours, preventing any identifying patterns in fund transfers.

**NOTE: `moneroc` is not offering or guaranting full complete untraceability of your Monero, simply put it is just a tool designed to help Monero users who participate in churning [to do it properly](https://github.com/antichainalysis/xmr-churner/blob/main/writeup.md) (read up carefully before you use). Monero is a tool just like `moneroc` and tools are meant to be used correctly. There is no silver bullet for privacy, people can slip up and make mistakes—just be smart, cautious, and aware/vigilant.**

I have tried and will continue to try to make this tool as user-friendly as possible so even the most non-technical/average person is able to use it easily and successfully.

# Features
* **Dynamic Range Calculation**: `moneroc` automatically calculates the range of atomic units (AMU) to distribute based on the total balance of the account (main account 0).
* **Account Creation & Transfer**: `moneroc` automatically creates new monero accounts and distributes a random amount of XMR within a specific range between them.
* **Churn Automation**: Configurable churn range to randomly perform churns between accounts for a set number of times to enhance privacy.
* **Monitors Account Balance**: `moneroc` ensures that sufficient unlocked funds are available before proceeding with any transactions.
* **Delays**: Random (30-60 minutes delay range) delays between each operation because after each churn, 8-10+ hours pass, and decoy addresses start to appear, making it difficult for anyone monitoring the process to detect patterns, trace, or link activities.

# Requirements
* Your OWN ([local - will explain why later on why local node is needed](https://github.com/antichainalysis/xmr-churner/blob/main/writeup.md#introduction-to-moneroc)) Monero node.
* monero-wallet-rpc completely setup with the JSON-RPC interface enabled (default is `http://127.0.0.1:18082/json_rpc`)
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
PLEASE READ [THIS](https://github.com/antichainalysis/xmr-churner/blob/main/INSTRUCTIONS.md) BEFORE YOU INSTALL AND RUN `moneroc`.

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

# [How It Works](https://github.com/antichainalysis/xmr-churner/blob/main/xmr_churner.png)

Read [this](https://github.com/antichainalysis/xmr-churner/blob/main/example_flow_of_funds_process.md) for a tldr/faster, better, simpler, and clearer understanding of `moneroc`.

**1. Check Account Balance**
  * `moneroc` first checks the balance and unlocked balance of the wallet.
  * If the balance is below the upper limit of `maxRange`, `moneroc` breaks the loop and stops distributing funds.
  * If the unlocked balance is insufficient, it waits for the funds to become available by polling the balance every 5 seconds
    
**2. Create new Account**
  * Once sufficient funds are avaiable, `moneroc` creates a new Monero account and retrieves the account's address and index

**3. Fund Distribution**
  * A random amount of XMR (within the `amuRange` range) is selected and transferred to the newly created account using the Monero `transfer` method via a RPC call.

**4. Wait for Unlocked Funds**
  * If the unlocked balance is not enough, `moneroc` waits until the funds are unlocked.

**5. Random Delays Between Operations**
  * After each transfer, `moneroc` introduces a random delay between 30 and 60 minutes to mimic more natual, human-like behaviour. This prevents `moneroc` from acting in a predictable manner and makes it harder for any observer to track/trace the flow of funds.

**6. Churning Process**
  * After all funds have been distributed across the accounts created in the same wallet, `moneroc` starts the churning process:
      * It retrieves a list of all accounts and their balances.
      * Accounts with non-zero balances are selected for churning.
      * `moneroc` transfers funds from each account to a newly created account, iterating over each account as specific by the `churnRange`

**7. Churning Iterations**
  * `moneroc` performs the churn operation for each selected account a random number of times (`iters`), defined within the `churnRange`. Each churn operation involves transferring all available funds from an account to a new one.
