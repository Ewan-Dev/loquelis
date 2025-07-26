<!--TODO: optimise error handling as user can be created in auth table but have an error w/ profiles table-->
<script>
import { supabase } from "../../lib/supabaseClient" // Importing supabase client for authentication
import InlineStatus from "../../lib/InlineStatus.svelte" // For inline status messages
import confetti from 'canvas-confetti' // For confetti effect

    let email = "", password = "", username = "", result = ""
    let statusError = $state("")
    
    async function handleSignup() {
        result = await supabase.auth.signUp({email, password}) 
    if (result.error) {
       statusError = result.error.message
       console.error(statusError)
    } else {
        const authResult = result.data
        const authUser = authResult.user
        const uid = authUser.id
        console.log(authUser)
        addUsertoTable(username, email, uid)
    }
 }

    async function addUsertoTable(username, email, uid){
        const { error } = await supabase
            .from("profiles")
            .insert({username, email, uid})
        if( error.message.includes("duplicate") && error.message.includes("email")) // Not the best way to check but Supabase as of 26.07.2025 returns a string for error and no JSON
        {
            statusError = "Account with email already exists"
            console.log(statusError)
            result = ""
        }
        else if( error.message.includes("duplicate") && error.message.includes("username")) // Not the best way to check but Supabase as of 26.07.2025 returns a string for error and no JSON
        {
            statusError = "Account with username already exists"
            console.log(statusError)
            result = ""
        }
        else if (error) {
            result = ""
            statusError = error.message     
        }
        else if (!error) {
            result = "success"
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
    <label for="username">Username:</label>
    <input class="username" bind:value={username} type="username" >
    <button class="sign-up" type="submit">Sign up</button>
    {#if statusError}
        <InlineStatus type="error" message={statusError} />
    {/if}
    {#if result && !statusError}
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