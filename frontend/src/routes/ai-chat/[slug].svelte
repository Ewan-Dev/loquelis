<script>
    import { location } from "svelte-spa-router"
    import { supabase } from "../../../lib/supabaseClient"

    import Sidebar from "../../../lib/Sidebar.svelte"
    import { onMount } from "svelte";
    import Definition from "../../../lib/Definition.svelte";

    let nativeLanguage = 'en'
    let slug = $state($location.split('/').pop()) // Gets the last part of the path - the slug
    let characterData = $state(Object) //Stores character data from Supabase
    let messageInput = $state("")
    let flashcardDecks = $state([])
    let chatHistory = $state([])
    let username = $state("")
    let chatAnalysisAI = $state("")
    let {messagesContainer, dialogBox} = $state(HTMLObjectElement)
    let deckIndex = $state()
    let {term, definition, partOfSpeech, phoneticAnnotation} = $state("")
    let userID = $state("")
    let isDefinitionFetched = true
    let isWaitingForAnalysis = $state(false)
    let chatArray = []
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
        console.log(prompt)
        const response = await fetch("/.netlify/functions/chat", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            prompt: "You are an AI chatbot roleplaying a character for a language learning app. Keep it chat-like and follow the character trait. Return just your response. No formatting. If a flashcard deck is submitted, relate your answers off that",
            characterName: characterData.name,
            characterLanguageISO6391: characterData.language,
            characterTrait: characterData.trait,
            characterOccupation: characterData.occupation,
            latestUserResponse: inputContent,
            chatHistory: chatHistory.map(msg => { return {user : msg.sender, message: msg.content}}),
            flashcardDecks: flashcardDecks[deckIndex],
        })      
        })      

    // If reponse fails
    if (!response.ok) {
        console.error("AI API error:", response.statusText)
    }
    else{
        console.log(response)
    }

    const aiResponseString = await response.json()
    
    // ADD MESSAGE O HISTORY
    chatHistory.push({sender: "AI", content: aiResponseString.reply})// Add AI response

    console.log("AI Response:", aiResponseString)

}
async function getAIAnalysis() {
    isWaitingForAnalysis = true

    try{
        const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            prompt: "You are an AI for a language learning app. The user and AI are having a conversation. Return no tags, no markup, just raw JSON with keys `analysis` — A strict critique in English aimed at helping the user improve. Also if the flashcardDeck is truthy then tell the user how well he used the cards in the flashcard deck - and also return `mistakes` — An array of objects. Each mistakes object must include `original_sentence` and `corrected_sentence`",
            flashcardDeck: flashcardDecks,
            chatLanguageISO6391: characterData.language,
            chatHistory: chatHistory.map(msg => { return {user : msg.sender, message: msg.content}}),
            flashcardDecks: flashcardDecks[deckIndex],
        })      
        })      
        const json = await response.json()
        chatAnalysisAI =  JSON.parse(json.reply)
        isWaitingForAnalysis = false
        console.log(chatAnalysisAI)
        }
        catch (error){
            console.error(error)
        }
}

// Fetches flashcards for ability to have AI test you on a deck
async function fetchFlashcardDecks() {
    fetchUserSesson()
    dialogBox.showModal();
    if (flashcardDecks.length === 0){ // Checks if the decks are already fetched
            const { data, error } = await supabase
                .from("flashcard_decks")
                .select("*")
                .eq("author", userID) // By user
            if (error) {
                // If error fetching flashcard decks
                console.error('Error fetching flashcard decks:', error)
            }
            if (data){
            flashcardDecks = data
            console.log("DECKS")
            console.log(flashcardDecks)
            }
            else{
                flashcardDecks= []
            }
    }
    
}
function handleDeckSubmit(){
    dialogBox.close()
}
        const segmenter = new Intl.Segmenter('zh', {granularity: 'word'})


    async function fetchDefinition(word, contextString) {
        isDefinitionFetched = false
        console.log(contextString)
        console.log("Fetching definition for ", word)
        try{
        const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            prompt: "Translate this word based of context. Return no tags, no markup, simply just raw JSON with keys `word` (original), `partOfSpeech`, `phoneticAnnotation` (IMPORTANT: depsite the tag, return all possible readings as a string based of context in whatever is used for the language, such as phonetic-annotation, furigana etc. ) and `definition` (meaning based off context and also simple, normal person-readable info about conjugation) but ONLY return `phoneticAnnotation` where it is not necessary. For example non-Latin scripts",
            word: word,
            context: contextString,
            originalWordLanguageISO6391: characterData.language,
            translatedWordLanguageISO6391: nativeLanguage,
        })      
        })
        console.log(response)
        const data = await response.json()
        const responseJSON = JSON.parse(data.reply)
        console.log(responseJSON)
        isDefinitionFetched = true
        term = responseJSON.word
        definition = responseJSON.definition
        partOfSpeech = responseJSON.partOfSpeech
        phoneticAnnotation = responseJSON.phoneticAnnotation
        }
        catch (error){
            console.error(error)
        }
    }

</script>

<!--Chat page-->
<main class="route">
    <Sidebar currentPage="/ai-chat"/> 
    <section class="main-page">
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
                    {#if isWaitingForAnalysis}
                    <p>Loading...</p>
                    {/if}
            </span>
            <button class="test-deck-btn" onclick={() => {fetchFlashcardDecks();}}><span class="material-symbols-rounded get-tested-on-deck">cards_star</span></button>
            <div class="messages-container" bind:this={messagesContainer}>
                {#each chatHistory as message}
                    {#if message.sender === "AI"}
                        <div class="message ai-sent">
                            {#each [...segmenter.segment(message.content)].map(s => s.segment) as word}
                                <p class="ai-word" onclick={() => fetchDefinition(word, message.content)}>{word}</p>
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
    <div class="definition">
     <Definition word={term} definition={definition} partOfSpeech={partOfSpeech} phoneticAnnotation={phoneticAnnotation} language={characterData.language}/>
</div>
    <!--AI analysis page-->
    {#if chatAnalysisAI}
    <section class="ai-analysis-page">
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
    </section>
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
          h1{
      margin: 0 0.35em 0.5em;
  }
  button{
    z-index: 1;
  }
    main{
        display: flex;
        gap: 1em;
        align-items:flex-start ;

        height: 100%;
        background-color: #ffffff;
        padding: 0;
    }
    .main-page{
         background-color: inherit;
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
        padding: 0 0.25em;
        box-sizing: border-box;
        gap:0.25em;
        justify-content: center;
        align-items: center;
        background-color: #eaeaea;
        border-radius: 0  0 1em 1em;
        width: 100%;
    }
    .page-header{
        margin-top: .45em
    }
    .stats-container{
        width: 100%;
        padding: 0em 1em 1.75em 1em;
        display: flex;
        gap:0.05em;
        flex-direction: column;
    }
    .chat-container{
        width: 100%;
        height: 90%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        background-color: #fafafa;
        border-radius: 1em;
        box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    }
    .deck-select{
        width: 100%;
    }
    .send-message-btn{
        width: 2.75em;
        height: 2.75em;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #5274ff;
        color: #ffffff;
        font-weight: bold;
        float: left;
        border-radius: 1em;
        border: none;
        box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    }

        .send-message-btn:hover{
        background-color: #4664da;
        box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000030,
                0 2px 4px #00000035;
    }

    p{
        font-size: 1.25em;
    }
    .close-deck-btn{
        height: 2em;
                box-shadow: inset 0 1px 2px #ffffff80,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
        width: 100%;
        border-radius: 0.5em;
    }
    .close-deck-btn:hover{
        background-color: #c8c8c8;
    }
    .submit-deck-btn{
        width: 100%;
        height: 2em;
        border: 0;
        background-color: #5274ff;
        color: #ffffff;
                box-shadow: inset 0 1px 2px #ffffff80,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    }
    .submit-deck-btn:hover{
        width: 100%;
        height: 2em;
        background-color: #3855ca;
        color: #ffffff;
    }

    .main-content{
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 1em;
        height: 70%;
        width: 100%;
        background-color: inherit;
        overflow: hidden;
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
        width: 4em;
        height:4em;
        margin: 0;
    }
    .chat-header{
        background-color: rgb(233, 233, 233);
        width: 100%;
        height: fit-content;
        border-radius: 1em 1em 0 0;
        padding: 0.35em 0.5em;
        padding-bottom: 0.5em;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        gap:0.25em;
        box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    }
    h3{
        height: fit-content;
        margin: 0;
        font-size: 1.5em;

    }
    dialog{ 
        padding: 0.75em 0.75em;
        border-radius: 0.5em;
        border: 0;
                        box-shadow: inset 0 1px 2px #ffffff80,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
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
        height: fit-content;
        font-size: 2em;
        border-radius: 0.45em;
        z-index: 1;
        width: 90%;
        padding: 0 0.3em;
        margin:  0.3em 0.1em 0.3em 0.15em;
        border:none;
        box-sizing: content-box;
        box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    }
    .message{
        max-width: 18em;
        width: fit-content;
        height: auto;
        overflow:visible !important;
        padding: 0.5em 0.75em;
        border-radius: 9px;
        display: flex;
        flex-wrap: wrap;
        background-color: #e2e2e2;
        gap: 0em 0.1em;
        justify-content:flex-start;
        align-items: flex-start;
                box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    }
    .test-deck-btn{
        padding: 0.3em;
        border: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(224, 224, 224);
        border-radius: 0 0 0.5em;
        box-shadow:
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    }
    .test-deck-btn:hover{
        border: 0;
        background-color: rgb(210, 210, 210);
        border-radius: 0 0 0.5em;
        box-shadow: inset 0 1px 2px #ffffff70,
                0 1px 2px #00000020,
                0 2px 4px #00000025;
            display: flex;
            align-items: center;
            justify-content: center;
    }
    .messages-container{
        display: flex;
        height: 100%;
        background-color: transparent;
        flex-direction: column;
        gap:0.75em;
        margin: 1em;
        overflow: scroll;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    .messages-container::-webkit-scrollbar {
        display: none;

    }

    .header-messages-container{
        width: 100%;
        height: 80vh;
        background-color: transparent;
        overflow: hidden;
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
        border-radius: 5px;
        padding: 0.25em 0.5em;
        background: linear-gradient(90deg, #2d5eff, #5e46fa, #c971ff);
        box-shadow: inset 0 1px 2px #ffffff80,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    }

    .ai-analysis-btn:hover{
        box-shadow: inset 0 1px 2px #ffffff80,
                0 1px 2px #00000030,
                0 2px 4px #00000035;
    }
        .trait-tag {
        background-color: #80a5ed;
        padding: 0.15em 0.5em;
        border-radius: 1em;
        color: #fff;
        font-weight: bold;
        height: fit-content;
        font-size: 1em;
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
        min-width: 10em;
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
        width: 100%;
        box-sizing: border-box;
        padding: 0.15em 0.25em;
        border-top-right-radius: 0.5em;
        font-size: 1em;
    }
    .input-deck-label-container{
        display: flex;
        flex-direction: column;
        gap:0;
        width: 100%;
        background-color: transparent;
    }
    .ai-word{
        margin: 0;
        padding: 0.07em  0.1em;
        border-radius: 0.35em;
    }
    .ai-word:hover{
        background-color: #b9b9b9;
    }
        @media (max-width: 500px){
    main{
      display: flex;
      flex-direction: column !important;
    }
        .definition{
        right:0;
    margin-left:2em ;}
    }

     @media (max-width: 750px){
        .definition{
        left: 5%;
        top: 25%;
        width: 0;
        position: absolute;
        min-width: 15em;
        z-index: 2;
        margin: 0;
    }
    .chat-container{
        width: 90%;
        height: 70vh;
    }

  }
      .main-page{
        margin: auto 0.25em;
        width: 100%;
    }
    .definition{
        margin-right: 2em;
    }
    .ai-analysis-page{
        display: flex;
        flex-direction: column;
    }
    .get-tested-on-deck{
        margin: 0;
        color:#adadad;
        font-size: 1.5em;
    }
</style>