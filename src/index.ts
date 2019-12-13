import _ from "lodash";
import platform from "./platform";
import Handler from "./handlers/handler";
import android from "./handlers/android";
import ios from "./handlers/ios";
import web from "./handlers/web";

declare global {
    interface Window {
        webkit: any;
        Android: any;
        onMessageReceive: Function;
    }

    interface Navigator {
        userAgent: string,
        standalone: boolean,
    }
}

let events: any = {};

ios.bindTo('webview:rpc');
android.bindTo(window.Android);

class MessageBus {
    constructor() {
        this.handler().mounted();
    }

    handler(): Handler {
        if (platform === 'android') {
            return android;
        } else if (platform === 'ios') {
            return ios;
        }

        return web;
    }

    platform(): string {
        return platform;
    }

    on(method: string, handler: any): this {
        if (!_.isFunction(handler)) {
            throw new Error("Handler is not a function!");
        }

        events[method] = handler;

        return this;
    }

    forget(method: string): this {
        _.unset(events, method);

        return this;
    }

    emit(method: string, parameters: any) {
        console.log('Emit event:', method, parameters);
        
        if (platform === 'android') {
            return android.dispatch(method, parameters);
        } else if (platform === 'ios') {
            return new Promise((resolve, reject) => {
                try {
                    let response = ios.dispatch(method, parameters);

                    resolve(response.result);
                } catch (err) {
                    reject(err.message);
                }
            });
        }

        return web.dispatch(method, parameters);
    }

    handle(message: string): this {
        let payload = JSON.parse(message);

        if (typeof payload.jsonrpc !== 'string' || payload.jsonrpc !== '2.0') {
            throw new Error('Request should be JSONRPC');
        }

        this.dispatch(this.handler(), payload.method, payload.params);

        return this;
    }

    private dispatch(instance: Handler, method: string, parameters: any) {
        if (events[method] !== undefined && _.isFunction(events[method])) {
            console.log('Dispatch event:', method, parameters);

            events[method].apply(instance, parameters);
        }
    }
}

export default MessageBus;