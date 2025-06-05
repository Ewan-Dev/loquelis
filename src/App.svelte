<script lang="ts">
  import Leaderboard from './routes/Leaderboard.svelte';
  import Router from 'svelte-spa-router';

  const routes = {
    '/app/leaderboard': Leaderboard
  };
</script>

<main>
  <Router {routes} />

</main>
