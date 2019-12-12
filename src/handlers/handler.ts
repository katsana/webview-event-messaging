import _ from "lodash";

let id: number = 1;

class Handler {
    asJsonRpcResult(message: string): any {
        let response = JSON.parse(message);

        if (typeof response.jsonrpc === 'string' || response.jsonrpc !== '2.0') {
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
}

export default Handler;