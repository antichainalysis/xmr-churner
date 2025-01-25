import type { BalanceResponse } from './types';
/**
 * Return the wallet's balance.
 * @param {string} rpcUrl - The RPC URL to connect to.
 * @param {number} [accountIndex=0] - The account index to retrieve the balance for (defaults to 0)
 * @returns {Promise<{balance: number, unlockedBalance: number}>} Wallet's balance and unlocked balance.
 */
export async function getBalance(
  rpcUrl: string,
  accountIndex: number = 0,
): Promise<BalanceResponse> {
  const res = await fetch(rpcUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '0',
      method: 'get_balance',
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

/**
 * @param rpcUrl - The RPC URL to connect to.
 * @param accountIndex - The account index to check the balance for (defaults to 0)
 * @param maxAmu - The target amount of unlocked balance to wait for.
 * @returns {Promise<void>}
 */
export async function waitForBalance(
  rpcUrl: string,
  accountIndex: number = 0,
  maxAmu: number,
): Promise<number> {
  return new Promise((res) => {
    const interval = setInterval(async () => {
      const { unlockedBalance } = await getBalance(rpcUrl, accountIndex);

      if (unlockedBalance >= maxAmu) {
        clearInterval(interval);
        res(0);
      }
    }, 5000);
  });
}
