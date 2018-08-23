var {desktopCapturer, screen, shell, ipcRenderer, remote} = require("electron");
var app = remote.require("./app.js");

var maximized = true; // Max/Min Window State

function winHandle(query) {
    var currentWindow = remote.BrowserWindow.getFocusedWindow();
    
    // Buttons
    var maxButton = document.getElementById("maxSVG");
    var fitButton = document.getElementById("fitSVG");

    if (query === "maximize") {
        if (maximized) {
            currentWindow.maximize();
            maxButton.classList.add("hidden");
            fitButton.classList.remove("hidden");
        } else {
            currentWindow.unmaximize();
            currentWindow.center();

            maxButton.classList.remove("hidden");
            fitButton.classList.add("hidden");
        }
        maximized = !maximized;
    } else if (query === "minimize") {
        currentWindow.minimize();
    } else if (query === "close") {
        ipcRenderer.send("event", "quit");
    } else if (query === "opendebug") {
        remote.BrowserWindow.getFocusedWindow().toggleDevTools();
    }
}

function isEmpty(content) { return !content.replace(/^\s+/g, ''); }

function isURL(str) {
    var pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (pattern.test(str)) {
        return true;
    } else {
        return false;
    }
}

function isValidYoutubeURL(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}

function handleEvent(event) {
    if (event === "setupLinkParser") {
        var linkbox = document.getElementById("linkinput");
        
        linkbox.focus();
        linkbox.addEventListener("keyup", (event) => {
            event.preventDefault();
            if (event.keyCode === 13) {
                if (linkbox.value === "" || isEmpty(linkbox.value)) return;
                if (!isURL(linkbox.value) || !isValidYoutubeURL(linkbox.value)) return;

                ipcRenderer.send("message", "Link: " + linkbox.value);
                linkbox.value = "";
            }
        })
    }
}

/*ipcRenderer.on("message", (event, arg) => {
    console.log("Message: " + arg);
});

function sendEvent(eventName) {
    ipcRenderer.send("event", eventName);
}

ipcRenderer.on("action", (event, arg) => {
    if (arg == "move") {

    }
});

console.log("window.js");*/

//ipcRenderer.send('async', "TEST");
ipcRenderer.send("message", "Hello backend");
ipcRenderer.send("event", "AppStart");

/*
ipcRenderer.on('async-reply', (event, arg) => {
    console.log(arg);

    let mainValue = ipcRenderer.sendSync('sync', 3);
    console.log(mainValue);
});

ipcRenderer.on('ping', (event, arg) => {
    console.log(arg);
});
*/
ipcRenderer.on('event', (event, arg) => {
    console.log(`Event Call: ${arg}`);

    handleEvent(arg);
});

ipcRenderer.on('message', (event, arg) => {
    console.log("Backend: " + arg);
});