            <!-- svelte-ignore state_referenced_locally -->
            <script>
    import { onMount } from "svelte";
    import confetti from "canvas-confetti";
  import { supabase } from "./supabaseClient";
  import InlineStatus from "./InlineStatus.svelte";
    const { content, backContent = [], deckName, author = "", id, isUsers } = $props()
    let cardNumber = $state(0)
    let unsure = $state([])
    let known = $state([])
    let { word, definition, partOfSpeech, romanisation } = $state("")
    let editCard = $state({})
    let percentKnown = $state(0)
    let deckContent = content
    let fullDeck = deckContent
    let newWord = $state(word)
    let newDefinition = $state(definition)
    let newPartOfSpeech = $state(partOfSpeech)
    let newRomanisation = $state(romanisation)
    let addWord = $state("")
    let addDefinition = $state("")
    let addPartOfSpeech = $state("")
    let addRomanisation = $state("")
    let editFlashcardDialog = $state(HTMLDialogElement)
    let addFlashcardDialog = $state(HTMLDialogElement)
    let statusMessage = $state("")
    let modifyDeckState = $state("")
    $effect(() => {
        percentKnown = Math.round((known.length / (unsure.length + known.length)) * 100)
    })
    console.log(content)
    onMount(() => {
        $inspect(cardNumber)
        $effect(() => {
            if(content && Array.isArray(content) && content[cardNumber]){
                const flashcardContentJSON = JSON.parse(content[cardNumber])
                console.log(flashcardContentJSON)
                word = flashcardContentJSON.word
                definition = flashcardContentJSON.definition
                partOfSpeech = flashcardContentJSON.partOfSpeech
                romanisation = flashcardContentJSON.romanisation
                newWord =  (word)
                newDefinition = (definition)
                newPartOfSpeech = (partOfSpeech)
                newRomanisation = romanisation
                showFront()
            }
        })
    })

    function showFront(){
            // Hide element until card is flipped
            backContent.forEach((className) => { // For every class to hide
                const element = document.getElementsByClassName(className) //Grab element by that classname
                // If element exists, add hidden class
                if (element){
                    Array.from(element).forEach((el) => { // For every element with that class
                        el.classList.add("hidden") // Add hidden class to element
                    })
                }
            })
    }

    function showBack(){
            // Show all elements 
            backContent.forEach((className) => { // For every class to hide
                const element = document.getElementsByClassName(className) //Grab element by that classname
                // If element exists, remove hidden class
                if (element){
                    Array.from(element).forEach((el) => { // For every element with that class
                        el.classList.remove("hidden") // Remove hidden class from element to "show" all hidden elements
                    })
                }
            })
    }
    function handleUnknown(){
        if (content[cardNumber]){ // If there is a card at the current index
            unsure.push(content[cardNumber]) // Add current card to unsure array
             cardNumber++ // Move to next card
        }
    }
    function markKnown(){
        if (content[cardNumber]){ // If there is a card at the current index
            known.push(content[cardNumber]) // Add current card to known array
            cardNumber++   // Move to next card
        } 
        if( percentKnown === 100){ // If all cards are known
            launchConfetti() // Launch confetti
        }
    }

    // Function to handle continuing with the flashcards that user did not know
    function handleContinue(){
       cardNumber = 0 // Reset card number to 0
        unsure = [] // Clear unsure array
        // Remove known terms from content
        known.forEach((term) => {
            content.splice(content.indexOf(term), 1) // Remove known terms from content
        })
        known = [] // Clear known array
    }
     function launchConfetti() {
        confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0 }
        })
    }
    async function updateFlashcard(){
        modifyDeckState = "update"
        const originalCard = content[cardNumber]
        const originalIndex = fullDeck.indexOf(originalCard)
        const newCard = JSON.stringify({word: newWord, definition: newDefinition, partOfSpeech: newPartOfSpeech, romanisation: newRomanisation})
        fullDeck= [
            ...fullDeck.slice(0, originalIndex),
            newCard,
            ...fullDeck.slice(originalIndex+1)
        ]
        console.log(originalCard)
        console.log(newCard)
        console.log(fullDeck)
        try{
        const {data, error} = await supabase
            .from('flashcard_decks')
            .update({content: (fullDeck)})
            .eq("id", id)
        .select()
    if(data){
        statusMessage = "success"
    }}
            catch(error){
                console.error(error)
                statusMessage = "error"
            }
        }

    async function addFlashcard(){
        modifyDeckState = "add"
        const newCard = JSON.stringify({word: addWord, definition: addDefinition, partOfSpeech: addPartOfSpeech, romanisation: addRomanisation})
        fullDeck.push(newCard)
        try{
        const {data, error} = await supabase
            .from('flashcard_decks')
            .update({content: (fullDeck)})
            .eq("id", id)
        .select()
    if(data){
        statusMessage = "success"
    }}
            catch(error){
                console.error(error)
                statusMessage = "error"
            }
        }
    
    $inspect(content)
</script>
<main>
    {#if author && deckName}
        <div class="title-author-container">
            <h1 class="deck-name-heading">{deckName}</h1>
            <p class="deck-name-author">Uploaded by: <b>@{author}</b></p>
        {#if isUsers}
    <span class="deck-edit-buttons">
            <button onclick={() => {editFlashcardDialog.show()}} class="edit-btn"><span class="material-symbols-rounded edit">edit</span> Edit card</button>
            <button onclick={() => {addFlashcardDialog.show()}} class="edit-btn"><span class="material-symbols-rounded edit">add_circle</span>Add card</button>
    </span>
            {/if}
        </div>
    {/if}
    {#if cardNumber !== content.length}
        <span class="card-count-container">
            <span class="unsure-count card-count">{unsure.length}</span>
            <span class="known-count card-count">{known.length}</span>
        </span>
        <div class="flashcard">
            <h1 class="word">{word}</h1>
            <span class="word-details">
                {#if romanisation}
                    <i><p class="romanisation">{romanisation}</p></i>
                {/if}
                <p class="part-of-speech">{partOfSpeech}</p>
            </span>
            <p class="definition">{definition}</p>
        </div>
        <span class="buttons">
            <button class="dont-know flashcard-button" onclick={handleUnknown}><span class="material-symbols-rounded">do_not_disturb</span>Unsure</button>
            <button class="flip flashcard-button" onclick={showBack}><span class="material-symbols-rounded">autorenew</span>Flip</button>
            <button class="know flashcard-button" onclick={markKnown}><span class="material-symbols-rounded">check_circle</span>Know</button>
        </span>
    {/if}
    {#if cardNumber === content.length}
        <div class="flashcard">
            <p class="known-percentage">Known: {percentKnown}%</p>
            {#if percentKnown !== 100}
                <button class="flashcard-continue" onclick={handleContinue}>
                <span class="material-symbols-rounded">expand_circle_right</span>
                Continue with unknown terms
            </button>
            {/if}
            {#if percentKnown === 100}
                <p>Congratulations! You know all the terms in this deck!</p>
            {/if}
        </div>
    {/if}
</main>

<dialog bind:this={editFlashcardDialog}>
    <h2>Editing card: <i>{newWord}</i></h2>
    <div class="dialog-inputs">
    <label>Term:</label>
    <textarea bind:value={newWord} class="small-t-area">{word}</textarea>
    <label>Romanisation (optional):</label>
    <textarea bind:value={newRomanisation} class="small-t-area">{romanisation}</textarea>
    <label>Part of speech:</label>
    <textarea bind:value={newPartOfSpeech} class="small-t-area">{partOfSpeech}</textarea>
    <label>Definition:</label>
    <textarea bind:value={newDefinition} c>{definition}</textarea>
</div>
    <button class="update-btn dialog-btn" onclick={updateFlashcard}>Update</button>
    <button class="cancel-btn dialog-btn" onclick={() => {editFlashcardDialog.close()}}>Cancel</button>
{#if statusMessage == "success"}
    <InlineStatus type="success" message="Card updated! Reload to see changes!" width="100%"/>
{/if}
{#if statusMessage == "error"}
    <InlineStatus type="error" message="Error changing card." width="100%"/>
{/if}
</dialog>

<dialog bind:this={addFlashcardDialog}>
    <h2>Creating card: <i>{addWord}</i></h2>
    <div class="dialog-inputs">
    <label>Term:</label>
    <textarea bind:value={addWord} class="small-t-area"></textarea>
    <label>Romanisation (optional):</label>
    <textarea bind:value={addRomanisation} class="small-t-area"></textarea>
    <label>Part of speech:</label>
    <textarea bind:value={addPartOfSpeech} class="small-t-area"></textarea>
    <label>Definition:</label>
    <textarea bind:value={addDefinition}></textarea>
</div>
    <button class="update-btn dialog-btn" onclick={addFlashcard}>Add</button>
    <button class="cancel-btn dialog-btn" onclick={() => {addFlashcardDialog.close()}}>Cancel</button>
    {#if statusMessage == "success"}
    <InlineStatus type="success" message="Card added! Reload to see changes!" width="100%"/>
{/if}
{#if statusMessage == "error"}
    <InlineStatus type="error" message="Error changing card." width="100%"/>
{/if}
</dialog>
<style>
main{
    width: fit-content
}
h2{
    margin: 0em;
}
p {
    margin: 0.25em 0;
}
h1{
    height:fit-content;
    margin: 0.05em 0;
}
label{
    margin-top: 0.5em;
}
input,
textarea
{
    border: none;
    font-size: 1.5em;
    box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    border: none;
    width: 90%;
    height: fit-content;
    overflow: scroll;
    resize: none;
}
dialog{
    background-color: #f8f8f8;
    border: 0;
    border-radius: 1em;
            box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
}
.dialog-inputs{
    display: flex;
    gap: 0.2em;
    flex-direction: column;
    margin-bottom: 1em;
}
button{
    border-radius: 8px;
    width: 32%;
    height: 3em;
    display: flex;
    align-items: center;
    justify-content:center;
    gap: 0.5em;
    box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    border: none;
}
progress {
    width: 100%;
    height: 2em;
    background: #437150;
    border-radius: 2em;

}
.dont-know{
    background-color: #f96d6d;
    color: #631818;
}
.know{
    background-color: #A4F8BD;
    color: #437150;
}
.flashcard {
    border: 1px solid #ccc;
    padding: 1em;
    border-radius: 8px;
    background-color: #ffffff;
    width: 17.5em;
    margin: 0.25em 0 0.5em;
    text-align: center;
    box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000005,
                0 2px 4px #00000005;
    border: none;
}
.word{
    font-size: 2.5em;
    font-weight: bold;
}
.definition {
    color: #555;
}
.romanisation {
    font-style: italic;
    color: #888;
}
.part-of-speech {
    color: #aaa;
}
.word-details{
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    justify-content: center;
    align-items: center;
}
.buttons{
    display: flex;
    justify-content: space-between;
    width: 19.75em;
    
}
.material-symbols-rounded{
    font-size: 1.5em;
    margin: 0;
}
.card-count-container{
    width: 20em;
    display: flex;
    margin-top: 0em;
    justify-content: space-between;
    align-items: center;
}
.card-count{
    border-width: 2px;
    border-style: solid;
    width: 2em;
    display: inline-block;
    text-align: center;
    border-radius: 30px;
    box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000005,
                0 2px 4px #00000005;
    border: none;
}
.unsure-count{
    border-color: #f96d6d;
    background-color: #ffa4a4;
    height: 1.5em;
    width: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
}
.known-count{
    border-color: #A4F8BD;
    background-color: #A4F8BD;
    height: 1.5em;
    width: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
}
.known-percentage { 
    font-size: 1.5em;
    font-weight: bold;
    color:  #69be81;
}
.flashcard-continue{
    width:fit-content;
    margin: 1em auto 0;
    color: #7a7a7a;
    box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    border: none;
}
.deck-name-heading{
    font-size: 2em;
}
.deck-name-heading,
.deck-name-author{
    margin:0;
}
.title-author-container{
    margin: 0.25em 0 0.5em;
    padding: 0.4em 0.25em;
    border-radius: 0.25em;
}
    .edit-btn:hover{
    background-color: #c0c0c0;
    cursor: pointer;
}
.edit{
    font-size: 1em;
    margin: 0;
    padding: 2em 0.5em;
}
span{

}
.edit-btn{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2em;
    height: 1.75em;
    background-color: #dcdcdc;
    width:fit-content;
    padding: 0.41em 0.75em 0.25em 0.2em;
    margin-top: 0.5em;
    border-radius: 15px;
    box-shadow: inset 0 1px 1px #ffffff,
                0 1px 1px #00000010,
                0 1px 2px #00000015;
    border: none;
}
.dialog-btn{
    height: 2.5em;
    width: 95%;
    margin-bottom: 0.5em;
}
.update-btn{
                    background-color: #4A70A9;
        box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
        border: none;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;

}
.dialog-btn:hover{
    background-color: #d9d9d9;
}
.update-btn:hover{
                    background-color: #33578e;
}
.small-t-area{
    height: 1.25em;
    resize: none;
    overflow: hidden;
}
.deck-edit-buttons{
    width: fit-content;
    display: flex;
    flex-direction: row;
    gap:0.1em;
}
</style>

