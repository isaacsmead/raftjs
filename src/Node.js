const Log = require('./Log');
const Connection = require('./Connection');
const Follower = require('./Follower');
const Candidate = require('./Candidate');
const Leader = require('./Leader');

module.exports = class Node {

    constructor(id, nodeList){
        this._role = new Follower(this);
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

    get connection() {
        return this._connection;
    }

    onMessage(message){
        this._role.handleMessage(message);
    }
};