<script>
    import { supabase } from "../../../lib/supabaseClient"
    import { location } from "svelte-spa-router";
    import Sidebar from "../../../lib/Sidebar.svelte"
  import { onMount } from "svelte";
    let slug = $state($location.split('/').pop()) // Gets the last part of the path - the slug
    let flashcardsContent = $state([]) // State to hold the flashcard content
    onMount(async () => {
        const flashcards = await fetchFlashcard(slug)
        if (flashcards) {
            flashcardsContent = flashcards.content // Assuming 'content' is the field that holds the flashcard data
        } else {
            console.error("Flashcards not found")
        }
    })

    async function fetchFlashcard(id) {
        const { data, error } = await supabase
            .from("flashcards") // From flashcards table
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
        {#each flashcardsContent as flashcard}
            <div class="flashcard">
                <h1>{JSON.parse(flashcard).word}</h1>
                {#if JSON.parse(flashcard).romanisation}
                    <i><p class="romanisation">{JSON.parse(flashcard).romanisation}</p></i>
                {/if}
                <p>{JSON.parse(flashcard).definition}</p>
                <p class="part-of-speech">{JSON.parse(flashcard).partOfSpeech}</p>
            </div>
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