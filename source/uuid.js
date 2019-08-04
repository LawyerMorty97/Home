var uuid = require("node-uuid");
var {machineId, machineIdSync} = require("node-machine-id");

function UUID() {

}

UUID.prototype.constructor = UUID;

function generateUUID() {
    var V1 = uuid.v1();
    var V4 = uuid.v4();

    var VS1 = V1.split("-");
    var VS4 = V4.split("-");

    var D1 = VS1[0] + "-" + VS1[2]; // 1 & 3
    var D2 = VS4[1] + "-" + VS4[3]; // 2 & 4

    var finalID = D1 + "-" + D2;

    return finalID;
}

function getMachineID() {
    var id = machineIdSync();

    return id;
}

UUID.prototype.generateUUID = generateUUID;
UUID.prototype.getMachineID = getMachineID;
module.exports = UUID;