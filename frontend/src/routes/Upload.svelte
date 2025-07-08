<script>
    import { supabase } from "../../lib/supabaseClient.js";
    import Sidebar from "../../lib/Sidebar.svelte";
    import confetti from "canvas-confetti";
    
    let mediumType = "", mediumURL = "";

    // Confetti effect
    function launchConfetti() {
        confetti({
            particleCount: 600,
            spread: 100,
            origin: { y: 0}
        })
        console.log(mediumURL, mediumType)
    }

    async function handleUpload(mediumType, mediumURL) {
        await isAlreadyUploaded(mediumURL)
            .then(isUploaded => {
                if (isUploaded) {
                    console.error("This medium has already been uploaded.");
                    return;
                }
                if (mediumType === "video" || mediumType === "music") {
                    requestSubtitles(mediumURL, "en", mediumType)
                    console.log("Your upload will be ready soon!");
                } else {
                    console.error("Invalid medium type. Please select 'video' or 'music'.")
                }
            })
            .catch(error => {
                console.error("Error checking upload status:", error);
            });

     }
    async function requestSubtitles( url, lang, type){
        const channel = supabase.channel("subtitles") // Create a channel named "subtitles"
        await channel.subscribe() // Subscribe to the channel
        // Send a broadcast message
        const result = await channel.send({
            type: "broadcast", // Specify it's a broadcast
            event: "subtitle-update", // Name of the broadcast event
            payload: {id: 1, url: url, lang: lang, type: type} // Data to send
        })
        
        console.log("Result:", result) // Print result of broadcast
        process.exit() 
    }
    async function isAlreadyUploaded(mediumURL) {
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('video_link', mediumURL)
            .single();

        if (error) { 
            console.error("Error checking upload status:", error);
            return false
        }
        return true
    }

</script>

<main class="route">
   <Sidebar currentPage="Upload" />
    <section class="main-page">
    <h1 class="page-header">Upload</h1>
    <section class="main-content">
        <form onsubmit={event => {event.preventDefault(); launchConfetti(); handleUpload(mediumType, mediumURL);}}>
            <span>
                <label for="media">Select media type:</label>
                <select class="media" bind:value={mediumType}>
                    <option value="video">YT Video</option>
                    <option value="music">Music</option>
                </select>
            </span>
           <span>
                <label for="url">Link to medium:</label>
                <input class="url"   bind:value={mediumURL} type="url" placeholder="Enter media URL">
           </span>
            <button type="submit">Upload</button>
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
