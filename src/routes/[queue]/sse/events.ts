import {Queue, Question, queues} from '$lib/Queue'
import {type Connection} from 'sveltekit-sse'

let listeners: Map<string, Connection[]> = new Map<string, Connection[]>();

export type SSEEvent = {
    name:string;
    message:string;
}


export async function joinQ(qName:string, connection:Connection){
    if( !listeners.has(qName) ){
        listeners.set(qName, [])
    }

    let clients:object[] = listeners.get(qName)!
    clients.push(connection)
}

export async function sendEvent(qName:string, event:SSEEvent ){
    if( !listeners.has(qName) ){
        return { status: false, message: 'Missing Queue'}
    }

    let clients:Connection[] = listeners.get(qName)!
    for( let spot = 0; spot < clients.length; spot++ ){
        let client = clients[spot];
        
        // Send message but remove the connection on error
        const {error} = client.emit('message', JSON.stringify(event));
        if(error){
            clients.splice(spot, 1)
            spot--;
        }
    }
}
