exports.MessageTypes = {
    APPEND_ENTRIES: 'APPEND_ENTRIES',
    CONFIRM_ENTRIES: 'CONFIRM_ENTRIES',
    REQUEST_VOTE: 'REQUEST_VOTE' ,
    VOTE: 'VOTE'


};
exports.Roles = {
    LEADER: 'LEADER',
    FOLLOWER: 'FOLLOWER',
    CANDIDATE: 'CANDIDATE'
};

exports.Settings= {
    TIMEOUT_WINDOW: 4000,
    MIN_TIMEOUT : 1000,
};