export async function churn(rpcUrl: string, accountIndex: number) {
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
    const address = json.result.address as string;
    const newAccount = json.result.account_index as number;

    await fetch(rpcUrl, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "0",
            method: "sweep_all",
            params: {
                address,
                accountIndex: accountIndex
            },
        }),
    });

    console.log("Swept", accountIndex, "->", newAccount);

    return newAccount;
}
