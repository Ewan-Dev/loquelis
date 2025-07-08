<script lang="ts">
  import Leaderboard from './routes/Leaderboard.svelte'
  import Home from './routes/Home.svelte'
  import Signup from './routes/Signup.svelte'
  import Login from './routes/Login.svelte'
  import Music from './routes/music/+page.svelte'
  import MusicSlug from './routes/music/[slug].svelte'
  import Upload from './routes/Upload.svelte'
  import Router from 'svelte-spa-router'

  // Setting the routes
  const routes = {
    '/app/upload': Upload,
    '/app/music/:slug' : MusicSlug,
    '/app/music' : Music,
    '/app/login' : Login,
    '/app/signup' : Signup,
    '/app/leaderboard': Leaderboard,
    '/': Home
  }


</script>

<head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght@400" rel="stylesheet" />
</head>

<main>
  <!-- Import router component to allow for routing -->
  <Router {routes} /> 
</main>
