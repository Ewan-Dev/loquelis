<script>
    import { supabase } from "../../../lib/supabaseClient";
    import Sidebar from "../../../lib/Sidebar.svelte"; 
    import MediaBox from "../../../lib/MediaBox.svelte";

    let language = 'german'; // Default language for music for now until user selection function is implemented
    let songs = [] // List to store fetched music data

    // Fetch music data from Supabase
    async function fetchMusic() {
        const { data, error } = await supabase
            .from('media') // From the 'media' table
            .select('*') // Select all columns
            .eq('language', language) // Filter by language
            .eq('media_type', 'music'); // Filter by media type
        if (!error) {
            songs = data || []; // If data is returned, assign it to songs
        } else {
            console.error('Error fetching music:', error);
        }
    }

    fetchMusic();

</script>

<main class="route">
    <Sidebar currentPage="/music"/> 
    <section class="main-page">
    <h1 class="page-header">Music</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
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
</main>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }

</style>