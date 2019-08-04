const fs = require('fs');
const path = require('path');

let STORAGE_FOLDER = "Home_AppStorage"
let DEFAULT_DIRECTORY = path.join(process.env.appdata, "..\\Local", STORAGE_FOLDER)

var FileIO;
var IPC;

function log(message)
{
    IPC.sendMessage("FileIO", message)
}
print = log

function FileIO(webContents) {
    IPC = webContents;
    log("up and running");
}


async function fileExists(filename)
{
    return new Promise(resolve => {
        let dir = path.join(DEFAULT_DIRECTORY, filename);

        fs.exists(dir, (exists) => {
            if (exists === true)
                resolve(dir)
            else
                resolve(false)
        })
    });
}

async function readConfig()
{
    if (!fs.existsSync(DEFAULT_DIRECTORY))
    {
        log("Storage directory did not exist, creating it")
        fs.mkdirSync(DEFAULT_DIRECTORY)
    }

    // Default config
    var config = {}
    config.theme = "grad_blue"
    config.ip = "192.168.100.27"

    var exists = false
    await fileExists("config.json")
    .then((data) => {
        exists = data
    })

    if (exists == false)
    {
        let data = JSON.stringify(config)
        fs.writeFileSync(path.join(DEFAULT_DIRECTORY, "config.json"), data)
    } else {
        let data = fs.readFileSync(exists);
        config = JSON.parse(data);
    }

    return config
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
FileIO.prototype.readConfig = readConfig
module.exports = FileIO