const debug = require('./src/utility/debug')(__filename);
const getRole = require('./src/RoleManager').getRole;
const Roles = require('./src/Constants').Roles;

const TEST_TIMEOUT = 5000;
let participantList = [
    8001,
    8002,
    8003,
    8004,
    8005
];

let participants = {};

let leaderId = null;

function changeRoll(newRole, participant){
    participants[participant.id] = getRole(newRole, participant);
    if(newRole === Roles.LEADER) leaderId = participant.id;
}

for( let id of participantList){
    participants[id] = getRole(Roles.FOLLOWER, {id, participantList, changeRole: changeRoll});
}

/*setTimeout(()=> {
    if(leaderId){
        participants[leaderId].cleanup();
        participants[leaderId].connection.close();
        participantList = participantList.filter(participant => participant !== leaderId)
    }
}, 1000);

setTimeout(()=> {
    if(leaderId){
        participants[leaderId].cleanup();
        participants[leaderId].connection.close();
        participantList = participantList.filter(participant => participant !== leaderId)
    }
}, 2000);

setTimeout(()=> {
    if(leaderId){
        participants[leaderId].cleanup();
        participants[leaderId].connection.close();
        participantList = participantList.filter(participant => participant !== leaderId)
    }
}, 3000);*/

setTimeout(()=> {
    if(leaderId){
        participants[leaderId].transferLead();
        setTimeout(()=> {
            participants[leaderId].cleanup();
            participants[leaderId].connection.close();
        }, 5)

    }
}, 2000);

setTimeout(()=> {
    for(let participant of participantList){
        participants[participant].cleanup();
        participants[participant].connection.close();

    }
}, TEST_TIMEOUT);





