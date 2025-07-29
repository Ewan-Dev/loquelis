<script>
    const { image, firstName, trait , occupation, lang} = $props();
</script>
<section class="ai-chat-box">
    <div class="pfp-name-occupation-container">
        {#if image}
            <img src={image} alt={firstName} />
         {/if}
        <div class="text">
            <h2>{firstName}</h2>
            <p class="occupation">{occupation}</p>
        </div>
        </div>
        <div class="flag-tags-container">
            <img class="lang-flag" src={`https://hatscripts.github.io/circle-flags/flags/${lang}.svg`} alt={lang} />
            <span class="traits">
                    <p class="trait-tag">{trait}</p>
            </span>
        </div>
        </section>
<style>
    img{
        width: 3.5em;
        border-radius: 25em;
        margin:  0 0.2em;
    }
    h2 {
        font-size: 2em;
        margin: 0;
        height: 1em;
    }
    p {
        margin: 0;
    }
    .lang-flag {
        width: 1.5em;
        height: 1.5em;
        border-radius: 0.25em;
    }
    .ai-chat-box {
        background-color: #F5F5F5;
        border: #DBDBDB 0.15em solid;
        padding: 1em;
        width: 97%;
        height: 3.25em;
        padding: 0.5em 0.25em;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: top;
        gap: 0.5em;
        border-radius: 1em;
    }
        .text{
        display: flex;
        flex-direction: column;
        text-align: left;
        height: fit-content;
        gap: 0.25em;
    }
    .traits {
        display: flex;
        flex-direction: row;
        gap: 0.25em;
        flex-wrap: wrap;
        font-size: 1em;
        margin-right: 0.2em;
    }
    .trait-tag {
        background-color: #80a5ed;
        padding: 0.15em 0.5em;
        border-radius: 1em;
        color: #fff;
        font-weight: bold;
        height: fit-content;
        font-size: 0.75em;
    }
    .occupation{
        font-size: 1em;
        height: 1.5em;
    }
    .pfp-name-occupation-container {
        display: flex;
        align-items: center;
        gap: 0.5em;
    }
    .flag-tags-container {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        flex-direction: column;
        gap: 0.5em;
    }
</style>