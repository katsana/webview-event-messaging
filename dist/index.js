import _ from 'lodash';

let platform = 'unknown';
function isAndroid() {
    return typeof window.Android === "undefined";
}
function isIos() {
    var standalone = window.navigator.standalone;
    var agent = window.navigator.userAgent.toLowerCase();
    var safari = /safari/.test(agent);
    var ios = /iphone|ipod|ipad/.test(agent);
    if (ios) {
        if (!standalone && safari) {
            return true; // browser
        }
        else if (standalone && !safari) {
            return true; // standalone
        }
        else if (!standalone && !safari) {
            return true; // uiwebview
        }
    }
    return false;
}
if (isAndroid()) {
    platform = 'android';
}
else if (isIos()) {
    platform = 'ios';
}
var platform$1 = platform;

class Handler {
    toJson(method, parameters) {
        return JSON.stringify({
            jsonrpc: "2.0",
            method,
            params: parameters
        });
    }
}

class AndroidHandler extends Handler {
    dispatch(method, parameters) {
        return new Promise((resolve, reject) => {
            // @TODO
            resolve('X');
            reject('Y');
        });
    }
}
var android = new AndroidHandler();

class IosHandler extends Handler {
    dispatch(method, parameters) {
        return new Promise((resolve, reject) => {
            // @TODO
            resolve('X');
            reject('Y');
        });
    }
}
var ios = new IosHandler();

let events = {};
class MessageBus {
    on(method, handler) {
        if (!_.isFunction(handler)) {
            throw new Error("Handler is not a function!");
        }
        events[method] = handler;
        return this;
    }
    forget(method) {
        _.unset(events, method);
        return this;
    }
    emit(method, parameters) {
        if (platform$1 === 'android') {
            return android.dispatch(method, parameters);
        }
        else if (platform$1 === 'ios') {
            return ios.dispatch(method, parameters);
        }
        return new Promise((resolve, reject) => {
            reject('Unknown platform');
        });
    }
    handle(message) {
        let payload = JSON.parse(message);
        if (platform$1 === 'android') {
            this.dispatch(android, payload.method, payload.params);
        }
        else if (platform$1 === 'ios') {
            this.dispatch(ios, payload.method, payload.params);
        }
        return this;
    }
    dispatch(instance, method, parameters) {
        if (_.isSet(events[method]) && _.isFunction(events[method])) {
            events[method].apply(instance, parameters);
        }
    }
}

export default MessageBus;
