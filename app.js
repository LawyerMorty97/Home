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
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        frame: true,
        center: true,
        title: "Lightweight Youtube Downloader",
        show: true,
        scrollBounce: true
    }
};

var uuid = null;
var frontend = null;

var window = null; // Window

function initModules() {
    uuid = new UUID();
    frontend = new Frontend(window.webC);
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

function loadHTML(file) {
    window.loadURL(url.format({
        pathname: path.join(__dirname, file),
        protocol: "file:",
        slashes: true
    }));
}

function createWindow() {
    instanceCheck();

    window = new BrowserWindow(appOptions.window);
    initModules();

    loadHTML("home.html");

    window.once("ready-to-show", () => {
        window.show();
        window.webContents.send("debug.message", "ready to show");
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