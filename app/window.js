var {desktopCapturer, screen, shell, ipcRenderer, remote} = require("electron")
var app = remote.require("./app.js")

var maximized = true; // Max/Min Window State

var devices = []
var elements = []

function winHandle(query) {
    var currentWindow = remote.BrowserWindow.getFocusedWindow();
    
    // Buttons
    var maxButton = document.getElementById("maxSVG");
    var fitButton = document.getElementById("fitSVG");

    if (query === "maximize") {
        if (maximized) {
            currentWindow.maximize();
            //maxButton.classList.add("hidden");
            //fitButton.classList.remove("hidden");
        } else {
            currentWindow.unmaximize();
            currentWindow.center();

            //maxButton.classList.remove("hidden");
            //fitButton.classList.add("hidden");
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
    var pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (pattern.test(str)) {
        return true;
    } else {
        return false;
    }
}

function isValidYoutubeURL(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}

function handleEvent(event) {
}

ipcRenderer.send("event", "appstart")

ipcRenderer.on('event', (event, arg) => {
    console.log(`Received Event: ${arg}`);

    handleEvent(arg);
})

ipcRenderer.on('message', (event, arg) => {
    console.log("Received Backend Message: " + arg);
})

ipcRenderer.on('data', (event, type, data) => {
    if (type === "homekit_devices") {
        console.log("GOT DEVICES ON CLIENT")
        devices = data

        const deviceContainer = document.getElementById("container");
        for (let device of devices)
        {
            device.boolState = device.state === "On" ? true : false;

            device.turnOn = () => {
                console.log("Turning on " + device.name)
                ipcRenderer.send("event", "hOn", device.name)
            }

            device.turnOff = () => {
                console.log("Turning on " + device.name)
                ipcRenderer.send("event", "hOff", device.name)
            }


            const el = document.createElement('div')
            el.className = "device"
            el.id = device.id

            if (device.boolState) {
                el.className = "device on"
            }

            el.onclick = () => {
                var new_state = !device.boolState
                device.boolState = new_state

                var thisDevice = elements[device.name];

                if (new_state) {
                    device.turnOn()
                    thisDevice.divElem.className = "device on"
                    thisDevice.stateElem.innerText = "On"
                    thisDevice.imgElem.src = "../assets/states/switch_on.png"
                } else {
                    device.turnOff()
                    thisDevice.divElem.className = "device"
                    thisDevice.stateElem.innerText = "Off"
                    thisDevice.imgElem.src = "../assets/states/switch_off.png"
                }
            }

            const img = document.createElement('img')
            img.id = "icon"
            img.src = device.boolState ? "../assets/states/switch_on.png" : "../assets/states/switch_off.png"
            el.appendChild(img)

            const name = document.createElement('a')
            name.id = "title"
            name.innerHTML = device.name

            if (device.name.length >= 9) {
                name.style.top = 47
            }
            el.appendChild(name)

            const state = document.createElement('a')
            state.id = "state"
            state.innerHTML = device.state
            el.appendChild(state)

            elements[device.name] = {}
            elements[device.name].divElem = el;
            elements[device.name].titleElem = name;
            elements[device.name].stateElem = state;
            elements[device.name].imgElem = img;
            /*<img src="../assets/states/switch_on.png" id="icon"/>
                    <a id="title">Test Device</a>
                    <a id="state">On</a>*/

            /*const btnOn = document.createElement('input')
            btnOn.type = "button"
            btnOn.value = "On"
            btnOn.onclick= device.turnOn

            const btnOff = document.createElement('input')
            btnOff.type = "button"
            btnOff.value = "Off"
            btnOff.onclick= device.turnOff

            el.appendChild(btnOn)
            el.appendChild(btnOff)*/
            deviceContainer.appendChild(el)
        }
    }
})