<script>
  import { onMount } from "svelte";
    import Sidebar from "../../../lib/Sidebar.svelte"
    import { supabase } from "../../../lib/supabaseClient";
    import FlashcardMediaBox from "../../../lib/FlashcardMediaBox.svelte";
    let dialog, flashCardName, flashCardLangID
    let availableLanguages = $state([])
    let userID = $state()
    let username = $state("")
    let flashcardDecks = $state([])
    onMount( async () => {
             fetchUserSesson()
            fetchLanguages()
            dialog.close()
        } 
    ) 
        $effect(async () => {
            if(userID){
                const { data, error } = await supabase
                    .from("flashcard_decks")
                    .select("*")
                if (error) {
                    // If error fetching flashcard decks
                    console.error('Error fetching flashcard decks:', error)
                }
                flashcardDecks = data || [] // Assign fetched data to flashcardDecks
                console.log(flashcardDecks)
            }
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

    async function uploadFlashcardDeck(name, user, lang, country, username) {
        const {error} = await supabase
            .from("flashcard_decks") 
            .insert({name: name, author : user, author_username: username, language: lang, country_code: country, content: []})   
        console.log(error)
        location.reload(); 
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
            // Fetches username based ff ID
            const { data, error } = await supabase
                .from("profiles")
                .select("username")
                .eq("user_id", userID)
                .single()
            if (data) {
                username = data.username
            }
            if(error){
                console.log(error)
            }
        }
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
            {#if !flashcardDecks[0]}
                <p class="not-found">:/ Oops! No flashcards found; try uploading your own or try again later.</p>
            {/if}
            {#each flashcardDecks as flashcardDeck}
            <FlashcardMediaBox name={flashcardDeck.name} author={flashcardDeck.author_username} terms={flashcardDeck.content.length} country={flashcardDeck.country_code} id={flashcardDeck.id}/>
        {/each}
        </section>
    </section>
    </section>
</main>
    

    <dialog bind:this={dialog}>
        <div class="dialog-container">
            <div>
                <h2>Create Flashcard Deck</h2>
                <h1>{availableLanguages[flashCardLangID]}</h1>
                <form onsubmit={(event) => {uploadFlashcardDeck(flashCardName, userID, availableLanguages[flashCardLangID].short,  availableLanguages[flashCardLangID].country_code, username);}}>
                    <span>
                    <label>Deck name:</label>
                    <input class="name" bind:value={flashCardName}>
                    </span>
                    <span>
                    <label>Language:</label>
                    <select class="language" bind:value={flashCardLangID}>
                        <option value="">--Select language--</option>
                        {#if availableLanguages}
                        {#each availableLanguages as language, i}                 
                            <option value={i}>{language.emoji} {language.name}</option>
                        {/each}
                        {/if}
                    </select>
                    </span>
                    <input class="submit-btn" type="Submit">
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
        background-color: #fff;
    }
    button{
        display: block;
        width: fit-content;
        height: fit-content;
        padding: 0.5em 1em;
        background-color: inherit;
    }
    .main-content{
        display: flex;
        flex-direction: column;
        gap:1em;
    }
    .create-flashcard-deck{
        background-color: #4A70A9;
        box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
        border: none;
        font-size: 1.25em;
        height: 1.75em;
        width: 100%;
        color: #fff;
        font-weight: bold;
        float: left;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5em;
    }
    .create-flashcard-deck:hover{
        background-color: #3c5a87;
        box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
    }
    .flashcard-decks{
        display: flex;
        flex-wrap: wrap;
        padding: 0.25em 0.1em;
        gap: 1em;
        background-color: inherit;
        align-content: flex-start;
    }
    dialog{
        background-color: #f7f7f7;
        padding: 1em;
        width: 25em;
        height: fit-content;
        border-radius: 1.5em;
        border: none;
        box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
    }
    .dialog-container{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap:0.5em;
        height: 100%;
    }
    .close-dialog-button,
    .submit-btn{
        width: 100%;
        box-shadow: inset 0 1px 2px #ffffff90,
        0 1px 2px #00000010,
        0 2px 4px #00000010;
        border: none;
        font-size: 1em;
        border-radius: 0.5em;
        height: 2em;
        font-weight: bold;
    }
    .close-dialog-button{
        background-color: #fff;
    }
    .close-dialog-button:hover{
                box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
    }
    .submit-btn{
                background-color: #4A70A9;
        box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
        border: none;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .submit-btn:hover{
        background-color: #3c5a87;
        box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
    }
    form{
        display: flex;
        flex-direction: column;
        gap:1em;
    }
    input{
        width: 90%;
        height: 2.5em;
        padding: 0 0.5em;
        border:none;
                box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
        font-size: 1em;
    }
    select{
        height: 2em;
        width: 17.15em;
        border:none;
                box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    }
    .not-found{
        font-weight: bold;
        color: #c5c5c5;
    }
    span{
        display: flex;
        flex-direction: column;
        align-items: left;
        justify-content: left;
        gap:0.5em;
    }
    h2,
    h1{
        margin: 0.2em 0;
    }
    h2{
        text-align: center;
    }
</style>