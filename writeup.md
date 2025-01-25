# Monero (XMR) Churning

## What is Churning in the context of Monero?

XMR Churning is essentially the process of moving Monero (XMR) between different addresses or wallets with the goal of enhancing privacy. The idea is that by moving the coins around, you can obfuscate the transaction history, making it harder for anyone to trace the origin or destination of funds. 

Churning is typically used to increase **transaction obfuscation** by breaking links between addresses and making it harder for external observers to trace the flow of funds. It's more about disrupting the transaction trail and creating noise. However, **how** you churn is CRUCIAL in determining whether it improves or harms your privacy.

We all know XMR churning is very controversial topic, some say churning benefits your privacy and others say it significantly harms your privacy even more. Hence why I wrote `moneroc` tool and this writeup to help explain why XMR churning is beneficial in TODAYS time if done correctly.

### sweep_all:
To my understanding most people churn via the `sweep_all` method which links outputs (e.g., undermines your privacy). The concern with this method is that if you sweep coins from multiple addresses (often containing unspent outputs), it links all those outputs together into one transaction.

The main issue with `sweep_all` is more about **consolidation**. For example, by consolidating funds from multiple addresses into one, it risks revealing relationships between addresses that were previously independent. 

While it does consolidate the funds, it creates a direct link between multiple addresses, which might make the transaction history easier to trace if someone is able to track the previous addresses. This linking of outputs could potentially reduce privacy, especially if you use the same `sweep_all` methods repeatedly.

### self-sending:

Self-sending is when you send coins back to yourself within the same wallet **account** (e.g., using the same receiving address or just generating a new address under the same account).

This process doesn't break any link between the source and the destination, as both are apart of the same account. Essentially, if you're sending Monero from address A to address B within the same account, then you're not obfuscating the flow of funds at all.

Since you're not churning with any outside addresses, it doesn't really achieve the goal of churning—it doesn't make it any harder to trace the transaction besides undermining it even more.

# Introduction to `moneroc`

`moneroc` is a tool designed to facilitate **proper Monero churning** by utilizing effective strategies that enhance privacy without the pitfalls of methods like `sweep_all` or self-sending. This tool automates the process of distributing funds by creating new accounts and churning XMR between them into other new accounts by carefully selecting random delays to avoid obvious patterns and mimicing a more human-like transaction on the network.

Click [here](https://github.com/antichainalysis/xmr-churner/blob/main/README.md#how-it-works) to read up on how it works.

There are still a few key things I'd like to mention/explain:
- The minimum amount of churns recommended is 3
- Minimum (range) amount of time to wait between each operation is at least 30 minutes. Here's why:
    * **Avoiding Predictability:** Rapid, automated transactions can easily be identified by observers/adversaries/3rd parties, leading to patterns that could compromise/undermine your privacy.
    * It enhances **Monero's Ring Signature Privacy**, once 1 FULL whole churn loop is done, 8 to 10+ hours have passed, the **ring signature** mechanism in Monero becomes much more effective. Monero uses **ring signatures** to mix your transaction with others, making it difficult to trace the source or destination of funds. When funds are moved across multiple acounts over time, the **number of decoy addresses** in the ring increases, which strengthens the privacy of the transaction.
    * The **ring size**—such as **Ring 16**—means that there are 16 possible sources for a transaction, including your own address and 15 decoy addresses. As more time passes and more churn occurs, the total number of decoy addresses involved in each transaction increases, making it significantly harder to identify the real sender or receiver.
- It is HIGHLY recommended that you run your OWN monero node and on Tor (read below on why this is needed)
    * running monerod with tor:
        ```
        monerod --proxy tor,127.0.0.1:9050 --anonymous-inbound tor,127.0.0.1:9050
        ```
- `moneroc` deletes your `p2pstate.bin` file because each Monero daemon has a node ID stored that is stored in the p2pstate.bin file. If and when you switch between Tor and the clearnet, this node ID (`p2pstate.bin`) file can be used to link the two, associating an IP address with your Tor session as mentioned in [this](https://www.reddit.com/r/Monero/s/SgUICWOcuB) reddit thread.

## Why run Monero daemon on Tor?
Everytime `moneroc` broadcasts a transaction (churns), it connects to a Monero **peer-to-peer** network node. If you run `moneroc` without using Tor, all of your transactions will be associated with the same public IP address, which could potentially link them together and undermine your privacy. 

Chainalysis, in a presentation to the IRS a few months ago (August-September 2024), explained how they run a lot of their **OWN poisoned (honeypot) nodes** in attempt to trace Monero transactions (lol). Their nodes are set up in a way to trace and link Monero transactions in an effort to de-anonymize us users... so later on in this writing I will refer to them as __CA nodes__.

The concern is that if all of your churn transactions come from a single IP address, it could look like they are coming from an exchange or centralized platform. This could be an indicator that you're churning XMR with non-private intentions.

However, not all nodes are CA so it wouldn't be every single TX (churn). Each chunk gets churned a random number of times and then each output split in size so there's a lot of opportunities for `moneroc` to have connected to CA node(s) and non CA node(s).
