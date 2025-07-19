<script>
  import { onMount } from "svelte";
    import Sidebar from "../../lib/Sidebar.svelte"
    import { supabase } from "../../lib/supabaseClient";
    import FlashcardMediaBox from "../../lib/FlashcardMediaBox.svelte";
    
    let lang = "de" // Example language for now until languages are attributed to accounts
    let flashcardDecks = []
    onMount(() => {
        (async () => {
             const { data, error } = await supabase
                .from("flashcards")
                .select("*")
                .eq("language", lang)
            flashcardDecks = data
        })
        ()
           
    })      



</script>

<main class="route">
    <Sidebar currentPage="/flashcards"/> 
    <section class="main-page">
    <h1 class="page-header">Flashcards</h1>
    <!-- Main content section for styles to be applied -->
    <section class="main-content">
        {#each flashcardDecks as flashcardDeck}
        <FlashcardMediaBox name={flashcardDeck.name} author={flashcardDeck.author} terms=6 lang={flashcardDeck.language}/>
        {/each}
    </section>
    </section>
</main>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }
</style>