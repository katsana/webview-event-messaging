import _ from "lodash";
import platform from "./platform";
import android from "./handlers/android";
import ios from "./handlers/ios";

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

class MessageBus {
    constructor() {
        if (platform === 'android') {
            android.mounted();
        } else if (platform === 'ios') {
            ios.mounted();
        } else {
            console.log('Not mounted to ios or android');
        }
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
        
        if (platform === 'unknown') {
            return new Promise((resolve, reject) => {
                reject('Unknown platform');
            });
        } else if (platform === 'android') {
            return android.dispatch(method, parameters);
        }

        if (platform === 'ios') {
            return new Promise((resolve, reject) => {
                try {
                    let response = ios.dispatch(method, parameters);

                    resolve(response.result);
                } catch (err) {
                    reject(err.message);
                }
            });
        }
    }

    handle(message: string): this {
        let payload = JSON.parse(message);

        if (!_.isSet(payload.jsonrpc) || payload.jsonrpc !== '2.0') {
            throw new Error('Request should be JSONRPC');
        }

        if (platform === 'android') {
            this.dispatch(android, payload.method, payload.params);
        } else if (platform === 'ios') {
            this.dispatch(ios, payload.method, payload.params);
        }

        return this;
    }

    private dispatch(instance: any, method: string, parameters: any) {
        if (_.isSet(events[method]) && _.isFunction(events[method])) {
            console.log('Dispatch event:', method, parameters);

            events[method].apply(instance, parameters);
        }
    }
}

export default MessageBus;