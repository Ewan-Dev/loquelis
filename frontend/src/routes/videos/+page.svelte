<script>
    import { supabase } from "../../../lib/supabaseClient";
    import Sidebar from "../../../lib/Sidebar.svelte"; 
    import MediaBox from "../../../lib/MediaBox.svelte";
  import { onMount } from "svelte";
  
    let language = 'ko'; // Default language for video for now until user selection function is implemented
    let videos = $state([]) // List to store fetched video data
    let availableLanguages = $state([]) // List to store fetched languages available
    let currentLanguage = $state("") // Current language to fetch media
    let mediumLang = $state("")
    let mainLanguage = $state("")
    let mainSubLanguage = $state("")
    let availableCategories = $state("")
    let grouped = $state({})

    async function fetchCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            availableCategories = data
    }
    onMount(() => {
                fetchCategories()
    })
    $effect(() => {
        console.log(availableCategories)
    })
    // Fetch video data from Supabase
    async function fetchVideos(lang) {
        const { data, error } = await supabase
            .from('media') // From the 'media' table
            .select('*') // Select all columns
            .eq('language', lang) // Filter by language
            .eq('media_type', 'video'); // Filter by media type
        if (!error) {
            console.log(videos)
            console.log(data)
            data.forEach((video) => {
                videos.push( video || []); // If data is returned, add it to videos
            })
            console.log(videos)
            grouped = []
            await categoriseVideos(videos)
        } else {
            console.error('Error fetching videos:', error);
        }
    }

function getCategoryEmoji(category){
    const row = availableCategories.find(r => r.name === category)
    if (row){
        return row.emoji
    }
    else{
        return "🏷️"
    }
}

    async function categoriseVideos(videos){
                videos.forEach((video) => {
            if(video){
            let category = video.category
            if (!category){
                category = "Uncategorised"
            }
            if (!grouped[category] && category){
                grouped[category] = []
            }
            grouped[category].push(video)
        }
        console.log(grouped)
        })
    }
    $effect(() => {
        console.log(videos)
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
        videos = []
        if (Array.isArray(mediumLang)){
            mediumLang.forEach((lang) => {
                console.log(lang)
                fetchVideos(lang) // Fetch video data when the component mounts
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

</script>

<main class="route">
    <Sidebar currentPage="/videos"/> 
    <section class="main-page">
    <h1 class="page-header">Videos</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
    <select bind:value={mainLanguage} class="language-select">
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
        {#if !videos[0] && currentLanguage}
        <p class="not-found">:/ Oops! No videos found; try uploading your own or try again later.</p>
        {/if}
        {#if !mainLanguage}
            <p>Try selecting a language to show media. If no languages show up, come back later as the servers may be down.
            </p>
        {/if}
        <!-- For each video, create a MediaBox component -->
    
    <section class="categories-section">
    {#each Object.entries(grouped) as [category, videos]}
    <h1 class="category-title">{getCategoryEmoji(category)} {category}</h1>
    <section class="category-section">
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
    {/each}
    </section>
    </section>
    </section>
    </section>
</main>

<style>
      h1{
      margin: 0 0.35em 0.5em;
  }
  .main-page{
    background-color: transparent;
  }
   main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
            margin-right: 1em;
    }
    .main-content{
        display: flex;
        flex-direction: column;
        width: 90%;
        gap:1em;
        align-items: flex-start;
    }
    .media-container{
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
        width: 100%;
        background-color: transparent;
    }
        .not-found{
        font-weight: bold;
        color: #c5c5c5;
    }
        select {
        background-color: #fff;
        width: 100%;
    }
        @media (max-width: 500px){
    main{
      display: flex;
      flex-direction: column !important;
      background-color: transparent;
    }
  }
      .main-page{
        margin: auto 0.25em;
              background-color: transparent;
    }
    .category-section{
        display: flex;
                    gap: 1em;
        flex-direction: row;
              background-color: transparent;
        overflow: scroll;
        height: 17.5em;
    }
    .categories-section{
        background-color: transparent;
    }
    .page-header{
        margin-top: 0;
    }
</style>