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
