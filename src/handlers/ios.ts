import Handler from "./handler";

let handlers: any = {};

window.onMessageReceive = (key: any, error: any, message: any) => {
    console.log("Received message from iOS:", key, error, message);

    try {
        let response = handlers[key].asJsonRpcResult(message);

        handlers[key].resolve(response.result);
    } catch (err) {
        handlers[key].reject(err.message);
    }

    delete handlers[key];
};

class IosHandler extends Handler {
    mounted(): this {
        console.log("Mount iOS handler");
        
        return this;
    }

    dispatch(method: string, parameters: any): any {
        let rpc = this.toJsonRpc(method, parameters);
        let key = `m${rpc.id}`;

        return new Promise((resolve, reject) => {
            handlers[key] = {
                resolve, 
                reject,
                asJsonRpcResult: this.asJsonRpcResult
            };

            window.webkit.messageHandlers[this.instance].postMessage(JSON.stringify(rpc));
        });
    }
}

export default new IosHandler();