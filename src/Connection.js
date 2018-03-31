const debug = require('./utility/debug')(__filename);
const dgram = require('dgram');

module.exports = class Connection {

    constructor(port, handler){
        this._port = port;
        this._handler = handler;
        this.open();
    }

    send(message, destination) {
        if(destination === 0){
            debug.error('oops');
        }
        this._socket.send(JSON.stringify(message), destination, 'localhost', (e) => {
            if(e){
                debug.error(`Error sending to port ${destination}`, e);
                this._socket.close();
            }
        })
    }

    set callback(handler){
        this._handler = handler;
    }

    broadcast (message, list){
        for (const node of list){
            if (node !== this._port){
                this.send(message, node);
            }
        }
    }

    close(){
        this._socket.close();
        this._socket = null;
    }

    open(){
        this._socket = dgram.createSocket('udp4')

            .on('error', (err) => {
                debug.error(`socket error:\n${err.stack}`);
                this._socket.close();
            })

            .on('message', (msg, rinfo) => {
                let m;
                try{
                    m = JSON.parse(msg.toString())
                }
                catch(e){
                    debug.error(`Error parsing JSON`);
                }
                if(m) this._handler(m);
            })

            .on('listening', () => {
                const address = this._socket.address();
                debug.log(`UDP socket listening on ${address.address}:${address.port}`);
            })

            .bind(this._port);
    }
};