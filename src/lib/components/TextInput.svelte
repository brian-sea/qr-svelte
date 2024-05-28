<script lang='ts'>
    let {textLabel, inputName, multiline = false} = $props()
</script>

<style>
    div {
        display: inline-block;
        position: relative;
        border: 1px solid black;
    }
    span{
        display: inline-block;
        width: 100%;
        padding-left: 10px;

        position: absolute;
        top: 10px;
        left: 0;
        z-index: 1;
        pointer-events: none;

        transition: all 50ms linear;
    }

    input[type='text'], textarea{
        display: inline-block;
        width: 100%;
        height: 100%;
        border: 0;
        padding: 10px;

        flex: 1;
        resize: none;
        outline: none;
    }
    input[type='text']:focus + span,
    textarea:focus + span {
        background: white;
        top: -50%;
        padding-left: 10px;
        padding-right: 10px;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
    }
</style>

<div>
    {#if multiline}
    <textarea name={inputName as string}>

    </textarea>
    {:else}
        <input type='text' name={inputName as string}>
    {/if}
    <span>{textLabel}</span>
</div>
