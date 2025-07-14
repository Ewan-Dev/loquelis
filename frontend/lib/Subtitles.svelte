<script >
    import Definition from "./Definition.svelte";

    const { currentLine = "Loading...", targetLanguage = "", nativeLanguage = "en"  } = $props()
    let {term, definition, partOfSpeech, original, translated} = $state("")
    let fullTranslationVisibility = true
    let subtitlesArray = $state([])

    $effect(() => {
        subtitlesArray = currentLine.split(" ")
        fetchSentenceTranslation(currentLine)
    })
    async function fetchDefinition(word, contextArray) {
        const contextString = contextArray.join(" ")
        const prompt = `you are being used as an AI to give a definition of a word based of context for a language learning software the language of the word and context is ${targetLanguage} and the user's native language is ${nativeLanguage} the word is ${word} and the context is ${contextString} so give your definition in that language return as raw json as your respone will be directly parsed into json respond with attributes word, partOfSpeech and definition`
        const response = await fetch(`https://text.pollinations.ai/${prompt}`)
        const responseJSON = await response.json()
        console.log(responseJSON)
        term = responseJSON.word
        definition = responseJSON.definition
        partOfSpeech = responseJSON.partOfSpeech
    }

    async function fetchSentenceTranslation(sentence) {
        const prompt = `you are being used as an AI to give a translation of a sentence for a language learning software the language of the sentence is ISO 639-2 ${targetLanguage} and the user's native language is ${nativeLanguage} give your definition in that language the sentence is SENTENCESTART ${sentence} SENTENCEEND return as simply raw json as your response will be directly parsed into json and respond with attributes original and translated`
        const response = await fetch(`https://text.pollinations.ai/${prompt}`)
        const responseJSON = await response.json()
        console.log(responseJSON)
        original = responseJSON.original
        translated = responseJSON.translated
    }

    async function toggleFullTranslationVisibility() {
        const fullTranslateEl = document.getElementsByClassName("full-translate")
        const showTranslationsBtn = document.getElementsByClassName("show-translations-btn")
        fullTranslationVisibility = !fullTranslationVisibility
        Array.from(fullTranslateEl).forEach((element) => {
            if(fullTranslationVisibility === true){
                element.style.display = "block"
            }
            else{
                element.style.display = "none"
            }
        })
        Array.from(showTranslationsBtn).forEach((element) => {
            if(fullTranslationVisibility === true){
                element.style.display = "none"
            }
            else{
                element.style.display = "block"
            }
        })
        }

</script>
<Definition word={term} definition={definition} partOfSpeech={partOfSpeech} />
<span>
<span class="main-subtitles">
    {#each subtitlesArray as subtitle}
        <p class="current-line" on:click={() => fetchDefinition(subtitle, subtitlesArray)}>{subtitle}</p>
    {/each}
</span>
    <p class="full-translate" on:click={() => toggleFullTranslationVisibility()}>{translated}</p>
    <button class="show-translations-btn" on:click={() => toggleFullTranslationVisibility()}>Show translations</button>
    
</span>

<style>
    .show-translations-btn{
        display: none;
    }
    .full-translate{
        width: 100%;
        display: block;
        font-size: 1.25em;
    }
     .full-translate{
        width: 100%;
        display: block;
        font-size: 1.25em;
    }
    .full-translate:hover{
        text-decoration: line-through;
        color: rgb(255, 169, 169);
    }
    p{
        width: fit-content;
        height: fit-content;
        margin: 0em;
        padding: 0.1em;
        border-radius: 0.2em;
    }
    .current-line {
        font-size: 2.5em;
        font-weight: bold;
    }
    span{
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        align-items: left;
        gap: 0;
        margin: 0.5em 0;
        position: relative;
        width: 100%;
    }
    p.current-line:hover{
        background-color: #d2d2d2;
        cursor: pointer;
    }
    .main-subtitles{
        width:100%;
    }
</style>