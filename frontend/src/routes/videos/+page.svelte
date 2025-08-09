<script>
    import { supabase } from "../../../lib/supabaseClient";
    import Sidebar from "../../../lib/Sidebar.svelte"; 
    import MediaBox from "../../../lib/MediaBox.svelte";
  import { onMount } from "svelte";
  
    let language = 'ko'; // Default language for video for now until user selection function is implemented
    let videos = $state([]) // List to store fetched video data
    let availableLanguages = $state([]) // List to store fetched languages available
    let currentLanguage = $state("") // Current language to fetch media
    
    // Fetch video data from Supabase
    async function fetchVideos(lang) {
        const { data, error } = await supabase
            .from('media') // From the 'media' table
            .select('*') // Select all columns
            .eq('language', lang) // Filter by language
            .eq('media_type', 'video'); // Filter by media type
        if (!error) {
            console.log(videos)
            videos = data || []; // If data is returned, assign it to videos
        } else {
            console.error('Error fetching videos:', error);
            videos = []
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
        fetchVideos(currentLanguage) // Fetch video data when the component mounts
    })


</script>

<main class="route">
    <Sidebar currentPage="/videos"/> 
    <section class="main-page">
    <h1 class="page-header">Videos</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
    <select bind:value={currentLanguage}>
        {#each availableLanguages as language}
            <option value={language.short}>{language.emoji} {language.name}</option>
        {/each}
    </select>
     <section class="media-container">
        {#if !videos[0]}
        <p class="not-found">:/ Oops! No videos found; try uploading your own or try again later.</p>
        {/if}
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
        width: 100%;
    }
    .media-container{
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
        width: 100%;
    }
    .not-found{
        font-weight: bold;
        color: #c5c5c5;
    }
</style>