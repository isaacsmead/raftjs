const dgram = require('dgram');




module.exports = class Connection {

    constructor(port, handler){

        this._socket = dgram.createSocket('udp4')

            .on('error', (err) => {
                console.log(`socket error:\n${err.stack}`);
                this._socket.close();
            })

            .on('message', (msg, rinfo) => {
            handler(msg.toString());
            })

            .on('listening', () => {
            const address = this._socket.address();
            console.log(`UDP socket listening on ${address.address}:${address.port}`);
            })

            .bind(port);

    }

    send(message, destination) {
        this._socket.send(message, destination, 'localhost', (e) => {
            if(e){
                console.error(`Error sending to port ${destination}`, e);
                this._socket.close();
            }
        })
    }
};