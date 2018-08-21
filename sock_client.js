var PORT = 2005; // YouTube release year

const io = require("socket.io-client");

var IO;
var IPC;

function Frontend(webContents) {
    IPC = webContents;
}

Frontend.prototype.constructor = Frontend;

//Frontend.prototype
module.exports = Frontend;