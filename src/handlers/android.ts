import Handler from "./handler";

class AndroidHandler extends Handler {
    dispatch(method: string, parameters: any) {
        return new Promise((resolve, reject) => {
            // @TODO
            resolve('X');
            reject('Y');
        });
    }
}

export default new AndroidHandler();