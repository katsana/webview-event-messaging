import Handler from "./handler";

class AndroidHandler extends Handler {
    dispatch(method: string, parameters: any) {
        let message = window.Android.rpcFromWebView(this.toJsonRpc(method, parameters));

        return JSON.parse(message);
    }
}

export default new AndroidHandler();