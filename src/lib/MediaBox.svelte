<script lang="ts">
    import MediaTag from "./MediaTag.svelte";
    // Example values
    let name = '99 Luftballons';
    let artist = 'Nena';
    let cover = 'https://upload.wikimedia.org/wikipedia/en/4/40/99_Luftballons_single_cover.jpg';
</script>

<div>
    <img src={cover} alt="Album cover">
    <span>
        <MediaTag type="level" message="A1"/>
        <MediaTag type="rating" message="79%" symbol="thumb_up"/>
    </span>
    <p><b>{ name }</b></p>
    <p>{ artist }</p>
</div>

<style>
    div {
        height: fit-content;
        width: fit-content;
        background-color: #F5F5F5;
        border: #DBDBDB 0.2em solid;
        padding: 0.3em;
        border-radius: 1em;
    }
    img {
        width: 10em;
        height: 10em;
        border-radius: 0.5em;
        margin: 0;
    }
    p {
        margin: 0.05em;
        font-size: 1.25em;
    }
    span {
        display: flex;
        gap: 0.2em;
    }
</style>