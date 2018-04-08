const debug = require('./src/utility/debug')(__filename);
const getRole = require('./src/RoleManager').getRole;
const Roles = require('./src/Constants').Roles;
const fs = require('fs');
const wtf = require('wtfnode');

if(!fs.existsSync('results')){
    fs.mkdirSync('results');
}

const numTests = 50;
const numParticipants = 5;

const resultsFile = `./results/${numParticipants}x${numTests}`;
if(fs.existsSync(resultsFile)){
    debug.error('results file already exists');
    process.exit(1);
}
const output = fs.createWriteStream(resultsFile);



const participantList = [];
const participants = {};

for(let i = 1 ; i <= numParticipants; i++){
    const id = i + 8000;
    participantList.push(id);
    participants[id] = getRole(Roles.FOLLOWER, {id, participantList, changeRole: changeRoll});
}

let leaderId = null;
let oldLeaderId = null;
let counter = 0;
let start;

function changeRoll(newRole, participant, message){
    participants[participant.id] = getRole(newRole, participant, message);
    if(newRole === Roles.LEADER){
        leaderId = participant.id;
        if(start){
            const delay = new Date() - start;
            //debug.log(delay, 'ms to elect leader');
            output.write
            counter++;
            participants[oldLeaderId] = getRole(Roles.FOLLOWER, {id: oldLeaderId, participantList, changeRole: changeRoll});
        }
        if(counter < numTests){
            setTimeout(runTest, 60);
        }
        else{
            setTimeout(done, 60);
        }
    }
}


function runTest(){
    oldLeaderId = leaderId;
    //debug.log('killing off', leaderId);
    start = new Date();
    participants[leaderId].cleanup();
    participants[leaderId].connection.close();
}


function done(){

    for(let participant of participantList){
        participants[participant].cleanup();
        participants[participant].connection.close();
        delete participants[participant];
    }
    debug.error('test complete');
    wtf.dump()
}
