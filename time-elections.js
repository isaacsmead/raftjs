const debug = require('./src/utility/debug')(__filename);
const getRole = require('./src/RoleManager').getRole;
const Roles = require('./src/Constants').Roles;
const Settings = require('./src/Constants').Settings;
const fs = require('fs');
const wtf = require('wtfnode');
const argv = require('yargs')
    .usage('Usage: -n [number nodes] -e [number elections]')
    .demandOption(['n','e'])
    .argv;


const numElections = argv.e;
const numParticipants = argv.n;


if(!fs.existsSync('results')){
    fs.mkdirSync('results');
}

debug.log('timing', numParticipants, 'nodes for', numElections, 'elections');

const resultsFile = `./results/${numParticipants}x${numElections}.csv`;
if(fs.existsSync(resultsFile)){
    debug.log('over-writing previous results', resultsFile);
    fs.unlinkSync(resultsFile);
}
const output = fs.createWriteStream(resultsFile);


let killed = null;
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
    if(participant.id === killed){
        //debug.error(`Killed member`, participant.id, 'trying to change to ', newRole);
        return;
    }
    participants[participant.id] = getRole(newRole, participant, message);
    if(newRole === Roles.LEADER){
        leaderId = participant.id;
        if(start){
            const delay = Date.now() - start;
            //debug.log(delay, 'ms to elect leader', leaderId);
            output.write(`${delay}\n`);
            counter++;
            if(counter % 10 === 0){
                debug.log(counter, 'rounds of', numElections, 'complete');
            }
            participants[oldLeaderId] = getRole(Roles.FOLLOWER, {id: oldLeaderId, participantList, changeRole: changeRoll});
            killed = null;
        }
        if(counter < numElections){
            setTimeout(runTest, Math.random()*Settings.APPEND_INTERVAL);
        }
        else{
            setTimeout(done, 60);
        }
    }
}


function runTest(){
    oldLeaderId = leaderId;
    //debug.log('killing off', leaderId);
    start = Date.now();
    participants[leaderId].cleanup();
    participants[leaderId].connection.close();
    killed = leaderId;
}


function done(){
    output.end();
    for(let participant of participantList){
        participants[participant].cleanup();
        participants[participant].connection.close();
        delete participants[participant];
    }
    debug.error('test complete');
    wtf.dump();
}