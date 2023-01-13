const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('qs');
const formidable = require('formidable');

const {getWeather, getTemplate} = require("./_handler");

const server = http.createServer(async (req, res) => {

    let cUrl = url.parse(req.url);
    switch (cUrl.pathname) {
        case '/':
            let temp = await getWeather('hanoi')
            let html = fs.readFileSync('./views/index.html','utf8');
            html = html.replace('{temp}', temp.toString())
            res.write(html);
            res.end();
            break;
        case '/login':

            if (req.method == 'GET') {
                // doc file html login
                let htmlLogin = await getTemplate('./views/login.html');
                // gan data body response
                res.write(htmlLogin)
                //  tra response ve cho client
                res.end();
            } else {
                // b1: lay du lieu tu request
                let dataFormLogin = ''
                req.on('data', chunk => {
                    dataFormLogin += chunk;
                })
                req.on('end', () => {
                    let account = qs.parse(dataFormLogin)
                    if (account.name === 'luan' && account.password === '12345') {
                        res.writeHead(301, {Location: '/users/create'})
                    } else {
                        res.writeHead(301, {Location: '/login'})
                    }
                    res.end()
                })
            }
            break;
        case '/css/style.css':
            let dataCSS = await getTemplate('./public/css/style.css');
            res.writeHead(200, {'Content-type': 'text/css'});
            res.write(dataCSS)
            res.end();
            break;
        case '/js/my.js':
            let dataJS = await getTemplate('./public/js/my.js');
            res.writeHead(200, {'Content-type': 'text/js'});
            res.write(dataJS)
            res.end();
            break;
        case '/users/create':
            if (req.method == 'GET') {
                let dataFormCreate = await getTemplate('./views/users/create.html');
                res.writeHead(200, {'Content-type': 'text/html'});
                res.write(dataFormCreate)
                res.end();
            } else {
                // xu ly form upload
                const form = new formidable.IncomingForm();

                form.parse(req, (err, fields, files) => {
                    if (err) {
                        throw new Error(err.message);
                    }

                    // xu ly upload file

                    let oldFile = files.avatar.filepath;

                    let newFile = './public/upload/' + files.avatar.originalFilename;

                    fs.rename(oldFile, newFile, (err) => {
                        if (err) {
                            throw new Error(err.message);
                        }

                        let user = {
                            name: fields.name,
                            password: fields.password,
                            avatar: newFile
                        }
                        console.log(user)
                        res.end()
                     })
                })

            }

            break;


    }


})

server.listen(8080)
