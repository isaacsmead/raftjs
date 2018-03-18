const Conn = require('./src/Connection');
const
    p1 = 8000,
    p2 = 9000;

const
    c1 = new Conn(p1, (m)=>{ console.log('c1', m ) }),
    c2 = new Conn(p2, (m)=>{ console.log('c2', m ) });

setTimeout( ()=>{c1.send("hello", p2)} , 1000);
setTimeout( ()=> {c2.send("asdfdf", p1)}, 2000);




