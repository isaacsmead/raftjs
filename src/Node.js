const WAIT_LOW = 2;
const WAIT_HIGH = 3;
const Log = require('./Log');
const Connection = require('./Connection');

module.exports = class Node {

    constructor(id, nodeList){
        this._id = id;
        this._nodeList = nodeList;
        this._log = new Log(id);
        this._commitIndex = 0;
        this._lastApplied = 0;
        this._connection = new Connection(id, this.onMessage);
    }



    get id(){
        return this._id;
    }
    get nodeList(){
        return this._nodeList;
    }
    get log(){
        return this._log
    }

    onMessage(message){

    }
};