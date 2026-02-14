<script>
   import { onMount } from "svelte";
    import { supabase } from "./supabaseClient"
    import InlineStatus from "./InlineStatus.svelte";
    let {definition, word, partOfSpeech, romanisation, language} = $props() // Pass 
    let definitionStatus = $state({message: "", type: ""}) // Object to store status from ayncronous request
    let currentDeckID = $state() // Current dec ID
    let flashcardDecks = $state([]) // Stores flashcard decks
    let infoDialog = $state(HTMLObjectElement) // The dialog box with deck info
    let definitionBox = $state(HTMLObjectElement)
    let userID = $state("")

    onMount( async () => {
         fetchUserSesson()
    })
        $effect( async () => {
        if (userID) {
            flashcardDecks = await fetchUserFlashcardDecks(userID)
            console.log(flashcardDecks)
        } else {
            flashcardDecks = []
        }
})
    $inspect(definitionStatus)

    // Fetch current flashcards lin deck
    async function fetchFlashcardData(id){
        const { data, error } = await supabase
            .from("flashcard_decks")
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
            .from("flashcard_decks")
            .update({ content: flashcards })
            .eq("id", id)
         if (error && error.message === `invalid input syntax for type bigint: "undefined"`){
            definitionStatus = {type: "error", message: "You haven't selected a deck. Try making one on 'Flashcards' page"}
            return error
        }
        else if(error){
            definitionStatus = {type: "error", message: gerror.message}
            return error
        }
        definitionStatus = {type: "success", message: "Added!"}
    }

    async function fetchUserFlashcardDecks(user) {
        language = "language"
        const { data, error } = await supabase
        .from("flashcard_decks")
        .select("*")
        .eq("author", user)

        if (error) {
            console.error(error)
            definitionStatus = {type: "error", message: error.message}
            return error
        }
        console.log(data)
        return data
    } 
        
    // Fetch user session, get UID, then fetch from profiles table to get the username
    async function fetchUserSesson() {
        const { data, error } = await supabase.auth.getSession()
        const sessionData = data // Store session data
        if (error) { //Id error fetching user
            console.error('Error fetching session:', error)
        } 
        else if(sessionData) { // If data exists
            userID = sessionData.session.user.id
        }
    }
</script>

<section class="definition-container">
    {#if word}
    <section class="definition">
    <div class="header">
        <h1>{word}</h1>
        <button class="close-btn" on:click={word = ''}>✕</button>
    </div>
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
        {/if}
            <InlineStatus type={definitionStatus.type} message={definitionStatus.message}/>
</section>
{/if}
</section>
<style>


    .definition{
        height: fit-content;
        width: 12.5em;
        background-color: #ffffff ;
        padding: 0.5em;
                box-shadow: inset 0 1px 2px #ffffff30,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
        border: none;
        border-radius: 1em;
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
        background-color: #4A70A9;
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
        gap:0.2em;
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
    .flashcard-upload{
        background-color: #ffffff;
        width: fit-content;
        display: flex;
        justify-content: center;
        align-content: center;
    }
    .flashcard-btn{
        background-color: #f0f0f0;
        margin: 0;
        border: none;
        padding: 0.5em;
                box-shadow: inset 0 1px 2px #ffffff30,
                0 1px 2px #00000030,
                0 2px 4px #00000015;

    }
    select{
        background-color: #ffffff;
        margin: 0;
    }

.definition {
  z-index: 9999;
  color: black;
  height: fit-content;
  margin: 0;
  width:  fit-content;
}

.definition-container{
    width: fit-content;
    height: fit-content;
    background-color: transparent;
    overflow:visible;
}
@media (min-width: 1200px) {
     .definition{
        margin: 0;
     }
     .definition-container{
        width: 15em;
     }
    }
    .header{
    display: flex;
    justify-content: space-between;
}
.close-btn{
    width: 1.5em;
    height: 1.5em;
    display: flex;
    align-items: center;
    justify-self: center;
    border-radius: 50%;
}
</style>