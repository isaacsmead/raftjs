const debug = require('../src/utility/debug')(__filename);
const assert = require('assert');
const Log = require("../src/Log");
const fs = require('fs-extra');
const nodeId = 12345;
const otherNode = 54321;


try{
    fs.unlinkSync(`./logs/${nodeId}.json`);
}
catch(e) {
    debug.error(`Error removing file`, e.message)
}

describe('log.js', function () {

    let log = new Log(nodeId);

    it('Should initiate with default values', function () {
        assert.equal(log.index, 0);
        assert.equal(log.currentTerm, 0);
        assert.equal(log.votedFor, null)
    });

    it('Should add an item to the log', function () {
        assert.equal(log.writeNext(2, 'write1'),true);
        assert.equal(log.writeNext(1, 'write2'),false);
        assert.equal(log.writeNext(3, 'write2'),true);
        assert.equal(log.getTerm(0), 2);
        log.votedFor = otherNode;
    });

    it('should open the db that was just made', function () {
        const log2 = new Log(nodeId);
        assert.equal(log2.index, 2);
        assert.equal(log2.currentTerm, 3);
        assert.equal(log2.getTerm(0), 2);
        assert.equal(log2.votedFor, otherNode);
        log = log2;
    });

    it('should get the previous entry index and term', function () {
        log.currentTerm = 4;
        assert.equal(log.currentTerm, 4);
        const lastLogEntry = log.lastLogEntry;
        assert.equal(lastLogEntry.lastLogIndex, log.index - 1);
        assert.equal(lastLogEntry.lastLogTerm, 3)
    })
});


