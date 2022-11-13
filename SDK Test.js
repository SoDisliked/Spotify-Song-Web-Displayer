if(require("sdk/system").platform == "winnt") {
    var { setTimeout } = require("sdk/timers");
    var tabs = require("sdk/tabs");
    tabs[0].url = "about:blank";

    exports["test register/de-register hotkey"] = function (assert, done) {
        let hotkeyWorker = require("../lib/mk-win.js");
        //add.EventListener();

        new Promise(function(resolve,reject){
            hotkeyWorker.onerror = reject;
            hotkeyWorker.postMessage("attach");
            setTimeout(resolve, 500);
        }).then(function (resolve, reject) {
            hotkeyWorker.onerror = reject;
            assert.pass("successfully registered settled hotkeys");
            hotkeyWorker.postMessage("detach");
            setTimeout(resolve, 500);
        }).then(function(resolve, reject) {
            assert.pass("successfully de-registered hotkeys");
            done();
        }).catch(function(error){
            assert.fail(error);
            done();
        })
    };

    require("sdk/test").run(exports);
}