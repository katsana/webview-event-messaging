import _ from "lodash";
import platform from "./platform";
import android from "./handlers/android";
import ios from "./handlers/ios";

let events: any = {};

class MessageBus {
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
        if (platform === 'android') {
            return android.dispatch(method, parameters);
        } else if (platform === 'ios') {
            return ios.dispatch(method, parameters);
        }

        return new Promise((resolve, reject) => {
            reject('Unknown platform');
        });
    }

    handle(message: string): this {
        let payload = JSON.parse(message);

        if (platform === 'android') {
            this.dispatch(android, payload.method, payload.params);
        } else if (platform === 'ios') {
            this.dispatch(ios, payload.method, payload.params);
        }

        return this;
    }

    private dispatch(instance: any, method: string, parameters: any) {
        if (_.isSet(events[method]) && _.isFunction(events[method])) {
            events[method].apply(instance, parameters);
        }
    }
}

export default MessageBus;