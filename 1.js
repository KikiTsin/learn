import { EventEmitter } from 'events';
import http from 'http';
import crypto from 'crypto';

function hashKey (key) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    return sha1.digest('base64')
}

class myWebSocket extends EventEmitter {
    constructor (options) {
        super(options);

        const server = http.createServer();

        server.listen(options.port || 8080);

        server.on('upgrade', (req, socket) => {
            this.socket = socket;

            socket.setKeepAlive(true);

            const resHeaders = [
                'HTTP/1.1 101 Switching Protocols',
                'Upgrade: websocket',
                'Connection: Upgrade',
                'Sec-WebSocket-accept' + hashKey(req.headers['sec-websocket-ket']),
                '',
                ''
            ].join('\r\n');

            socket.write(resHeaders);

            socket.on('data', (data) => {
                console.log('data...', data)
            });

            socket.on('close', (error) => {
                console.log('close error', error)
            })
        })
    }
}

const wsCase = new myWebSocket({ 
    port: 8080
})

wsCase.on('data', function (data) {
    console.log('ws receive data', data)
})

wsCase.on('close', (code, reason) => {
    console.log(`close code ${code}`, reason)
})