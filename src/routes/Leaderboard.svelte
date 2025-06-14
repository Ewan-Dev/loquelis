<script>
  import Sidebar from "../lib/Sidebar.svelte";
</script>

<main class="route">
    <Sidebar currentPage="/leaderboard"/> 
    <section class="main-page">
    <h1 class="page-header">Leaderboard</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
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