let id: number = 1;

abstract class Handler {
    instance: any = null;

    bindTo(instance: any): this {
        this.instance = instance;

        return this;
    }

    dispatch(method: string, parameters: any) {
        let rpc = this.toJsonRpc(method, parameters);
        let message = this.instance.rpcFromWebView(JSON.stringify(rpc));

        return new Promise((resolve, reject) => {
            if (message == null) {
                resolve(message);
            }

            try {
                let response = this.asJsonRpcResult(message);

                resolve(response.result);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    asJsonRpcResult(message: string): any {
        let response = JSON.parse(message);

        if (typeof response.jsonrpc !== 'string' || response.jsonrpc !== '2.0') {
            throw new Error('Response should be JSONRPC');
        } else if (typeof response.error === 'object') {
            throw new Error(`[${response.error.code}] ${response.error.message}`);
        }

        return response;
    }

    toJsonRpc(method: string, parameters: any): any {
        return {
            jsonrpc: "2.0",
            method,
            params: parameters,
            id: id++
        }
    }

    abstract mounted(): any;
}

export default Handler;