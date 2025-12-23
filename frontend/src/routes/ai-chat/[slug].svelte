<script>
    import { location } from "svelte-spa-router"
    import { supabase } from "../../../lib/supabaseClient"

    import Sidebar from "../../../lib/Sidebar.svelte"
    import { onMount } from "svelte";
    import Definition from "../../../lib/Definition.svelte";

    let slug = $state($location.split('/').pop()) // Gets the last part of the path - the slug
    let characterData = $state(Object) //Stores character data from Supabase
    let messageInput = $state("")
    let flashcardDecks = $state([])
    let chatHistory = $state([])
    let username = $state("")
    let chatAnalysisAI = $state("")
    let {messagesContainer, dialogBox} = $state(HTMLObjectElement)
    let deckIndex = $state()
    let {term, definition, partOfSpeech, romanisation} = $state("")
    let userID = $state("")

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
            userID = sessionData.session.user.id // Get UID from session
        }
            if (error) {
                // If error fetching username
                console.error('Error fetching username:', error)
            }
        }
    

async function sendAIMessage(inputContent, chatHistory) {
    let prompt = ""
    // ADD MESSAGE TO HISTORY
    chatHistory.push({sender: "User", content: inputContent}) // Add user response
    if (flashcardDecks != []){
        print(flashcardDecks)
        prompt = `You are an AI chatbot for a language learning app. 
                your name is ${characterData.name} - but you dont need to append that before your response
        Give short and simple responses and only respond in ISO CODE ${characterData.language} 
        Your job is a ${characterData.occupation} Even if the user gets something wrong, try to interperet it and don't give corrections 
        Base all your response lightly on the selected flashcard deck as the user selected the deck for you, the AI character to test me on. You dont need all words in one response. You can see which words you've used and haven't in chat history. Take it slow and but the words in at any order but they must make sense in context
        only respond in ISO ${characterData.language}
        your personality is ${characterData.trait} for character engagement reasons.
        Here is the deck content:
        ${flashcardDecks[deckIndex]}
        Here is the user response: 
        ${inputContent}. 
        Here is the chat history:
       ${chatHistory.map(msg => `SENT BY ${msg.sender}: ${msg.content}`)}`
    }
    else{
        prompt = `You are an AI chatbot for a language learning app. 
        your name is ${characterData.name} - but you dont need to append that before your response
        Give short and simple responses and only respond in ISO ${characterData.language} and and your personality is very exaggerated ${characterData.trait} . 
        Your job is a ${characterData.occupation} Even if the user gets something wrong, try to interperet it and don't give corrections 
        only respond in ISO ${characterData.language}
        Here is the user response: 
        ${inputContent}. 
        Here is the chat history:
        ${chatHistory.map(msg => `SENT BY ${msg.sender}: ${msg.content}`)}`
    }
    console.log(prompt)
    const response = await fetch(`https://text.pollinations.ai/prompt/${prompt}`)
    
    // If reponse fails
    if (!response.ok) {
        console.error("AI API error:", response.statusText)
    }

    const aiResponseString = await response.text()
    
    // ADD MESSAGE O HISTORY
    chatHistory.push({sender: "AI", content: aiResponseString})// Add AI response

    console.log("AI Response:", aiResponseString)
}

async function getAIAnalysis() {
    const prompt =  `
    You are an AI for a language learning app. The user and AI are having a conversation in ${characterData.language}. The user's messages are marked with "User :". Your task is to return a pure JSON object as your response will be directly parsed into JSON and use no markdown annotates and the response has two fields:

    1. "analysis" — A strict critique in English aimed at helping the user improve. Also if flashcards deck is valid it means teh user wants to use or see all those deck words. So take that into your anaylisis account - pw well did they respond or did they use any flashcard words?
    2. "mistakes" — An array of objects. Each object must include:

    {
    "original_sentence": <user sentence>,
    "corrected_sentence": <correct version, even if its the same as original if no issues found>
    }

    ⚠️ Include **every single sentence** spoken by the user — even if it's 100% correct — so we can evaluate all usage. Do not skip or omit any. Assume all are full sentences. Do not return markdown, just raw JSON.

    Here is the deck content:
    ${flashcardDecks[deckIndex]}
    Conversation:
    ${chatHistory.map(msg => `SENT BY ${msg.sender}: ${msg.content}`)}`

    const encodedPrompt = encodeURIComponent(prompt);
    console.log(prompt)
    const response = await fetch(`https://text.pollinations.ai/prompt/${encodedPrompt}`)
    const json = await response.json()
    chatAnalysisAI =  json
    console.log(chatAnalysisAI)
}

// Fetches flashcards for ability to have AI test you on a deck
async function fetchFlashcardDecks() {
    if (!flashcardDecks){ // Checks if the decks are already fetched
            const { data, error } = await supabase
                .from("flashcards")
                .select("*")
                .eq("author", userID) // By user
                .eq("language", characterData.language) // Matching language decks to character
            if (error) {
                // If error fetching flashcard decks
                console.error('Error fetching flashcard decks:', error)
            }
            if (data){
            flashcardDecks = data
            }
            else{
                flashcardDecks= []
            }
            console.log(flashcardDecks)
    }
    
}
function handleDeckSubmit(){
    dialogBox.close()
}

    async function fetchDefinition(word, context) {
        let contextString = context // Set context string to context 
        if (Array.isArray(context)){ // If it's an array
             contextString = context.join(" ") // Turn it to a string
        }
        const prompt = `you are being used as an AI to give a definition of a word based of context for a language learning software the language of the word and context is ISO code ${characterData.language} and the user's native language is english the word is ${word} and the context is ${contextString} so give your definition in ENGLISH and as part of your just definition NOT the partOfSpeech add helpful notes such as if its plural and its singular or its case/tense and its infintive etc. but keep it simple and short return as raw json with no backtick MD markers as your respone will be directly parsed into json respond with attributes word, partOfSpeech, romanisation and definition but do NOT return romanisation where it is not necessary`
        const response = await fetch(`https://text.pollinations.ai/${prompt}`)
        const responseJSON = await response.json()
        console.log(response)
        term = responseJSON.word
        definition = responseJSON.definition
        partOfSpeech = responseJSON.partOfSpeech
        romanisation = responseJSON.romanisation
    }

</script>

<!--Chat page-->
<main class="route">
    <Sidebar currentPage="/ai-chat"/> 
    <section class="main-page">
    <h1 class="page-header">AI Chat</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
        {#if !chatAnalysisAI}
        <div class="chat-container">
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
            <button class="test-deck-btn" onclick={() => {dialogBox.showModal(); fetchFlashcardDecks();}}>Get tested on a deck</button>
            <div class="messages-container" bind:this={messagesContainer}>
                {#each chatHistory as message}
                    {#if message.sender === "AI"}
                        <div class="message ai-sent">
                            {#each message.content.split(" ") as word}
                                <p class="ai-word" onclick={() => fetchDefinition(word, message)}>{word}</p>
                            {/each}
                        </div>
                    {/if}
                    {#if message.sender === "User"}
                        <div class="message user-sent">{message.content}</div>
                    {/if}
                {/each}
            </div>
        </section>
        <div class="input-deck-label-container">
            {#if deckIndex || deckIndex === 0} <!-- Gets value when deck is submitted -->
                <span class="deck-label">Deck: <b>{flashcardDecks[deckIndex].name}</b></span>
            {/if}
            <span class="send-container">
                <input class="send-message-input" bind:value={messageInput}>
                <button class="send-message-btn" onclick={() => sendAIMessage(messageInput, chatHistory)}><span class="material-symbols-rounded">send</span></button>
            </span>          
        </div>
        </div>
    {/if}
     <Definition word={term} definition={definition} partOfSpeech={partOfSpeech} romanisation={romanisation} language={characterData.language}/>

    <!--AI analysis page-->
    {#if chatAnalysisAI}
    <span class="analysis-character-container">
        <img src={characterData.image} class="analysis-image" alt={characterData.name}>
        <h1 class="analysis-header">{characterData.name}</h1>
    </span>
    <div class="stats-container">
        <div class="ai-chat-analysis-container">
            <h3 class="ai-chat-analysis-header">💡 AI Chat Analysis</h3>
             <p class="ai-chat-analysis">{chatAnalysisAI.analysis}</p>
        </div>
         {#each chatAnalysisAI.mistakes as correction}
       <span class="sentence-container">
            <span class="corrected_sentence_label_container">📑 <p class="original_sentence_label">Original sentence: </p></span>
            <p class="original_sentence">{correction.original_sentence}</p>
        </span>
       <span class="sentence-container">
            <span class="corrected_sentence_label_container">✅ <p class="corrected_sentence_label"> Corrected sentence: </p></span>
            <p class="corrected_sentence">{correction.corrected_sentence}</p>
        </span>
        {/each}
    </div>
    {/if}
    </section>
    </section>
</main>

<!--Dialog box to pick deck to be tested on-->
<dialog bind:this={dialogBox}>
    <div class="dialog-container">
        <h2 class="dialog-header">Select deck to be tested on:</h2>
        <form onsubmit={(event) =>{event.preventDefault(); handleDeckSubmit();}}>
            <select class="deck-select" bind:value={deckIndex}>
                {#each flashcardDecks as deck, i} <!-- For every deck -->
                    <option required value={i}>{deck.name}</option> <!-- Show deck name -->
                {/each}
            </select>
            <span class="deck-buttons-container">
                <input type="Submit" class="submit-deck-btn">
                <button class="close-deck-btn" onclick={() => dialogBox.close()}>Close</button>
            </span>
        </form>       
    </div>
</dialog>
<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
        height: 100%;
        background-color: inherit;
        padding: 0;
    }
    .main-page{
         background-color: inherit;
         height: 40em;
         width: 100%;
    }
    .analysis-character-container{
        display: flex;
        justify-content: center;
        align-items: center;
        gap:0.75em;
        margin: 1em;
        margin-bottom: 0.5em;
        height: fit-content;
    }
    .analysis-image{
        width: 4em;
        height: 4em;
        margin: 0;
    }
    .analysis-header{
        font-size: 2em;
        margin: 0;
    }
    .send-container{
        display: flex;
        flex-wrap: wrap;
        gap:0.25em;
        justify-content: center;
        align-items: center;
        background-color: #eaeaea;
        border-radius: 0  0 1em 1em;
        width: 100%;
    }
    .stats-container{
        width: 100%;
        padding: 0em 1em 1.75em 1em;
        display: flex;
        gap:0.05em;
        flex-direction: column;
    }
    .chat-container{
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        background-color: #fff;
        border-radius: 1em;
    }
    .deck-select{
        width: 100%;
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
    .close-deck-btn{
        border: #c8c8c8 1.5px solid;
        width: 100%;
    }
    .close-deck-btn:hover{
        background-color: #c8c8c8;
    }
    .submit-deck-btn{
        width: 100%;
        height: 2em;
        background-color: #5274ff;
        color: #ffffff;
        border: #3855ca 1.5px solid;
    }
    .submit-deck-btn:hover{
        width: 100%;
        height: 2em;
        background-color: #3855ca;
        color: #ffffff;
        border: #3855ca 1.5px solid;
    }

    .main-content{
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 1em;
        height: 100%;
        width: 100%;
        background-color: inherit;
    }
    img {
        border-radius: 100px;
        
    }
    form{
        display: flex;
        flex-direction: column;
        gap:0.45em;

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
    dialog{ 
        padding: 0.75em 0.75em;
        border-radius: 0.5em;
        border: #b2b2b2 1.5px solid;
    }
    .dialog-container{
        display: flex;
        flex-direction: column;
        gap:0.5em;
    }
    .dialog-header{
        font-size: 1.25em;
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
        display: flex;
        flex-wrap: wrap;
        gap: 0em 0.1em;
        justify-content:flex-start;
        align-items: flex-start;
    }
    .test-deck-btn{
        border: 0;
        background-color: rgb(224, 224, 224);
        border-radius: 0 0 0.5em;
    }
    .test-deck-btn:hover{
        border: 0;
        background-color: rgb(210, 210, 210);
        border-radius: 0 0 0.5em;
    }
    .messages-container{
        display: flex;
        flex-direction: column;
        gap:0.75em;
        margin: 1em;
        overflow: scroll ;
        height: 85.5%;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    .messages-container::-webkit-scrollbar {
        display: none;
    }

    .header-messages-container{
        width: 100%;
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
    .deck-buttons-container{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap:0.2em;
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
    .original_sentence,
    .corrected_sentence,
    .original_sentence_label,
    .corrected_sentence_label{
        margin: 0;
        margin-left: 0.25em;  }

    .original_sentence_label,
    .corrected_sentence_label{
        font-style: italic;
    }
   .original_sentence,
    .corrected_sentence{
        font-size: 1.5em;
        font-weight: bold;
        width: 100%;
        height: fit-content;
    }
   .original_sentence {
    font-size: 1.5em;
    font-weight: bold;
    height: fit-content;
    color: #c34747;
    word-break: break-word;
   }

    .corrected_sentence{
        font-size: 1.5em;
        font-weight: bold;
        height: fit-content;
        color:rgba(61, 178, 90, 0.999);
        word-break: break-word;
    }

    .sentence-container{
        display: flex;
        flex-direction: column;
        gap:0;
        width: 90%;
        margin: 0.5em 0;
    }
    .ai-chat-analysis{
        margin: 0;
        width: 95%;
        padding: 0.25em  0.5em;
        border-radius: 0.75em;
    }
    .ai-chat-analysis-container{
        background-color: #f2f2f2;
        padding: 0.25em;
        border-radius: 0.75em;
        margin: 0;
        margin-bottom: 0.5em;
        width: 90%;
    }
    .ai-chat-analysis-header{
        background-color: #fcfcfc;
        padding: 0.1em 0.5em 0.15em 0.25em;
        border-radius: 0.5em;
        width: fit-content;
    }

    .corrected_sentence_label_container{
        display: flex;
        flex-direction: row;
        margin-left: 0.5em;
    }
    .deck-label{
        background-color: #f1f1f1;
        margin: 0;
        width: fit-content;
        padding: 0.15em 0.25em;
        border-top-right-radius: 0.5em;
        font-size: 1em;
    }
    .input-deck-label-container{
        display: flex;
        flex-direction: column;
        gap:0;
        width: 100%;
    }
    .ai-word{
        margin: 0;
        padding: 0.07em  0.1em;
        border-radius: 0.35em;
    }
    .ai-word:hover{
        background-color: #b9b9b9;
    }
</style>