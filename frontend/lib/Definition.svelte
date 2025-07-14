<script>
    const {definition, word, partOfSpeech} = $props()
</script>

{#if word}
    <section>
        <h1>{word}</h1>
        <p class="part-of-speech">{partOfSpeech}</p>
        <p>{definition}</p>
    </section>
{/if}
<style>
    section{
        height: fit-content;
        width: 12.5em;
        background-color: #fff ;
        border: #DBDBDB solid 2.5px ;
        padding: 0.35em 0.5em;
        border-radius: 1em;
;
        z-index: 1;
    }

    h1,
    p{
        margin: 0.1em 0;
    }

    h1{
        font-size: 2em;
    }
    .part-of-speech{
        font-weight: bold;
        color: #ffffff;
        background-color: #2c67fa;
        width: fit-content;
        padding: 0.15em 0.2em;
        border-radius: 0.4em;
    }
</style>