const debug = require('./src/utility/debug')(__filename);
const getRole = require('./src/RoleManager').getRole;
const Roles = require('./src/Constants').Roles;

let participantList = [
    8001,
    8002,
    8003,
    8004,
    8005
];

let leader = null;
let counter = 0;

function changeRoll(newRole, participant){
    if(newRole === Roles.LEADER){
        leader = getRole(newRole, participant);



    }
    else getRole(newRole, participant);
}

for( let id of participantList){
    getRole(Roles.FOLLOWER, {id, participantList, changeRole: changeRoll});
}

function startTest(){
    const start = new Date();
    leader.cleanup();
    leader.connection.close();
}