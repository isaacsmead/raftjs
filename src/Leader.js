const uuid = require("uuid/v4");

module.exports = class Leader{

    constructor(nodeList, log, connection){
        this.log = log;
        this._nodeInfo = {};
        this._matchIndex = {};
        for(const id of nodeList){
            this._nodeInfo[id] = {
                nextIndex : this.log.index + 1,
                matchIndex : 0
            };
        }
        this._connection = connection;

        this.appendEntries = this.appendEntries.bind(this);

        setInterval(this.appendEntries, 1000); //todo dynamic

    }

    handleMessage(message){
        console.log(message.term, message.success);
    }

    appendEntries(){
        for(const node of Object.keys(this._nodeInfo)){
            this._connection.send({
                term: this.log.term,
                id: this.log.id,
                prevLogIndex: this.log.index,
                pervLogTerm: this.log.term
            });




        }
    }
};