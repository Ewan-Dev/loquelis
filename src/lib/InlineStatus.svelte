<script lang="ts">
     let { type = "info", message = "Information" } = $props();
     let icons = {
         info: "info",
         error: "error",
         success: "check_circle",
         warn: "warning"
     };
</script>

<section role="status" class={type}>
<span class={`${type} material-symbols-rounded`}>{icons[type]}</span>
<p class={type}>{ message }</p>
</section>

<style>
    p {
        font-size: 0.75em;
        margin: 0.5em;
        font-weight: 500;
    }
    section{
        width: 16em;
        height: 3em;
        padding: 0.15em 0.5em;
        border-radius: 0.5em;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .info {
        background-color: #ABBFED;
        color: #3B5998;
    }
    .error {
        background-color: #f96d6d;
        color: #631818;
    }
    .success {
        background-color: #A4F8BD;
        color: #437150;
    }
    .warn {
        background-color: #FFD967;
        color: #bb9e48;
    }

</style>