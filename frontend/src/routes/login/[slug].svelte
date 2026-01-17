<script lang="ts">
    import { supabase } from "../../../lib/supabaseClient"; // Importing supabase client for authentication
    import InlineStatus from "../../../lib/InlineStatus.svelte" // For inline status messages
    import confetti from 'canvas-confetti' // For confetti effect
  import { AuthError } from "@supabase/supabase-js";

    let email = $state(""), password =  $state(""), error =  $state(""), data =  $state("")
    let statusError = $state("")
    let result =  $state("")

    $inspect(() => {
        console.error(statusError)
    })
    
    async function handleSignin() {
    let {data: authData, error: authError} = await supabase.auth.signInWithPassword({email, password})
    if (authError) {
        if (authError && authError.message.includes("profiles_email_key")){
        statusError = ""
        }
         statusError = authError.message
    } else {
        result = authData
        console.log("Login successful", data)
        statusError = ""
        launchConfetti()
        addUsertoTable(authData.user.email)

    }
    }
    
        async function addUsertoTable(email){
        const { error } = await supabase
            .from("profiles")
            .insert({email})
        if (error && error.message) {
            console.error(error.message)
        }
        else if (!error) {
                statusError = ""
                console.log("User added to profiles table")
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
    
    <main class="route">
        <section class="main-page">
            <h1 class="page-header">Login</h1>
            <!-- Main content section for styles to be applied -->
            <section class="main-content">
                <form onsubmit={event => { event.preventDefault(); handleSignin(); }} >
                <label for="email">Email:</label>
                <input class="email" bind:value={email} type="email" >
                <label for="password">Password:</label>
                <input class="password" bind:value={password} type="password" > 
                <button class="log-in" type="submit">Sign in</button>
                {#if statusError}
                    <InlineStatus type="error" message={statusError} />
                {/if}   
                {#if !statusError && result}
                    <InlineStatus type="success" message="Login successful!" width="15em"/>
                    <p>Continue <a href="./#/app/home">here</a></p>
                {/if}
                </form>
                </section>
        </section>
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