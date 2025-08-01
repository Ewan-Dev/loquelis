<script>
  import { onMount } from "svelte";
    import Sidebar from "../../../lib/Sidebar.svelte"
    import { supabase } from "../../../lib/supabaseClient";
    import FlashcardMediaBox from "../../../lib/FlashcardMediaBox.svelte";
    let dialog, flashCardName, flashCardLang
    let availableLanguages = $state([])
    let username = $state("")
    let flashcardDecks = $state([])
    onMount( async () => {
             fetchUserSesson()
            fetchLanguages()
            dialog.close()
        } 
    ) 
        $effect(async () => {
             const { data, error } = await supabase
                .from("flashcards")
                .select("*")
                .eq("author", username)
            if (error) {
                // If error fetching flashcard decks
                console.error('Error fetching flashcard decks:', error)
            }
            flashcardDecks = data || [] // Assign fetched data to flashcardDecks
        })
    // Fetch user session, get UID, then fetch from profiles table to get the username
    async function fetchUserSesson() {
        const { data, error } = await supabase.auth.getSession()
        const sessionData = data // Store session data
        if (error) { //Id error fetching user
            console.error('Error fetching session:', error)
        } 
        else if(sessionData) { // If data exists
            const uid = sessionData.session.user.id // Get UID from session
            // Use the UID to fetch username
            const { data, error} = await supabase
                .from("profiles")
                .select("username")
                .eq("uid", uid)
                .single()
            if (data) {
                username = data.username // Set username to username from profiles table
        }
            if (error) {
                // If error fetching username
                console.error('Error fetching username:', error)
            }
        }
    }

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
    
        $inspect(flashcardDecks)
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
            <FlashcardMediaBox name={flashcardDeck.name} author={flashcardDeck.author} terms=6 country={flashcardDeck.language} id={flashcardDeck.id}/>
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
                            <option value={language.country_code}>{language.emoji} {language.name}</option>
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