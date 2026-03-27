<script lang="ts">
    import MediaTag from "./MediaTag.svelte";

    // Example values
    export let name = null;
    export let artist = null;
    export let cover = null;
    export let level = null;
    export let rating = null;
    export let link = null;
    export let type = null; // § Type of media, e.g., "video" or "music"
</script>

<div class={type}>
    <img src={cover} alt="Album cover" class={type}>
    <span>
        <MediaTag type="level" message={level}/>
    </span>
    <a href={ link } class="name"><b>{ name }</b></a>
    <a class="artist">{ artist }</a>
</div>

<style>
    div {
        height: fit-content;
        width: 10em;
        background-color: #fff;
        box-shadow: inset 0 1px 2px #ffffff30,
                0 1px 2px #00000030,
                0 2px 4px #00000015;
        border: none;
        padding: 0.3em;
        border-radius: 1em;
    }
    div.video{
        width: 15em;
    }
    img.video {
        height: 8em;
        width: 15em;
    }
    img {
        width: 10em;
        height: 10em;
        border-radius: 0.5em;
        margin: 0;
        object-fit: cover;
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
    span {
        display: flex;
        gap: 0.2em;
    }
    .name{
        width: 95%;
        height: 2.75em;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .artist{
        width: 95%;
        height: 1.5em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
</style>