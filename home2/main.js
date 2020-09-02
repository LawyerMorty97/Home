const {app, BrowserWindow} = require('electron');
const path = require('path');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 1024,
        minHeight: 768,

        frame: false,
        center: true,
        title: "Home",
        scrollBounce: true,

        webPreferences: {
            nodeIntegration: true
            //preload: path.join(__dirname, 'preload.js')
        }
    })

    //mainWindow.loadFile('index.html');
    mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        /* macOS Compatibility:
            Common to re-create a window in the app when the dock icon
            is clicked and there are no other windows open.
        */
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    })
})

app.on("window-all-closed", () => {

    // Quit the application, if not on macOS
    if (process.platform !== 'darwin')
        app.quit();
});