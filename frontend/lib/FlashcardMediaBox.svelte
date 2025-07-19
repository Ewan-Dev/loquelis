<script>
    let {name, author, link, terms, lang} = $props()
</script>
<section>
    <span>
        <a href={link}><h1 class="name">🍔 {name}</h1></a>
        <img src="https://hatscripts.github.io/circle-flags/flags/{lang}.svg">
        <p class="terms">Terms: {terms}</p>
    </span>
        <p class="author">@{author}</p>
</section>
<style>
    section{
        height: fit-content;
        width: 12em;
        padding: 0.5em;
        background-color: #F5F5F5;
        border: #DBDBDB 0.2em solid;
        border-radius: 1em;
        display: flex;
        flex-direction: column;
        gap:0.25em;
    }
    a,
    p,
    h1{
        margin: 0;
        margin-right: 0.5em;
        padding: 0;
        height: fit-content;
        font-size: 1.15em;
    }
    .terms{
        background-color: #80a5ed;
        width: fit-content;
        padding: 0.15em 0.5em;
        border-radius: 1em;
        font-size: 0.85em;
        font-weight: bold;
    }
    span{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between ;
        gap:0.25em;
    }
    img{
        width: 1.5em;
    }
</style>