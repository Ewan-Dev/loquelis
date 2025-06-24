<script lang="ts">
    import MediaTag from "./MediaTag.svelte";
    import { supabase } from "./supabaseClient.js";
    // Example values
    export let name = null;
    export let artist = null;
    export let cover = null;
    export let level = null;
    export let rating = null;
    export let link = null;
</script>

<div>
    <img src={cover} alt="Album cover">
    <span>
        <MediaTag type="level" message={level}/>
        <MediaTag type="rating" message={rating} symbol="thumb_up"/>
    </span>
    <a href={ link }><b>{ name }</b></a>
    <a>{ artist }</a>
</div>

<style>
    div {
        height: fit-content;
        width: 10em;
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
</style>