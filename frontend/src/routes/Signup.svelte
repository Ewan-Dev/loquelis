<script>
import { supabase } from "../../lib/supabaseClient.js" // Importing supabase client for authentication
import InlineStatus from "../../lib/InlineStatus.svelte" // For inline status messages
import confetti from 'canvas-confetti' // For confetti effect

    let email = "", password = "", error = "" , result = ""
    
    async function handleSignup() {
        result = await supabase.auth.signUp({email, password}) 
    if (result.error) {
       error = result.error.message
       console.error(error)
    } else {
        console.log(result.data)
        launchConfetti()
    }
 }
    
    function launchConfetti() {
        confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 }
        })
    }
</script>

<main>
    <h1>Signup</h1>
    <form onsubmit={event => { event.preventDefault(); handleSignup(); }}>
    <label for="email">Email:</label>
    <input class="email" bind:value={email} type="email" >
    <label for="password">Password:</label>
    <input class="password" bind:value={password} type="password" > 
    <button class="sign-up" type="submit">Sign up</button>
    {#if error}
        <InlineStatus type="error" message={error} />
    {/if}
    {#if result && !error}
        <InlineStatus type="success" message="Signup successful! Check your email to confirm." />
    {/if}

    </form>
</main>

<style>
    input{
        background-color: transparent; 
        height: 3em;
        width: 20em;
        border: 0.15em  solid #e5e5e5;
        border-radius: 0.75em;
        box-sizing: border-box;
    }
    main{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    form{
        width: fit-content;
        margin: 1em auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5em;
    }
    label{
        text-align: left;
        width: 18em;
        display: inline-block;
    }
    .sign-up{
        height: 3em;
        width: 20em;
        background-color: #151515;
        color: #fff;
        box-shadow: #414141 0 0 0.5em; 
        border: none;
        border-radius: 0.75em;
    }
    .sign-up:hover{

        box-shadow: #414141 0 0 1em; 
        transition: box-shadow 0.2s;
    }
</style>