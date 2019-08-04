const io = require("./io");

var fio = new io()

async function s()
{
    var result = null;
    await fio.fileExists("test2.json")
    .then((exists) => {
        result = exists
    })

    return result;
}

var json = fio.readJSON("test.json")
.then((data) => {
    console.log("data: " + data.ip)
})