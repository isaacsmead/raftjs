const debug = require('./src/utility/debug')(__filename);
const getRole = require('./src/RoleManager').getRole;
const Roles = require('./src/Constants').Roles;
const MessageTypes = require('./src/Constants').MessageTypes;
const Settings = require('./src/Constants').Settings;
const fs = require('fs');
const wtf = require('wtfnode');
const argv = require('yargs')
    .usage('Usage: -n [number nodes] -e [number elections]')
    .demandOption(['n','e'])
    .argv;


const numElections = argv.e;
const groupSize = argv.n;

const leaderPort = 1999;

if (groupSize > 99) {
    debug.error('group size', groupSize, 'greater than 99');
    process.exit(1);
}

if(!fs.existsSync('results2')){
    fs.mkdirSync('results2');
}

debug.log('timing', groupSize, 'nodes for', numElections, 'elections');

const resultsFile = `./results2/${groupSize}x${numElections}.csv`;
if(fs.existsSync(resultsFile)){
    debug.log('over-writing previous results', resultsFile);
    fs.unlinkSync(resultsFile);
}
const output = fs.createWriteStream(resultsFile);


let killed = null;
const participantLists = {};
const participants = {};
const groupLeaderIds = {};

for(let i = 1 ; i <= groupSize; i++){
    const gpId = i * 100 + 2000;
    participantLists[gpId] = [];
    for(let j = 1; j <= groupSize; j++){
        const id = gpId + j;
        participantLists[gpId].push(id);
    }
    for(const id of participantLists[gpId]){
        participants[id] = getRole(Roles.FOLLOWER, {id, participantList: participantLists[gpId], changeRole: changeRoll})
    }
}
for(const id of Object.keys(participantLists)){
    participants[id] = null;
    groupLeaderIds[id] = null;
}

const topParticipantList = [...Object.keys(participantLists), leaderPort].map(key => {return parseInt(key)});

let leaderId = null;
let oldLeaderId = null;
let counter = 0;
let testStartTime;

function changeRoll(newRole, participant, message){
    if(participant.id === killed){
        debug.error(`Killed member`, participant.id, 'trying to change to ', newRole);
        return;
    }
    participants[participant.id] = getRole(newRole, participant, message);
    if(newRole === Roles.LEADER){
        const gpId = getGroupId(participant.id);

        // group leader elected, if just starting out start follower for top tier
        if(groupLeaderIds[gpId] === null){
            participants[gpId] = getRole(Roles.FOLLOWER, { id: gpId, participantList: topParticipantList, changeRole: changeTopRole });
        }

        // keep track of id
        groupLeaderIds[gpId] = participant.id;



        if(testStartTime) {
            const delay = Date.now() - testStartTime;
            output.write(`${delay}\n`);
            counter++;
            if(counter % 10 === 0){
                debug.log(counter, 'rounds of', numElections, 'complete');
            }
            participants[oldLeaderId] = getRole(Roles.FOLLOWER, {
                id: oldLeaderId,
                participantList:
                participantLists[getGroupId(oldLeaderId)],
                changeRole: changeRoll
            });
            killed = null;

            if (counter < numElections) {
                setTimeout(runTest, Math.random()*Settings.APPEND_INTERVAL + Settings.APPEND_INTERVAL);
            }
            else {
                setTimeout(done, 60);
            }
        }
        else if(leaderId){
            setTimeout(runTest, 100);
        }

    }
}

function changeTopRole(newRole, participant, message){

    if(newRole === Roles.LEADER){
        leaderId = groupLeaderIds[participant.id];

        // since node is now supreme leader must stop as group leader
        // groupLeaderIds[participant.id] = null;
        // request a new leader take over

        const foo = participants[leaderId];
        foo.transferLead();
        setTimeout(()=> {
            foo.cleanup();
            foo.connection.close();
        },30);



        participants[leaderId] = getRole(
            Roles.LEADER, {
                id: leaderPort,
                participantList: topParticipantList,
                changeRole: badChangeRole,
                carriedTerm: participant.currentTerm
            }
        );

        if(testStartTime){
            const delay = Date.now() - testStartTime;
            //debug.log(delay, 'ms to elect leader', leaderId);
            output.write(`${delay}, `);
        }
    }

    else {
        participants[participant.id] = getRole(newRole, participant, message);
    }
}


function badChangeRole(newRole, participant, message){
    debug.error("Bad change Role", participant.id, newRole)
}

function runTest(){
    oldLeaderId = leaderId;
    //debug.log('killing off', leaderId);
    testStartTime = Date.now();
    participants[leaderId].cleanup();
    participants[leaderId].connection.close();
    killed = leaderId;
}


function done(){
    output.end();
    for(let participant of Object.keys(participants)){
        participants[participant].cleanup();
        participants[participant].connection.close();
        delete participants[participant];
    }
    debug.log('test complete');
    wtf.dump();
}

function getGroupId(id){
    return id - id % 100;
}
