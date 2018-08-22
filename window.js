var {ipcRenderer, remote} = require("electron");
var app = remote.require("./app.js");

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
ipcRenderer.send("message", "window.js message");

ipcRenderer.on('async-reply', (event, arg) => {
    console.log(arg);

    let mainValue = ipcRenderer.sendSync('sync', 3);
    console.log(mainValue);
});

ipcRenderer.on('ping', (event, arg) => {
    console.log(arg);
});

ipcRenderer.on('message', (event, arg) => {
    console.log("Backend: " + arg);
});