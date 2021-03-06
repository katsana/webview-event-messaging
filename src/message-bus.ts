import platform from "./platform";
import Handler from "./handlers/handler";
import android from "./handlers/android";
import ios from "./handlers/ios";
import web from "./handlers/web";

let isFunction = require('lodash').isFunction;
let unset = require('lodash').unset;

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
        if (!isFunction(handler)) {
            throw new Error("Handler is not a function!");
        }

        events[method] = handler;

        return this;
    }

    forget(method: string): this {
        unset(events, method);

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

    rpc(message: string): this {
        return this.handle(message);
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
        if (events[method] !== undefined && isFunction(events[method])) {
            console.log('Dispatch event:', method, parameters);

            events[method].apply(instance, parameters);
        }
    }
}

export default MessageBus;