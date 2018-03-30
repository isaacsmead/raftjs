const debug = require('./src/utility/debug')(__filename);

const Node = require('./src/Participant');

const TEST_TIMEOUT = 5000;
const playerList = [
    8001,
    8002,
    8003,
    8004,
    8005
];

let players = {};

for( let player of playerList){
    players[player] = new Node(player, playerList);
}


setTimeout(()=> {
    for(let player of playerList){
        players[player].connection.close();
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




