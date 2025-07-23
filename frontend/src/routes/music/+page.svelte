<script>
    import { supabase } from "../../../lib/supabaseClient";
    import Sidebar from "../../../lib/Sidebar.svelte"; 
    import MediaBox from "../../../lib/MediaBox.svelte";
    import { onMount } from "svelte";

    let songs = $state([]) // List to store fetched music data
    let availableLanguages = $state([]) // List to store fetched languages available
    let currentLanguage = $state("") // Current language to fetch media
    
    // Fetch music data from Supabase
    async function fetchMusic(lang) {
        const { data, error } = await supabase
            .from('media') // From the 'media' table
            .select('*') // Select all columns
            .eq('language', lang) // Filter by language
            .eq('media_type', 'music'); // Filter by media type
        if (!error) {
            songs = data || []; // If data is returned, assign it to songs
            console.log(data)
        } else {
            console.error('Error fetching music:', error);
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
    }
}
    onMount(() => {
        fetchLanguages()
    })

    $effect(() => {
         fetchMusic(currentLanguage)
    })
</script>

<main class="route">
    <Sidebar currentPage="/music"/> 
    <section class="main-page">
    <h1 class="page-header">Music</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
    <select bind:value={currentLanguage}>
        {#each availableLanguages as language}
            <option value={language.short}>{language.emoji} {language.name}</option>
        {/each}
    </select>
    <section class="media-container">
        <!-- For each song, create a MediaBox component -->
        {#each songs as song} 
        <MediaBox 
            name={song.name} 
            artist={song.artist} 
            cover={song.cover} 
            level={song.level} 
            rating={song.rating}
            link={`#/app/music/${song.id}`} />
    {/each}
    </section>
    </section>
    </section>
</main>

<style>
   main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }
    .main-content{
        display: flex;
        flex-direction: column;
    }
    .media-container{
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
        width: 100%;
    }
</style>