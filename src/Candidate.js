const debug = require('./utility/debug')(__filename);
const c = require('./Constants');
const Participant = require('./Participant');
const Follower = require('./Follower');
const Leader = require('./Leader');
const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;

class Candidate extends Participant {
    constructor( options ){
        super(options);
        this._election = {};
        this._requestVote();
    }
    get role(){return Roles.CANDIDATE}

        _requestVote(){
            this.currentTerm = this.currentTerm + 1;
            this._election[this.id] = true;
            const lastLogEntry = this.lastLogEntry;
            const mesage = {
                type: MessageTypes.REQUEST_VOTE,
                term: this.currentTerm,
                sender : this.id,  // candidateId in docs
                lastLogIndex: lastLogEntry.lastLogIndex,
                lastLogTerm: lastLogEntry.lastLogTerm
                };
            this.connection.broadcast(mesage, this._participantList);
        }

        onTimeout(){
            this._requestVote();
            this.startTimer();
        }

        onAppendEntries(message){
            if(message.term >= this.currentTerm){
                // todo log entry
                this.roleChange(new Follower(this));
                this.cleanup();
            }

        }

        onConfirmEntries(message){}
        onRequestVote(message){}

        onVote(message){
            if(message.term >= this.currentTerm){
                debug.log(this.id, Follower);
                this.roleChange(new Follower(this));
                this.cleanup();
                return;
            }

            this._election[message.sender] = message.voteGranted;

            const yesVotes = Object.keys(this._election)
                .filter(participant => {return this._election[participant];})
                .length;

            if( yesVotes > this._participantList.length / 2){
                this.roleChange(new Leader(this));
                this.cleanup();
            }
        }
}

module.exports = Candidate;
