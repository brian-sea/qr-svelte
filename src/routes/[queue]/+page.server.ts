import {fail} from '@sveltejs/kit'
import {Queue, Question, queues} from '$lib/Queue'
import {sendEvent} from './sse/events'

export async function load({ params, locals }) {
    if(params.queue){    
        let qName:string = params.queue;
        if( !queues.has(qName)){
            queues.set(qName, new Queue(qName))
        }
        locals.queue = queues.get(qName)?.toObject();
    }

    return {
        locals
    };
}

export const actions = {
    default: async ( {params, locals, request} ) => {

        const qName:string = params.queue;
        if(!queues.has(qName)){
            return fail(400, { name: qName, missing:true})
        }
        const Q:Queue = queues.get(params.queue)!

        const formData = await request.formData()
        if(!formData.has('action')){
            return fail(400, {name:'action', missing:true})
        }

        switch(formData.get('action')?.toString()){
            case 'question': {
                if( !formData.has('asker')){
                    return fail(400, {name:'Missing Name', fail:true})
                }
                if( !formData.has('reason')){
                    return fail(400, {name:'Missing Reason', fail:true})
                }

                const asker:string = formData.get('asker')?.toString()!
                const reason:string = formData.get('reason')?.toString()!

                if( asker.length == 0 ){
                    return fail(400, {message:'Missing Name', fail: true})
                }

                let question:Question = new Question(asker, reason)
                Q.questions.push(question)

                sendEvent(Q.name, {name:"add", message:question.toJSON()})
                break;
            }
            default: {
                break;
            }
        }
        return {sucess:true}
    }
}