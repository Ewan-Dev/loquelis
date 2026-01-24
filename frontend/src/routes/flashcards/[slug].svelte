<script>
    import { supabase } from "../../../lib/supabaseClient"
    import { location } from "svelte-spa-router";
    import Sidebar from "../../../lib/Sidebar.svelte"
    import FlashcardDeck from "../../../lib/FlashcardDeck.svelte";
    import { onMount } from "svelte";
    let slug = $state($location.split('/').pop()) // Gets the last part of the path - the slug
    let flashcardsContent = $state([]) // State to hold the flashcard content
    let flashcardsLength = $state(0) // State to hold the length of the flashcards
    let {flashcardDeckName, flashcardDeckAuthor} = $state("")
    
    onMount(async () => {
        const flashcards = await fetchFlashcard(slug)
        if (flashcards) {
            flashcardDeckName = flashcards.name
            flashcardDeckAuthor = flashcards.author_username
            flashcardsContent = flashcards.content // Assuming 'content' is the field that holds the flashcard data
            flashcardsLength = flashcardsContent.length // Get the length of the flashcards
            console.log(flashcardsLength)
        } else {
            console.error("Flashcards not found")
        }
    })

    async function fetchFlashcard(id) {
        const { data, error } = await supabase
            .from("flashcard_decks") // From flashcards table
            .select("*") // Fetch all fields
            .eq("id", id) // Fetch by ID
            .single() // Fetches a single flashcard by ID
        if (error) {
            console.error(error)
            return
        }
        return data
    }
</script>

<main class="route">
    <Sidebar currentPage="/flashcards"/> 
    <section class="main-page">
    <h1 class="page-header">Flashcards</h1>
    <section class="main-content">
        {#if flashcardsContent && flashcardsContent.length > 0}
            <FlashcardDeck content={flashcardsContent}  backContent={["part-of-speech", "definition"]} deckName={flashcardDeckName} author={flashcardDeckAuthor}/>
        {/if}
        {#if !flashcardsContent.length > 0}
            <h3>Oops! Looks like there are no cards in this deck. Try going to a video, song or AI Chat and add some!</h3>
        {/if}
    </section>
    </section>
</main>
    
<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
        background-color: #fff;
    }
    .main-content {
        flex: 1; /* Allow main content to take available space */
        display: flex;
        flex-direction: column;
        align-items: center; /* Center the flashcard deck */
    }
</style>