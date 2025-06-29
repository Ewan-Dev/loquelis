<script>
  import {supabase} from "../../../../lib/supabaseClient";

  import Sidebar from "../../../lib/Sidebar.svelte";
  import MediaHeader from "../../../lib/MediaHeader.svelte";

  import { location } from 'svelte-spa-router'

  let slug = $state($location.split('/').pop()) // Gets the last part of the path - the slug
  
  // Metadata for song and takes 'Loading...' until data is fetched and can be updated to Unknown or song data
  let name = $state("Loading...")
  let artist = $state("Loading...")
  let cover = $state("https://img.youtube.com/vi/loquela/maxresdefault.jpg") // Fallback cover image
  let level = $state("Unknown Level")
  let rating = $state("No Rating")
  let link = $state("https://youtu.be/zabswqP6xEM")

  // Whenever page reloads this runs
  $effect(() => {
    const currentSlug = $location.split('/').pop() // Gets slug from current path
    if (currentSlug != slug){ // If slug if different to page to last before reload
      slug = currentSlug // Update slug
    }
    loadSong() // Load new song from slug
})
  async function loadSong (){
    const {data, error} = await supabase
    .from('music') // From music table
    .select('*') // All
    .eq('id', slug) // Select song with same ID as slug
    .single() // Specifies that only 1 row is expected to be returned

    // Updates elements if data is available
    if (data) {
      const song = data
      name = song.name
      artist = song.artist 
      cover = song.cover 
      level = song.level 
      rating = song.rating 
      link = song.link 
    }
    else {
      // Error/ invalid slug
      name = "Unknown Song"
      artist = "Unknown Artist"
      cover = "https://img.youtube.com/vi/loquela/maxresdefault.jpg"
      level = "Unknown Level"
      rating = "No Rating"
      link = "https://youtu.be/zabswqP6xEM"
    }
  
}

</script>

<main class="route">
  <Sidebar currentPage="/music"/> 
  <section class="main-page">
      <h1 class="page-header">Music</h1>
      <!-- Main content section for styles to be applied -->
      <section class="main-content">
          <MediaHeader
              song={name}
              artist={artist}
          />
          <iframe width="560" height="315" src={ link } title={ name } allowfullscreen></iframe>
      </section>
  </section>
</main>




<style>
  iframe {
      border-radius: 0.5em;
      margin: 0;
  }
  h1{
      margin-bottom: 0;
  }
  section {
      display: flex;
      flex-direction: column;
      gap: 1em;
      margin-top: 0;
      padding: 0.25em 1em;
  }
  main{
      display: flex;
      gap: 1em;
      align-items: flex-start;
  }

</style>