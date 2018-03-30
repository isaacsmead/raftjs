const debug = require('./utility/debug')(__filename);
const c = require('./Constants');
const participant = require('./Participant');
const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;

module.exports = class Candidate {


    constructor( participant ){
        this._role = Roles.CANDIDATE;
        this._participant = participant;
        this._election = {};
        participant.currentTerm = participant.currentTerm + 1;
        this._requestVote();
    }

    _requestVote(){
        this._election[this._participant.id] = true;
        const lastLogEntry = this._participant.lastLogEntry;
        const mesage = {
            type: MessageTypes.REQUEST_VOTE,
            term: this._participant.currentTerm,
            sender : this._participant.id,  // candidateId in docs
            lastLogIndex: lastLogEntry.lastLogIndex,
            lastLogTerm: lastLogEntry.lastLogTerm
            };
        this._participant.connection.broadcast(mesage, this._participant.nodeList);
    }

    handleMessage(message){
        debug.log(`${this._participant.id} got ${message.type} from ${message.sender}`);
        switch (message.type) {
            case MessageTypes.APPEND_ENTRIES:
                break;
            case MessageTypes.REQUEST_VOTE:
                break;
            case MessageTypes.VOTE:
                this.handleVote(message);
                break;
            default:
        }
    }

    handleVote(message){
        // todo how to handle term field in vote message?
        this._election[message.sender] = message.voteGranted;

        const yesVotes = Object.keys(this._election)
            .filter(participant => {return this._election[participant];})
            .length;

        if( yesVotes > this._participant.nodeList.length / 2){
            this._participant.setRole(Roles.LEADER);
        }

    }
};