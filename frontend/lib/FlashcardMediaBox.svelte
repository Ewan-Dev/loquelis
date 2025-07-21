<script>
    let {name, author, id, terms, lang} = $props()
</script>
<section>
    <span class="text-container">
        <a href={`#/app/flashcards/${id}`}> <!-- Link to the flashcard slug page with id-->
            <h1 class="name">{name}</h1>
        </a>
        <p class="terms">Terms: {terms}</p>
        <p class="author">@{author}</p>
    </span>
    <span class="language-image-container">
          <img src="https://hatscripts.github.io/circle-flags/flags/{lang}.svg">
    </span>

</section>
<style>
    section{
        height: 7em;
        width: 12em;
        padding: 0.5em;
        background-color: #F5F5F5;
        border: #DBDBDB 0.2em solid;
        border-radius: 1em;
        display: flex;
        flex-direction: row;
        justify-content:space-between;
        gap:0.25em;
        overflow: hidden;
    }
    a,
    p,
    h1{
        margin: 0;
        padding: 0;
        height: fit-content;
        font-size: 1.15em;
    }
    a {
        height: auto;
        overflow: hidden;
        color: #000;
        margin: 0.05em;
        font-size: 1.25em;
        text-decoration: none;
        display: block;
    }
    .terms{
        background-color: #80a5ed;
        width: fit-content;
        padding: 0.15em 0.5em;
        border-radius: 1em;
        font-size: 0.85em;
        font-weight: bold;
    }
    img{
        width: 1.5em;
    }
    span{
        width: 80%;
        overflow: hidden;
    }
    .language-image-container{
        display: flex;
        align-items: start;
        width: 1.5em;
        height: 1.5em;
    }
    .text-container{
        width: 85%;
        display: flex;
        flex-direction: column;
        gap:0.4em;
    }
</style>