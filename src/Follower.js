const debug = require('./utility/debug')(__filename);
const c = require('./Constants');
const Participant = require('./Participant');
const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;

module.exports = class Follower extends Participant{


    constructor( options ){
        super (options);
        this._role = Roles.FOLLOWER;
        this._timeout = this._listen();
        this._votedFor = null;
    }

    _listen(){
        clearTimeout(this._timeout);
        const wait = Math.random() * Settings.TIMEOUT_WINDOW + Settings.MIN_TIMEOUT;
        return setTimeout(()=>{
            this._participant.setRole(Roles.CANDIDATE);
        }, wait)
    }

    handleMessage(message){
        debug.log(`${this._participant.id} got ${message.type} from ${message.sender}`);
        switch (message.type) {
            case MessageTypes.APPEND_ENTRIES:
                break;
            case MessageTypes.REQUEST_VOTE:
                this._handleRequestVote(message);
                break;
            default:
        }
    }

    onAppendEntries(message){

    }
    onConfirmEntries(message){

    }
    onRequestVote(message){
        const lastLogEntry = this._participant.lastLogEntry;
        let voteGranted;
        if(message.term < this._participant.currentTerm){
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

        this._participant.connection.send(
            {
                type: MessageTypes.VOTE,
                sender: this._participant.id,
                voteGranted,
                term: this._participant.currentTerm
            },
            message.sender)
    }
    onVote(message){

    }
    _handleRequestVote(message){}


};