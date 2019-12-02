import _ from "lodash";

class Handler {
    protected asJsonRpc(message: string): any {
        let response = JSON.parse(message);

        if (!_.isSet(response.jsonrpc) || response.jsonrpc !== '2.0') {
            throw new Error('Response should be JSONRPC');
        }

        return response;
    }

    protected toJsonRpc(method: string, parameters: any): string {
        return JSON.stringify({
            jsonrpc: "2.0",
            method,
            params: parameters
        })
    }
}

export default Handler;