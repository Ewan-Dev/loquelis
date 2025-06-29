import { supabase } from "../lib/supabaseClient.js"

// Example data to send
const id = 77
const url = "https://www.youtube.co.um/watch?v=uyzeP77LZ90"
const lang = "ru"

async function requestSubtitles(){
    const channel = supabase.channel("subtitles") // Create a channel named "subtitles"
    await channel.subscribe() // Subscribe to the channel
    // Send a broadcast message
    const result = await channel.send({
        type: "broadcast", // Specify it's a broadcast
        event: "subtitle-update", // Name of the broadcast event
        payload: {id: id, url: url, lang: lang} // Data to send
    })
    
    console.log("Result:", result); // Print result of broadcast
    process.exit() 
}

requestSubtitles();
