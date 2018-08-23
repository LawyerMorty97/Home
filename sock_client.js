var PORT = 2005; // YouTube release year

const io = require("socket.io-client");

var IO;
var IPC;

function Frontend(webContents) {
    IPC = webContents;
    IPC.send("message", "hello world");
    console.log("Backend IPC init");
}

function shutdown() {

}

function send(message) {
    if (message !== "") {
        IPC.send("message", message);
    }
}

function sendEvent(message) {
    if (message !== "") {
        IPC.send("event", message);
    }
}

Frontend.prototype.constructor = Frontend;

Frontend.prototype.send = send;
Frontend.prototype.sendEvent = sendEvent;
Frontend.prototype.shutdown = shutdown;
module.exports = Frontend;