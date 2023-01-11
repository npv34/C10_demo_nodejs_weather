const http = require('http');
const fs = require('fs');
const {getWeather} = require("./_handler");

const server = http.createServer(async (req, res) => {
    let temp = await getWeather('hanoi')
    let html = fs.readFileSync('index.html','utf8');
    html = html.replace('{temp}', temp.toString())
    res.write(html);
    res.end();
})

server.listen(8080)
