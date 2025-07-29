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
    let mediumLang = "";
    let mediumLevel = "";
    let availableLanguages = $state([]);
    let username = $state("");

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


    async function handleUpload(mediumType, mediumURL, mediumLang, mediumLevel) {
        try {
            const isUploaded = await isAlreadyUploaded(mediumURL);
            
            if (isUploaded) {
                error = { type: "warn", name: "This has already been uploaded to Loquela" };
                return;
            }
            
            if (mediumType === "video" || mediumType === "music") {
                await requestSubtitles(mediumURL, mediumLang, mediumType, mediumLevel);
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

    async function requestSubtitles(url, lang, type, level) {
        const channel = supabase.channel("subtitles");
        await channel.subscribe();
        const result = await channel.send({
            type: "broadcast",
            event: "subtitle-update",
            payload: {id: 1, url: url, lang: lang, type: type, level: level, author: username}
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

    async function videoExists(mediumURL, mediumType, mediumLang, mediumLevel) {
        try {
            const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(mediumURL)}&format=json`);
            
            if (!response.ok) {
                error = { type: "error", name: "Invalid YouTube URL" };
                return false;
            }
            
            await handleUpload(mediumType, mediumURL, mediumLang, mediumLevel);
            return true;
        } catch (err) {
            console.error("Validation error:", err);
            error = { type: "error", name: "Error validating URL" };
            return false;
        }
    }

        // Fetch user session, get UID, then fetch from profiles table to get the username
    async function fetchUserSesson() {
        const { data, error } = await supabase.auth.getSession()
        const sessionData = data // Store session data
        if (error) { //Id error fetching user
            console.error('Error fetching session:', error)
        } 
        else if(sessionData) { // If data exists
            const uid = sessionData.session.user.id // Get UID from session
            // Use the UID to fetch username
            const { data, error} = await supabase
                .from("profiles")
                .select("username")
                .eq("uid", uid)
                .single()
            if (data) {
                username = data.username // Set username to username from profiles table
        }
            if (error) {
                // If error fetching username
                console.error('Error fetching username:', error)
            }
        }
    }
</script>

<main class="route">
   <Sidebar currentPage="Upload" />
    <section class="main-page">
    <h1 class="page-header">Upload</h1>
    <section class="main-content">
        <form onsubmit={event => { event.preventDefault(); videoExists(mediumURL, mediumType, mediumLang, mediumLevel); }}>
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
            <label for="language">Select language of content:</label>
            <select class="language" bind:value={mediumLang}>
                <option value="">--Select language--</option>
                {#each availableLanguages as language}                 
                    <option value={language.short}>{language.emoji} {language.name}</option>
                {/each}
            </select>
            </span>
            <span>          
            <label for="level">Select level of content:</label>
            <select class="level" bind:value={mediumLevel}> 
                <option value="">--Select a level--</option>           
                <option value="A1">🐣 A1</option>
                <option value="A2">🐥 A2</option>
                <option value="B1">🦉 B1</option>
                <option value="B2">🦅 B2</option>
                <option value="C1">🦜 C1</option>
                <option value="C2">🦚 C2</option>
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
</style>