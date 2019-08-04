var installer = require('electron-winstaller');

resultPromise = installer.createWindowsInstaller({
    appDirectory: "../binary",
    outputDirectory: "../appd",
    authors: "Mathias Berntsen",
    exe: "homekit.exe",
    version: "0.0.1"
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log("Error! " + e))