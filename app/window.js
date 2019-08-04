var {desktopCapturer, shell, ipcRenderer, remote} = require("electron")
var app = remote.require("./app.js")

var maximized = true; // Max/Min Window State

var devices = []

function winHandle(query) {
    var currentWindow = remote.BrowserWindow.getFocusedWindow();
    
    // Buttons
    var maxButton = document.getElementById("maxSVG");
    var fitButton = document.getElementById("fitSVG");

    if (query === "maximize") {
        if (maximized) {
            currentWindow.maximize();
        } else {
            currentWindow.unmaximize();
            currentWindow.center();
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
    if (type == "window_theme")
    {
        document.body.classList.remove("grad_blue")
        document.body.classList.add(data)
    }

    if (type === "homekit_device_update") {
        var name = data[1]
        var id = data[0]
        var state = data[2]

        var div = document.getElementById(id)
        var stateElem = div.querySelector("#state")

        var icon_on_Elem = div.querySelector("#iconOn")
        var icon_off_Elem = div.querySelector("#iconOff")

        if (div !== null)
        {
            if (state === true)
            {
                div.classList.add("on")

                icon_on_Elem.classList.remove("invisible")
                icon_off_Elem.classList.add("invisible")

                stateElem.innerText = "On"
                //iconElem.src = "../assets/states/switch_on.png"
            } else {
                div.classList.remove("on")
                
                icon_on_Elem.classList.add("invisible")
                icon_off_Elem.classList.remove("invisible")

                stateElem.innerText = "Off"
                //iconElem.src = "../assets/states/switch_off.png"
            }
        }
    }

    if (type === "homekit_devices") {
        devices = data

        const deviceContainer = document.getElementById("container");
        for (let device of devices)
        {
            device.boolState = device.state === "On" ? true : false;

            device.turnOn = () => {
                ipcRenderer.send("event", "hOn", device.name)
            }

            device.turnOff = () => {
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

                if (new_state) {
                    device.turnOn()
                } else {
                    device.turnOff()
                }
            }

            const imgOn = document.createElement('img')
            imgOn.id = "iconOn"
            imgOn.src = "../assets/states/switch_on.png"
            el.appendChild(imgOn)

            const imgOff = document.createElement('img')
            imgOff.id = "iconOff"
            imgOff.src = "../assets/states/switch_off.png"
            el.appendChild(imgOff)

            if (device.boolState)
            {
                imgOff.classList.add("invisible")
            } else {
                imgOn.classList.add("invisible")
            }

            const name = document.createElement('a')
            name.id = "title"
            name.innerHTML = device.name

            if (device.name.length >= 17) {
                name.style.top = 47
            } else {
                name.style.top = 60
            }
            el.appendChild(name)

            const state = document.createElement('a')
            state.id = "state"
            state.innerHTML = device.state
            el.appendChild(state)

            deviceContainer.appendChild(el)
        }
    }
})