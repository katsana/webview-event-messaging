import Handler from "./handler";

class AndroidHandler extends Handler {
    mounted(): this {
        console.log("Mount Android handler");

        return this;
    }
}

export default (new AndroidHandler()).bindTo(window.Android);