<script >
    import Definition from "./Definition.svelte";

    const { currentLine = "Loading...", targetLanguage = "", nativeLanguage = "en"  } = $props()
    let {term, definition, partOfSpeech} = $state("")
    let subtitlesArray = $state([])

    $effect(() => {
        subtitlesArray = currentLine.split(" ")
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

</script>
<Definition word={term} definition={definition} partOfSpeech={partOfSpeech} />
<span>

    {#each subtitlesArray as subtitle}
        <p class="current-line" on:click={() => fetchDefinition(subtitle, subtitlesArray)}>{subtitle}</p>
    {/each}
    
</span>

<style>
    p {
        font-size: 2.5em;
        margin: 0em;
        padding: 0.1em;
        border-radius: 0.2em;
        font-weight: bold;
        width: fit-content;
        height: fit-content;
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
    p:hover{
        background-color: #d2d2d2;
        cursor: pointer;
    }
</style>