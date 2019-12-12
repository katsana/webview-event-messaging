let platform: string = 'web';

function isAndroid(): boolean {
    return typeof window.Android !== "undefined";
}

function isIos(): boolean {
    var standalone = window.navigator.standalone;
    var agent = window.navigator.userAgent.toLowerCase();

    var safari = /safari/.test(agent);
    var ios = /iphone|ipod|ipad/.test(agent);

    if (ios) {
        if (!standalone && safari) {
            return true; // browser
        } else if (standalone && !safari) {
            return true; // standalone
        } else if (!standalone && !safari) {
            return true; // uiwebview
        }
    }


    return false;
}

if (isAndroid()) {
    platform = 'android';
} else if (isIos()) {
    platform = 'ios';
}

export default platform;
