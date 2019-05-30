const fs = require('fs'); // IO Handler
const ytdl = require('ytdl-core'); // Youtube Downloader Library

// Make sure we have a valid timestamp available
if (!Date.now) {
    Date.now = function() {
        return new Date().getTime();
    }
}

var url = "https://www.youtube.com/watch?v=kNUKLMkcVEU";
var options = {
    quality: "highest",
    filter: "audioandvideo",
    format: "mp4"
};

//var fileName = Date.now + "-vid";
//ytdl(url, options).pipe(fs.createWriteStream("downloads/" + fileName + ".mp4"));

var dlFolder = "downloads2/";

function init() {
    // Check if a downloads folder exists
    if (!fs.existsSync(dlFolder)) {
        fs.mkdirSync(dlFolder);
    }
}

function startDownload(ytURL, title) {
    if (fs.existsSync(dlFolder + title + ".mp4")) {
        console.log("Video has already been downloaded. Goodbye.");
        return;
    }

    var video = ytdl(ytURL, options);
    video.pipe(fs.createWriteStream(dlFolder + title + ".mp4"));
    video.on('response', (res) => {
        var totalSize = res.headers['content-length'];
        var dataRead = 0;
        res.on('data', (data) => {
            dataRead += data.length;
            var p = dataRead / totalSize;
            console.log((p * 100).toFixed(2) + "%");
            console.clear();
            /*dataRead += data.length;
            var percent = dataRead / totalSize;
            process.stdout.cursorTo(0);
            process.stdout.clearLine(1);
            process.stdout.write((percent * 100).toFixed(2) + "% ");*/
        });
        res.on('end', () => {
            //process.stdout.write("\n");
        });
    });
}

function run() {
    init();
    console.log("Getting info for URL: " + url);
    ytdl.getInfo(url, (err, info) => {
        if (err) {
            console.log("ERROR: " + err);
            return;
        }
        var author = info.author.name;
        var title = info.title;
        //console.log(info);
        console.log("Downloading '" + title + "' by " + author);
        startDownload(url, Date.now());
    });
}

run();