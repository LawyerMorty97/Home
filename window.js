var {desktopCapturer, screen, shell, ipcRenderer, remote} = require("electron");
var app = remote.require("./app.js");

var maximized = true; // Max/Min Window State

function winHandle(query) {
    var currentWindow = remote.BrowserWindow.getFocusedWindow();
    
    // Buttons
    var maxButton = document.getElementById("maxSVG");
    var fitButton = document.getElementById("fitSVG");

    if (query === "maximize") {
        if (maximized) {
            currentWindow.maximize();
            maxButton.classList.add("hidden");
            fitButton.classList.remove("hidden");
        } else {
            currentWindow.unmaximize();
            currentWindow.center();

            maxButton.classList.remove("hidden");
            fitButton.classList.add("hidden");
        }
        maximized = !maximized;
    } else if (query === "minimize") {
        currentWindow.minimize();
    } else if (query === "close") {
        ipcRenderer.send("event", "quit");
    } else if (query === "opendebug") {
        remote.BrowserWindow.getFocusedWindow().toggleDevTools();
    }
}

function isEmpty(content) { return !content.replace(/^\s+/g, ''); }

function isURL(str) {
    var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
      '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
      '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
      '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
      '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
      '(\#[-a-z\d_]*)?$','i'); // fragment locater
    if(!pattern.test(str)) {
      alert("Please enter a valid URL.");
      return false;
    } else {
      return true;
    }
  }

function handleEvent(event) {
    if (event === "setupLinkParser") {
        var linkbox = document.getElementById("linkinput");
        
        linkbox.focus();
        linkbox.addEventListener("keyup", (event) => {
            event.preventDefault();
            if (event.keyCode === 13) {
                if (linkbox.value === "" || isEmpty(linkbox.value)) return;
                if (!isURL()) return;

                ipcRenderer.send("message", "Link: " + linkbox.value);
                linkbox.value = "";
            }
        })
    }
}

/*ipcRenderer.on("message", (event, arg) => {
    console.log("Message: " + arg);
});

function sendEvent(eventName) {
    ipcRenderer.send("event", eventName);
}

ipcRenderer.on("action", (event, arg) => {
    if (arg == "move") {

    }
});

console.log("window.js");*/

//ipcRenderer.send('async', "TEST");
ipcRenderer.send("message", "Hello backend");
ipcRenderer.send("event", "AppStart");

/*
ipcRenderer.on('async-reply', (event, arg) => {
    console.log(arg);

    let mainValue = ipcRenderer.sendSync('sync', 3);
    console.log(mainValue);
});

ipcRenderer.on('ping', (event, arg) => {
    console.log(arg);
});
*/
ipcRenderer.on('event', (event, arg) => {
    console.log(`Event Call: ${arg}`);

    handleEvent(arg);
});

ipcRenderer.on('message', (event, arg) => {
    console.log("Backend: " + arg);
});