<script >
    import Definition from "./Definition.svelte";

    const { currentLine = "Play the video to see live subtitles. Click on an individual word for a definition!", targetLanguage = "", nativeLanguage = "en"} = $props() 
    let {term, definition, partOfSpeech, original, translated, romanisation} = $state("")
    let fullTranslationVisibility = true
    let subtitlesArray = $state([])
 
    $effect(() => {
        const segmenter = new Intl.Segmenter('zh', {granularity: 'word'})
        subtitlesArray = [...segmenter.segment(currentLine)].map(s => s.segment)
        fetchSentenceTranslation(currentLine)
    })
    async function fetchDefinition(word, contextArray) {
        console.log("Fetching definition for ", word)
        const contextString = contextArray.join(" ")
        const prompt = `you are being used as an AI to give a definition of a word based of context for a language learning software the language of the word and context is ${targetLanguage} and the user's native language is ${nativeLanguage} the word is ${word} and the context is ${contextString} so give your definition in ${nativeLanguage} and as part of your just definition NOT the partOfSpeech add helpful notes such as if its plural and its singular or its case/tense and its infintive etc. but keep it simple and short return as raw json with no backtick MD markers as your respone will be directly parsed into json respond with attributes word, partOfSpeech, romanisation and definition but do NOT return romanisation where it is not necessary`
        const response = await fetch(`https://text.pollinations.ai/${prompt}`)
        const responseJSON = await response.json()
        console.log(responseJSON)
        term = responseJSON.word
        definition = responseJSON.definition
        partOfSpeech = responseJSON.partOfSpeech
        romanisation = responseJSON.romanisation
    }

    async function fetchSentenceTranslation(sentence) {
        const prompt = `Translate from ISO 639-2 ${targetLanguage} to ${nativeLanguage}. Sentence: "${sentence}". Respond only with raw JSON: { "original": "...", "translated": "..." }. No comments, markdown, or extra text`
        const response = await fetch(`https://text.pollinations.ai/${prompt}`)
        console.log(response)
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

<img src="././static/throbber.gif">
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
</style>