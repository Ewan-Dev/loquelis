<script>
    const {definition, word} = $props()
</script>

<section>
    <h1>{word}</h1>
    <p>{definition}</p>
</section>

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
</style>