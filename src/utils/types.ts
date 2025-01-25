type BalanceResponse = {
  balance: number;
  unlockedBalance: number;
};

// Each subaddress account contains:
// - an index
// - balance
// - base address
// - unlocked balance
type SubaddressAccount = {
  account_index: number;
  balance: number;
  base_address: string;
  unlocked_balance: number;
};

export type { BalanceResponse, SubaddressAccount };
