<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
     let { type = "info", message = "Information", width = "100%" } = $props();
     let icons = {
         info: "info",
         error: "error",
         success: "check_circle",
         warn: "warning"
     }
    let timeoutID;
    let visible = $state(true);
    $effect(()=> {
        visible = false
        if(message){
            visible = true
            clearTimeout(timeoutID)
            timeoutID = setTimeout(() => {
            visible = false
            }, 5000) // Hide status after 3 seconds
        }
        return () => {
            visible = false
            clearTimeout(timeoutID)
        } 
        })
</script>
{#if visible}
<section style="width:{width};" role="status" class={type} transition:fade={{ duration:400}}>
    <span class={`${type} material-symbols-rounded`}>{icons[type]}</span>
    <p class={type}>{ message }</p>
    </section>
{/if}

<style>
    p {
        font-size: 0.75em;
        margin: 0;
        font-weight: 500;
    }
    section{
        height: fit-content;
        min-width: 7em;
        margin: 0.5em;
        margin-left: 0;
        padding: 0.5em;
        border-radius: 0.5em;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: center;
        border: none;
        gap: 0.5em;
        box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000005,
                0 2px 4px #00000005;
    }

    .info {
        background-color: #ABBFED;
        color: #3B5998;
    }
    .error {
        background-color: #f96d6d;
        color: #631818;
    }
    .success {
        background-color: #A4F8BD;
        color: #437150;
    }
    .warn {
        background-color: #FFD967;
        color: #bb9e48;
    }

</style>