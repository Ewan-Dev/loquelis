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
            statusError = "Signup successful! Try logging in with your details!."
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
            background-color: #fff; 
            height: fit-content;
            font-size: 1.5em;
            padding: 0.2em 0.35em;
            width: 15em;
            border: none;
            box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
            border-radius: 0.35em;
            box-sizing: border-box;
        }
        main{
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        form{
            width: 22em;
            margin: 1em auto;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5em;
        }
        label{
            text-align: left;
            width: 18em;
            display: inline-block;
        }
        .sign-up{
            height: 3em;
            width: 27em;
            font-weight:bold; 
            background-color:#4A70A9;
            color: #fff;
            border: none;
            border-radius: 0.75em;
      box-shadow: inset 0 1px 2px #ffffff80,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
        }
        .sign-up:hover{
            background-color: #3c5a87;
            box-shadow: inset 0 1px 2px #ffffff80,
                0 1px 2px #00000030,
                0 2px 4px #00000035;
        }
        .continue{
            background-color: #e5e5e5;
            padding: 0.15em 0.25em;
            color: #222222;
            box-sizing: border-box;
            width: 8em;
            text-align: center;
            text-decoration: none;
                border-radius: 7.5px;
                box-shadow: inset 0 1px 2px #ffffff80,
                0 1px 1px #00000030,
                0 2px 2px #00000035;       }
        .continue:hover{
                box-shadow: inset 0 1px 2px #ffffff80,
                0 1px 4px #00000030,
                0 2px 2px #00000035;       }
        
    </style>