<script>
  import Sidebar from "../../lib/Sidebar.svelte";
    import { supabase } from "../../lib/supabaseClient";
    import { onMount } from "svelte";
    import MediaBox from "../../lib/MediaBox.svelte";
    let recentVideos = []
    onMount(async () => {
        const { data: { user } } = await supabase.auth.getUser()
        console.log(user)

    const {data, error} = await supabase
    .from("profiles")
    .select('recent_videos')
    recentVideos = data[0].recent_videos
        console.log(recentVideos)
        })

</script>

<main class="route">
    <Sidebar currentPage="/home"/> 
    <section class="main-page">
    <h1 class="page-header">Home</h1>
        <!-- Main content section for styles to be applied -->
    <section class="main-content">
        <h2 class="home-page-main-section-head">Recent videos</h2>
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
    </section>
    </section>
</main>

<style>
    main{
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }
    .main-content{
        flex-direction: column;
    }
    .home-page-main-section-head{
        margin-bottom: 0.5em;
    }
    .media-list{
        display: flex;
        flex-wrap: wrap;
        gap:1em;
    }
        @media (max-width: 1200px){
    main{
      display: flex;
      flex-direction: column !important;
    }
  }
    .main-page{
        margin-left: 1em;
    }
</style>