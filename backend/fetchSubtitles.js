import { supabase } from "../lib/supabaseClient.js";
import { execa } from "execa" // Allows executing terminal commands but safe
import fs from "fs"
import path from "path"
const currentPath = "../backend"
let languages = []


main() // Call the function to start listening for broadcasts

async function main() {
    await availableLanguages()
    console.log(languages)
    await listenAndDownloadSubtitles() // Start listening for subtitles then downloading subtitles
    
    process.stdin.resume() // Keep the process listening
}

// Delete all .json3 files (the lyric files)
function deleteAllJson3Files(){
    try {
        const files = fs.readdirSync(currentPath) // Read all files in the directory
        // Loop through each file
        files.forEach(file => { 
            // If the file ends with .json3, delete it
            if (file.endsWith(".json3")){
                const filePath = path.join(currentPath, file) // Full path of the file
                fs.unlinkSync(filePath) // Delete the file
            }
        })
    }
    catch (error) {
        console.error("Error deleting files:", error) // Print error if file deletion fails
    }
}

async function listenAndDownloadSubtitles() {
    const channel = supabase.channel("subtitles") // Create a channel named "subtitles"
    deleteAllJson3Files() // Delete previous subtitle files
    // Listen for broadcasts from channel "subtitles"
    channel.on("broadcast", { event: "subtitle-update" }, async (broadcast) => {
    console.log("Received subtitles:", broadcast) // Print the broadcast
    const lang = broadcast.payload.lang // Get language
    const url = broadcast.payload.url // Get URL
    const id = broadcast.payload.id // Get ID
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
            url // Vid URL
        ], {
            cwd: currentPath // Where to run command 
        });
        console.log(`Success: ${stdout}`) // Print success message
        uploadSubtitles(id, lang, stdout) // Upload subtitles to the database
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

async function uploadSubtitles(id, name, sub){
    const { error } = await supabase
        .from('subtitles')
        .insert({ id: id, name: name, subtitles: sub }) 
}
