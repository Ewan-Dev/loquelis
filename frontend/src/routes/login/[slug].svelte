<script lang="ts">
    import { supabase } from "../../../lib/supabaseClient"; // Importing supabase client for authentication
    import InlineStatus from "../../../lib/InlineStatus.svelte" // For inline status messages
    import confetti from 'canvas-confetti' // For confetti effect

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
                    <InlineStatus type="error" message={statusError}  width="100%" />
                {/if}   
                {#if !statusError && result}
                    <InlineStatus type="success" message="Login successful!" width="100%"/>
                    <a class="continue" href="./#/app/home">Continue here</a>
                {/if}
                </form>
                </section>
        </section>
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
        .log-in{
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
        .log-in:hover{
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