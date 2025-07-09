<script>
    export let song = "Loading..."; 
    export let artist = "Loading..."; 
</script>

<span><h1 class="song">{ song }</h1><h1 class="artist">{ artist }</h1></span>
<style>
    h1{
        font-size: 1.5em;
        margin: 0.5em 0.25em 0;
    }
    span {
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.15em;
}
    .song{
        font-weight: bold;
    }
    .artist{
        font-style: italic;
        font-weight: normal;
    }
</style>

