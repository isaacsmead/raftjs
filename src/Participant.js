const debug = require('./utility/debug')(__filename);
const
    Log = require('./Log'),
    Connection = require('./Connection'),
    c = require('./Constants');
const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;

const requiredOptions = ['id', 'participantList', 'changeRole'];

class Participant {
    constructor(options, message){
        this.onMessage = this.onMessage.bind(this);
        if(options instanceof Participant){
            options.connection.callback = this.onMessage;
            this._id = options.id;
            this._log = options.log;
            this._participantList = options.participantList;
            this._commitIndex = options.commitIndex;
            this._lastApplied = options.lastApplied;
            this._connection = options.connection;
            this._currentLeader = options.currentLeader;
            this._votedFor = options._votedFor;
            this.changeRole = options.changeRole;
        }
        else if (requiredOptions.every(option =>{ return options.hasOwnProperty(option)})){
            this._id = options.id;
            this._log = new Log(this.id);
            this._participantList = options.participantList;
            this._commitIndex = 0;
            this._lastApplied = 0;
            this._connection = new Connection(this.id, this.onMessage, options.participantList);
            this._currentLeader = null;
            this._votedFor = null;
            this.changeRole = options.changeRole;
        }
        else{
            debug.error('unable to create participant....missing options');
            process.exit(1);
        }
        if(message){
            this.onMessage(message);
        }
        this.startTimer();
    }

    get id() { return this._id }
    get log() { return this._log }
    get participantList() { return this._participantList }
    get commitIndex() { return this._commitIndex }
    get lastApplied() {  return this._lastApplied }
    get connection() { return this._connection }
    get lastLogEntry() { return this._log.lastLogEntry }
    get currentTerm(){ return this._log.currentTerm }
    get currentLeader() { return this._currentLeader }
    set currentTerm(term) { this._log.currentTerm = term }
    set currentLeader(leader) { this._currentLeader = leader }

    startTimer(){
        clearTimeout(this._timeout);
        const wait = Math.random() * Settings.TIMEOUT_WINDOW + Settings.MIN_TIMEOUT;
        this._timeout = setTimeout(()=>{
            this.onTimeout();
        }, wait)
    }

    onMessage(message){
        if(message.term > this.currentTerm){
            this.currentTerm = message.term;
            this._votedFor = null;
            if(this.role !== Roles.FOLLOWER){
                debug.log(this.id, `changing back to follower`);
                this.changeRole(Roles.FOLLOWER, this, message);
                this.cleanup();
                return;
            }
        }

        switch (message.type) {
            case MessageTypes.APPEND_ENTRIES:
                this.onAppendEntries(message);
                break;
            case MessageTypes.CONFIRM_ENTRIES:
                this.onConfirmEntries(message);
                break;
            case MessageTypes.REQUEST_VOTE:
                this.onRequestVote(message);
                break;
            case MessageTypes.VOTE:
                this.onVote(message);
                break;
            default:
                debug.error("Unknown message", message);
        }
    }

    onRequestVote(message){

        let voteGranted = true;

        if(message.term < this.currentTerm || this._votedFor !== null){
            voteGranted = false;
        }

        /*const lastLogEntry = this.lastLogEntry;
        if(message.term <= this.currentTerm){
            voteGranted = false;
        }
        else if(this._votedFor === null ||
            (this._votedFor === message.sender &&
                lastLogEntry.lastLogIndex <= message.lastLogIndex &&
                lastLogEntry.lastLogTerm <= message.lastLogTerm)){
            voteGranted = true;
        }*/

        if(voteGranted){
            this._votedFor = message.sender;
            this.startTimer();
        }

        debug.log(this.id, `voting`, voteGranted, 'for', message.sender, message.term);
        this.connection.send(
            {
                type: MessageTypes.VOTE,
                sender: this.id,
                voteGranted,
                term: this.currentTerm
            },
            message.sender)
    }

    cleanup(){
        clearTimeout(this._timeout);
    }
}

module.exports = Participant;