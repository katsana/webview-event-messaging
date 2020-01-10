import Handler from "./handlers/handler";
declare global {
    interface Window {
        webkit: any;
        Android: any;
        onMessageReceive: Function;
    }
    interface Navigator {
        userAgent: string;
        standalone: boolean;
    }
}
declare class MessageBus {
    constructor();
    handler(): Handler;
    platform(): string;
    on(method: string, handler: any): this;
    forget(method: string): this;
    emit(method: string, parameters: any): Promise<unknown>;
    rpc(message: string): this;
    handle(message: string): this;
    private dispatch;
}
export default MessageBus;
//# sourceMappingURL=message-bus.d.ts.map