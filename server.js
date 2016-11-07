var http = require('http');
var fs = require('fs');
var chat = require('./chat');

http.createServer(function (req, res) {
    switch (req.url){
        case '/':
            sendFile('index.html', res);
            break;
        case '/subscribe':
            chat.subsribe(req, res);
            break;
        case '/publish':
            var body = "";
            req
                .on('readable', function () {
                    body += req.read();
                    console.log('body!!!:',body);

                    if(body.length > 1e4){
                        res.statusCode = 412;
                        res.end('Your message is too big');
                    }
                })
                .on('end', function () {
                    try {
                        console.log('typeof body',typeof body);
                        body = JSON.parse(body);
                    } catch (err){
                        res.statusCode = 400;
                        res.end('Bad request!!');
                        return;
                    }

                    chat.publish(body);
                    res.end('ok');
                });
            break;

        default:
            res.statusCode = 404;
            res.end('Not found url');
    }
}).listen(3000);

function sendFile(fileName, res) {
    var fileStream = fs.createReadStream(fileName);
    fileStream.on('error', function () {
        res.statusCode = 500;
        res.end('Server error');

    }).pipe(res);
}
