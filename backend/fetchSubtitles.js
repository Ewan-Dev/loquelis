import { supabase } from "./lib/supabaseClient.js";
import { execa } from "execa" // Allows executing terminal commands but safe
const currentPath = "../backend"
let languages = ["en"]


main() // Call the function to start listening for broadcasts

async function main() {
    await availableLanguages()
    console.log(languages)
    await listenAndDownloadSubtitles() // Start listening for subtitles then downloading subtitles
    
    process.stdin.resume() // Keep the process listening
}


async function listenAndDownloadSubtitles() {
    const channel = supabase.channel("subtitles") // Create a channel named "subtitles"
    // Listen for broadcasts from channel "subtitles"
    channel.on("broadcast", { event: "subtitle-update" }, async (broadcast) => {
    console.log("Received subtitles:", broadcast) // Print the broadcast
    const lang = broadcast.payload.lang // Get language
    const url = broadcast.payload.url // Get URL
    const id = broadcast.payload.id // Get ID
    const type = broadcast.payload.type // Get type
    console.log(`Language: ${lang}`) // Print language
    console.log(`URL: ${url}`)  // Print URL
    console.log(languages.includes(lang))
    if(languages.includes(lang) && url.startsWith("https://www.youtube.com")){
    // Execute yt-dlp command to fetch subtitles
    try {
        const { stdout } = await execa("yt-dlp", [
            "--skip-download", // Skip downloading the video
            "--write-sub", // Get manually set subtitles
            "--sub-lang", lang, // Language of the subtitles
            "--sub-format", "json3", // Format of the subtitles
            "--print-json", // Print the subtitles in JSON format
            url // Vid URL
        ], {
            cwd: currentPath // Where to run command 
        });
        console.log(`Success: ${stdout}`) // Print success message
        const videoData = JSON.parse(stdout) // Parse the JSON output
        const title = videoData.title
        const channel = videoData.channel
        const videoID = videoData.id
        const cover = `https://i.ytimg.com/vi/${videoID}/sddefault.jpg`
        const embedLink = `https://www.youtube.com/embed/${videoID}`
        const videoLink = `https://www.youtube.com/watch?v=${videoID}`
        uploadMedia(id, title, channel, cover, stdout, embedLink, videoLink, type) // Upload subtitles to the database
    }
    catch (error) {
        console.error(error)
    }
    }
    else if (!languages.includes(lang)) {
        console.error(`Language ${lang} is not available.`) // Print error if language is not available
    }
    else if (!url.startsWith("https://www.youtube.com")) {
        console.error(`${url} is not a valid youtube.com URL.`) // Print error if URL is not valid
    }
})
    const { error } = await channel.subscribe() // Subscribe to the channel and if anything is returned it is stored as error
    if (error) {
        console.error("Error:", error) // Print error if subscription fails
    } else {
        console.log("Listening...") // Print message while channel is being listened to
    }

}

async function availableLanguages(){

    const channel = supabase.channel("languages") // Create a channel named "languages"
    // Listen for broadcasts from channel "languages" and only updates languages array when broadcast is received
    channel.on("broadcast", { event: "update-languages" }, async (broadcast) => {
        const { data, error } = await supabase
            .from("languages") // Languages table
            .select("short")  // Short column (language codes e.g "en", "fr", "es")
        if (!error) {
            console.log("Available languages:", data) // Print available languages
            // Add each language to languages 
            data.forEach((language)=> {
                languages.push(language.short) 
            })
            console.log("Languages array:", languages) // Print languages array
        }
        else{
            console.error("Error fetching languages:", error) 
        }        
    });

    const { error } = await channel.subscribe() // Subscribe to the channel and if anything is returned it is stored as error
    if (error) {
        console.error("Error subscribing to languages channel:", error) // Print error if subscription fails
    } else {
        console.log("Subscribed to languages channel") // Print message when subscribed to languages channel
    }

}

async function uploadMedia(id, title, channel, cover, sub, embedLink, videoLink, type) {
    const currentDate = new Date();
    console.log(type, sub, id)
    const { error } = await supabase
        .from("media")
        .insert({ name: title, artist: channel, cover: cover, content: sub, media_type: type, embed_link: embedLink, video_link: videoLink }) // Update the content, media_type and updated_at columns
    if (error) {
        console.error("Error uploading subtitles:", error) // Print error if upload fails
    }
}

