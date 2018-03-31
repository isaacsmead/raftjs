const debug = require('../src/utility/debug')(__filename);
const constants = require('../src/Constants');
const Candidate = require('../src/Candidate');
const assert = require('assert');





describe('Testing Candidate class', function () {

    const options = {
        id: 7000,
        participantList: Array.from({length: 5}, (x,i) => i + 7000),
        roleChange: roleChange
    };

    let current = new Candidate(options);

    function roleChange(newRole) {
        current = newRole
    }

    it('should change role to leader', function () {
/*        for(const p of options.participantList){
            current.onVote({sender: p, voteGranted: true})
        }
        assert(current.role, constants.Roles.LEADER);*/
        current.connection.close();
        current.cleanup();
    });

});
