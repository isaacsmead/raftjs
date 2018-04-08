const Roles = require('./Constants').Roles;
const Follower = require('./Follower');
const Candidate = require('./Candidate');
const Leader = require('./Leader');

function getRole(role, current, message) {
    switch (role){
        case Roles.CANDIDATE:
            return new Candidate(current, message);
        case Roles.FOLLOWER:
            return new Follower(current, message);
        case Roles.LEADER:
            return new Leader(current, message);
    }
}

exports.getRole = getRole;