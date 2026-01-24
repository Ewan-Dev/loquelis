<script>
  import { supabase } from "../../../lib/supabaseClient"
  import Sidebar from "../../../lib/Sidebar.svelte"
  import MediaHeader from "../../../lib/MediaHeader.svelte"
  import Subtitles from "../../../lib/Subtitles.svelte"
  import { location } from 'svelte-spa-router'
  import AuthorTag from "../../../lib/AuthorTag.svelte";
  let slug = $state($location.split('/').pop()) // Gets the last part of the path - the slug
  let player

  // Metadata for video and takes 'Loading...' until data is fetched and can be updated to Unknown or video data
  let name = $state("Loading...")
  let author = $state("Loading...")
  let authorUsername = $state("Loading...")
  let artist = $state("Loading...")
  let cover = $state("https://img.youtube.com/vi/loquela/maxresdefault.jpg") // Fallback cover image
  let level = $state("Unknown Level")
  let rating = $state("No Rating")
  let language = $state("")
  let subtitles = $state([])
  let currentLine = $state()
  let link = $state("https://youtu.be/zabswqP6xEM")

  // Whenever page reloads this runs
  $effect(() => {
    const currentSlug = $location.split('/').pop() // Gets slug from current path
    if (currentSlug != slug){ // If slug if different to page to last before reload
      slug = currentSlug // Update slug
    }
     // Load new video from slug
    loadVideo().then(() => {
    if (window.YT){ // If iframe exists
      onYouTubeIframeAPIReady()
    }
    else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady // Once iframe loads onYouTubeIframeAPIReady() 
    }
    })
})
  async function loadVideo (){
    const {data, error} = await supabase
    .from('media') // From media table
    .select('*') // All
    .eq('id', slug) // Select video with same ID as slug
    .single() // Specifies that only 1 row is expected to be returned

    // Updates elements if data is available
    if (data) {
      const video = data
      name = video.name
      artist = video.artist
      author = video.author_username
      authorUsername = video.author_username
      cover = video.cover
      level = video.level
      rating = video.rating
      language = video.language
      link = video.embed_link
      subtitles = video.content.events
      console.log(subtitles)
      console.log(`${link}?enablejsapi=1`)
    }
    else {
      // Error/ invalid slug
      name = "Unknown Video"
      artist = "Unknown Artist"
      cover = "https://img.youtube.com/vi/loquela/maxresdefault.jpg"
      level = "Unknown Level"
      rating = "No Rating"
      link = "https://youtu.be/zabswqP6xEM"
      
    }
  }

    function updateSubtitlesLive(time) {
      let i = 0 // Counter so script knows what item of list the iteration is on
      subtitles.forEach((subtitle) => { // For every timestamp
        if(time > subtitle.tStartMs && time < subtitles[i+1].tStartMs){ // As the time will not always exactly match up to the timestamps of subtitles
          subtitle.segs.forEach((seg) => { // Every line
            // So it only updates once subtitles change
            if(currentLine !== seg.utf8){ 
              currentLine = seg.utf8 // Current line is set 
            }

          })
        }
        i++
      })
      }


       
      
      
  

  // Use onMount so the function works in svelte components/routes
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


</script>
<svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script> <!-- For getting the current time on YT iframe embed -->
</svelte:head>
<main class="route">
  <Sidebar currentPage="/videos"/> 
  <section class="main-page">
      <h1 class="page-header">Videos</h1>
      <!-- Main content section for styles to be applied -->
      <section class="main-content">
        <span class="heading">
          <MediaHeader
            song={name}
            artist={artist}
          />
          <AuthorTag author={author} />
        </span>
          <iframe id="player" src={`${link}?enablejsapi=1`} title={ name } frameborder="0" allowfullscreen></iframe>
          {#if link === "https://youtu.be/zabswqP6xEM"}
            <p>Oops. Loquelis is struggling to the media - it may be invalid or unavailable.</p>
          {/if}
          <Subtitles
              currentLine={currentLine}
              targetLanguage={language}
            />
          
          
          
      </section>
  </section>
</main>




<style>
  iframe {
      border-radius: 0.5em;
      margin: 0;
    aspect-ratio: 16 / 9;
    width: 70% !important;
  }
  h1{
      margin-bottom: 0;
  }
  section {
      display: flex;
     flex-wrap: wrap;
      gap: 0.75em;
      margin-top: 0;
      padding: 0.25em 1em;
  }
  main{
      display: flex;
      gap: 1em;
      align-items: flex-start;
  }
  .main-content{
              align-content: flex-start;
        justify-content: flex-start;
  }
  @media (max-width: 1200px){
    iframe{
      width: 100% !important;
    }
  }
  .heading {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
</style>