const debug = require('./utility/debug')(__filename);
const uuid = require("uuid/v4");
const Participant = require('./Participant');

module.exports = class Leader extends Participant{

    constructor( options ){
        super(options);
        this._nodeInfo = {};
        for(const id of this.participantList){
            this._nodeInfo[id] = {
                nextIndex : this._log.index + 1,
                matchIndex : 0
            };
        }
        this.sendAppendEntries = this.sendAppendEntries.bind(this);

        this._interval = setInterval(this.sendAppendEntries, 1000); //todo dynamic
        debug.log(this.id, 'is now leader');
    }

    onAppendEntries(message){

    }
    onConfirmEntries(message){

    }
    onRequestVote(message){

    }
    onVote(message){
    }

    onTimeout(){

    }

    sendAppendEntries(){
        debug.log("sendAppendEntries");
        /*{
            term: this._log.term,
            id: this._log.id,
            prev_logIndex: this._log.index,
            perv_logTerm: this._log.term
        }*/
    }


};
