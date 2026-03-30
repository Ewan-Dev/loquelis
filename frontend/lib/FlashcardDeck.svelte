            <!-- svelte-ignore state_referenced_locally -->
            <script>
    import { onMount } from "svelte";
    import confetti from "canvas-confetti";
  import { supabase } from "./supabaseClient";
  import InlineStatus from "./InlineStatus.svelte";
  import { tick } from "svelte";
    const { content,originalDeck, deckName, author = "", id, isUsers } = $props()
    let cardNumber = $state(0)
    let backContent =  []
    let unsure = $state([])
    let known = $state([])
    let { word, definition, partOfSpeech, phoneticAnnotation } = $state("")
    let editCard = $state({})
    let percentKnown = $state(0)
    let fullDeckFetched = false
    let fullDeck = $state(originalDeck)
    let newWord = $state(word)
    let newDefinition = $state(definition)
    let newPartOfSpeech = $state(partOfSpeech)
    let newPhoneticAnnotation = $state(phoneticAnnotation)
    let addWord = $state("")
    let addDefinition = $state("")
    let addPartOfSpeech = $state("")
    let addPhoneticAnnotation = $state("")
    let editFlashcardDialog = $state(HTMLDialogElement)
    let addFlashcardDialog = $state(HTMLDialogElement)
    let deleteFlashcardDialog = $state(HTMLDialogElement)
    let deleteDeckDialog = $state(HTMLDialogElement)
    let frontCardDeckDialog = $state(HTMLDialogElement)
    let exportDeckDialog = $state(HTMLDialogElement)
    let showFrontCardDefinition = $state(false)
    let showFrontCardTerm = $state(true)
    let showFrontCardPhoneticAnnotation = $state(false)
    let showFrontCardPartOfSpeech = $state(false)
    let statusMessage = $state("")
    let modifyDeckState = $state("")
    let waitingForSB = $state(false)
    let deletingCard = $state(word)
    let csv = $state("")
$inspect(statusMessage)

    $effect(() => {
        percentKnown = Math.round((known.length / (unsure.length + known.length)) * 100)
    })

    onMount(async () => {
        console.log("DECK")
        console.log(content)
        $inspect(cardNumber)
        $effect(() => {
            if(content && Array.isArray(content) && content[cardNumber]){
                const flashcardContentJSON = JSON.parse(content[cardNumber])
                console.log(flashcardContentJSON)
                word = flashcardContentJSON.word
                definition = flashcardContentJSON.definition
                partOfSpeech = flashcardContentJSON.partOfSpeech
                phoneticAnnotation = flashcardContentJSON.phoneticAnnotation
                newWord =  (word)
                newDefinition = (definition)
                newPartOfSpeech = (partOfSpeech)
                newPhoneticAnnotation = phoneticAnnotation
            }
        tick().then(() => showFront())
        })
         const { data, error } = await supabase
            .from('flashcard_decks')
            .select("*")
            .eq('id', id)
        if (data){
            backContent = []
            let backContentObject = Object.values(data[0].back_content)
            for (const content of backContentObject){
                console.log(content)
                backContent.push(content)
            }
            
        }
    })

    function showFront(){
        showBack()
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
        showFront();
    }
    function markKnown(){
        if (content[cardNumber]){ // If there is a card at the current index
            known.push(content[cardNumber]) // Add current card to known array
            cardNumber++   // Move to next card
        } 
        if( percentKnown === 100){ // If all cards are known
            launchConfetti() // Launch confetti
        }
        showFront();
    }

    // Function to handle continuing with the flashcards that user did not know
    async function handleContinue(){
       cardNumber = 0 // Reset card number to 0
        unsure = [] // Clear unsure array
        // Remove known terms from content
        known.forEach((term) => {
            content.splice(content.indexOf(term), 1) // Remove known terms from content
        })
        known = [] // Clear known array
        console.log(backContent)
        await tick() // ← wait for Svelte to re-render
        showFront();
    }
     function launchConfetti() {
        confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0 }
        })
    }
    async function updateFlashcard(){
        statusMessage = ""
        modifyDeckState = "update"
            console.log(content)
        const originalCard = content[cardNumber]
        const originalIndex = originalDeck.indexOf(originalCard)
        const newCard = JSON.stringify({word: newWord, definition: newDefinition, partOfSpeech: newPartOfSpeech, phoneticAnnotation: newPhoneticAnnotation})
        fullDeck= [
            ...originalDeck.slice(0, originalIndex),
            newCard,
            ...originalDeck.slice(originalIndex+1)
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

    
    async function deleteFlashcardDeck(){
    statusMessage = ""
        try{
        const {data, error} = await supabase
            .from('flashcard_decks')
            .delete()
            .eq("id", id)
    if(!data){
        statusMessage = "success"
    }
}
            catch(error){
                console.error(error)
                statusMessage = "error"
            }
        }

    async function addFlashcard(){
        statusMessage = ""
        modifyDeckState = "add"
        console.log("cards", originalDeck)
        const newCard = JSON.stringify({word: addWord, definition: addDefinition, partOfSpeech: addPartOfSpeech, phoneticAnnotation: addPhoneticAnnotation})
        fullDeck= [
            newCard,
            ...originalDeck
        ]
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
    
        async function deleteFlashcard(){
        statusMessage = ""
        waitingForSB = true
        modifyDeckState = "delete"
        const currentCard = content[cardNumber]
        const currentCardIndex = originalDeck.indexOf(currentCard)
        fullDeck = originalDeck
        deletingCard = word
        console.log(deletingCard)
        console.log(currentCard)
        console.log(originalDeck)
        fullDeck.splice(currentCardIndex, 1)
        try{
        const {data, error} = await supabase
            .from('flashcard_decks')
            .update({content: (fullDeck)})
            .eq("id", id)
        .select()
    if(data){
        statusMessage = "success"
        waitingForSB = false
    }}
            catch(error){
                console.error(error)
                statusMessage = "error"
                waitingForSB = false
            }
    waitingForSB = false
        }

        $inspect(content.length)
    async function handleFrontCardChange(){
        backContent = []
        statusMessage = ""
        if (!showFrontCardDefinition){
            backContent.push("definition")
        }
        if (!showFrontCardPartOfSpeech){
            backContent.push("part-of-speech")
        }
        if (!showFrontCardTerm){
            backContent.push("word")
        }
        if (!showFrontCardPhoneticAnnotation){
            backContent.push("phonetic-annotation")
        }
            const { error } = await supabase
            .from('flashcard_decks')
            .update({ back_content: backContent })
            .eq('id', id)
        showFront()
            if (error){
                console.error(error)
                statusMessage = "error"
            }
            else{
                statusMessage = "success"
            }
    }

    function exportDeck(){
        csv = "word, definition, partOfSpeech, phoneticAnnotation \n"
        for (let i = 0; i < originalDeck.length; i++){
            const card = JSON.parse(originalDeck[i])
            const word = card.word
            const definition = card.definition
            const partOfSpeech = card.partOfSpeech
            const phoneticAnnotation = card.phoneticAnnotation
            const line = `${word}, ${definition}, ${partOfSpeech}, ${phoneticAnnotation}`
            if (originalDeck.length -1 == i){
                csv += line

            }
            else{
            csv += line + '\n'
            }
    
        }
        console.log(csv)

    }
</script>
<main>
    {#if author && deckName}
        <div class="title-author-container">
            <h1 class="deck-name-heading">{deckName}</h1>
            <p class="deck-name-author">Uploaded by: <b>@{author}</b></p>
        {#if isUsers}
    <span class="deck-edit-buttons">
            <button onclick={() => {editFlashcardDialog.show(); statusMessage = "";}} class="edit-btn"><span class="material-symbols-rounded edit">edit</span></button>
            <button onclick={() => {addFlashcardDialog.show(); statusMessage = "";}} class="edit-btn"><span class="material-symbols-rounded edit">add_circle</span></button>
            <button onclick={() => {frontCardDeckDialog.show(); statusMessage = "";}} class="edit-btn"><span class="material-symbols-rounded edit">select_check_box</span></button>
<button onclick={() => {exportDeckDialog.show(); statusMessage = "";}} class="edit-btn"><span class="material-symbols-rounded edit">file_export</span></button>
            <button onclick={() => {deleteFlashcardDialog.show(); deletingCard = (word);statusMessage = "";}} class="edit-btn delete"><span class="material-symbols-rounded edit">tab_close</span></button>
            <button onclick={() => {deleteDeckDialog.show()}} class="edit-btn delete"><span class="material-symbols-rounded edit">delete</span></button>
    </span>
            {/if}
        </div>
    {/if}
    {#if cardNumber !== content.length}
        <span class="card-count-container">
            <span class="unsure-count card-count">{unsure.length}</span>
            <span class="known-count card-count">{known.length}</span>
        </span>
        {#if content}
        <div class="flashcard">
            <h1 class="word">{word}</h1>
            <span class="word-details">
                {#if phoneticAnnotation}
                    <i><p class="phonetic-annotation">{phoneticAnnotation}</p></i>
                    {/if}
                <p class="part-of-speech">{partOfSpeech}</p>
            </span>
            <p class="definition">{definition}</p>
        </div>
        {/if}
        <span class="buttons">
            <button class="dont-know flashcard-button" onclick={() => {handleUnknown(); showFront();}}><span class="material-symbols-rounded">do_not_disturb</span>Unsure</button>
            <button class="flip flashcard-button" onclick={showBack}><span class="material-symbols-rounded">autorenew</span>Flip</button>
            <button class="know flashcard-button" onclick={() => {markKnown(); showFront();}}><span class="material-symbols-rounded">check_circle</span>Know</button>
        </span>
    {/if}
    {#if content.length == 0}
        <div class="flashcard">
            <p>Deck is empty!</p>
        </div>
    {/if}
    {#if cardNumber === content.length && content.length > 0}
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
    <label>Phonetic Annotation (optional):</label>
    <textarea bind:value={newPhoneticAnnotation} class="small-t-area">{phoneticAnnotation}</textarea>
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
    <label>Phonetic Annotation (optional):</label>
    <textarea bind:value={addPhoneticAnnotation} class="small-t-area"></textarea>
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
<dialog bind:this={deleteFlashcardDialog}>
    <h2>Delete</h2> 
    <p>Are you sure you want to delete the card <i>{word}</i>?</p>
        {#if waitingForSB}
    <img class="throbber" src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Ajax_loader_metal_512.gif">
    {/if}
    <button class="update-btn dialog-btn" onclick={deleteFlashcard}>Delete</button>
    <button class="cancel-btn dialog-btn" onclick={() => {deleteFlashcardDialog.close()}}>Cancel</button>
    {#if statusMessage == "success"}
    <InlineStatus type="success" message="Card {deletingCard} deleted! Reload to see changes!" width="100%"/>
{/if}
{#if statusMessage == "error"}
    <InlineStatus type="error" message="Error changing card." width="100%"/>
{/if}
</dialog>

<dialog bind:this={deleteDeckDialog}>
    <h2>Delete</h2>
    <p>Are you sure you want to delete this deck?</p>
        {#if waitingForSB}
    <img class="throbber" src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Ajax_loader_metal_512.gif">
    {/if}
    <button class="update-btn dialog-btn" onclick={deleteFlashcardDeck}>Delete</button>
    <button class="cancel-btn dialog-btn" onclick={() => {deleteDeckDialog.close()}}>Cancel</button>
    {#if statusMessage == "success"}
    <InlineStatus type="success" message="Deck deleted! Reload to see changes!" width="100%"/>
{/if}
{#if statusMessage == "error"}
    <InlineStatus type="error" message="Error changing card." width="100%"/>
{/if}
</dialog>

<dialog bind:this={frontCardDeckDialog}>
    <h2>Adjust front card</h2>
    <section class="checkbox-list">
    <label>Term:</label>
    <input type="checkbox" name="term" bind:checked={showFrontCardTerm} class="checkbox">
    <label>Phonetic annotation/romanisation:</label>
    <input type="checkbox" name="term" bind:checked={showFrontCardPhoneticAnnotation} class="checkbox">
    <label>Definition:</label>
    <input type="checkbox" name="term" bind:checked={showFrontCardDefinition} class="checkbox">
    <label>Part of speech:</label>
    <input type="checkbox" name="term" bind:checked={showFrontCardPartOfSpeech} class="checkbox">
</section>
        {#if waitingForSB}
    <img class="throbber" src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Ajax_loader_metal_512.gif">
    {/if}
    <button class="update-btn dialog-btn" onclick={() => {handleFrontCardChange(); showBack(); showFront();}}>Submit</button>
    <button class="cancel-btn dialog-btn" onclick={() => {frontCardDeckDialog.close()}}>Cancel</button>
    {#if statusMessage == "success"}
    <InlineStatus type="success" message="Success! Reload to see full changes" width="100%"/>
{/if}
{#if statusMessage == "error"}
    <InlineStatus type="error" message="Error changing card." width="100%"/>
{/if}
</dialog>

<dialog bind:this={exportDeckDialog}>
    <h2>Export deck as CSV</h2>
    <p>Import to Anki, Quizlet etc.</p>
    {#if csv}
    <textarea class="export-ta">
        {csv}
    </textarea>
    <section class="mini-notice">
        Copy and paste this above!
    </section>
    {/if}
    <button class="update-btn dialog-btn" onclick={exportDeck}>Generate CSV</button>
    <button class="cancel-btn dialog-btn" onclick={() => {exportDeckDialog.close()}}>Cancel</button>
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
.checkbox{
    width: fit-content;
    overflow: hidden;
    background-color: transparent;
    box-shadow: none;
    border: 0;
}
dialog{
    background-color: #f8f8f8;
    border: 0;
    border-radius: 1em;
            box-shadow: inset 0 1px 2px #ffffff90,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
    z-index: 5;
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
.flashcard-button{
    z-index: 5;
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
.phonetic-annotation {
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
.checkbox-list{
    display: flex;
    flex-direction: column;
    background-color: transparent;
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
.export-ta{
    font-size: 0.5em;
    height: 10em;
    border-radius: 1em;
    scrollbar-width: 0;
    overflow: auto;
}
.export-ta::-webkit-scrollbar {
    display: none;
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
.mini-notice{
    font-size: 0.75em;
    padding: 0.2em 0.2em;
    background-color: #ededed;
    border-radius: 5px;
    width: 90%;
    margin: 0;
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
    margin: 0;
}
.edit-btn{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2em;
    height: 1.75em;
    background-color: #dcdcdc;
    width:1.75em;
    height: 1.75em;
    padding: 0em;
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
            margin-top: 0.5em;

}
.dialog-btn:hover{
    background-color: #d9d9d9;
}
.update-btn:hover{
                    background-color: #33578e;
}
.hidden{
    display: none;
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
.delete{
    background-color: #f68484;
}
.delete:hover{
    background-color: #d76d6d;
}
.material-symbols-rounded{
    margin: 0.1em 0 0 0  ;
    padding: 0;
}
.throbber{
    width: 2em;
    margin: 0 auto;

}
dialog{
    padding-bottom: 0;
        z-index: 7 !important;
}
.dialog-btn{
    position: relative;
    z-index: 5 !important;
}
</style>

