export async function createAccount(rpcUrl: string) {
    const res = await fetch(rpcUrl, {
        headers: {
            "Content-Type": "application/json"
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

    return json.result.address as string;
}

export async function transfer(rpcUrl: string, amu: number, address: string) {
    return fetch(rpcUrl, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "0",
            method: "transfer",
            params: {
                destinations: [{
                    amount: amu,
                    address
                }],
            },
        }),
    });
}

export async function getAccounts(rpcUrl: string) {
    const res = await fetch(rpcUrl, {
        headers: {
            "Content-Type": "application/json"
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

    return json.result.subaddress_accounts as {
        account_index: number;
        balance: number;
        base_address: string;
        unlocked_balance: number;
    }[];
}
