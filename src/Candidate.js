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
            if(this.term >= message.term){
                debug.log(this.id, this.term, 'going back to candidate, Leader:', message.sender, message.term)
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

            if( yesVotes > this._participantList.length / 2){
                this.changeRole(Roles.LEADER, this);
                this.cleanup();
            }
        }
}

module.exports = Candidate;
