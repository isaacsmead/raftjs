const debug = require('./src/utility/debug')(__filename);
const getRole = require('./src/RoleManager').getRole;
const Roles = require('./src/Constants').Roles;

const numTests = 50;
const numParticipants = 5;

const participantList = [];
const participants = {};

for(let i = 0 ; i < numParticipants; i++){
    const id = i + 8000;
    participantList.push(id);
    participants[i] = getRole(Roles.FOLLOWER, {id, participantList, changeRole: changeRoll});
}

debug.log(participantList);

let leaderId = null;
let oldLeaderId = null;
let counter = 0;
let start;

function changeRoll(newRole, participant){
    participantList[participant.id] = getRole(newRole, participant);
    if(newRole === Roles.LEADER){
        leaderId = participant.id;
        if(start){
            const delay = new Date() - start;
            debug.log(delay, 'ms to elect leader');
            counter++;
            participantList[oldLeaderId] = getRole(Roles.FOLLOWER, {id: oldLeaderId, participantList, changeRole: changeRoll})
            if(counter < numTests){
                setTimeout(()=> runTest(), 60);
            }
            else{
                done();
            }
        }
    }
}


function runTest(){
    oldLeaderId = leaderId;
    start = new Date();
    participantList[leaderId].cleanup();
    participantList[leaderId].connection.close();
}


function done(){
    for(let participant of participantList){
        participants[participant].cleanup();
        participants[participant].connection.close();
    }
}
