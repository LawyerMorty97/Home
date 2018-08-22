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

Frontend.prototype.constructor = Frontend;

Frontend.prototype.shutdown = shutdown;
module.exports = Frontend;