const debug = require('./utility/debug')(__filename);
const fs = require('fs');
const JSONdb = require('simple-json-db');

const VOTED_FOR = 'votedFor';
const INDEX = 'index';
const CURRENT_TERM = 'currentTerm';

module.exports = class Log{

    constructor(nodeId){
        if(!fs.existsSync('./logs')) fs.mkdirSync('./logs');
        this.db = new JSONdb(`./logs/${nodeId}.json`, {asyncWrite: false});
        this._index = this.db.get(INDEX);
        this._currentTerm = this.db.get(CURRENT_TERM);
        this._votedFor = this.db.get(VOTED_FOR);

        if(this._index === undefined){
            this.index = 0;
        }
        if(this._currentTerm === undefined){
            this.currentTerm = 0
        }
        if(this._votedFor === undefined){
            this.votedFor = null;
        }
    }

    set votedFor(node){
        this._votedFor = node;
        this.db.set(VOTED_FOR, node)
    }

    get votedFor(){
        return this._votedFor;
    }

    set index(index){
        this._index = index;
        this.db.set(INDEX, index);
    }

    get index() {
        return this._index
    }

    set currentTerm(term){
        this._currentTerm = term;
        this.db.set(CURRENT_TERM, term);
    }

    get currentTerm(){
        return this._currentTerm;
    }

    get lastLogEntry(){
        const atBegining = this._index === 0;
        return {
            lastLogIndex : atBegining ? 0 : this._index - 1,
            lastLogTerm: atBegining ? 0 :  this.db.get(this._index - 1).term
        }
    }

    getTerm(index) {
        const entry = this.db.get(index.toString());
        if (entry) return entry.term;
        return undefined;
    }

    writeNext(term, data){
        if(this._currentTerm > term) {
            return false;
        }
        this.currentTerm = term;
        this.db.set(this.index.toString(), {term, data});
        this.index = this.index + 1;
        return true;
    }
};