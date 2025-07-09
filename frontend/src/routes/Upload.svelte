<script>
    import { supabase } from "../../lib/supabaseClient.js";
    import Sidebar from "../../lib/Sidebar.svelte";
    import InlineStatus from "../../lib/InlineStatus.svelte";
    import confetti from "canvas-confetti";

    // Initialize with empty error
    let error = $state({name: "", type: ""});
    let mediumType = "";
    let mediumURL = "";

    function launchConfetti() {
        confetti({
            particleCount: 600,
            spread: 100,
            origin: { y: 0 }
        });
    }

    async function handleUpload(mediumType, mediumURL) {
        try {
            const isUploaded = await isAlreadyUploaded(mediumURL);
            
            if (isUploaded) {
                error = { type: "warn", name: "This has already been uploaded to Loquela" };
                return;
            }
            
            if (mediumType === "video" || mediumType === "music") {
                await requestSubtitles(mediumURL, "en", mediumType);
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

    async function requestSubtitles(url, lang, type) {
        const channel = supabase.channel("subtitles");
        await channel.subscribe();
        const result = await channel.send({
            type: "broadcast",
            event: "subtitle-update",
            payload: {id: 1, url, lang, type}
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

    async function videoExists(mediumURL, mediumType) {
        error = {name:"", type:""}
        try {
            const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(mediumURL)}&format=json`);
            
            if (!response.ok) {
                error = { type: "error", name: "Invalid YouTube URL" };
                return false;
            }
            
            await handleUpload(mediumType, mediumURL);
            return true;
        } catch (err) {
            console.error("Validation error:", err);
            error = { type: "error", name: "Error validating URL" };
            return false;
        }
    }
</script>

<main class="route">
   <Sidebar currentPage="Upload" />
    <section class="main-page">
    <h1 class="page-header">Upload</h1>
    <section class="main-content">
        <form onsubmit={event => { event.preventDefault(); videoExists(mediumURL, mediumType); }}>
            <span>
                <label for="media">Select media type:</label>
                <select class="media" bind:value={mediumType}>
                    <option value="video">YT Video</option>
                    <option value="music">Music</option>
                </select>
            </span>
           <span>
                <label for="url">Link to medium:</label>
                <input class="url" bind:value={mediumURL} type="url" placeholder="Enter media URL">
           </span>
            <button type="submit">Upload</button>
            {#if error.name}
                <InlineStatus type={error.type} message={error.name} />
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
        width: 100%;
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
    .media{
        width: 10em;
        height: 2em;
        border: #c8c8c8 2px solid;
    }
</style>
