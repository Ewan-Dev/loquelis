<script>
  import { supabase } from "../../../lib/supabaseClient"
  import Sidebar from "../../../lib/Sidebar.svelte";
  import MediaHeader from "../../../lib/MediaHeader.svelte";
  import Subtitles from "../../../lib/Subtitles.svelte"
  import { location } from 'svelte-spa-router'
  import { onMount } from "svelte";
  let slug = $state($location.split('/').pop()) // Gets the last part of the path - the slug
  let player

  // Metadata for song and takes 'Loading...' until data is fetched and can be updated to Unknown or song data
  let name = $state("Loading...")
  let artist = $state("Loading...")
  let cover = $state("https://img.youtube.com/vi/loquela/maxresdefault.jpg") // Fallback cover image
  let level = $state("Unknown Level")
  let rating = $state("No Rating")
  let subtitles = $state([])
  let currentLine = $state()
  let link = $state("https://youtu.be/zabswqP6xEM")
  let currentTime = $state("")

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
    .from('media') // From music table
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
      link = song.embed_link 
      subtitles = song.content.events
      console.log(subtitles)
      console.log(`${link}?enablejsapi=1`)
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

    function updateSubtitlesLive(time) {
      let i = 0
      subtitles.forEach((subtitle) => {
        if(time > subtitle.tStartMs && time < subtitles[i+1].tStartMs){
          subtitle.segs.forEach((seg) => {
            if(currentLine !== seg.utf8){
              currentLine = seg.utf8
            }

          })
        }
        i++
      })
      }


       
      
      
  

  // Use onMount so the function works in svelte components/routes
  onMount(() => {
    function onYouTubeIframeAPIReady() {
      player = new YT.Player("player", { // "player" id
        events: {
          onReady: () => {
            setInterval(() => {
              const time = player.getCurrentTime()
              const milliseconds = Math.round(time * 1000)
              updateSubtitlesLive(milliseconds) 
            }, 1) // Every millisecond
          }
        }
      })
      
    }
    if (window.YT){
      onYouTubeIframeAPIReady()
    }
    else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
    }

  })
     
    


</script>
<svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script> <!-- For getting the current time on YT iframe embed -->
</svelte:head>
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
          <iframe id="player" width="560" height="315" src={`${link}?enablejsapi=1`} title={ name } frameborder="0" allowfullscreen></iframe>
            <Subtitles
              currentLine={currentLine}
            />
          
          
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
      gap: 0.75em;
      margin-top: 0;
      padding: 0.25em 1em;
  }
  main{
      display: flex;
      gap: 1em;
      align-items: flex-start;
  }

</style>