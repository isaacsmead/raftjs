module.exports = class Leader{
    heartbeat;

    constructor(nodeList, log, connection){
        this.log = log;
        this._nextIndex = {};
        this._matchIndex = {};
        for(const id of nodeList){
            this._nextIndex[id] = this.log.index + 1;
            this._matchIndex[id] = 0;
        }
        this._connection = connection;

        this.appendEntries = this.appendEntries.bind(this);

        setInterval(this.appendEntries, 1000); //todo dynamic

    }

    onMessage(message){

    }

    appendEntries(){

    }
};