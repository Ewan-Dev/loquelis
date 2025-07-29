<script>
    import { onMount } from "svelte";
    import Sidebar from "../../../lib/Sidebar.svelte";
    import AIChatMediaBox from "../../../lib/AIChatMediaBox.svelte";
    import { supabase } from "../../../lib/supabaseClient";
    
    const { occupation = "Knight", image = "https://image.pollinations.ai/prompt/Generate%20a%20pixar-style%20image%20of%20a%20knight%20called%20Hansel%20with%20traits%20of%20brave,%20adventurous%20who%20is%20dressed%20in%20traditional%20attire%20of%20German", firstName = "Hansel", trait = "Friendly", lang = "de" } = $props()
    let { characterName, characterLang, characterTrait, characterOccupation } = $state("")
    let availableLanguages = $state([])
    let dialog = $state(null)
    let characterFields = $state([])
    let allCharacterOccupations = $state([])
    let allCharacterTraits = $state([])
    let availableCharacters = $state([])

    onMount(async () => {
        await fetchLanguages()
        await fetchCharacterFields()
         fetchCharacterOccupations()
        fetchCharacterTraits()
        fetchCharacters() 
    })
    
    async function fetchCharacters() {
        const { data, error } = await supabase
            .from("ai_characters")
            .select("*")
        if (data) {
            availableCharacters = data
        }
        if (error) {
            console.error(error)
        }
    } 

    function fetchCharacterOccupations(){
        Array.from(characterFields).forEach(field => {
            console.log("gabo")
            if (field.type === "occupation"){
                allCharacterOccupations.push(field.name)
            }
            else {
                console.error("Error finding occupations")
            }
            
        });
    }
    function fetchCharacterTraits(){
        Array.from(characterFields).forEach(field => {
            console.log("gabo")
            if (field.type === "trait"){
                allCharacterTraits.push(field.name)
            }
            else {
                console.error("Error finding traits")
            }
            
        });
    }


    async function createAICharacter(name, trait, occupation, language) {
        const { error } = await supabase
            .from('ai_characters')
            .insert([
                { name, trait, occupation, language }
            ])
        
    }

     async function fetchLanguages(){
        const {data, error} = await supabase
            .from("languages")
            .select("*")
        if(data){
            availableLanguages = data
            console.log(availableLanguages)
            return data
        }
        if (error){
            throw error
    }
     }
    async function fetchCharacterFields(){
        const {data, error} = await supabase
            .from("character_fields")
            .select("*")
        if(data){
            characterFields = data
            console.log(characterFields)
            return data
        }
        if (error){
            throw error
    }

}

</script>

<main class="route">
    <Sidebar currentPage="/ai-chat"/> 
    <section class="main-page">
    <h1 class="page-header">AI Chat</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
     <button class="create-ai-character" onclick={() => dialog.showModal()}><span class="material-symbols-rounded">person_add</span>Create AI Character</button>
    <div class="chats">
        {#each availableCharacters as character}
                 <AIChatMediaBox image={`https://image.pollinations.ai/prompt/Generate a pixar-style image of a ${character.occupation} called ${character.name} with trait of ${character.trait} who is dressed in traditional attire of ${character.language}.`} firstName={character.name} trait={character.trait} lang={character.language} occupation={character.occupation} />
        {/each}
    
    </div>  
    </section>
    </section>
</main>

    <dialog bind:this={dialog}>
        <div class="dialog-container">
                <h2 class="dialog-header">Create AI Character</h2>
                <form onsubmit={(event) => {event.preventDefault(); createAICharacter(characterName, characterTrait, characterOccupation, characterLang);}}>
                        <label>🪪 Character name:</label>
                        <input class="name" bind:value={characterName}>      
                    <span class="label-input-container">
                    <label>💬 Language:</label>
                    <select class="language" bind:value={characterLang}>
                        <option>--Select language--</option>
                        {#if availableLanguages}
                        {#each availableLanguages as language}                 
                            <option value={language.short}>{language.emoji} {language.name}</option>
                        {/each}
                        {/if}
                    </select>
                    </span>
                    <span class="label-input-container">
                    <label>👔 Occupation:</label>
                    <select class="occupation" bind:value={characterOccupation}>
                        <option>--Select occupation--</option>
                        {#if allCharacterOccupations}
                        {#each allCharacterOccupations as occupation}                 
                            <option value={occupation}>{occupation}</option>
                        {/each}
                        {/if}
                    </select>
                    </span>
                    <span class="label-input-container">
                    <label> 🧠 Trait:</label>
                    <select class="traits" bind:value={characterTrait}>
                        <option>--Select trait--</option>
                        {#if allCharacterTraits}
                        {#each allCharacterTraits as trait}                 
                            <option value={trait}>{trait}</option>
                        {/each}
                        {/if}
                    </select>
                    </span>
                    <input class="submit-btn" type="Submit">
                </form>
            <button class="close-dialog-btn" onclick={() => dialog.close()}>Close</button>
        </div>
    </dialog>

<style>
    form{
        width:100%;
        display: flex;
        flex-direction: column;
        gap:0.5em;
    }
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }
    dialog{
        border-radius: 1em;
    }
    input{
        height: 2em;
    }
    label{
        width: 11em;
        text-align: left;
    }
    select,
    input{
        width: 100%;
    }
    .name{
        font-size: 125%;
        font-weight: bold;
        height: 2em;
        padding: 0em;
    }
    .dialog-header{
        margin: 0.5em 0;
    }
    .dialog-container{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center ;
        flex-direction: column;
    }
    .main-content{
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
    .create-ai-character{
        background-color: #4364ea;
        color: #F4F4F4;
        border: #1e379b 2.5px solid;
        font-weight: bold;
        float: left;
        display: flex; 
        align-items: center;
        justify-content: center;
        gap: 0.5em;
    }
    .material-symbols-rounded{
        font-size: 1.25em;
    }
    .chats{
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
    .label-input-container{
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 0.5em;
    }
    .close-dialog-btn,
    .submit-btn{
        width: 95%;
    }
    .submit-btn{
        background-color: #4364ea;
        color: #F4F4F4;
        font-weight: bold;
        border: #1e379b 2px solid;
        margin: 0.25em auto;
    }
    .close-dialog-btn{
        background-color: #F4F4F4;
        color: #1d1d1d;
        font-weight: bold;
        border: #c0c0c0 2px solid;
        margin: auto;
    }
    .submit-btn:hover{
        background-color: #1e379b;
        color: #F4F4F4;
        font-weight: bold;
        border: #1e379b 2px solid;
    }
    .close-dialog-btn:hover{
        background-color: #c0c0c0;
        color: #1d1d1d;
        font-weight: bold;
        border: #c0c0c0 2px solid;
    }
</style>