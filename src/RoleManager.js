const Roles = require('./Constants').Roles;
const Follower = require('./Follower');
const Candidate = require('./Candidate');
const Leader = require('./Leader');

function getRole(role, current) {
    switch (role){
        case Roles.CANDIDATE:
            return new Candidate(current);
        case Roles.FOLLOWER:
            return new Follower(current);
        case Roles.LEADER:
            return new Leader(current);
    }
}

exports.getRole = getRole;