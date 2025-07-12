<script lang="ts">
    export let currentLine = "Loading..."
</script>

<span>
    <p class="current-line">{currentLine}</p>
</span>

<style>
    p {
        font-size: 2.5em;
        margin: 0em;
        padding: 0;
        font-weight: bold;
    }
    span{
        display: flex;
        gap: 0;
        flex-direction: column;
        margin: 0.5em 0;
    }
</style>