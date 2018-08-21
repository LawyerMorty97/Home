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

    const ChildProcess = require("child-process");

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

var uuid = null;
var frontend = null;

function initModules() {
    uuid = new UUID();
    frontend = new Frontend();
}