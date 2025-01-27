# Monero (XMR) Churning

## What is Churning in the context of Monero?

XMR Churning is essentially the process of moving Monero (XMR) between different addresses or wallets with the goal of enhancing privacy. The idea is that by moving the coins around, you can obfuscate the transaction history, making it harder for anyone to trace the origin or destination of funds. 

Churning is typically used to increase **transaction obfuscation** by breaking links between addresses and making it harder for external observers to trace the flow of funds. It's more about disrupting the transaction trail and creating noise. However, **how** you churn is CRUCIAL in determining whether it improves or harms your privacy.

We all know XMR churning is very controversial topic, some say churning benefits your privacy and others say it significantly harms your privacy even more. Hence why I wrote `moneroc` tool and this writeup to help explain why XMR churning is beneficial in TODAYS time if done correctly.

# Why is Churning needed?

Monero churning is really only needed especially when your funds originate from an exchange/identifiable source/traceable source that WILL report to **Chainalysis** and/or the **IRS**. So, I agree with people who say normal Monero users should not participate in Monero churning.

When you receive Monero from an exchange or other identifiable sources, **the origin of funds can often be traced back** to the exchange. One of the very common methods used to trace back Monero funds is the **EAE (Eve-Alice-Eve) attack**. 

In the **EAE attack**, the first "Eve" is (Chainalysis/IRS) getting the outgoing TXID(s) from whatever exchange. Then, identify "Alice's" consolidation transactions. The second "Eve" trick is when you bring that Monero from the exchange (the first "Eve") to the same or **ANOTHER exchange**. That's when an external observer (Chainalysis/IRS) gets to see the Monero deposit addresses (yes it's still impossible to identify Monero's stealth deposit addresses using blockchain data but if you are sending Monero that comes directly from an exchange prior, external observers are able to see this still because of their authority...). 

The core issue arises from the fact that **exchanges are a weak point** in Monero's privacy. It's easier for external observers to link transactions originating from exchanges. For a deeper dive into the very technical details of this, see this [article on tracing Monero transactions](https://medium.com/@nbax/tracing-the-wannacry-2-0-monero-transactions-d8c1e5129dc1).

Even Monero developers acknowledge this in their article on **FCMP++** ([Monero's Official Article](https://www.getmonero.org/2024/04/27/fcmps.html)):

```
Full-Chain Membership Proofs, as a concept, is a replacement for rings within the Monero protocol. While rings have offered sender privacy to Monero since it launched, they're vulnerable to attacks such as the EAE attack, have difficulties upon chain reorganizations, and in general enable statistical analysis (mitigated by distribution of the decoy selection algorithm).
```

One highly notable example is when **Julius "zeekill" Kivimäki**, who was identified because he [inadvertently fell victim to the EAE attack](https://cointelegraph.com/news/finnish-authorities-traced-monero-vastaamo-hack). You'd be surprised by how many people inadvertently fall victim to this attack, even if they churn their Monero after receiving it from an exchange and that is because they INCORRECTLY churn it.

However, after "Alice" if the person was to churn their Monero after receiving it from the exchange (CORRECTLY) then there would be no chance in being identified. Additionally, waiting a minimum of **12 hours**, and ideally **one to two days,** before exchanging your Monero adds significant privacy benefits (because of **Monero's Ring Signature technology**). 

### sweep_all:
To my understanding most people churn via the `sweep_all` method which links outputs (i.e., undermines your privacy). The concern with this method is that if you sweep coins from multiple addresses (often containing unspent outputs), it links all those outputs together into one transaction.

The main issue with `sweep_all` is more about **consolidation**. For example, by consolidating funds from multiple addresses into one, it risks revealing relationships between addresses that were previously independent. 

While it does consolidate the funds, it creates a direct link between multiple addresses, which could make the transaction history easier to trace if someone is able to track the previous addresses. This linking of outputs could potentially reduce privacy, especially if you use the same `sweep_all` methods repeatedly.

### self-sending:

Self-sending is when you send coins back to yourself within the same wallet **account** (e.g., using the same receiving address or generating a new address under the same account).

Although Monero uses **stealth addresses** to ensure that transactions within the same wallet are unlinkable to external observers, this process **doesn't break any inherent link** between the source and destination addresses **for the wallet owner**. This means that while the transaction appears private to anyone looking at the blockchain, **the relationship between the internal address remains intact** for the wallet holder.

For external observers, the transaction appears as private and unlinkable as any other Monero transaction. However, for the wallet owner, the relationship between the source and destination remains fully traceable. Additionally, if the funds originate from a traceable source (e.g., an exchange), a self-send does not disrupt the chain of custody or add meaningful privacy, as the exchange TXID can still be linked to the wallet.

# Introduction to `moneroc`

`moneroc` is a tool designed to facilitate **proper Monero churning** by utilizing effective strategies that enhance privacy without the pitfalls of methods like `sweep_all` or self-sending. This tool automates the process of distributing funds by creating new accounts and churning XMR between them into other new accounts by carefully selecting random delays to avoid obvious patterns and mimicing a more human-like transaction on the network.

Click [here](https://github.com/antichainalysis/xmr-churner/blob/main/README.md#how-it-works) to read up on how it works.

There are still a few key things I'd like to mention/explain:
- The minimum amount of churns recommended is 3
- Minimum (range) amount of time to wait between each operation is at least 30 minutes. Here's why:
    * **Avoiding Predictability:** Rapid, automated transactions can easily be identified by observers/adversaries/3rd parties, leading to patterns that could compromise/undermine your privacy.
    * It enhances **Monero's Ring Signature Privacy**. Once a full churn loop is completed, with 8 to 10+ hours having passed, the **ring signature** mechanism in Monero becomes much more effective. Monero uses **ring signatures** to mix your transaction with others, making it difficult to trace the source or destination of funds. When funds are moved across multiple acounts over time, the **number of decoy addresses** in the ring increases, which strengthens the privacy of the transaction.
    * The **ring size**—such as **Ring 16**—means that there are 16 possible sources for a transaction, including your own address and 15 decoy addresses. As more time passes and more churn occurs, the total number of decoy addresses involved in each transaction increases, making it significantly harder to identify the real sender or receiver.
- It is HIGHLY recommended that you run your OWN monero node and on Tor (read below on why this is needed)
    * running monerod with tor:
        ```
        monerod --proxy tor,127.0.0.1:9050 --anonymous-inbound tor,127.0.0.1:9050
        ```

## Why run Monero daemon on Tor?
Every time `moneroc` broadcasts a transaction (churns), it connects to a Monero **peer-to-peer** network node. If you run `moneroc` without using Tor, all of your transactions will be associated with the same public IP address, which could potentially link them together and undermine your privacy. 

Chainalysis, in a presentation to the IRS a few months ago (August-September 2024), explained how they run a lot of their **OWN poisoned (honeypot) nodes** in attempt to trace Monero transactions (lol). Their nodes are set up in a way to trace and link Monero transactions in an effort to de-anonymize us users... so later on in this writing I will refer to them as __CA nodes__.

The concern is that if all of your churn transactions come from a single IP address, it could look like they are coming from an exchange or centralized platform. This could be an indicator that you're churning XMR with non-private intentions.

However, not all nodes are CA so it wouldn't be every single TX (churn). Each chunk gets churned a random number of times and then each output split in size so there's a lot of opportunities for `moneroc` to have connected to CA node(s) and non CA node(s).

# [Chainalysis Monero Presentation to IRS -- August 2023](https://vimeo.com/1009284260)

00:00 - 10:00:
      
      - Monero had its origins in a whitepaper called cryptonote. Which sought to seek privacy and decentralization.
      - Cryptonote was first in a cryptocurrency called "Bytecoin", which was acknowledged as the first privacy coin. Which later on, Monero spawned out of the Bytecoin community because of controversy and it's anonymous development team.
      - There are also different privacy coins, such as Zcash and Dash. But the main difference between Monero, and Zcash/Dash is that Monero has privacy on by default. With Zcash it's an opt-in feature.
      - Bitcoin is pseudonymous, not a true "privacy coin" since the transactions are public.
      - Japan and UAE have outlawed privacy coins, there were also leaked EU draft regulations trying to ban privacy coins. Which was virtually impossible due to how decentralized the network is.
      - Ring Confidential Transactions also known as Ring CTs, is one of the features with the Monero protocol. When you send a Monero transaction, instead of making it obvious the funds are coming from your identity, the Monero protocol automatically will draw in other transaction outputs from the Monero blockchain, and it will hide the real output being spent among those decoys.
      - The mandatory Ring size used to be 11, meaning 1 real output being spent hidden among 11 decoy outputs, currently the Ring size is 16. (It may increase to 100 in the future. He also says how it will make his job alot harder, since a big part of his job is learning how to remove those decoy outputs).
      - Pederson commitment is a cryptographic technique that obscures transaction amounts while ensuring they still balance out. (Allow people to spend their funds without revealing the network of how much their spending.
      - Similarly with Bitcoin, it uses the same unspent transaction model, meaning the transactions input consists of previous outputs from the previous outputs on the blockchain. That means, the network will need to stop the user from spending the same coin twice. How is this possible if everything is obscure? The answer is zero knowledge proofs, which is where you want to convince someone that you know some secret information without actually revealing what the secret information is. In Monero, a prover is the initiator of a transaction and they're convincing the verifier (the miner), that they control the private keys for some input in that set, and that the amounts balance without revealing what the actual input is being spent and without revealing the amount.
      - Zero knowledge proofs allow funds to be spent without revealing what member of the ring is sending and what the amount of Monero is being spent was.

10:00 - 20:00:

      - Stealth addresses are created automatically when you initiate a Monero transaction they serve to further obfuscate identities on the Monero blockchain. You're creating a new stealth address (essentially a burner address and also known as a one-time public keys) everytime you're sending a Monero transaction.
      - Another feature of Monero is Bulletproofs, they made the network alot faster and brought down transaction fees.
      - The more privacy technology added was Dandelion, which was originally developed for the Bitcoin blockchain but it was later implemented for Monero. What it does it hides IP addresses from being sent along with the transaction. It does this by splitting the transmission of a transaction into two parts. First is the anonymity phase, where the transaction is shared from one node to the next without being shared more widely to the network. At a randomly selected point, a node will choose to start spreading all around to the rest of the network. So when you're receiving it at the later stage, you have no idea whether the IP address you're receiving from, is the same IP address where the transaction came from. Which makes it essentially invisible of what the initiators IP address was.
      - He goes on to explain how it was a really big challenge for Chainalysis because of alot of how they do their Monero tracing involved IP observations. Anything after 2020 (When Dandelion was introduced) IP observation became much much weaker. Before it was introduced they were more confident in their IP observation skills (lol). They also name transactions on if it was the "pre-dandelion era" or the "post-dandelion era"
      - A Bitcoin address shows the actual spenders, the transacted amounts are visible, the address itself is also public. However, with Monero, the addresses are all stealth addresses, so you can't toss that addresses into a searchbar and find other transactions from that address. THe actual inputs are hidden in ring signature. Also, no amount disclosed.
      - However, there are still some breadcrumbs they can use. The payment ID was an optional field (up to Dec 2019). The fees paid with the transaction. Some initiators would use a higher fee structure, in order to have their transactions prioritised by the network, which where Chainalysis would use that to identify behaviours, as some initiators would use the same fees structure, creating a link. It shows: Fees paid, Size of transaction, number of mixins, unlocking time, number of inputs, number of outputs, transaction version and key information order.
      - Most users like to use the x1 fee multiplier (the default). However shown on the video theres multiple spikes meaning some of them can be identified if they are consistently using that fee structure.

20:00 - 30:00

      - Chainalysis uses honeypot nodes to "bypass" dandelion, as if an initiator were to broadcast a Chainalysis node it would be labeled with "RPC: IP address"; indicating a Chainalysis broadedcasted transaction, meaning Chainalysis can see the initiators IP address, when they connect.
      - Chainalysis has a Monero Block Explorer, which shows the most recent blocks that have been mined and added to the Monero blockchain. So those blocks have little to no history behind them, (e.g, no spending of the outputs).
      - Older blocks will have much more information than the latest blocks mined.
      - Chainalysis investigated a darknet marketplace and specifically the administrators which were believed to be operating outside of Columbia. They had a list of transactions, which the transactions represented the administrator of the darknet marketplace was swapping from Bitcoin to Monero, using the swap service "MorphToken". Each time the administrator swapped, it represented a transaction hash sending the Monero assosciated with the swap. He then uses the Monero Block Explorer to find more information about the transactions, which in this case returned 70 txids (transaction ids). The data involves, the block height, the date, the node, the coutnry, delay to next, features, txid, name. The Monero explorer already identified that it was a MorphToken swap and that the same transaction features were used.
      - Chainalysis also has a document full of known, or suspected service, or exchange IP addresses. The list conatains Binance, Exodus, Cumberland Mining, SwapLap, FixedFloat, MorphToken, ChangeNow, CoinSwitch.
      - Chainalysis later on finds that the administrator connected to one of their nodes when swapping, as it was labeled with "RPC", meaning that IP observation was fairly simple, as dandelion had no effect. He checks the IP address with ipqualityscore.com, which is a IP address Lookup site, showing if the IP was a VPN/Proxy, which it was.
      - From the outputs section, there was a bunch of IP addresses which show that it was potentially deposits from services. In this case the IP address was "116.202.237.82", an IP address assosciated with ChangeNow. Which where he copies the txid, and Chainalysis would return it to LE, describing how this transaction id might be the user depositing funds into ChangeNow. Which where LE would go to ChangeNow and try to get some KYC information.
      - Coming back to the administrator, the ring CTs are ruled out as he filtered them with the IP address of MorphToken.
      - Looking at the co-spends he sees the same RPC IP address, meaning the same Chainalysis node where the transaction was broadcasted from, tracking the transaction hops, one of the outputs is the spend and the other is the change in balance. Even if it's post-dandelion, Chainalysis still knows that the user connected to one of their nodes and broadcasted a transaction on their node. Going forward one more hop, he sees that in Output 0, he already ruled out all the decoys, and sees that its an RPC ip address, meaning that was the IP address that initiated the transaction, he sees that the IP address seems to be assosciated with Columbia, he checks the IP address on ipqualityscore.com to verify its a clean IP address, which it is.
      - After identifying the IP address of the administrator, they leverage the IP address with other data, to find other information about the administrator (off the Monero blockchain.). Then he uses the Chainalysis tool "reactor" to find that the IP address was used in two centralized entities, which can later be subpoenad if theres any records. In this case, there were records showing the identity of the administrator in Columbia. From a list of MorphToken swap TXIDs to the Monero Blockchain Explorer to finding out that the user connected to a Chainalysis node, to then tracing it forward to other Chainalysis tools to find the identity of the darknet marketplace administrator.
