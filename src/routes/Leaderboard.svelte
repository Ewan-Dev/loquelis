<script>
  import Sidebar from "../lib/Sidebar.svelte";
    import MediaBox from "../lib/MediaBox.svelte"; 
</script>

<main>
    <Sidebar currentPage="/leaderboard" /> <!-- Add sidebar to the leaderboard page -->
    <h1>Leaderboard</h1>
</main>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }
</style>