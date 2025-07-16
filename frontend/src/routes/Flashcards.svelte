<script>
    import Sidebar from "../../lib/Sidebar.svelte";
</script>

<main class="route">
    <Sidebar currentPage="/music"/> 
    <section class="main-page">
    <h1 class="page-header">Flashcards</h1>
    <!-- Main content section for styles to be applied -->
    <section class="main-content">
        <p>test</p>
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