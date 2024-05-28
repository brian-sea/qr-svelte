<script lang="ts">
    import { enhance } from '$app/forms';
    import {Queue,Question} from '$lib/Queue';
    import {source} from 'sveltekit-sse'
    import TextInput from '$lib/components/TextInput.svelte';

    let {data, form} = $props();

    let accountName:string = '';
    let Q: Queue = data.locals.queue;
 
    
    const sseSource = source(`/${Q.name}/sse`).select('message')
    sseSource.subscribe(async function run(value:string){
        if(value.length === 0 ){
            return "";
        }
        
        let data = await JSON.parse(value);
        let message = await JSON.parse(data.message)
        if( data.name === 'add' ) {
            Q.questions.push(new Question(message.asker, message.question))
        }
    })
</script>

<style>
    main {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    section.questionList {
        display: flex;
        flex-direction: column;

        flex-grow: 1;
    }

    details:not(:last-child) {
        border: 1px dashed black;
        border-radius: 10px;
        margin-bottom: 0.5em;
    }

    summary {
        font-size: 1.5rem;
        font-weight: bold;

        padding: 0.5em;
        background-color: rgb(12, 144, 253);
        border-bottom: 1px solid black;

        list-style-type: none;
        cursor: pointer;
        outline: 0;
    }

    p {
        padding: 0.5em;
    }  
    
    form {
        display: flex;
        flex-direction: column;
        padding: 0.5em;
    }
    form > div {
        display: flex;
        padding: 10px;
        flex-basis: 15vh;
        justify-content: space-around;
    }
</style>

<main>
    <h1>Welcome to {Q.name} </h1>

    <section class='questionList'>
        {#each Q.questions as question}
            <details>
                <summary>{question.asker}</summary>
                <p> {question.question} </p>
            </details>
        {/each}
    </section>

    <form method='POST' use:enhance>

        {#if accountName == '' }
            <TextInput textLabel='Name' inputName='asker'></TextInput>
        {/if}
        
        <div>
            <TextInput textLabel='Reason' inputName='reason' multiline></TextInput>
            <input type='submit' value='Post Question'/>    
        </div>
        <input type='hidden' name='action' value='question'/>
        {#if form?.fail}
            <div>
                {form.message}
            </div>
        {/if}
    </form>
</main>
