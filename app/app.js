"use strict";

if (require("electron-squirrel-startup")) return;

const {app, shell, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const url = require("url");
const dialog = require("dialog");

// START: Squirrel Handling
if (handleSquirrel()) return;

function handleSquirrel() {
    if (process.argv.length === 1) return false;

    const ChildProcess = require("child_process");

    const rootDir = path.resolve(process.execPath, "..");
    const rootAppDir = path.resolve(rootDir, "..");
    const updateEXE = path.resolve(path.join(rootAppDir, "Update.exe"));
    const exe = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
        } catch(error) {
            throw error;
        }

        return spawnedProcess;
    }

    const spawnUpdate = function(args) {
        return spawn(updateEXE, args);
    }

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exe]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exe]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-obselete':
            app.quit();
            return true;
    }
}

// END: Squirrel Handling

// START: Application
const IO = require("./io")
const UUID = require("./uuid");
const Frontend = require("./sock_client");
const HQTT = require('./hqtt')

const appOptions = {
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    center: true,
    title: "Homekit - By Mathias Berntsen",
    show: false,
    scrollBounce: true,
    webPreferences:
    {
        nodeIntegration: true
    }
};

var io = null;
var uuid = null;
var frontend = null;
var hqtt = null;

var window = null; // Window

// In charge of class communication
var communicator = {}
communicator.sendMessage = (cat, msg) => {
    console.log(cat + ": " + msg)
    window.webContents.send("message", msg)
}

communicator.sendEventData = (event, data) => {
    if (event === "device_state") {
        window.webContents.send("data", "homekit_device_update", data)
    }
}

communicator.sendEvent = (event) => {
    if (event === "device_list")
    {
        var d = hqtt.GetDevices()
        window.webContents.send("data", "homekit_devices", d)
    }

    window.webContents.send("event", event)
}

function initModules() {
    uuid = new UUID();
    frontend = new Frontend(window.webContents);
    hqtt = new HQTT(communicator);
    io = new IO(communicator);
}

function instanceCheck() {
    const appLock = app.requestSingleInstanceLock()

    if (!appLock)
    {
        app.quit()
    } else {
        if (window)
        {
            if (window.isMinimized()) {
                window.restore()
            }
            window.focus()
        }
    }
}

function loadHTML(fileName) {
    window.loadURL(url.format({
        pathname: path.join(__dirname, fileName),
        protocol: "file:",
        slashes: true
    }));
}

function createWindow() {
    instanceCheck();

    window = new BrowserWindow(appOptions);
    initModules();

    loadHTML("static/homebridge.html");
    window.once("ready-to-show", () => {
        window.show();
    });

    if (process.platform !== 'darwin') {
        window.on("move", () => {
            window.webContents.send("action", "move");
        });
    } else {
        window.on("moved", () => {
            window.webContents.send("action", "move");
        });
    }
}

async function onWindowCreated() {
    var ip = null
    var config = io.readJSON("config.json")
    .then((data) => {
        if (data !== false) {
            ip = data.ip
        }
    })

    await config;

    hqtt.init(ip);
}

function quitApp() {
    if (frontend !== null) frontend.shutdown();
    if (hqtt !== null) hqtt.shutdown();

    app.quit();
}

// Windows & Linux
app.on("ready", () => {
    createWindow();
});

// macOS Dock Init
app.on("activate", () => {
    if (window === null) createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') quitApp();
});

ipcMain.on('message', (event, arg) => {
    console.log("Renderer: " + arg);
});

ipcMain.on("event", (event, arg, state) => {
    if (arg === "appstart") {
        onWindowCreated()
    }

    if (arg === "quit") {
        quitApp()
        return
    }

    if (arg === "device_list")
    {
        var devices = hqtt.GetDevices()
        /*devices.forEach(function(device) {
            device.turnOff()
        })*/
    }

    if (arg === "hOn")
    {
        hqtt.Toggle(state, true)
    }
    if (arg === "hOff") {
        hqtt.Toggle(state, false)
    }

    // Send the rendered the event that was called :-)
    frontend.sendEvent(arg);
});