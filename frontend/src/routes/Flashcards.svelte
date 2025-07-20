<script>
  import { onMount } from "svelte";
    import Sidebar from "../../lib/Sidebar.svelte"
    import { supabase } from "../../lib/supabaseClient";
    import FlashcardMediaBox from "../../lib/FlashcardMediaBox.svelte";
    let dialog, flashCardName, flashCardLang
    let availableLanguages = $state([])
    let username = "samwu" // Example username until i add dynamic reading with auth
    let flashcardDecks = $state([])
    onMount(() => {
        (async () => {
            fetchLanguages()
            dialog.close()
             const { data, error } = await supabase
                .from("flashcards")
                .select("*")
                .eq("author", username)
            flashcardDecks = data
        })
        ()
           
    })  
     async function fetchLanguages(){
        const {data, error} = await supabase
            .from("languages")
            .select("*")
        if(data){
            availableLanguages = data
            console.log(availableLanguages)
            return data
        }
        if (error){
            throw error
    }}

    async function uploadFlashcardDeck(name, user, lang) {
        const {error} = await supabase
            .from("flashcards") 
            .insert({name: name, author : user, language: lang})   
        console.log(error)
        }
    

</script>

<main class="route">
    <Sidebar currentPage="/flashcards"/> 
    <section class="main-page">
    <h1 class="page-header">Flashcards</h1>
    <!-- Main content section for styles to be applied -->
    <section class="main-content">
        <button class="create-flashcard-deck" onclick={() => dialog.showModal()}>+ Create Flashcard Deck</button>
        <section class="flashcard-decks">
            {#each flashcardDecks as flashcardDeck}
            <FlashcardMediaBox name={flashcardDeck.name} author={flashcardDeck.author} terms=6 lang={flashcardDeck.language}/>
        {/each}
        </section>
    </section>
    </section>

</main>
    

    <dialog bind:this={dialog}>
        <div class="dialog-container">
            <div>
                <h2>Create Flashcard Deck</h2>
                <form onsubmit={(event) => {event.preventDefault(); uploadFlashcardDeck(flashCardName, username, flashCardLang);}}>
                    <label>Deck name:</label>
                    <input class="name" bind:value={flashCardName}>
                    <label>Language:</label>
                    <select class="language" bind:value={flashCardLang}>
                        <option>--Select language--</option>
                        {#if availableLanguages}
                        {#each availableLanguages as language}                 
                            <option value={language.short}>{language.emoji} {language.name}</option>
                        {/each}
                        {/if}
                    </select>
                    <input type="Submit">
                </form>
            </div>
            <button class="close-dialog-button" onclick={() => dialog.close()}>Close</button>
        </div>
    </dialog>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }
    button{
        display: block;
        width: fit-content;
        height: fit-content;
        border-radius: 1em;
        padding: 0.5em 1em;
    }
    .main-content{
        display: flex;
        flex-direction: column;
    }
    .create-flashcard-deck{
        background-color: #4364ea;
        color: #F4F4F4;
        border: #1e379b 2.5px solid;
        font-weight: bold;
        float: left;
    }
    .create-flashcard-deck:hover{
        background-color: #1e379b;
        color: #F4F4F4;
        border: #1e379b 2.5px solid;
    }
    .flashcard-decks{
        display: flex;
        flex-wrap: wrap;
        gap: 1em;
    }
    dialog{
        padding: 0 0.5em;
        width: 20em;
        height: fit-content;
        border-radius: 1.5em;
    }
    .dialog-container{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap:1em;
        height: 100%;
    }
    .close-dialog-button{
        border-radius: 0;
    }
    form{
        display: flex;
        flex-direction: column;
    }
    input{
        width: 20em;
        height: 2em;
        padding: 0.05em;
        border-width: 0.15em;
    }
    select{
        height: 2em;
        width: 17.15em;
        border-width: 0.15em;
    }
</style>