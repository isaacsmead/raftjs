const c = require('./Constants');
const Node = require('./Node');
const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;

module.exports = class Follower {


    constructor( node ){

        this._role = Roles.FOLLOWER;
        this._node = node;
        this._timeout = this.listen();
    }

    listen(){
        clearTimeout(this._timeout);
        const wait = Math.random() * Settings.TIMEOUT_WINDOW + Settings.MIN_TIMEOUT;
        return setTimeout(()=>{
            console.log(`${this._node.id} has timed out`)
        }, wait)
    }

    handleMessage(message){
        switch (message.type) {
            case MessageTypes.APPEND_ENTRIES:
                this.listen();
                break;
            case MessageTypes.REQUEST_VOTE:
            default:
        }
    }

};