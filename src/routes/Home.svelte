<script>
  import Sidebar from "../lib/Sidebar.svelte";
  import Greeting from "../lib/Greeting.svelte";
</script>

<main>
    <Sidebar currentPage="/"/> <!-- Add home to the leaderboard page -->
    <Greeting firstName="Ewan" /> <!--Dynamically greet user -->
</main>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }
</style>