<script>
    import { supabase } from "../../lib/supabaseClient.js";
    import Sidebar from "../../lib/Sidebar.svelte";
    import InlineStatus from "../../lib/InlineStatus.svelte";
    import confetti from "canvas-confetti";
    import { onMount } from "svelte";

    // Initialize with empty error
    let error = $state({name: "", type: ""});
    let mediumType = "";
    let mediumURL = "";
    let mediumLang = $state("");
    let mediumLangFurther = $state("");
    let mediumLevel = "";
    let mediumCategory = "";
    let availableLanguages = $state([]);
    let availableCategories = $state([])
    let userID = $state("")
    let username = $state("")


    let furtherLanguageOptionsRow = $state()
    let furtherLanguageOptions = $state()
    $effect(() => {
            furtherLanguageOptionsRow = availableLanguages.find(r => r.short === mediumLang)
        furtherLanguageOptions = furtherLanguageOptionsRow?.sub_options
        console.log(furtherLanguageOptions)
        })

    availableCategories = [
        {name: "Comedy", emoji: "🤣"},
        {name: "Cartoon", emoji: "🖌️"},
        {name: "Documentary", emoji: "📑"},
        {name: "Sport", emoji: "⚽️"},
        {name: "History", emoji: "🏰"},
        {name: "Politics", emoji: "🇺🇳"},
        {name: "Action", emoji: "⚡️"},
        {name: "Reviews/Unboxings", emoji: "📦"},
        {name: "Gaming", emoji: "🎮"},
        {name: "Vlogs", emoji: "📷"},
        {name: "Movie/ Film", emoji: "🍿"},
        {name: "Series", emoji: "📺"},
        {name: "Cooking", emoji: "🍳"},
        {name: "Comedy", emoji: "🤣"},
        {name: "News", emoji: "📰"},
        {name: "Technology", emoji: "💽"},
        {name: "Story", emoji: "📚"},
        {name: "Hobby", emoji: "🎭"},
        {name: "Culture", emoji: "🌎"},
        {name: "Hobby", emoji: "🎭"},
        {name: "Children's", emoji: "👶"},
        {name: "Religion", emoji: "🙏"},
        {name: "Science", emoji: "🧪"},
        {name: "Interviews/Podcasts", emoji: "🎙️"},
        {name: "Linguistics", emoji: "💬"}
    





    ]
    function launchConfetti() {
        confetti({
            particleCount: 600,
            spread: 100,
            origin: { y: 0 }
        });
    }
    onMount( async () => {
        fetchUserSesson()
        fetchLanguages()
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


    async function handleUpload(mediumType, mediumURL, mediumLang, mediumLevel, mediumCategory) {
        try {
            const isUploaded = await isAlreadyUploaded(mediumURL);
            
            if (isUploaded) {
                error = { type: "warn", name: "This has already been uploaded to Loquela" };
                return;
            }
            
            if (mediumType === "video" || mediumType === "music") {
                await requestSubtitles(mediumURL, mediumLang, mediumType, mediumLevel, mediumCategory);
                error = { type: "success", name: "Beginning upload..." };
                launchConfetti();
            } else {
                error = { type: "error", name: "Error in link validation" };
            }
        } catch (err) {
            console.error("Upload error:", err);
            error = { type: "error", name: "Error in upload process" };
        }
    }

    async function requestSubtitles(url, lang, type, level, category) {
        const channel = supabase.channel("subtitles");
        await channel.subscribe();
        const result = await channel.send({
            type: "broadcast",
            event: "subtitle-update",
            payload: {id: 1, url: url, lang: lang, type: type, level: level, author: userID, author_username: username, category: category}
        });
        console.log("Broadcast result:", result);
    }

    async function isAlreadyUploaded(mediumURL) {
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('video_link', mediumURL)
            .single();

        if (error) {
            if (error.details && error.details.includes("0 rows")) {
                return false;
            }
            console.error("Database error:", error);
        }
        return !!data;
    }

    async function videoExists(mediumURL, mediumType, mediumLang, mediumLevel, mediumCategory) {
        try {
            const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(mediumURL)}&format=json`);
            console.log(response)
            console.log(mediumURL)
            if (!response.ok || !mediumURL.startsWith("https://www.youtube.com/watch?v=")) {
                error = { type: "error", name: "Invalid URL. Must be in format 'https://www.youtube.com/watch?v='" };
                return false;
            }
            
            await handleUpload(mediumType, mediumURL, mediumLang, mediumLevel, mediumCategory);
            return true;
        } catch (err) {
            console.error("Validation error:", err);
            error = { type: "error", name: "Error validating URL" };
            return false;
        }
    }

        // Fetch user session, get UID, then fetch from profiles table to get the userID
    async function fetchUserSesson() {
        const { data, error } = await supabase.auth.getSession()
        const sessionData = data // Store session data
        if (error) { //Id error fetching user
            console.error('Error fetching session:', error)
        } 
         else if(sessionData) { // If data exists
            userID = sessionData.session.user.id
            // Fetches username based ff ID
            const { data, error } = await supabase
                .from("profiles")
                .select("username")
                .eq("user_id", userID)
                .single()
            if (data) {
                username = data.username
            }
            if(error){
                console.log(error)
            }
        }
        if (error) {
            // If error fetching user id
            console.error('Error fetching userID:', error)
        }
        }
</script>

<main class="route ">
   <Sidebar currentPage="/upload" />
    <section class="main-page">
    <h1 class="page-header">Upload</h1>
        <section class="notice">
            <h3 class='notice-text'>Notice</h3>
            <p class='notice-text'>Please ensure video has subtitles enabled by creator!</p>
        </section>
    <section class="main-content">
        <form onsubmit={event => { event.preventDefault(); videoExists(mediumURL, mediumType, mediumLang, mediumLevel, mediumCategory); }}>
            <div class="vertical-container">
            <span>
                <label for="media">* Select media type:</label>
                <select class="media" bind:value={mediumType} required>
                    <option value="">--Pick the medium category--</option>
                    <option value="video">📺 YT Video</option>
                    <option value="music">🎧 Music</option>
                </select>
            </span>
            <span>          
            <label for="language">* Select language of content:</label>
            <select class="language" required bind:value={mediumLang}>
                <option value="">--Select language--</option>
                {#each availableLanguages as language}                 
                    <option value={language.short}>{language.emoji} {language.name}</option>
                {/each}
            </select>
            </span>
            {#if mediumLang.length > 1}
            <span>          
            <label for="language">* Select further detail:</label>
            <select class="language" required bind:value={mediumLangFurther}>
                <option value="">--Select--</option>
                {#each furtherLanguageOptions as option}                 
                    <option value={option.codes}>{option.name}</option>
                {/each}
            </select>
            </span>
            {/if}
            <span>          
            <label for="level">* Select level of content:</label>
            <select class="level" required bind:value={mediumLevel}> 
                <option value="">--Select a level--</option>           
                <option value="A1">🐣 A1</option>
                <option value="A2">🐥 A2</option>
                <option value="B1">🦉 B1</option>
                <option value="B2">🦅 B2</option>
                <option value="C1">🦜 C1</option>
                <option value="C2">🦚 C2</option>
            </select>
            </span>
            <span>
            <label for="category">* Select category of content:</label>
            <select class="category" required bind:value={mediumCategory}>
                <option value="">--Select category--</option>
                {#each availableCategories as category}                 
                    <option value={category.name}>{category.emoji} {category.name}</option>
                {/each}
            </select>
            </span>
        </div>
        

            <span>
                <label for="url">Link to medium:</label>
                <input class="url" bind:value={mediumURL} type="url" placeholder="Enter media URL">
            </span>
            <button type="submit">Upload</button>
            {#if error.name}
                <InlineStatus type={error.type} message={error.name} width="16em" />
            {/if}
        </form>
    </section>
    </section>
</main>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
        justify-content: center;
    }
    form{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1em;
    }
    input,
    select,
    button{
        box-sizing: border-box;
        border-radius: 0.55em;
        text-align: center;
    }
    input,
    select{
        border: #c8c8c8 2.5px solid;
    }
    input{
        height: 4rem;
        width: 95%;
        font-size: 2em;
        font-weight: bold;
    }
    select{
        height: 2em;
        width: 95%;
        font-size: 1.25em;
    }

    option{
        height: fit-content ;
        width: 100%;
    }
    button{
        background-color: #4364ea;
        color: #F4F4F4;
        border: #1e379b 2.5px solid;
        font-size: 1.25em;
        font-weight: bold;
        padding: 0em;
        height: 2.25em;
        width: 15em;
    }
    span{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        width: fit-content;
    }
    button:hover{
        background-color: #1e379b;
        color: #F4F4F4;
    }
    .main-content{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1em;
    }
    .media,
    .language,
    .level{
        width: 10em;
        height: 2em;
        border: #c8c8c8 2px solid;
    }

    .vertical-container{
        width: 100%;
        gap:0.5em;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
    .notice{
        background-color: #f7f7f7;
        padding: 1em 1em;
        border-radius: 0.75em;
        border: #eee 1px solid;
        width: 89.5%;
        margin: 0.5em;
    }

    .notice-text{
        margin: 0em;
    }
</style>