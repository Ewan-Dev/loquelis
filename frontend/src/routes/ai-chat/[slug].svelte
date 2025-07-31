<script>
    import { location } from "svelte-spa-router"
    import { supabase } from "../../../lib/supabaseClient"

    import Sidebar from "../../../lib/Sidebar.svelte"
  import { onMount } from "svelte";

    let slug = $state($location.split('/').pop()) // Gets the last part of the path - the slug
    let characterData = $state(Object) //Stores character data from Supabase
    let messageInput = $state("")
    let chatHistory = $state([])
    let username = $state("")
    let chatAnalysisAI = $state("")
    let messagesContainer = $state(HTMLObjectElement)

    onMount(async () => {
        await fetchUserSesson()
    })
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

async function sendAIMessage(inputContent, chatHistory) {
    // ADD MESSAGE TO HISTORY
    chatHistory.push(["User", inputContent]) // Add user response

    const prompt = `You are an AI chatbot for a language learning app. Give short and simple responses and only respond in ${characterData.language} and your name is ${characterData.name} but don't but that before ur response and your personality is very exaggerated ${characterData.trait} . Your job is a ${characterData.occupation} Even if the user gets something wrong, try to interperet it and don;t give corrections Here is the user response: ${inputContent}. Here is the chat history: ${chatHistory.join('\n')}`
    
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
setInterval(() => {
  messagesContainer.scrollTo(0, document.body.scrollHeight) // Scroll to bottom on container to see all images
}, 500) // every 1 second

async function getAIAnalysis() {
    const prompt =`You are an AI for a language learning app. I will pass a user conversation with AI in the language of ${characterData.language} and you return a JSON file a percentage rating of the spelling punctuation and grammar and every mistake made ONLY BY THE USER AND BE VERY STRICT. So an example json file will have the properties spelling_percent, grammar_percent, punctuation_percent and mistakes, where mistakes is an array of objects where the object has 3 properties, type(spelling, punctuation or grammar), original_sentence, corrected_sentence. return simply as a pure json file as your output will eb immediatly parsed into JSON. leave no markdown markers for code either. here is user conversation ${chatHistory.join("/")}`
    chatAnalysisAI = await fetch(`https://text.pollinations.ai/prompt/${prompt}?model=openai-large`)
    console.log(chatAnalysisAI.json())
    console.log(chatHistory.join("/"))
    const { data, error } = await supabase
        .from("profiles")
        .select("chat_history")
        .eq("username", username)     
        .single()   
}
</script>

<main class="route">
    <Sidebar currentPage="/ai-chat"/> 
    <section class="main-page">
    <h1 class="page-header">AI Chat</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
        {#if !chatAnalysisAI}
        <section class="header-messages-container">
            <span class="chat-header">
                <span class="pfp-name-container">
                    <img class="character-header-image" src={characterData.image} alt={`Image of charater ${characterData.name}`}>
                    <h3>{characterData.name}</h3>     
                    <p>{characterData.occupation}</p>
                         <p class="trait-tag">{characterData.trait}</p>            
                </span>
                <button class="ai-analysis-btn" onclick={async () => await getAIAnalysis()}> Get AI analysis of chat</button>
            </span>
            <div class="messages-container" bind:this={messagesContainer}>
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
    {/if}
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
        background-color: #eaeaea;
        border-radius: 0  0 1em 1em;
    }
    .send-message-btn{
        width: 2.5em;
        height: 2.5em;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #5274ff;
        color: #ffffff;
        border: #3855ca 2px solid;
        font-weight: bold;
        float: left;
        border-radius: 50%;
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
        justify-content: space-between;
        align-items: center;
        gap:0.5em;
    }
    h3{
        height: fit-content;
        margin: 0;
    }
    .send-message-input{
        height: 2em;
        width: 87.5%;
        margin: 0.7em 0em;
        border-width: 2px;
        border-radius: 100em;
        box-sizing: content-box;
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
    .pfp-name-container{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap:0.5em;
    }
    .ai-analysis-btn{
        color: #fff;
        border: none;
        background: linear-gradient(90deg, #2d5eff, #5e46fa, #c971ff);
    }
        .trait-tag {
        background-color: #80a5ed;
        padding: 0.15em 0.5em;
        border-radius: 1em;
        color: #fff;
        font-weight: bold;
        height: fit-content;
        font-size: 0.75em;
    } 
</style>