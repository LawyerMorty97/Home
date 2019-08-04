"use strict";

const {app, shell, BrowserWindow, ipcMain} = require("electron");
const path = require("path");
const url = require("url");
const dialog = require("dialog");

// START: Application
const IO = require("./io")
const UUID = require("./uuid");
const HQTT = require('./hqtt')

const appOptions = {
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    frame: false,
    center: true,
    title: "Home",
    show: false,
    scrollBounce: true,
    webPreferences:
    {
        nodeIntegration: true
    }
};

var io = null;
var uuid = null;
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

    window.webContents.on("devtools-opened", () => {
        window.webContents.closeDevTools();
    })
}

async function onWindowCreated() {
    var theme = "grad_blue"
    var ip = null
    var config = io.readConfig()
    .then((data) => {
        if (data !== false) {
            ip = data.ip
            theme = data.theme
        }
    })

    await config;

    hqtt.init(ip);
    window.webContents.send("data", "window_theme", theme)
}

function quitApp() {
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
    }

    if (arg === "hOn")
    {
        hqtt.Toggle(state, true)
    }
    if (arg === "hOff") {
        hqtt.Toggle(state, false)
    }
});