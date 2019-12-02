import _ from 'lodash';

var platform = 'unknown';
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

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var id = 1;
var Handler = /** @class */ (function () {
    function Handler() {
    }
    Handler.prototype.asJsonRpcResult = function (message) {
        var response = JSON.parse(message);
        if (!_.isSet(response.jsonrpc) || response.jsonrpc !== '2.0') {
            throw new Error('Response should be JSONRPC');
        }
        else if (_.isSet(response.error)) {
            throw new Error("[" + response.error.code + "] " + response.error.message);
        }
        return response;
    };
    Handler.prototype.toJsonRpc = function (method, parameters) {
        return {
            jsonrpc: "2.0",
            method: method,
            params: parameters,
            id: id++
        };
    };
    return Handler;
}());

var AndroidHandler = /** @class */ (function (_super) {
    __extends(AndroidHandler, _super);
    function AndroidHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AndroidHandler.prototype.mounted = function () {
        console.log("Mount Android handler");
        return this;
    };
    AndroidHandler.prototype.dispatch = function (method, parameters) {
        var _this = this;
        var rpc = this.toJsonRpc(method, parameters);
        var message = window.Android.rpcFromWebView(JSON.stringify(rpc));
        return new Promise(function (resolve, reject) {
            try {
                var response = _this.asJsonRpcResult(message);
                resolve(response.result);
            }
            catch (err) {
                reject(err.message);
            }
        });
    };
    return AndroidHandler;
}(Handler));
var android = new AndroidHandler();

var handlers = {};
window.onMessageReceive = function (key, error, message) {
    console.log("Received message from iOS:", key, error, message);
    try {
        var response = handlers[key].asJsonRpcResult(message);
        handlers[key].resolve(response.result);
    }
    catch (err) {
        handlers[key].reject(err.message);
    }
    delete handlers[key];
};
var IosHandler = /** @class */ (function (_super) {
    __extends(IosHandler, _super);
    function IosHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IosHandler.prototype.mounted = function () {
        console.log("Mount iOS handler");
        return this;
    };
    IosHandler.prototype.dispatch = function (method, parameters) {
        var _this = this;
        var rpc = this.toJsonRpc(method, parameters);
        var key = "m" + rpc.id;
        return new Promise(function (resolve, reject) {
            handlers[key] = {
                resolve: resolve,
                reject: reject,
                asJsonRpcResult: _this.asJsonRpcResult
            };
            window.webkit.messageHandlers.rpcFromWebView.postMessage(JSON.stringify(rpc));
        });
    };
    return IosHandler;
}(Handler));
var ios = new IosHandler();

var events = {};
var MessageBus = /** @class */ (function () {
    function MessageBus() {
        if (platform$1 === 'android') {
            android.mounted();
        }
        else if (platform$1 === 'ios') {
            ios.mounted();
        }
    }
    MessageBus.prototype.on = function (method, handler) {
        if (!_.isFunction(handler)) {
            throw new Error("Handler is not a function!");
        }
        events[method] = handler;
        return this;
    };
    MessageBus.prototype.forget = function (method) {
        _.unset(events, method);
        return this;
    };
    MessageBus.prototype.emit = function (method, parameters) {
        if (platform$1 === 'unknown') {
            return new Promise(function (resolve, reject) {
                reject('Unknown platform');
            });
        }
        else if (platform$1 === 'android') {
            return android.dispatch(method, parameters);
        }
        if (platform$1 === 'ios') {
            return new Promise(function (resolve, reject) {
                try {
                    var response = ios.dispatch(method, parameters);
                    resolve(response.result);
                }
                catch (err) {
                    reject(err.message);
                }
            });
        }
    };
    MessageBus.prototype.handle = function (message) {
        var payload = JSON.parse(message);
        if (!_.isSet(payload.jsonrpc) || payload.jsonrpc !== '2.0') {
            throw new Error('Request should be JSONRPC');
        }
        if (platform$1 === 'android') {
            this.dispatch(android, payload.method, payload.params);
        }
        else if (platform$1 === 'ios') {
            this.dispatch(ios, payload.method, payload.params);
        }
        return this;
    };
    MessageBus.prototype.dispatch = function (instance, method, parameters) {
        if (_.isSet(events[method]) && _.isFunction(events[method])) {
            console.log('Dispatch event:', method, parameters);
            events[method].apply(instance, parameters);
        }
    };
    return MessageBus;
}());

export default MessageBus;
