<script lang="ts">
  import Leaderboard from './routes/Leaderboard.svelte'
  import Home from './routes/Home.svelte'
  import Signup from './routes/Signup.svelte'
  import Router from 'svelte-spa-router'

  // Setting the routes
  const routes = {
    '/app/signup' : Signup,
    '/app/leaderboard': Leaderboard,
    '/': Home
  }

</script>

<main> 
  <!-- Import router component to allow for routing -->
  <Router {routes} /> 
</main>
