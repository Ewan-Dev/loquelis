<script>
    import { supabase } from "../lib/supabaseClient.js"
    import Sidebar from "../lib/Sidebar.svelte"; 
    import MediaBox from "../lib/MediaBox.svelte";

    let language = 'german'; // Default language for music for now until user selection function is implemented
    let songs = [] // List to store fetched music data

    // Fetch music data from Supabase
    async function fetchMusic() {
        const { data, error } = await supabase
            .from('music') // From the 'music' table
            .select('*') // Select all columns
            .eq('language', language); // Filter by language
        if (!error) {
            songs = data || []; // If data is returned, assign it to songs
        } else {
            console.error('Error fetching music:', error);
        }
    }

    fetchMusic();

</script>

<main>
    <Sidebar currentPage="/music"/> 
        <h1>Music</h1>

    <!-- For each song, create a MediaBox component -->
    {#each songs as song} 
    <MediaBox 
        name={song.name} 
        artist={song.artist} 
        cover={song.cover} 
        level={song.level} 
        rating={song.rating} />
    {/each}
</main>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }

</style>