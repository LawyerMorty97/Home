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
const UUID = require("./uuid");
const Frontend = require("./sock_client");

const appOptions = {
    window: {
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        frame: false,
        center: true,
        title: "LYD",
        show: false,
        scrollBounce: true
    }
};

var uuid = null;
var frontend = null;

var window = null; // Window

function initModules() {
    uuid = new UUID();
    frontend = new Frontend(window.webContents);
}

function instanceCheck() {
    var instanced = app.makeSingleInstance((cmd, dir) => {
        if (window) {
            if (window.isMinimized()) window.restore();
            window.focus();
        }
    });

    if (instanced === true) app.quit();
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

    window = new BrowserWindow(appOptions.window);
    initModules();

    loadHTML("static/index.html");
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

function onWindowCreated() {
    //frontend.send("Window successfully initialized.");
    frontend.sendEvent("setupLinkParser");
}

function quitApp() {
    if (frontend !== null) frontend.shutdown();

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

/*
ipcMain.on('async', (event, arg) => {
    console.log(arg);
    event.sender.send('async-reply', 2);
});

ipcMain.on('sync', (event, arg) => {
    console.log(arg);
    event.returnValue = 4;
    window.webContents.send('ping', 5);
});
*/
ipcMain.on('message', (event, arg) => {
    console.log("Renderer: " + arg);

    // Once we know a 'Hello backend' message have been sent, we know the window has been created
    if (arg === "Hello backend") {
        frontend.send("Hello renderer");
        onWindowCreated();
    }
});

ipcMain.on("event", (event, arg) => {
    if (arg === "quit") {
        quitApp();
    }
    // Send the rendered the event that was called :-)
    console.log("Event Call: " + arg);
    frontend.sendEvent(arg);
});