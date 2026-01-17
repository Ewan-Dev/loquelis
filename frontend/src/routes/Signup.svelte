<script lang="ts">
import { supabase } from "../../lib/supabaseClient" // Importing supabase client for authentication
import InlineStatus from "../../lib/InlineStatus.svelte" // For inline status messages
import confetti from 'canvas-confetti' // For confetti effect

    let email = "", password = ""
    let  { statusError, statusType } = $state("")
    
    async function handleSignup(){
        await handleAuth()
    }

    async function handleAuth() {
        console.log("Signing up...")
            let {data, error} = await supabase.auth.signUp({email, password,
            options: {
                emailRedirectTo: "https://ewan.is-a.dev/#/app/login/"
  }
        })
    if (error && error.message.includes("Password should contain at least one character of each")){
            statusError = ""
            statusType = ""
            statusError = "Password must contain capital letters, lowercase letters, numbers and special characters."
            statusType = "warn"
        }
        else if (error && error.message) {
            statusType = ""
            statusType = "error"
            statusError = ""
            statusError = error.message
        }
        else if (data && !error){
            statusError = "Signup successful! Check your email to confirm."
            statusType = "success"
            console.log("User signed up successfully", data)
            launchConfetti() // Launching confetti effect when signup is successful 
        
    }
 }


    function launchConfetti() {
        confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

            $inspect(statusError)
</script>

<main>
    <h1>Signup</h1>
    <form onsubmit={event => { event.preventDefault(); handleSignup(); }}>
    <label for="email">Email:</label>
    <input class="email" bind:value={email} type="email" >
    <label for="password">Password:</label>
    <input class="password" bind:value={password} type="password" > 
    <button class="sign-up" type="submit">Sign up</button>
    
    {#if statusError && statusType}
        <InlineStatus type={statusType} message={statusError} />
    {/if}
    </form>
</main>

<style>
     input{
            background-color: transparent; 
            height: 3em;
            width: 20em;
            border: 0.15em  solid rgb(0, 0, 0);
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
        .log-in{
            height: 3em;
            width: 20em;
            background-color: #021533;
            color: #fff;
            box-shadow: #414141 0 0 0.5em; 
            border: none;
            border-radius: 0.75em;
        }
        .log-in:hover{
    
            box-shadow: #414141 0 0 1em; 
            transition: box-shadow 0.2s;
        }
    </style>