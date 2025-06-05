<script lang="ts">
    export let currentPage = '' // Selected route
</script>

<div class="sidebar">
    <div class="sidebar-header">
        <img src="../static/loquela.png" class="logo" alt="loquela logo">
    </div>
    <nav class="sidebar-nav">
        <a href="/" class:selected={currentPage === '/'}> <!-- 'selected' is set to true if 'currentPage' is equal to set path -->
            Home
        </a>
        <a href="/#/app/leaderboard" class:selected={currentPage === '/leaderboard'} >
            Leaderboard
        </a>
    </nav>
</div>

<style>
    a {
        color: #000;
        font-style: normal;
        text-decoration: none;
        margin: 0;
        padding: 0.15em;
        border: 0.15em solid transparent;
        border-radius: 0.5em;
        display: inline-block;
        transition: background-color 0.2s, border-color 0.2s;
        cursor: pointer;
    }
    a.selected {
        background-color: #CADDFF;
        border-color: #99B4E6;
    }
    a:hover {
        background-color: #f0f0f0;
    }
    a.selected:hover {
        background-color: #B8D0FF;
    }
    .sidebar{
        height: 100vh;
        padding: 0.75em;
        background-color: #fff;
        width: 7.5em;
    }
    .sidebar-header{
        margin: 0;
        margin-bottom: 0.5em
    }
    .sidebar-nav{
        height: 100%;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.3em;
        margin:0;
    }
    .logo{
        width: 2.5em;
    }
</style>