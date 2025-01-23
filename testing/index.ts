const rpcUrl = "http://127.0.0.1:18082/json_rpc";

const amuRange: [number, number] = [1e12 * 160, 1e12 * 200];
const churnRange: [number, number] = [3, 7]; // inclusive, exclusive
const delayRange: [number, number] = [30 * 60 * 1000, 60 * 60 * 1000];

function randomRange(range: [number, number]) {
  return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
}

async function getBalance(accountIndex = 0) {
  const res = await fetch(rpcUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "0",
      method: "get_balance",
      params: {
        account_index: accountIndex,
      },
    }),
  });
  const json = (await res.json()) as any;
  return {
    balance: json.result.balance as number,
    unlockedBalance: json.result.unlocked_balance as number,
  };
}

const waitForBalance = (accountIndex = 0) =>
  new Promise((res) => {
    const interval = setInterval(async () => {
      const { unlockedBalance } = await getBalance(accountIndex);
      if (unlockedBalance >= amuRange[1]) {
        clearInterval(interval);
        res(0);
      }
    }, 5000);
  });

async function churn(accountIndex: number) {
  const res = await fetch(rpcUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "0",
      method: "create_account",
      params: {},
    }),
  });
  const json = (await res.json()) as any;
  const address = json.result.address as string;
  const newAccount = json.result.account_index as number;

  await fetch(rpcUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "0",
      method: "sweep_all",
      params: {
        address,
        account_index: accountIndex,
      },
    }),
  });

  console.log("Swept", accountIndex, "->", newAccount);

  return newAccount;
}

const randomDelay = () =>
  new Promise((r) => {
    const ms = randomRange(delayRange);
    console.log("Waiting", Math.floor(ms / (60 * 1000)), "minutes");
    setTimeout(r, ms);
  });

while (true) {
  const { balance, unlockedBalance } = await getBalance();
  console.log("Balance:", balance);
  console.log("Unlocked:", unlockedBalance);
  if (balance < amuRange[1]) {
    break;
  }
  if (unlockedBalance < amuRange[1]) {
    console.log("Waiting for funds to unlock...");
    await waitForBalance();
    console.log("Funds unlocked");
  }

  const res = await fetch(rpcUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "0",
      method: "create_account",
      params: {},
    }),
  });
  const json = (await res.json()) as any;
  const address = json.result.address as string;

  console.log("Created new account with address", address);

  const amu = randomRange(amuRange);

  console.log("Sending", amu / 1e12, "XMR to", address);

  await fetch(rpcUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "0",
      method: "transfer",
      params: {
        destinations: [
          {
            amount: amu,
            address,
          },
        ],
      },
    }),
  });

  console.log("Transaction sent to RPC");
}

console.log("Finished distributing (out of funds)");

await randomDelay();

console.log("Starting churn");

const res = await fetch(rpcUrl, {
  headers: {
    "Content-Type": "application/json",
  },
  method: "POST",
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "0",
    method: "get_accounts",
    params: {},
  }),
});
const json = (await res.json()) as any;
const accounts = json.result.subaddress_accounts as {
  account_index: number;
  balance: number;
  base_address: string;
  unlocked_balance: number;
}[];

const accountsToChurn = accounts
  .filter((acc) => acc.balance)
  .map((acc) => ({
    ...acc,
    iters: randomRange(churnRange),
  }));

for (let i = 0; i < churnRange[1]; i++) {
  for (const account of accountsToChurn) {
    if (i >= account.iters) continue;
    console.log(
      "Doing churn %d/%d for account index %d",
      i + 1,
      account.iters,
      account.account_index
    );
    const oldIndex = account.account_index;
    account.account_index = await churn(oldIndex);
    await randomDelay();
  }
}

console.log("Finished all churns");
