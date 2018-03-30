const debug = require('./utility/debug')(__filename);
const
    Log = require('./Log'),
    Connection = require('./Connection'),
    Follower = require('./Follower'),
    Candidate = require('./Candidate'),
    Leader = require('./Leader'),
    c = require('./Constants');
const
    Roles = c.Roles,
    MessageTypes = c.MessageTypes,
    Settings = c.Settings;




module.exports = class Participant {

    constructor(options){
        this.onMessage = this.onMessage.bind(this);
        if(options.hasOwnProperty('previousMode')){
            options.previousMode.connection.callback = this.onMessage;
            this._id = options.previousMode.id;
            this._log = options.previousMode.log;
            this._participantList = options.previousMode.participantList;
            this._commitIndex = options.previousMode.commitIndex;
            this._lastApplied = options.previousMode.lastApplied;
            this._connection = options.previousMode.connection;

        }
        else if (options.hasOwnProperty('id') && options.hasOwnProperty('participantList')) {
            this._id = options.id;
            this._log = new Log(this.id);
            this._participantList = options.participantList;
            this._commitIndex = 0;
            this._lastApplied = 0;
            this._connection = new Connection(this.id, this.onMessage);
        }
        else{
            debug.error('unable to create participant....missing options');
            process.exit(1);
        }
    }

    get id(){
        return this._id;
    }
    get participantList(){
        return this._participantList;
    }
    get commitIndex(){
        return this._commitIndex;
    }
    get lastApplied(){
        return this._lastApplied;
    }
    get log(){
        return this._log
    }
    get connection() {
        return this._connection;
    }
    get lastLogEntry(){
        return this._log.lastLogEntry;
    }
    get currentTerm(){
        return this._log.currentTerm;
    }
    set currentTerm(term){
        this._log.currentTerm = term;
    }
    get participantList(){
        return this._participantList;
    }

    onMessage(message){

        switch (message.type) {
            case MessageTypes.APPEND_ENTRIES:
                break;
            case MessageTypes.REQUEST_VOTE:
                break;
            case MessageTypes.VOTE:
                break;
            default:
        }

        this._role.handleMessage(message);
    }

    setRole(role){
        switch (role){
            case Roles.FOLLOWER:
                this._role = new Follower(this);
                break;
            case Roles.CANDIDATE:
                this._role = new Candidate(this);
                break;
            case Roles.LEADER:
                this._role = new Leader(this);
        }
    }
};