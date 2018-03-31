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
    constructor(options){
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
            this.changeRole = options.changeRole;
        }
        else{
            debug.error('unable to create participant....missing options');
            process.exit(1);
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
        }
    }

    cleanup(){
        clearTimeout(this._timeout);
    }
}

module.exports = Participant;