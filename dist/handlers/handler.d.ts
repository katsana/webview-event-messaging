declare abstract class Handler {
    instance: any;
    bindTo(instance: any): this;
    dispatch(method: string, parameters: any): Promise<unknown>;
    asJsonRpcResult(message: string): any;
    toJsonRpc(method: string, parameters: any): any;
    abstract mounted(): any;
}
export default Handler;
//# sourceMappingURL=handler.d.ts.map