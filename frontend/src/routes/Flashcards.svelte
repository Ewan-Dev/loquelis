<script>
  import { onMount } from "svelte";
    import Sidebar from "../../lib/Sidebar.svelte"
    import { supabase } from "../../lib/supabaseClient";
    let lang = "en" // Example language for now until languages are attributed to accounts
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
        <p>{flashcardDeck.id}</p>
        <p>{flashcardDeck.name}</p>
        <p>{flashcardDeck.content}</p>
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