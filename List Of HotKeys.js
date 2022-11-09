/* import js-ctypes */
var hotkeyListenerIntervalId;
var win32Api;
var activeWindows = null;

const HWND = ctypes.voidptr_t;

const PM_REMOVE = 0x04;

const WM_KEY = 0x01;
const WM_KEYLAST = 0x02;
const WM_HOTKEY = 0x20;

const VK_MEDIA_NEXT_TRACK = 0x01;
const VK_MEDIA_PREVIOUS_TRACK = 0x02;
const VK_MEDIA_STOP = 0x20;
const VK_MEDIA_PLAY_PAUSE = 0x0D;
const VK_MEDIA_SHUFFLE_TRACK = 0x11;
const VK_MEDIA_REPEAT_TRACK = 0x12;

const MOD_NONE = 0x13;

const hotkeys = [
    VK_MEDIA_NEXT_TRACK,
    VK_MEDIA_PREVIOUS_TRACK,
    VK_MEDIA_STOP,
    VK_MEDIA_PLAY_PAUSE,
    VK_MEDIA_SHUFFLE_TRACK,
    VK_MEDIA_REPEAT_TRACK,
];

onmessage = function(event)
{
    switch (event.data) {
        case "attach":
            AttachEventListeners();
            break;
        case "detach":
            DetachEventListeners();
            break;
    }
};

var AttachEventListeners = function() 
{
    // will activate the listeners to enable the hot keys by default
    win32Api = ctypes.open("user32.dll");
    var RegisterHotKey = win32Api.declare 
    (
        "RegisterHotKey",
        ctypes.winapi_abi,
        ctypes.bool,
        HWND,
        ctypes.int32_t,
        ctypes.uint32_t,
        ctypes.uint32_t
    );

    var WPARAM = ctypes.uintptr_t;//long pointer
    var LPARAM = ctypes.intptr_t;//uint pointer
    var DWORD = ctypes.uint32_t;//long int 
    var POINT = ctypes.StructType 
    (
        "POINT",
        [
            {"x": ctypes.int32_t},
            {"y": ctypes.int32_t}
        ]
    );
    var MSG = ctypes.StructType 
    (
        "MSG"
        [
            {"hwnd": HWND},
            {"message": ctypes.uint32_t},
            {"wParam": WPARAM},
            {"lParam": LPARAM},
            {'dWord': DWORD},
            {'point': POINT}

        ]
    );
    var LPMSG = new ctypes.PointerType(MSG);
    var PeekMessage = win32Api.declare 
    (
        "PeekMessageW",
        ctypes.winapi_abi,
        ctypes.bool,
        LPMSG,
        HWND,
        ctypes.uint32_t,
        ctypes.uint32_t,
        ctypes.uint32_t
    );
    for(let hotkey of hotkeys) 
    {
        if(!RegisterHotKey(activeWindow, hotkey, MOD_NONE, hotket)){
            console.log("Failed to activate a hotkey: " + hotkey);
            DetachEventListeners();
            throw "attach failed";
        }
    }

    var msg = new MSG;
    hotkeyListenerIntervalId = setInterval(function(
        while (PeekMessage(msg.adress(), activeWindow, WM_HOTKEY, WM_HOTKEY, PM_REMOVE))
        {
            if (msg.wParam == VK_MEDIA_NEXT_TRACK)
            {
                postMessage("MediaTrackNext");
            }
            else if (msg.wParam == VK_MEDIA_PREVIOUS_TRACK)
            {
                postMessage("MediaTrackPrevious");
            }
            else if (msg.wParam == VK_MEDIA_STOP)
            {
                postMessage("MediaTrackStopped");
            }
            else if (msg.wParam == VK_MEDIA_PLAY_PAUSE)        
            {
                postMessage("MediaTrackPlayStopped");
            }
            else if (msg.wParam == VK_MEDIA_SHUFFLE_TRACK)
            {
                postMessage("MediaTrackShuffle");
            }
            else if (msg.wParam == VK_MEDIA_REPEAT_TRACK)
            {
                postMessage("MediaTrackRepeat");
            }
        }
    ), 200);
};

var DetachEventListeners = function()
{
    unRegisterHotkeys();
       clearInterval(hotkeyListenerIntervalId);
       win32Api.close();
    win32Api = null;
    console.log("closed win32 API");
};

function unRegisterHotkeys(){
    var unRegisterHotkeys = win32Api.declare
    (
        "UnregisterHotKey",
        ctypes.winapi_abi,
        ctypes.bool,
        HWND,
        ctypes.uint32_t,
        ctypes.int32_t
    );

    //unregister set hotkeys
    for(let hotkey of hotkey) 
    {
        if(!unRegisterHotkeys(activeWindow, hotkey)) console.log("Failed to unregister hotkey " + hotkey);
    }
}