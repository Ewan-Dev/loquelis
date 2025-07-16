<script>
  import { onMount } from "svelte";
    import { supabase } from "./supabaseClient"
    const {definition, word, partOfSpeech} = $props() // Pass 
    const username = "samwu" // Example username before I add auth
    let currentDeckID = ""
    let flashcardDecks = []
    // Fetch current flashcards in deck
    async function fetchFlashcardData(id){
        const { data, error } = await supabase
            .from("flashcards")
            .select("content")
            .eq("id", id)
            
        if (error) {
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
            return error
        }
    }

    async function fetchUserFlashcardDecks(user) {
        const { data, error } = await supabase
            .from("flashcards")
            .select("*")
            .eq("author", user)
        if (error) {
            console.error(error)
            return error
        }
        return data
    } 
        onMount( async () => {
            flashcardDecks = await fetchUserFlashcardDecks(username) 
            console.log(flashcardDecks)
        })

</script>


{#if word} 
    <section>
        <h1>{word}</h1>
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

    </section>
{/if}

<style>
    section{
        height: fit-content;
        width: 12.5em;
        background-color: #fff ;
        border: #DBDBDB solid 2.5px ;
        padding: 0.5em;
        border-radius: 1em;
;
        z-index: 1;
    }


    h1,
    p{
        margin: 0;
    }

    h1{
        font-size: 2em;
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
        padding: 0.2em;
    }
    button,
    select{
        height: 1.5em;
        border-radius: 50%;
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
        margin-top: 0.5em;
        background-color: #eee;
        padding: 0.2em;
        border-radius: 500em;
        display: flex;
    }
    .material-symbols-rounded{
        font-size: 0.95em;
    }
</style>