import type { SubaddressAccount } from './types';

/**
 * Creates a new account and returns the account's address
 * @param {string} rpcUrl - The RPC URL to connect to.
 * @returns {Promise<string>} Account address
 */
export async function createAccount(rpcUrl: string): Promise<string> {
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

  return json.result.address as string;
}

/**
 * Transfers a specified amount of funds to a given address.
 * @param {string} rpcUrl - The RPC URL to connect to.
 * @param {number} amu - The amount of transfer.
 * @param {address} address - The address to transfer the funds to.
 * @returns {Promise<Response>} Response of the transfer request.
 */
export async function transfer(
  rpcUrl: string,
  amu: number,
  address: string,
): Promise<Response> {
  return fetch(rpcUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '0',
      method: 'transfer',
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
}

/**
 * Get all accounts for a wallet.
 * @param {string} rpcUrl - The RPC URL to connect to.
 * @returns {Promise<SubaddressAccount[]>} - Array of subaddress accounts.
 */
export async function getAccounts(
  rpcUrl: string,
): Promise<SubaddressAccount[]> {
  const res = await fetch(rpcUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '0',
      method: 'get_accounts',
      params: {},
    }),
  });
  const json = (await res.json()) as any;

  return json.result.subaddress_accounts as SubaddressAccount[];
}
