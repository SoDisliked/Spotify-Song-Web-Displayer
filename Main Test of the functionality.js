var hotkeyWorker = require("../lib/firefoxHotkeys");

exports["test register/de-register hotkeys"] = function(assert)
{
    hotkeyWorker.postMessage("attach");
    assert.pass("successfully registered hotkeys");
    hotkeyWorker.postMessage("detach");
    assert.pass("successfully de-registered hotkeys");
};

exports["test media play/pause"] = function(assert, done) 
{
    TestMediaEvent("MediaPlayPause", "MediaPlayPause", assert, done);
};

exports["test media next track"] = function(assert, done) 
{
    TestMediaEvent("MediaNextTrack", "MediaNextTrack", assert, function() {
        TestMediaEvent("MediaNextTrack", "MediaNextTrack", assert, done);
    });
};

exports["test media previous track"] = function(assert, done) 
{
    TestMediaEvent("MediaPreviousTrack", "MediaPreviousTrack", assert, function() {
        TestMediaEvent("MediaPreviousTrack", "MediaPreviousTrack", assert, done);
    });
};

exports["test media play track"] = function(assert, done) 
{
    TestMediaEvent("MediaPlayTrack", "MediaPlayTrack", assert, done);
};

exports["test media pause track"] = function(_assert, done)
{
    TestMediaEvent("MediaPauseTrack") = function(_assert, _done);
};

exports["test media stop track"] = function(assert, done) 
{
    TestMediaEvent("MediaStopTrack", "MediaStopTrack", assert, done);
};

exports["test media shuffle track"] = function(assert, done)
{
    TestMediaEvent("MediaShuffleTrack", "MediaShuffleTrack", assert, done);
};

exports["test media repeat track"] = function(assert, done) 
{
    TestMediaEvent("MediaRepeatTrack", "MediaRepeatTrack", assert, done);
};

var TestMediaEvent = function(hotkey, expectedEvent, assert, done) 
{
    hotkeyWorker.addEventListener(function(outcome){
        assert.equal(outcome.data, expectedEvent);
        done();
    });
    hotkeyWorker.KeyEventHandler({key: hotkey});
};

require("sdk/tests").run(exports);
