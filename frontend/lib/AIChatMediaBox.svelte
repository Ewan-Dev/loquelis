<script>
    const { id, image, firstName, trait , occupation, lang, cefr} = $props();
</script>
<section class="ai-chat-box">
    <div class="pfp-name-occupation-container">
        {#if id != 1860}
            <img src={`https://hatscripts.github.io/circle-flags/flags/${lang}.svg?raw=true`} alt={lang} class="pfp"/>
         {/if}
         {#if id == 1860}
         <img src={`https://raw.githubusercontent.com/Ewan-Dev/loquelis/refs/heads/main/frontend/static/loq-pfp.png`} alt={lang} class="pfp"/>
         {/if}
        <div class="text">
        <div class="name-span">
            <a href={`/#/app/ai-chat/${id}`}>
                <h2>{firstName}</h2>
            </a>        {#if id == 1860}

                    <span class="torq"><span class="material-symbols-rounded">forum</span>talk to me!</span>
                    {/if}
                    </div>
            <p class="occupation">{occupation}</p>
        </div>
        </div>
        <div class="flag-tags-container">
                    <span class="cefr">
                {cefr}
            </span>
            <span class="traits">
                <p class="trait-tag">{trait}</p>
            </span>
        </div>

        </section>
<style>
.cefr{
    height: 2em;
    aspect-ratio: 1/1;
    font-size: 1em;
    position: relative
    ;
    top:-0.25em;
    padding: 1px;
    background-color: #a8f0c4;
    color: #65b694;
    font-weight: bold;
    border-radius: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    right: -1px;
}
    section{
        background-color: #ffffff;
                width: 100%;
    }
    img{
        width: 3em;
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
    a{
        text-decoration: none;
        color: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .torq{
        margin-top: 1em;
        height: 1em;
        right: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding:0.2em 0.4em !important;
        gap:0.25em;
         background: linear-gradient(90deg,rgb(40, 65, 194) 0%, rgb(111, 87, 199) 50%, rgb(211, 83, 237) 100%);
                padding-bottom: 0.3em;
                border-radius: 1em;
        color:#ffffff
    }
        .torq:hover{
font-weight: bold;
         background: linear-gradient(90deg,rgb(40, 65, 194) 0%, rgb(111, 87, 199) 50%, rgb(211, 83, 237) 100%);
                padding-bottom: 0.3em;
                border-radius: 1em;
        color:#ffffff
        }
    .lang-flag {
        width: 1.5em;
        height: 1.5em;
        border-radius: 0.25em;

    }
    .ai-chat-box {
        flex-shrink: 0;
        padding: 1em;
        width: 97%;
        margin: 0;
        height: 3em;
        padding: 0.5em 0.25em;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: top;
        gap: 0.5em;
        overflow: hidden;
        border-radius: 1em;
    }
    .ai-chat-box:hover {
     box-shadow:rgb(230, 230, 230) 0px 0px 0px 1.5px;
    }

    .material-symbols-rounded{
        font-size: 1em;
        margin-top: 0.1em;
    }
        .text{
        display: flex;
        flex-direction: column;
        text-align: left;
        height: fit-content;
        gap: 0.25em;
    }
    .name-span{
        display: flex;
        align-items: center;
        gap:0.5em;
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
        background-color: #a5c9ff;
        color: #5b84c1;
        padding: 0.15em 0.5em;
        position: relative;
        left:3.5px;
        top: -1px;
        border-radius: 1em;
        font-weight: bold;
        height: 1.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75em;
        margin: 0;
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