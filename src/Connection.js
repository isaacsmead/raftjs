const debug = require('./utility/debug')(__filename);
const dgram = require('dgram');
const gaussian = require('gaussian');
const settings = require('./Constants').Settings;
const variance = Math.pow(settings.NETWORK_DELAY_STD_DEVIATION, 2);
const distribution = gaussian(settings.NETWORK_DELAY_MEDIAN, variance);

module.exports = class Connection {

    constructor(port, handler, participantList){
        this._port = port;
        this._handler = handler;
        this._participantList = participantList;
        this.open();
        this._isOpen = false;
    }

    send(message, destination) {

        setTimeout(()=> {

            if(!this._socket || !this._isOpen){
                debug.log('Unable to send', this._port, 'is closed');
                return;
            }
            if(destination === 0){
                debug.error('Invalid Destination of 0');
            }

            this._socket.send(JSON.stringify(message), destination, 'localhost', (e) => {
                if(e){
                    if(e.code === 'ECANCELED'){
                        debug.log('send canceled', this._port)
                    }
                    else{
                        debug.error(`Error sending to port ${destination}`, e);
                        this._socket.close();
                    }
                }
            });

        }, distribution.ppf(Math.random()));
    }

    set callback(handler){
        this._handler = handler;
    }

    broadcast (message){
        for (const participant of this._participantList){
            if (participant !== this._port){
                this.send(message, participant);
            }
        }
    }

    close(){
        if(this._socket){
            this._socket.close();
            this._socket = null;
        }
        else{
            debug.error('Trying to close a null socket', this._port)
        }
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
                this._isOpen = true;
                const address = this._socket.address();
                debug.log(`UDP socket listening on ${address.address}:${address.port}`);
            })

            .on('close', () => {
                debug.log('Socket', this._port, 'closed')
            })

            .bind(this._port);
    }
};