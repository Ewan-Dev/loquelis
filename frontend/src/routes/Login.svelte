<script>
    import { supabase } from "../../lib/supabaseClient"; // Importing supabase client for authentication
    import InlineStatus from "../../lib/InlineStatus.svelte" // For inline status messages
    import confetti from 'canvas-confetti' // For confetti effect

    let email = "", password = "", error = "", data = ""
    async function handleSignin() {
    ({data, error} = await supabase.auth.signInWithPassword({email, password})) 
    if (error) {
       console.error(error.message)
    } else {
        console.log("Login successful", data)
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
                {#if error}
                    <InlineStatus type="error" message={error} />
                {/if}   
                {#if data }
                    <InlineStatus type="success" message="Login successful!" />
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
        .log-in{
            height: 3em;
            width: 20em;
            background-color: #151515;
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