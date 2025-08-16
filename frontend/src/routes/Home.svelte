<script>
  import Sidebar from "../../lib/Sidebar.svelte";
    import { supabase } from "../../lib/supabaseClient";
    import { onMount } from "svelte";

    onMount(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        console.log(user)
    })

</script>

<main class="route">g
    <Sidebar currentPage="/home"/> 
    <section class="main-page">
    <h1 class="page-header">Home</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
        <h1>👋 Hello, welcome back.</h1>
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