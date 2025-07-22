<script>
    import { supabase } from "../../../lib/supabaseClient";
    import Sidebar from "../../../lib/Sidebar.svelte"; 
    import MediaBox from "../../../lib/MediaBox.svelte";
  import { onMount } from "svelte";
    let language = $state("uk")// Language for music, default to English but changes according to select
    let songs = $state([]) // List to store fetched music data
    let availableLanguages = $state([]) // List of available languages for music
    
    // Fetch music data from Supabase
    async function fetchMusic(lang) {
        console.log("Fetching music for language:", lang);
        const { data, error } = await supabase
            .from('media') // From the 'media' table
            .select('*') // Select all columns
            .eq('language', lang) // Filter by language
            .eq('media_type', 'music'); // Filter by media type
        if (!error) {
            songs = data || []; // If data is returned, assign it to songs
            console.log(songs)
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
        fetchLanguages() // Fetch available languages when the component mounts
    })

    $effect(() => {
        fetchMusic(language) // Fetch music whenever the language changes
    })
</script>

<main class="route">
    <Sidebar currentPage="/music"/> 
    <section class="main-page">
    <h1 class="page-header">Music</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
             <select bind:value={language} class="language-select">
            {#each availableLanguages as lang}
                <option value={lang.short}>{lang.emoji} {lang.name}</option>
            {/each}
        </select>
    <div class="music-container">
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
    </div>
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
        gap: 1em;
        flex-direction: column;
    }
    .music-container{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }

</style>