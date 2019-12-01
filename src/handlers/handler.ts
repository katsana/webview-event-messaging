class Handler {
    protected toJson(method: string, parameters: any): string {
        return JSON.stringify({
            jsonrpc: "2.0",
            method,
            params: parameters
        })
    }
}

export default Handler;