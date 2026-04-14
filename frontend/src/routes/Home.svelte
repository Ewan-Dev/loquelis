<script>
  import Sidebar from "../../lib/Sidebar.svelte";
    import { supabase } from "../../lib/supabaseClient";
    import { onMount } from "svelte";
    import MediaBox from "../../lib/MediaBox.svelte";
    let recentVideos = $state([])
    let recentMusic = $state([])
    onMount(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        console.log(user)

    const {data, error} = await supabase
    .from("profiles")
    .select('*')
    recentVideos = (data[0].recent_videos).reverse()

        console.log(recentVideos)


    const {musicData, musicError} = await supabase
    .from("profiles")
    .select('*')
    recentMusic = (data[0].recent_music).reverse()

        console.log(recentMusic)
        })

</script>

<main class="route">
    <Sidebar currentPage="/home"/> 
    <section class="main-page">
    <h1 class="page-header">Home</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
    <section class="loq-box">
    <img src="https://github.com/Ewan-Dev/loquelis/blob/main/frontend/static/loq.gif?raw=true" class="loq">
        <p>Hello! I'm Loq. Watch some videos to get started!</p>
    </section>
        <h1 class="home-page-main-section-head">Recent videos</h1>
        <div class="media-list">
        {#each recentVideos as video}
                  <MediaBox 
        name={video.name} 
        artist={video.artist} 
        cover={video.cover} 
        level={video.level} 
        rating={video.rating}
        link={`#/app/videos/${video.id}`} 
        type="video"/>
        {/each}
        </div>
                <h1 class="home-page-main-section-head">Recent music</h1>
        <div class="media-list">
        {#each recentMusic as song}
                  <MediaBox 
        name={song.name} 
        artist={song.artist} 
        cover={song.cover} 
        level={song.level} 
        rating={song.rating}
        link={`#/app/music/${song.id}`} 
        type="song"/>
        {/each}
        </div>
    </section>
    </section>
</main>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
                margin-right: 1em;
                height: 100vh;
        
    }
    .main-content{
        flex-direction: column;
        width: 90%;
        overflow: hidden;
    }
    .home-page-main-section-head{
        margin-bottom: 0;
    }
    .media-list{
        display: flex;
        align-items: center;
        gap:0em;
        width: 100%;
        height: 18em;
        padding:0;
        padding-top: 0.5em;
        padding-left:0.2em;
        padding-bottom: 1em;
        overflow-y: visible;
        overflow-x: scroll !important;

    }
        @media (max-width: 500px){
    main{
      display: flex;
      flex-direction: column !important;
    }
  }
      .main-page{
        margin: 0 0.25em;
    }
    .loq{
        width: 2em;
        height: 2em;
    }
    .loq-box{
        display: flex;
        flex-direction: row;
        justify-self: center;
        align-items: center;
        gap:0.25em;
        padding: 0.25em 1em;
        width: fit-content;
        height: fit-content;
        border-radius: 1em;
    }
</style>