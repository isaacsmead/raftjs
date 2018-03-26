const c = require('./Constants');
const Node = require('./Node');
const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;

module.exports = class Candidate {


    constructor( node ){

        this._role = Roles.CANDIDATE;
        this._node = node;
        this._requestVote();
    }

    _requestVote(){

        const
            connection = this._node.connection,
            nodeList = this._node.nodeList,
            id = this._node.id,
            mesage = {
                term: this._node.
            };


        for(const nodeId of nodeList){
            if(nodeId !== id){
                connection.send()


            }


        }

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