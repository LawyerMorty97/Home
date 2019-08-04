const fs = require('fs')
const path = require('path')
const child = require('child_process')

const folder = "Home_AppStorage"
const appdata = path.join(process.env.appdata, "..\\Local", folder)

function log(content)
{
    console.log(content)
}

function getConfig()
{
    let file = "config.json"
    let filename = path.join(appdata, file)

    // Check that the directory exists
    if (!fs.existsSync(appdata))
    {
        fs.mkdirSync(appdata)
    }

    var endData = null
    if (!fs.existsSync(filename))
    {
        var config = {}
        config.theme = "grad_blue"
        config.ip = "127.0.0.1"

        var configJson = JSON.stringify(config);
        fs.writeFileSync(filename, json)

        endData = config
    } else {
        var config = null

        
    }

    return endData
}

function openDirectory(directory)
{
    child.exec('start "" "' + directory + '"')
}

getConfig()