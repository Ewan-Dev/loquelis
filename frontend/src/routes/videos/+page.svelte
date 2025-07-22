<script>
    import { supabase } from "../../../lib/supabaseClient";
    import Sidebar from "../../../lib/Sidebar.svelte"; 
    import MediaBox from "../../../lib/MediaBox.svelte";
  import { onMount } from "svelte";
    let language = 'ko'; // Default language for music for now until user selection function is implemented
    let videos = $state([]) // List to store fetched music data

    // Fetch music data from Supabase
    async function fetchMusic() {
        const { data, error } = await supabase
            .from('media') // From the 'media' table
            .select('*') // Select all columns
            .eq('language', language) // Filter by language
            .eq('media_type', 'video'); // Filter by media type
        if (!error) {
            console.log(videos)
            videos = data || []; // If data is returned, assign it to videos
        } else {
            console.error('Error fetching videos:', error);
        }
    }

    onMount(() => {
        fetchMusic() // Fetch music data when the component mounts
    })

</script>

<main class="route">
    <Sidebar currentPage="/music"/> 
    <section class="main-page">
    <h1 class="page-header">Videos</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
        <!-- For each video, create a MediaBox component -->
    {#each videos as video} 
    <MediaBox 
        name={video.name} 
        artist={video.artist} 
        cover={video.cover} 
        level={video.level} 
        rating={video.rating}
        link={`#/app/videos/${video.id}`} 
        type="video"/>
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