<script>
  import { supabase } from "../../../lib/supabaseClient"
  import Sidebar from "../../../lib/Sidebar.svelte"
  import MediaHeader from "../../../lib/MediaHeader.svelte"
  import Definition from "../../../lib/Definition.svelte"
  import Subtitles from "../../../lib/Subtitles.svelte"
  import AuthorTag from "../../../lib/AuthorTag.svelte"
  import { location } from 'svelte-spa-router'
  import { onMount } from "svelte";
  let slug = $state($location.split('/').pop()) // Gets the last part of the path - the slug
  let player

  // Metadata for song and takes 'Loading...' until data is fetched and can be updated to Unknown or song data
  let name = $state("Loading...")
  let artist = $state("Loading...")
  let author = $state("Loading...")
  let cover = $state("https://img.youtube.com/vi/loquela/maxresdefault.jpg") // Fallback cover image
  let level = $state("Unknown Level")
  let rating = $state("No Rating")
  let language = $state("")
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
     // Load new song from slug
    loadSong().then(() => {
    if (window.YT){ // If iframe exists
      onYouTubeIframeAPIReady()
    }
    else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady // Once iframe loads onYouTubeIframeAPIReady() 
    }
    })
})

  onMount(() => {
    fetchLanguages()
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
      author = song.author_username 
      cover = song.cover 
      level = song.level 
      rating = song.rating 
      language = song.language
      link = song.embed_link 
      subtitles = song.content.events
      console.log(subtitles)
      console.log(`${link}?enablejsapi=1`)
        const musicObjectForHistory = {
        name,
        artist,
        cover,
        level,
        rating,
        id : slug
      }
      addToRecents(musicObjectForHistory)
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

async function addToRecents(music){
  const {data, readError} = await supabase
    .from('profiles') 
    .select('recent_music')
    .eq('user_id', uid)
    .single()
  console.log(data.recent_music)
  const originalArray = data.recent_music
  if (originalArray.includes(music)){
      originalArray.pop(music)
  }
  if (originalArray.length === 10){
    originalArray.splice(0, 1)
  }
  originalArray.push(music)
  console.log(originalArray)

  const {updateData, updateError} = await supabase
  .from('profiles')
  .update({recent_music: originalArray})
  .eq('user_id', uid)

  if (updateError){
    console.error(updateError)
  }
  if(updateData){
    console.log(updateData)
  }

}
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
        <span class="heading">
          <MediaHeader
            song={name}
            artist={artist}
          />
          <AuthorTag author={author} />
          </span>
          
          <iframe id="player" src={`${link}?enablejsapi=1`} title={ name } frameborder="0" allowfullscreen></iframe>
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
      margin: 0 0.35em 0.5em;
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
  @media (max-width: 1200px){
    iframe{
      width: 100% !important;
    }
  }
  .heading {
    display: flex;
    flex-direction: column ;
    gap: 0.5em;
  }
      @media (max-width: 1200px){
    main{
      display: flex;
      flex-direction: column !important;
    }
  }
      .main-page{
        margin-left: 1em;
    }
</style>