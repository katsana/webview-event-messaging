import Handler from "./handler";

class WebHandler extends Handler {
    mounted(): this {
        console.log("Mount web handler");

        return this;
    }
}

export default new WebHandler();