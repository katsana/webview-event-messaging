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
export {};
//# sourceMappingURL=index.d.ts.map