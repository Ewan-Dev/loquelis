<script>
    import { location } from "svelte-spa-router"
    import { supabase } from "../../../lib/supabaseClient"

    import Sidebar from "../../../lib/Sidebar.svelte"

    let slug = $state($location.split('/').pop()) // Gets the last part of the path - the slug
    let characterData = $state(Object) //Stores character data from Supabase
    let messageInput = $state("")
    let chatHistory = $state([])

    $effect(async () => {
        const { data, error } = await supabase
            .from("ai_characters")
            .select("*")
            .eq("id", slug) // Fetch character which has ID matching to the link
            .single() // Only one expected to return
        if (error){
            console.error(error)
        }
        if(data){
            characterData = data
        }
    })

async function sendAIMessage(inputContent, chatHistory) {
    // ADD MESSAGE TO HISTORY
    chatHistory.push(["User", inputContent]) // Add user response
    
    const prompt = `You are an AI chatbot for a language learning app. Here is the user response: ${inputContent}. Here is the chat history: ${chatHistory.join('\n')}`
    
    const response = await fetch(`https://text.pollinations.ai/prompt/${prompt}`)
    
    // If reponse fails
    if (!response.ok) {
        console.error("AI API error:", response.statusText)
    }

    const aiResponseString = await response.text()
    
    // ADD MESSAGE TO HISTORY
    chatHistory.push(["AI", aiResponseString]) // Add AI response
    
    console.log("AI Response:", aiResponseString)
}

</script>

<main class="route">
    <Sidebar currentPage="/ai-chat"/> 
    <section class="main-page">
    <h1 class="page-header">AI Chat</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
        <section class="header-messages-container">
            <span class="chat-header">
                <img class="character-header-image" src={characterData.image} alt={`Image of charater ${characterData.name}`}>
                <h3>{characterData.name}</h3>
            </span>
            <div class="messages-container">
                {#each chatHistory as message}
                    {#if message[0] === "AI"}
                        <div class="message ai-sent">{message[1]}</div>
                    {/if}
                    {#if message[0] === "User"}
                        <div class="message user-sent">{message[1]}</div>
                    {/if}
                {/each}
            </div>
        </section>

        <span class="send-container">
            <input class="send-message-input" bind:value={messageInput}>
            <button class="send-message-btn" onclick={() => sendAIMessage(messageInput, chatHistory)}><span class="material-symbols-rounded">send</span></button>
        </span>
    </section>
    </section>
</main>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
        height: 100%;
    }
    .main-page{
        height: 45em;
    }
    .send-container{
        display: flex;
        flex-wrap: wrap;
        gap:0.25em;
        justify-content: center;
        align-items: center;
    }
    .send-message-btn{
        width: 2.655em;
        height: 2.655em;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #4364ea;
        color: #F4F4F4;
        border: #1e379b 2.5px solid;
        font-weight: bold;
        float: left;
        border-radius: 12.5px;
    }
    .main-content{
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }
    img {
        border-radius: 100px;
        
    }
    .character-header-image{
        width:2.25em;
        height: 2.25em;
        margin: 0;
    }
    .chat-header{
        background-color: rgb(233, 233, 233);
        width: 100%;
        height: fit-content;
        border-radius: 1em 1em 0 0;
        padding: 0.35em 0.5em;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        justify-content: flex-start;
        align-items: center;
        gap:0.5em;
    }
    h3{
        height: fit-content;
        margin: 0;
    }
    .send-message-input{
        height: 2.35em;
        width: 85%;
        margin: 0.7em 0em;
        border-width: 2px;
        border-radius: 12.5px;
    }
    .message{
        background-color: #e2e2e2;
        max-width: 18em;
        width: fit-content;
        padding: 0.5em 0.75em;
        border-radius: 12.5px;
    }
    .messages-container{
        display: flex;
        flex-direction: column;
        gap:0.75em;
        margin: 1em;
        overflow: scroll ;
        height: 100%;
    }
    .header-messages-container{
        height: 37.5em;
    }
    .user-sent{
        background-color: #5978f4;
        color: #fff;
        align-self: flex-end;
        
    }
</style>