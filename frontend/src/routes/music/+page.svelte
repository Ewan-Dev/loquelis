<script>
    import { supabase } from "../../../lib/supabaseClient";
    import Sidebar from "../../../lib/Sidebar.svelte"; 
    import MediaBox from "../../../lib/MediaBox.svelte";
  import { onMount } from "svelte";
  
    let language = 'ko'; // Default language for music for now until user selection function is implemented
    let songs = $state([]) // List to store fetched music data
    let availableLanguages = $state([]) // List to store fetched languages available
    let currentLanguage = $state("") // Current language to fetch media
    let mediumLang = $state("")
    let mainLanguage = $state("")
    let mainSubLanguage = $state("")
    // Fetch music data from Supabase
    async function fetchSongs(lang) {
        const { data, error } = await supabase
            .from('media') // From the 'media' table
            .select('*') // Select all columns
            .eq('language', lang) // Filter by language
            .eq('media_type', 'music'); // Filter by media type
        if (!error) {
            console.log(songs)
            console.log(data)
            data.forEach((song) => {
                songs.push( song || []); // If data is returned, add it to songs
            })
            console.log(songs)
        } else {
            console.error('Error fetching songs:', error);
        }
    }
    $effect(() => {
        console.log(songs)
    })
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
        songs = []
        if (Array.isArray(mediumLang)){
            mediumLang.forEach((lang) => {
                console.log(lang)
                fetchSongs(lang) // Fetch song data when the component mounts
            })
    }
    })

    let furtherLanguageOptionsRow = $state()
    let furtherLanguageOptions = $state()
    $effect(() => {
            furtherLanguageOptionsRow = availableLanguages.find(r => r.short === mainLanguage)
        furtherLanguageOptions = furtherLanguageOptionsRow?.sub_options
        console.log(furtherLanguageOptions)
        })


        $effect(() => {
        if (mainLanguage.length === 1){
            mediumLang = mainLanguage
        }
        else{
            mediumLang = mainSubLanguage
        }
    })
    $effect(() => {
        console.log(mediumLang)
    })

</script>

<main class="route">
    <Sidebar currentPage="/music"/> 
    <section class="main-page">
    <h1 class="page-header">Songs</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
    <select bind:value={mainLanguage}>
        {#each availableLanguages as language}
            <option value={language.short}>{language.emoji} {language.name}</option>
        {/each}
    </select>
        {#if mainLanguage.length > 1}
            <span>          
            <label for="language">Select further detail:</label>
            <select class="language" required bind:value={mainSubLanguage}>
                <option value="">--Select--</option>
                {#each furtherLanguageOptions as option}                 
                    <option value={option.codes}>{option.name}</option>
                {/each}
            </select>
            </span>
        {/if}
     <section class="media-container">
        {#if !songs[0] && mediumLang}
        <p class="not-found">:/ Oops! No songs found; try uploading your own or try again later.</p>
        {/if}
        {#if !mainLanguage}
            <p>Try selecting a language to show media. If no languages show up, come back later as the servers may be down.
            </p>
        {/if}
        <!-- For each song, create a MediaBox component -->
        {#each songs as song} 
        <MediaBox 
        name={song.name} 
        artist={song.artist} 
        cover={song.cover} 
        level={song.level} 
        rating={song.rating}
        link={`#/app/songs/${song.id}`} 
        type="song"/>
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
        .not-found{
        font-weight: bold;
        color: #c5c5c5;
    }
        select {
        background-color: inherit;
    }
</style>