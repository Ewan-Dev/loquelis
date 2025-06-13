<script lang="ts">
    export let type = '';
    export let message = ''; 
    export let symbol = ''; 
</script>

<div class={`media-tag ${type}`}>
    <span class="material-symbols-rounded">{ symbol }</span>
    <p>{ message }</p>
</div>

<style>
    .material-symbols-rounded{
        font-size: 1.15em;
    }
    .media-tag {
        border-radius: 0.45em;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.15em;
        font-size: 0.9em;

    }

    .level{
        background-color: #FA8282;
        color: #AC3A3A;
        width: 1.25em;
        height: 1.25em;
    }
    .rating{
        background-color: #89E2B0;
        color: #457448;
        width: fit-content;
        height: 1.25em;
        gap: 0.15em;
    }
</style>