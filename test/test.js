const assert = require('assert');
const Log = require("../src/Log");
const fs = require('fs-extra');
const nodeId = 12345;
const otherNode = 54321;


try{
    fs.unlinkSync(`./logs/${nodeId}.json`);
}
catch(e) {
    console.error(`Error removing file`, e.message)
}

describe('log.js', () => {

    const log = new Log(nodeId);

    it('Should initiate with default values', () => {
        assert.equal(log.index, 0);
        assert.equal(log.currentTerm, 0);
        assert.equal(log.votedFor, null)
    });

    it('Should add an item to the log', ()=> {
        assert.equal(log.writeNext(2, 'write1'),true);
        assert.equal(log.writeNext(1, 'write2'),false);
        assert.equal(log.writeNext(3, 'write2'),true);
        assert.equal(log.getTerm(0), 2);
        log.votedFor = otherNode;
    });

    it('should open the db that was just made', ()=> {
        const log2 = new Log(nodeId);
        assert.equal(log2.index, 2);
        assert.equal(log2.currentTerm, 3);
        assert.equal(log2.getTerm(0), 2);
        assert.equal(log2.votedFor, otherNode);
    });
});

describe('another test', ()=> {
    it('array should have length 1', ()=> {
        assert.equal([1].length, 1)
    })
});

