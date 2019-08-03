var broker = require("mqtt");

var mqtt = broker.connect('mqtt://94.168.100.27')
var IPC

var requestedDevices
var devices = []

mqtt.on('connect', function()
{
    sendMessage("Connected to MQTT broker")
})

mqtt.on('error', function(error)
{
    sendMessage("ERROR: " + error)
})

mqtt.on('message', function(topic, message)
{
    var jsonData = JSON.parse(message);
    if (topic === "homebridge/from/response")
    {
        // Get/Update device list
        if (requestedDevices === true) {
            devices = []

            requestedDevices = false

            var index = 0
            var ids = Object.keys(jsonData)
            ids.forEach(function(element) {
                var device = jsonData[element];
                var services = device.services;
                var characteristics = device.characteristics;

                var name = Object.keys(services)
                var type = services[name]
                var state = characteristics[name]["On"]

                var deviceObject = {}
                deviceObject.name = name[0]
                deviceObject.id = element
                deviceObject.index = index
                deviceObject.type = type
                deviceObject.state = state ? "On" : "Off"
                deviceObject.line = JSON.parse("{\"name\": \"" + element + "\", \"service_name\": \"" + name + "\", \"characteristic\": \"On\", \"value\": " + state + "}")
                deviceObject.turnOn = function() {
                    var obj = this.line
                    obj.value = true
                    var str = JSON.stringify(obj)

                    mqtt.publish("homebridge/to/set", str)
                    mqtt.publish("homebridge/from/set", str)
                }

                deviceObject.turnOff = function() {
                    var obj = this.line
                    obj.value = false
                    var str = JSON.stringify(obj)

                    mqtt.publish("homebridge/to/set", str)
                    mqtt.publish("homebridge/from/set", str)
                }

                devices.push(deviceObject)
                index = index + 1;
            })
            sendEvent("device_list")
        }
    } else {
        sendMessage("MESSAGE: " + message)
    }
})

function RequestDevices()
{

    requestedDevices = true
    publish("homebridge/to/get", "{\"name\": \"*\"}")
}

function GetDevices()
{
    return devices
}

function init()
{
    RequestDevices()
}

function HQTT(webContents) {
    IPC = webContents;
}

HQTT.prototype.constructor = HQTT;

function sendMessage(message)
{
    IPC.sendMessage("HQTT", message)
}

function sendEvent(message)
{
    //console.log("HQTT-Event: " + message)
    IPC.sendEvent(message)
}

function publish(topic, message)
{
    mqtt.publish(topic, message);
}

function Toggle(id, state)
{
    if (typeof state !== 'boolean') return

    for (let device of devices)
    {
        if (device.index == id || device.name == id)
        {
            if (state) {
                device.turnOn()
            } else {
                device.turnOff()
            }
            break;
        }
    }
}

function subscribe(topic)
{
    if (mqtt.connected) {
        sendMessage("connected")
    } else {
        sendMessage("not connected")
    }
    sendMessage("Attempting to subscribe to '" + topic + "'")
    mqtt.subscribe(topic, function(err)
    {
        if (!err)
        {
            sendMessage("Subscribed to '" + topic + "'")
        }
    })
}

function shutdown()
{
    //sendMessage("Disconnecting from MQTT broker")
    mqtt.end();
}

HQTT.prototype.subscribe = subscribe
HQTT.prototype.publish = publish
HQTT.prototype.shutdown = shutdown
HQTT.prototype.init = init

HQTT.prototype.Toggle = Toggle
HQTT.prototype.RequestDevices = RequestDevices
HQTT.prototype.GetDevices = GetDevices

module.exports = HQTT