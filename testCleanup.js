const debug = require('./src/utility/debug')(__filename);
const getRole = require('./src/RoleManager').getRole;
const Roles = require('./src/Constants').Roles;
const wtf = require('wtfnode');

const numParticipants = 60;

const participantList = [];
const participants = {};

for(let i = 1 ; i <= numParticipants; i++){
    const id = i + 8000;
    participantList.push(id);
    participants[id] = getRole(Roles.FOLLOWER, {id, participantList, changeRole: changeRoll});
}

function changeRoll(newRole, participant, message){
    debug.log(participant.id, `changing to`, newRole);
    participants[participant.id] = getRole(newRole, participant, message);
}



setTimeout(done, 4000);
function done(){
    for(const p of participantList){
        participants[p].cleanup();
        participants[p].connection.close();
    }
    setTimeout(wtf.dump, 1000);
    wtf.dump();
}
