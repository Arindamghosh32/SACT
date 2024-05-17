let connections=[];

addEventListener('connect',(event)=>{
    const port = event.ports[0];
    connections.push(port);
    addEventListener('message',(mes)=>{
        connections.forEach(conn=>conn.postMessage(mes.data));
    })
})