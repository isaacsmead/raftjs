const debug = require('./src/utility/debug')(__filename);
const getRole = require('./src/RoleManager').getRole;
const Roles = require('./src/Constants').Roles;

const TEST_TIMEOUT = 60000;
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

setTimeout(()=> {
   if(leaderId){
       participants[leaderId].cleanup();
       participants[leaderId].connection.close();
       participantList = participantList.filter(participant => participant !== leaderId)
   }
}, 10000);

setTimeout(()=> {
    for(let participant of participantList){
        participants[participant].cleanup();
        participants[participant].connection.close();

    }
}, TEST_TIMEOUT);

/*const Conn = require('./src/Connection');
const
    p1 = 8000,
    p2 = 9000;

const
    c1 = new Conn(p1, (m)=>{ console.log('c1', m ) }),
    c2 = new Conn(p2, (m)=>{ console.log('c2', m ) });

setTimeout( ()=>{c1.send("hello", p2)} , 1000);
setTimeout( ()=> {c2.send("asdfdf", p1)}, 2000);*/




