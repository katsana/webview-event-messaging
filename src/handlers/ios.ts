import Handler from "./handler";

class IosHandler extends Handler {
    dispatch(method: string, parameters: any) {
        return new Promise((resolve, reject) => {
            // @TODO
            resolve('X');
            reject('Y');
        });
    }
}

export default new IosHandler();