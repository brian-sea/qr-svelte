import {produce, type Connection} from 'sveltekit-sse';
import {joinQ, sendEvent} from './events'

export async function POST({params}){

    let qName = params.queue
    const p:Response = produce( async function run(connection: Connection){
        joinQ(qName, connection);
    })

    return p;
}