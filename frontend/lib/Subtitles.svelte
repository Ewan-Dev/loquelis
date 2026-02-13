<script >
  import { resolveDefaultFetch } from "@fal-ai/serverless-client/src/config";
    import Definition from "./Definition.svelte";

    const { currentLine = "Play the video to see live subtitles. Click on an individual word for a definition!", targetLanguage = "", nativeLanguage = "en"} = $props() 
    let {term, definition, partOfSpeech, original, translated, romanisation} = $state("")
    let fullTranslationVisibility = true
    let subtitlesArray = $state([])
    let isDefinitionFetched = $state(true)
    let fetchSubtitles = true

    $effect(() => {
        const segmenter = new Intl.Segmenter('zh', {granularity: 'word'})
        subtitlesArray = [...segmenter.segment(currentLine)].map(s => s.segment)
        fetchSentenceTranslation(currentLine)
    })
    async function fetchDefinition(word, contextArray) {
        isDefinitionFetched = false
        console.log("Fetching definition for ", word)
        try{
        const contextString = contextArray.join(" ")

        const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            prompt: "Translate this word based of context. Return no tags, no markup, just raw JSON with keys `word` (original), `partOfSpeech`, `romanisation` and `definition` (meaning based off context and also simple, normal person-readable info about conjugation) but ONLY return `romanisation` where it is not necessary. For example non-Latin scripts",
            word: word,
            context: contextString,
            originalWordLanguageISO6391: targetLanguage,
            translatedWordLanguageISO6391: nativeLanguage,
        })      
        })      
        const data = await response.json()
        const responseJSON = JSON.parse(data.reply)
        console.log(responseJSON)
        isDefinitionFetched = true
        term = responseJSON.word
        definition = responseJSON.definition
        partOfSpeech = responseJSON.partOfSpeech
        romanisation = responseJSON.romanisation
        }
        catch (error){
            console.error(error)
        }
    }

    async function fetchSentenceTranslation(targetLanguage, nativeLanguage, sentence) {
        if (fetchSubtitles){
        try {
            const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            prompt: "Translate this sentence and return no tags, no markup, just raw JSON with keys `original` and `translated` }",
            originalSentence: sentence,
            originalSentenceLanguageISO6391: targetLanguage,
            translatedSentenceLanguageISO6391: nativeLanguage,
        })      
    })
    const data = await response.json()
    const responseJSON = JSON.parse(data.reply)
    console.log(responseJSON)
    original = responseJSON.original
    translated = responseJSON.translated
}
catch(error){
    console.error(error)
}}
else{
    console.log("Subtitle translations turned off!")
}}

    async function toggleFullTranslationVisibility() {
        const fullTranslateEl = document.getElementsByClassName("full-translate")
        const showTranslationsBtn = document.getElementsByClassName("show-translations-btn")
        fullTranslationVisibility = !fullTranslationVisibility
        Array.from(fullTranslateEl).forEach((element) => {
            if(fullTranslationVisibility === true){
                fetchSubtitles = true
                element.style.display = "block"
            }
            else{
                fetchSubtitles = false
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
{#if !isDefinitionFetched}
<img class="throbber" src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Ajax_loader_metal_512.gif">
{/if}
<Definition word={term} definition={definition} partOfSpeech={partOfSpeech} romanisation={romanisation} language={targetLanguage}/>
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
        border: none;
        box-shadow: inset 0 1px 2px #ffffff30,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
    }
    .show-translations-btn:hover{
        display: none;
        border: none;
        box-shadow: inset 0 1px 2px #ffffff30,
                0 1px 2px #00000030,
                0 2px 4px #00000035;
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
    .throbber{
        width: 3em;
        height: 3em;
        margin: 2em auto;
    }
</style>