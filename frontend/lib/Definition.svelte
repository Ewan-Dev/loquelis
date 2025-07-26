<script>
   import { onMount } from "svelte";
    import { supabase } from "./supabaseClient"
    import InlineStatus from "./InlineStatus.svelte";
    let {definition, word, partOfSpeech, romanisation, language} = $props() // Pass 
    const username = "samwu" // Example username before I add auth
    let definitionStatus = $state({message: "", type: ""}) // Object to store status from ayncronous request
    let currentDeckID = $state() // Current dec ID
    let flashcardDecks = $state([]) // Stores flashcard decks
    let infoDialog = $state(HTMLObjectElement) // The dialog box with deck info
    // Fetch current flashcards lin deck
    async function fetchFlashcardData(id){
        const { data, error } = await supabase
            .from("flashcards")
            .select("content")
            .eq("id", id)
            
        if (error) {
            definitionStatus = {type: "error", message: error.message}
            return[]
        }
        return data[0].content // The content
    }

    // Append the new word to existing content and update database
    async function updateFlashcard(id) {
        const flashcards = await fetchFlashcardData(id) // Existing flashcards in deck
        flashcards.push({word, definition, partOfSpeech, romanisation}) // Push to array of existing flashcards
       // Update newly changed array to database
        const { error } = await supabase
            .from("flashcards")
            .update({ content: flashcards })
            .eq("id", id)
        if(error){
            definitionStatus = {type: "error", message: error.message}
            return error
        }
        definitionStatus = {type: "success", message: "Added!"}
    }

    async function fetchUserFlashcardDecks(user) {
        const { data, error } = await supabase
            .from("flashcards")
            .select("*")
            .eq("author", user)
            .eq("language", language)
        if (error) {
            console.error(error)
            definitionStatus = {type: "error", message: error.message}
            return error
        }
        return data
    } 
        $effect( async () => {
            flashcardDecks = await fetchUserFlashcardDecks(username) 
        })


</script>


{#if word} 
    <section>
        <h1>{word}</h1>
        {#if romanisation}
            <i><p class="romanisation">{romanisation}</p></i>     
        {/if}
        <p class="part-of-speech">{partOfSpeech}</p>
        <p>{definition}</p>
        {#if flashcardDecks}
        <span class="flashcard-functions">
            <span class="flashcard-upload">
                <button class="add-to-deck flashcard-btn" on:click={() => updateFlashcard(currentDeckID)}><span class="material-symbols-rounded">library_add</span></button>
                <select bind:value={currentDeckID}>
                    {#each flashcardDecks as flashcardDeck}
                    <option value={flashcardDeck.id}>{flashcardDeck.name}</option>
                    {/each}
                </select>
            </span>
             <button class="info-flashcards-btn flashcard-btn" on:click={infoDialog.showModal()} ><span class="material-symbols-rounded">info</span> <!--Opens dialog/modal box on button click-->
  
            </button>
        </span>
         <dialog class="info-flashcards-container" bind:this={infoDialog}>
             <strong class='definition-info-header'>Where's my deck?</strong>
            <p class='definition-info-body'>This is as you may not yet have a deck for the language you are curretly studying; You can only add words to decks of the same language</p>
            <button on:click={infoDialog.close()} class="close-dialog">OK</button> <!--Closes the dialog box with info about decks-->
        </dialog>
            <InlineStatus type={definitionStatus.type} message={definitionStatus.message}/>

{/if}
        </section>
{/if}
<style>

    /**
    TODO:
    - Style dialog box
    */

    section{
        height: fit-content;
        width: 12.5em;
        background-color: #fff ;
        border: #DBDBDB solid 2.5px ;
        padding: 0.5em 0.5em 0;
        border-radius: 1em;
        z-index: 1;
    }

    p{
        margin: 0.2em 0;
    }

    h1{
        font-size: 2em;
        margin: 0;
    }
    .part-of-speech{
        font-weight: bold;
        color: #ffffff;
        background-color: #2c67fa;
        width: fit-content;
        padding: 0.15em 0.2em;
        border-radius: 0.4em;
    }
    select{
        padding: 0 0.5em;
        width: fit-content;
        display: inline-block;
        border-radius: 100em;
    }
    button,
    select{
        height: 1.5em;
    }
    .flashcard-btn{
        width: 1.5em;
        text-align: center;
        font-size: 1em;
        display: flex;
        justify-content: center;
        align-items: center;
        border: #c5c5c5 1.75px solid;
        color: #545454;
        padding: 0.3em;
        border-radius: 100%;
    }
    span{
        font-size: 1em;
        text-align: left;
    }
    dialog{
        width: 17.5em;
        border-radius: 16px;
    }
    .flashcard-upload{
        height: fit-content;
        width: fit-content;
        margin: 0.5em 0;
        background-color: #eee;
        padding: 0.2em;
        border-radius: 500em;
        display: flex;
    }

    .material-symbols-rounded{
        font-size: 0.95em;
    }
    .flashcard-functions{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap:0.25em;
    }
    .add-to-deck:hover{
        background-color: #558cea;
        color: #ffffff;
        border-color: #3b69e8;
    }
    .close-dialog {
        height: 1.75em;
        width: 5em;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: #545454 2px solid;
    }

</style>