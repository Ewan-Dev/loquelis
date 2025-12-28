<script lang="ts">
  import { supabase } from '../lib/supabaseClient'
  import Home from './routes/Home.svelte'
  import Signup from './routes/Signup.svelte'
  import Login from './routes/login/+page.svelte'
  import LoginSlug from './routes/login/[slug].svelte'
  import Music from './routes/music/+page.svelte'
  import MusicSlug from './routes/music/[slug].svelte'
  import Upload from './routes/Upload.svelte'
  import Router from 'svelte-spa-router'
  import Flashcards from './routes/flashcards/+page.svelte'
  import FlashcardsSlug from './routes/flashcards/[slug].svelte'
  import Video from './routes/videos/+page.svelte'
  import VideoSlug from './routes/videos/[slug].svelte'
  import AIChat from './routes/ai-chat/+page.svelte'
  import AIChatSlug from './routes/ai-chat/[slug].svelte'
  import Welcome from './routes/Welcome.svelte'
  import { onMount } from 'svelte'
  import InlineStatus from '../lib/InlineStatus.svelte'
  import { location } from "svelte-spa-router"

  // Setting the routes
  const routes = {
    '/': Login,
    '/welcome': Welcome,
    '/app/ai-chat/:slug': AIChatSlug,
    '/app/ai-chat': AIChat,
    '/app/videos/:slug': VideoSlug,
    '/app/videos': Video,
    '/app/flashcards/:slug': FlashcardsSlug,
    '/app/flashcards': Flashcards,
    '/app/upload': Upload,
    '/app/music/:slug' : MusicSlug,
    '/app/music' : Music,
    '/app/login' : Login,
    '/app/login/:slug': LoginSlug,
    '/app/signup' : Signup,
    '/app/home': Home,
  }
  let username = $state("")
  let usernameInputValue = $state("")
  let { statusMessage, statusType} = $state("")
  let uid = $state("")
  let dialog
  let currentLocation = $state($location)

onMount(() => {
  dialog?.close()
  currentLocation = $location
})

$effect(() => {
  currentLocation = $location
})

$effect( async () => {
  console.log(currentLocation)
  await fetchUserSesson()
     handleDialog()
})

function handleDialog(){
       if (!username && uid) {
              dialog?.showModal()
            } else {
              dialog?.close()
            }
}

    // Fetch user session, get UID, then fetch from profiles table to get the username
    async function fetchUserSesson(){
        const { data, error } = await supabase.auth.getSession()
        const sessionData = data // Store session data
        if (error) { //Id error fetching user
            console.error('Error fetching session:', error)
        } 
        else if(sessionData) { // If data exists
            uid = sessionData?.session?.user?.id // Get UID from session
            // Use the UID to fetch username
            const { data, error} = await supabase
                .from("profiles")
                .select("username")
                .eq("user_id", uid)
                .single()
                if (data) {
                  console.log(data)
                  username = data.username
                  console.log("User: ", username)
                }

        }
    }

    async function addUsername(user){
      if(user){
        const { error } = await supabase
        .from("profiles") 
        .update({username: user}) 
        .eq("user_id", uid)
      if (error){
        console.error(error.message)
        statusMessage = ""
        statusType = ""
        if( error.message.includes("duplicate") && error.message.includes("username")) // Not the best way to check but Supabase as of 26.07.2025 returns a string for error and no JSON
        {
          statusMessage = ""
        statusType = ""
          statusMessage = "Account with username already exists"
           statusType = "error"
      }
      else{
        statusMessage = ""
        statusType = ""
          statusMessage = error.message
          statusType = "error"
      }
      if( error.message === `Column "username" cannot be modified once set`){ 
        statusMessage = ""
        statusType = ""
        statusMessage = "Username already set!"
        statusType = "warn"
      }
    } 
      else{
        statusMessage = ""
        statusType = ""
        statusMessage = "success"
        statusType = "success"
        username = user
      }
      }
      else{
          statusMessage = ""
        statusType = ""
          statusMessage = "No username typed"
          statusType = "warn"
      }
  }

</script>

<head>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght@400" rel="stylesheet" />
</head>

<main>
    <!-- Show dialog -->
    <dialog bind:this={dialog}>
      <form onsubmit={(event) => {event.preventDefault(); addUsername(usernameInputValue);}}>
        <label class="username-header">👤 Set a username:</label>
        <span class="input-container">
          <p class="at-symbol">@</p><input placeholder="username" class="username-input" bind:value={usernameInputValue}/>
        </span>
        <input type="Submit">
        <button class="close-button-username" onclick={handleDialog()}>Close</button>
        {#if statusMessage}
            <InlineStatus message={statusMessage} type={statusType} />
        {/if}
        </form>
    </dialog>
  <!-- Import router component to allow for routing -->
  <Router {routes} /> 
</main>
<style>
  main{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input[type=Submit]{
    background-color: #4364ea;
    color: #F4F4F4;
    border: #1e379b 2.5px solid;
    font-size: 1.25em;
    font-weight: bold;
    padding: 0em;
    height: 2.25em;
    width: 100%;
  }
    input[type=Submit]:hover{
    background-color: #1e379b;
  }
    button.close-button-username{
    background-color: #ebebeb;
    color: #000000;
    border: #c7c7c7 2.5px solid;
    font-size: 1.25em;
    font-weight: bold;
    padding: 0em;
    height: 2.25em;
    width: 100%;
  }
    button.close-button-username:hover{
    background-color: #c7c7c7;
  }
  .username-input{
    width: 100%;
    height: 2em;
    margin: 0;
    border: none;
    font-weight: bold;
    padding: 0;
    font-size: 1.5em;
  }
 .username-input:focus {
    outline: none;
    border: none;
    box-shadow: none;
}

  .input-container{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap:0.2em;
    border: #e0e0e0 1.75px solid;
    border-radius: 0.75em;
    padding: 0.15em 0.5em 0.25em;
  }
  .at-symbol{
    font-size: 2em;
    margin: 0;
    font-weight: bold;
  }
  .username-header{
    margin: 0;
    font-size: 2em;
  }
  dialog{
    border-radius: 1em;
    padding: 1em;
    gap:0.5em;
    border: #ababab solid 1.5px;
  }
  dialog::backdrop {
    background-color: rgba(59, 59, 59, 0.198);
    backdrop-filter: blur(5px);          /* optional blur */
  }

  form{
    display: flex;
    gap:0.25em;
    flex-direction: column;
  }
</style>