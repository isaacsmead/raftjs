const debug = require('./utility/debug')(__filename);
const c = require('./Constants');
const Participant = require('./Participant');

const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;

class Candidate extends Participant {
    constructor( options, message ){
        super(options, message);
        this._election = {};
        this._requestVote();
        this._changing = false;
    }
    get role(){return Roles.CANDIDATE}

        _requestVote(){
            this.currentTerm = this.currentTerm + 1;
            debug.log(this.id, `holding election for term`, this.currentTerm);
            this._election[this.id] = true;
            this._votedFor = this.id;
            const lastLogEntry = this.lastLogEntry;
            const mesage = {
                type: MessageTypes.REQUEST_VOTE,
                term: this.currentTerm,
                sender : this.id,  // candidateId in docs
                lastLogIndex: lastLogEntry.lastLogIndex,
                lastLogTerm: lastLogEntry.lastLogTerm
                };
            this.connection.broadcast(mesage);
        }

        onTimeout(){
            this._requestVote();
            this.startTimer();
        }

        onAppendEntries(message){
            if(this.currentTerm <= message.term){
                debug.log(this.id, 'changing back to follower');
                this.changeRole(Roles.FOLLOWER, this, message);
                this.cleanup();
            }

        }

        onConfirmEntries(message){}


        onVote(message){
            if(!message.term === this.currentTerm){
                debug.error(this.id, this.currentTerm, 'discarding vote from', message.sender, message.term);
                return;
            }
            this._election[message.sender] = message.voteGranted;

            const yesVotes = Object.keys(this._election)
                .filter(participant => {return this._election[participant];})
                .length;

            if( yesVotes > this._participantList.length / 2 && !this._changing){
                this.changeRole(Roles.LEADER, this);
                this._changing = true;
                this.cleanup();
            }
        }
}

module.exports = Candidate;
