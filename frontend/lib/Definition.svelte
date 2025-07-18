<script>
   import { onMount } from "svelte";
    import { supabase } from "./supabaseClient"
    import InlineStatus from "./InlineStatus.svelte";
    let {definition, word, partOfSpeech, romanisation} = $props() // Pass 
    const username = "samwu" // Example username before I add auth
    let definitionStatus = $state({message: "", type: ""})
    let currentDeckID = ""
    let flashcardDecks = []
    // Fetch current flashcards in deck
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
        flashcards.push({word, definition, partOfSpeech}) // Push to array of existing flashcards
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
        if (error) {
            console.error(error)
            definitionStatus = {type: "error", message: error.message}
            return error
        }
        return data
    } 
        onMount( async () => {
            flashcardDecks = await fetchUserFlashcardDecks(username) 
            console.log(flashcardDecks)
        })

        $inspect(definitionStatus)
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
        <span class="flashcard-upload">
            <button on:click={() => updateFlashcard(currentDeckID)}><span class="material-symbols-rounded">library_add</span></button>
            <select bind:value={currentDeckID}>
                {#each flashcardDecks as flashcardDeck}
                <option value={flashcardDeck.id}>{flashcardDeck.name}</option>
                {/each}
            </select>
        </span>
        {/if}
            <InlineStatus type={definitionStatus.type} message={definitionStatus.message}/>
    </section>
{/if}

<style>
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
    button{
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
        text-align: center;
         display: flex;
        flex-wrap: wrap;
        gap:0.25em;
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

    button:hover{
        background-color: #558cea;
        color: #ffffff;
        border-color: #3b69e8;
    }
</style>