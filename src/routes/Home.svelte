<script>
  import Sidebar from "../lib/Sidebar.svelte";
  import Greeting from "../lib/Greeting.svelte";
</script>

<main class="route">
    <Sidebar currentPage="/"/> 
    <section class="main-page">
    <h1 class="page-header">Home</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
        <Greeting firstName="Ewan" /> <!--Dynamically greet user -->
    </section>
    </section>
</main>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }

</style>