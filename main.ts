import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getBalance, waitForBalance } from './src/utils/balance';
import { churn } from './src/utils/churn';
import { randomDelay } from './src/utils/delay';
import { createAccount, transfer, getAccounts } from './src/utils/rpc';
import { calculateAmuRange } from './src/utils/calc';
import { randomRange } from './src/utils/random';

interface Args {
  'rpc-url': string;
  churnRange: number[];
}

const argv = yargs(hideBin(process.argv))
  .option('rpc-url', {
    alias: 'rpc',
    type: 'string',
    description: 'The RPC URL to connect to',
    default: 'http://127.0.0.1:18082/json_rpc',
  })
  .option('churnRange', {
    alias: 'cr',
    type: 'array',
    description:
      'Random number of times to perform churn by given range - Churn range, e.g., --churnRange, -cr 3,7',
    default: [3, 7], // inclusive, exclusive
    coerce: (arg) => (Array.isArray(arg) ? arg : arg.split(',').map(Number)), // check if it's an array or string
  })
  .help().argv as Args;

const rpcUrl = argv['rpc-url'];
const churnRange: [number, number] =
  argv.churnRange.length === 2 ? (argv.churnRange as [number, number]) : [3, 7];
const delayRange: [number, number] = [30 * 60 * 1000, 60 * 60 * 1000];

async function main() {
  const { balance: totalBalance } = await getBalance(rpcUrl, 0);

  console.log('Total balance in account 0:', totalBalance / 1e12);

  const [minRange, maxRange] = calculateAmuRange(totalBalance / 1e12).map(
    (value) => value * 1e12,
  );

  console.log('Calculated atomic units range:', [minRange / 1e12, maxRange / 1e12]);

  while (true) {
    const { balance, unlockedBalance } = await getBalance(rpcUrl);

    console.log('Balance:', balance / 1e12);
    console.log('Unlocked:', unlockedBalance / 1e12);

    if (balance < maxRange) break;
    if (unlockedBalance < maxRange) {
      console.log('Waiting for funds to unlock...');
      await waitForBalance(rpcUrl, 0, maxRange);
      console.log('Funds unlocked');
    }

    const address = await createAccount(rpcUrl);
    console.log('Created new account with address:', address);

    const amu = Math.floor(Math.random() * (maxRange - minRange) + minRange);
    console.log('Sending', amu / 1e12, 'XMR to', address);

    await transfer(rpcUrl, amu, address);
    console.log('Transaction sent to RPC');
  }

  console.log('Finished distributing (out of funds)');

  await randomDelay(delayRange);

  console.log('Starting churn');

  const accounts = await getAccounts(rpcUrl);

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
        'Doing churn %d/%d for account index %d',
        i + 1,
        account.iters,
        account.account_index,
      );

      const oldIndex = account.account_index;

      account.account_index = await churn(rpcUrl, oldIndex);
      await randomDelay(delayRange);
    }
  }

  console.log('Finished all churns');
}

main();
