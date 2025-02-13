/**
 * Create a new account and send the unlocked balance to the account.
 * @param {string} rpcUrl - The RPC URL to connect to.
 * @param {number} accountIndex - The account index to sweep the balance to.
 * @returns {Promise<number>} newAccount - The account the funds have been sweeped to.
 */
export async function churn(
  rpcUrl: string,
  accountIndex: number,
): Promise<number> {
  const res = await fetch(rpcUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '0',
      method: 'create_account',
      params: {},
    }),
  });
  const json = (await res.json()) as any;
  const address = json.result.address as string;
  const newAccount = json.result.account_index as number;

  await fetch(rpcUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '0',
      method: 'sweep_all',
      params: {
        address,
        account_index: accountIndex,
      },
    }),
  });

  console.log('Swept', accountIndex, '->', newAccount);
  return newAccount;
}
