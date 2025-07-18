import { supabase } from "./lib/supabaseClient.js"

// Run function to update languages array in fetchSubtitles.js
async function fetchLanguages() {
        const channel = supabase.channel("languages") // Channel used to communicate
        await channel.subscribe() // Subscribe to channel
        const result = await channel.send({
            type: "broadcast",
            event: "update-languages",
            payload: {id: 1} // ID is irreverent; As long as a broadcast is sent the languages will be fetched
        });
        console.log("Broadcast result:", result);
    }

fetchLanguages()