<script>
    let { author = "Loading..."} = $props()
</script>
<span class="author-tag">
    <span class="material-symbols-rounded">person</span>
    <span class="author-text-container">
        <p>Uploaded by:</p>
        <p class="author">{author}</p>
    </span>
</span>
<style>
    p{
        margin:0;
        height: fit-content;
    }
    .author {
        font-size: 1rem;
        font-weight: bold;
        color:#000;
        margin: 0;
        padding: 0;
    }
    .author-text-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25em;
    }
    .author-tag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: 1.25em;
        border-radius: 0.25em;
        background-color: #f1f1f1;
        padding: 0.25em 0.5em;
    }
    .material-symbols-rounded {
        font-size: 1.25rem;
        color: #000;
        margin-right: 0.25em;
    }
</style>