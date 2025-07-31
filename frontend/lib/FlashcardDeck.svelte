<script>
  import { onMount } from "svelte";
    import confetti from "canvas-confetti";
    const { content, backContent = [] } = $props()
    let cardNumber = $state(0)
    let unsure = $state([])
    let known = $state([])
    let { word, definition, partOfSpeech, romanisation } = $state("")
    let percentKnown = $state(0)
    $effect(() => {
        percentKnown = Math.round((known.length / (unsure.length + known.length)) * 100)
    })
    console.log(content)
    onMount(() => {
        $inspect(cardNumber)
        $effect(() => {
            if(content && Array.isArray(content) && content[cardNumber]){
                const flashcardContentJSON = JSON.parse(content[cardNumber])
                word = flashcardContentJSON.word
                definition = flashcardContentJSON.definition
                partOfSpeech = flashcardContentJSON.partOfSpeech
                romanisation = flashcardContentJSON.romanisation
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
    $inspect(content)
</script>
<main>
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
<style>

p {
    margin: 0.25em 0;
}
h1{
    height:fit-content;
    margin: 0.05em 0;
}
button{
    border-radius: 8px;
    width: 32%;
    height: 3em;
    display: flex;
    align-items: center;
    justify-content:center;
    gap: 0.5em;
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
    border-color: #631818;
}
.know{
    background-color: #A4F8BD;
    color: #437150;
}
.flashcard {
    border: 1px solid #ccc;
    padding: 1em;
    border-radius: 8px;
    background-color: #f9f9f9;
    width: 17.5em;
    margin: 0.25em auto 0.5em;
    text-align: center;
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
}
.material-symbols-rounded{
    font-size: 1.5em;
    margin: 0;
}
.card-count-container{
    width: 20em;
    display: flex;
    justify-content: space-between;
    align-items: center
}
.card-count{
    border-width: 2px;
    border-style: solid;
    width: 2em;
    display: inline-block;
    text-align: center;
    border-radius: 30px;
}
.unsure-count{
    border-color: #f96d6d;
    background-color: #ffa4a4;
    border-color: #ff8383;
}
.known-count{
    border-color: #A4F8BD;
    background-color: #A4F8BD;
    border-color: #71df9b;
}
.known-percentage { 
    font-size: 1.5em;
    font-weight: bold;
    color:  #69be81;
}
.flashcard-continue{
    width:12em;
    margin: 1em auto 0;
    border: rgb(197, 197, 197) 1px solid;
    color: #7a7a7a;
}
</style>