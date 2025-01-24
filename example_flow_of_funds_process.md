# Breakdown of the `moneroc` Process

So, lets just say we have 100 XMR in Account 0 which we will distribute in intervals of 10 XMR:

1. **Account Fund Distribution:**
   * Account 0 has 100 XMR.
   * It will send 10 XMR to each of the newly created accounts (10 new accounts) one by one with a `delayRange` in between each distribution.

Distribution Process:
```
Account 0 - 100 XMR

Account 0 -> Account 1: 10 XMR
wait 30-60 minutes
Account 0 -> Account 2: 10 XMR
wait 30-60 minutes
Account 0 -> Account 3: 10 XMR
wait 30-60 minutes
Account 0 -> Account 4: 10 XMR
wait 30-60 minutes
Account 0 -> Account 5: 10 XMR
wait 30-60 minutes
Account 0 -> Account 6: 10 XMR
wait 30-60 minutes
Account 0 -> Account 7: 10 XMR
wait 30-60 minutes
Account 0 -> Account 8: 10 XMR
wait 30-60 minutes
Account 0 -> Account 9: 10 XMR
wait 30-60 minutes
Account 0 -> Account 10: 10 XMR
```

2. **Churning Process**:
   * After distribution, accounts with non-zero balances (Account 1 to Account 10 in this context/example) are selected for churning.
   * Each account moves its funds to a newly created account (Account 11 to Account 20 in this context/example), with random delays between each transaction.

**NOTE: This is just 1 churn, there are more churns**

Churning Process:
```
Account 1 -> Account 11
wait 30-60 minutes
Account 2 -> Account 12
wait 30-60 minutes
Account 3 -> Account 13
wait 30-60 minutes
Account 4 -> Account 14
wait 30-60 minutes
Account 5 -> Account 15
wait 30-60 minutes
Account 6 -> Account 16
wait 30-60 minutes
Account 7 -> Account 17
wait 30-60 minutes
Account 8 -> Account 18
wait 30-60 minutes
Account 9 -> Account 19
wait 30-60 minutes
Account 10 -> Account 20
```

# Conceptual Visual Representation

```mermaid
classDiagram
    class Churning {
        The main churning process.
        +getAccounts()
        +churn()
        +randomDelay()
    }

    class Account0 {
        XMR = 100
        +getBalance()
        +waitForBalance()
        +createAccount()
        +transfer()
    }

    class Account1 {
        XMR = 10
    }

    class Account2 {
        XMR = 10
    }

    class Account3 {
        XMR = 10
    }

    class Account4 {
        XMR = 10
    }

    class Account5 {
        XMR = 10
    }

    class Account6 {
        XMR = 10
    }

    class Account7 {
        XMR = 10
    }

    class Account8 {
        XMR = 10
    }

    class Account9 {
        XMR = 10
    }

    class Account10 {
        XMR = 10
    }

    class Account11 {
        XMR = 10
    }

    class Account12 {
        XMR = 10
    }

    class Account13 {
        XMR = 10
    }

    class Account14 {
        XMR = 10
    }

    class Account15 {
        XMR = 10
    }

    class Account16 {
        XMR = 10
    }

    class Account17 {
        XMR = 10
    }

    class Account18 {
        XMR = 10
    }

    class Account19 {
        XMR = 10
    }

    class Account20 {
        XMR = 10
    }

    Account0 --> Account1 : distributes XMR
    Account0 --> Account2 : distributes XMR
    Account0 --> Account3 : distributes XMR
    Account0 --> Account4 : distributes XMR
    Account0 --> Account5 : distributes XMR
    Account0 --> Account6 : distributes XMR
    Account0 --> Account7 : distributes XMR
    Account0 --> Account8 : distributes XMR
    Account0 --> Account9 : distributes XMR
    Account0 --> Account10 : distributes XMR

    Account1 --> Churning : undergoes
    Account2 --> Churning : undergoes
    Account3 --> Churning : undergoes
    Account4 --> Churning : undergoes
    Account5 --> Churning : undergoes
    Account6 --> Churning : undergoes
    Account7 --> Churning : undergoes
    Account8 --> Churning : undergoes
    Account9 --> Churning : undergoes
    Account10 --> Churning : undergoes

    Churning --> Account11 : transfers to
    Churning --> Account12 : transfers to
    Churning --> Account13 : transfers to
    Churning --> Account14 : transfers to
    Churning --> Account15 : transfers to
    Churning --> Account16 : transfers to
    Churning --> Account17 : transfers to
    Churning --> Account18 : transfers to
    Churning --> Account19 : transfers to
    Churning --> Account20 : transfers to
``` 
