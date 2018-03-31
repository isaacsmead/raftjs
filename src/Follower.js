const debug = require('./utility/debug')(__filename);
const c = require('./Constants');
const Participant = require('./Participant');
const Candidate = require('./Candidate');
const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;

class Follower extends Participant {

    constructor( options ){
        super (options);
        this._votedFor = null;
    }

    onTimeout(){
        this.roleChange(new Candidate(this));
        this.cleanup();
    }

    get role(){return Roles.FOLLOWER}

    onAppendEntries(message){

    }
    onConfirmEntries(message){

    }
    onRequestVote(message){
        const lastLogEntry = this.lastLogEntry;
        let voteGranted;

        if(message.term < this.currentTerm){
            voteGranted = false;
        }
        else if(this._votedFor === null ||
            (this._votedFor === message.sender &&
                lastLogEntry.lastLogIndex <= message.lastLogIndex &&
                lastLogEntry.lastLogTerm <= message.lastLogTerm)){
            voteGranted = true;
        }
        else{
            voteGranted = false
        }

        if(voteGranted) this._votedFor = message.sender;

        this.connection.send(
            {
                type: MessageTypes.VOTE,
                sender: this.id,
                voteGranted,
                term: this.currentTerm
            },
            message.sender)
    }
    onVote(message){

    }
}

module.exports = Follower;