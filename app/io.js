const fs = require('fs');
const path = require('path');

let DEFAULT_DIRECTORY = "\\data\\";

var FileIO;
var IPC;

function log(message)
{
    IPC.sendMessage("FileIO", message)
}
print = log

function FileIO(webContents) {
    IPC = webContents;
    log("FileIO up and running");
}

async function fileExists(filename)
{
    return new Promise(resolve => {
        let dir = DEFAULT_DIRECTORY + filename;
        let location = process.cwd() + dir;

        fs.exists(location, (exists) => {
            if (exists === true)
                resolve(location)
            else
                resolve(false)
        })
    });
}

async function readJSON(filename)
{
    var location = null
    await fileExists(filename)
    .then((data) => {
        location = data
    })

    if (location == false){
        return location
    }

    let data = fs.readFileSync(location);
    let json = JSON.parse(data);

    return json;
}

FileIO.prototype.constructor = FileIO
FileIO.prototype.fileExists = fileExists
FileIO.prototype.readJSON = readJSON
module.exports = FileIO