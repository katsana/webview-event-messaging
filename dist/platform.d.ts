declare let platform: string;
declare global {
    interface Window {
        Android: any;
    }
    interface Navigator {
        userAgent: string;
        standalone: boolean;
    }
}
export default platform;
//# sourceMappingURL=platform.d.ts.map