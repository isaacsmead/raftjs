const debug = require('./utility/debug')(__filename);
const uuid = require("uuid/v4");
const c = require('./Constants');
const Participant = require('./Participant');
const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;

module.exports = class Leader extends Participant{

    constructor( options, message ){
        super(options, message);
        this._nodeInfo = {};
        for(const id of this.participantList){
            this._nodeInfo[id] = {
                nextIndex : this._log.index + 1,
                matchIndex : 0
            };
        }
        this.sendAppendEntries = this.sendAppendEntries.bind(this);

        this.sendAppendEntries();
        this._appendInteval = setInterval(this.sendAppendEntries, Settings.APPEND_INTERVAL);
        debug.log(this.id, 'is now leader for term ', this.currentTerm);
    }

    onAppendEntries(message){

    }
    onConfirmEntries(message){

    }
    onVote(message){
    }

    onTimeout(){

    }

    sendAppendEntries(){
        const lastLogEntry = this.lastLogEntry;
        //debug.log('Leader', this.id, 'broadcasting');
        this.connection.broadcast({
            type: MessageTypes.APPEND_ENTRIES,
            term: this.currentTerm,
            sender: this.id,
            prevLogIndex: lastLogEntry.lastLogIndex,
            prevLogTerm: lastLogEntry.lastLogTerm,
            entries: [],
            commitIndex: this.commitIndex
        })
    }

    cleanup(){
        super.cleanup();
        clearInterval(this._appendInteval);
    }

};
