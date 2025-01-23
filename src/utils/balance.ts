export async function getBalance(rpcUrl: string, accountIndex = 0) {
    const res = await fetch(rpcUrl, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "0",
            method: "get_balance",
            params: { 
                account_index: accountIndex 
            },
        }),
    });
    const json = (await res.json()) as any;
    return {
        balance: json.result.balance as number,
        unlockedBalance: json.result.unlocked_balance as number,
    };
}

export async function waitForBalance(rpcUrl: string, accountIndex = 0, maxAmu: number) {
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
