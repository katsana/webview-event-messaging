declare global {
    interface Window {
        Android: any;
    }
    interface Navigator {
        userAgent: string;
        standalone: boolean;
    }
}
declare class MessageBus {
    on(method: string, handler: any): this;
    forget(method: string): this;
    emit(method: string, parameters: any): Promise<unknown>;
    handle(message: string): this;
    private dispatch;
}
export default MessageBus;
//# sourceMappingURL=index.d.ts.map