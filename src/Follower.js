const debug = require('./utility/debug')(__filename);
const c = require('./Constants');
const Participant = require('./Participant');
const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;

class Follower extends Participant {

    constructor( options ){
        super (options);
    }

    onTimeout(){
        this.changeRole(Roles.CANDIDATE, this);
        this.cleanup();
    }

    get role(){return Roles.FOLLOWER}

    onAppendEntries(message){
        this.startTimer(); // todo any case where ignore?


        if(message.term > this.currentTerm){
            this.currentLeader = message.sender;
            this.currentTerm = message.term;
            this._votedFor = null;
        }

        // todo Reply false if term < currentTerm
        // todo reply false if log doesn't contain entry at previous log index who's term doesn't match prevLogTerm
        // todo if an existing entry conflicts with new one, delete existing entry and all that follow
        // todo append any new entries not in log
        /*const success =  !(message.term < this.currentTerm );
        if(success) {
        }
        if(message.commitIndex > this.commitIndex){
            //todo this.commitIndex = min message.commitIndex, index of last new entry
        }
        this.connection.send({
            sender: this.id,
            term: this.currentTerm,
            success
        }, message.sender)*/
    }
    onConfirmEntries(message){

    }

    onVote(message){

    }
}

module.exports = Follower;