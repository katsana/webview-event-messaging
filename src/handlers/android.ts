import Handler from "./handler";

class AndroidHandler extends Handler {
    mounted(): this {
        console.log("Mount Android handler");

        return this;
    }
    dispatch(method: string, parameters: any) {
        let rpc = this.toJsonRpc(method, parameters);
        let message = window.Android.rpcFromWebView(JSON.stringify(rpc));

        return new Promise((resolve, reject) => {
            try {
                let response = this.asJsonRpcResult(message);

                resolve(response.result);
            } catch (err) {
                reject(err.message);
            }
        });
    }
}

export default new AndroidHandler();