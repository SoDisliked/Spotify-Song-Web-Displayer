exports["test initialize hotkeys"] = function(assert)
{
    require("../index");
    assert.pass("hotkeys initialized");
};

exports["disables toggle play"] = function(assert, done)
{
    var tabs = require("sdk/tabs");
    var { data, test } = require("sdk/self");

    //.addEventListener(
    hotkeyWorker.postMessage("attach");
    tabs.on('ready'), function(tab){
        hotkeyWorker.KeyEventHandler({key: "MediaPlayPause"});
    });

    tabs.open({
        url: test.url(pageDomain + ".html"),
        contentScriptFile: [data.url("Finder.js"), data.url(pageDomain + ".html"), data.url(pageDomain + ".html")],
        onMessage: function(data) {
            assert.equal("MediaPlayPause", data);
            done();
        };
    });
};

require("sdk/test").run(exports);