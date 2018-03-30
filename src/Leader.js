const debug = require('./utility/debug')(__filename);
const uuid = require("uuid/v4");

module.exports = class Leader{

    constructor(participant){
        this._log = participant.log;
        this._nodeInfo = {};
        this._matchIndex = {};
        for(const id of participant.participantList){
            this._nodeInfo[id] = {
                nextIndex : this._log.index + 1,
                matchIndex : 0
            };
        }
        this._participant = participant;
        this.appendEntries = this.appendEntries.bind(this);

        setInterval(this.appendEntries, 1000); //todo dynamic
        debug.log(participant.id, 'is now leader');
    }

    handleMessage(message){
        debug.log(message);
    }

    appendEntries(){
        debug.log("appendEntries");
        /*{
            term: this._log.term,
            id: this._log.id,
            prev_logIndex: this._log.index,
            perv_logTerm: this._log.term
        }*/
    }
};