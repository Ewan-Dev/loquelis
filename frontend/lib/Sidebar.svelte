<script lang="ts">
    export let currentPage = '' // Selected route
    let sidebarVisible = false // Tracks sidebar visibility
    function toggleSidebar(){
        sidebarVisible = !sidebarVisible // Toggle the visibility of the sidebar for hamburger menu on mobile
    } 
</script>

<button class="open-sidebar-icon icon" onclick={toggleSidebar}>≡</button> <!-- Open hamburger button for the sidebar, only visible on small screens -->
<aside class="sidebar" class:show={sidebarVisible}>
    <div class="sidebar-header">
        <img src="https://raw.githubusercontent.com/Ewan-Dev/ewan.is-a.dev/refs/heads/main/frontend/static/loquela.png" class="logo" alt="loquela logo">
        <button class="close-sidebar-icon icon" onclick={toggleSidebar}>X</button> <!-- Close button for the sidebar -->
    </div>
    <nav class="sidebar-nav">
        <a href="./#/app/home" class:selected={currentPage === '/home'}> <!-- 'selected' is set to true if 'currentPage' is equal to set path -->      
        <span class="material-symbols-rounded">home</span>
            Home
        </a>
        <a href="./#/app/music" class:selected={currentPage === '/music'} >
            <span class="material-symbols-rounded">music_note</span>
            Music
        </a>
        <a href="./#/app/videos" class:selected={currentPage === '/videos'} >
            <span class="material-symbols-rounded">movie</span>
            Videos
        </a>
        <a href="./#/app/upload" class:selected={currentPage === '/upload'} >
            <span class="material-symbols-rounded">upload</span>
            Upload
        </a>
        <a href="./#/app/flashcards" class:selected={currentPage === '/flashcards'} >
            <span class="material-symbols-rounded">cards_star</span>
            Flashcards
        </a>
        <a href="./#/app/ai-chat" class:selected={currentPage === '/ai-chat'} >
            <span class="material-symbols-rounded">chat</span>
            AI Chat
        </a>


</aside>

<style>
    a {
        margin: 0; 
        padding: 0.15em;
        border: 0.15em solid transparent;
        border-radius: 0.5em;
        color: #000;
        font-style: normal;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: left;
        gap: 0.2em;
        transition: background-color 0.2s, border-color 0.2s;
    }
    a.selected {
        background-color: #8FABD4;
        box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
        border: none;
        box-sizing: border-box;
        padding: 0.25em;
    }
    a:hover {
        background-color: #e9e9e9;
    }
    a.selected:hover{
        background-color: #3c5a87;
    }
        a.selected:hover {
        background-color: #4a70a9af;
    }

    .material-symbols-rounded{
        font-size: 1.15em;
    }
    .sidebar{
        height: 100%;
        padding: 0.25em;
        background-color: #f2f2f2;
        width: 10em;
        margin: 0;
        overflow: hidden;
        
    }
    .sidebar-header{
        margin: 0;
        margin-bottom: 0.5em;
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .sidebar-nav{
        height: 100%;
        width: 100%;
        padding: 0.5em;
        margin:0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.3em;
    }
    .logo{
        width: 2.5em;
        margin: 0.5em;
    }
    .icon {
        width: 1.5em;
        height: 1.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 0.25em;
    }
    .icon:hover {
        background-color: #f0f0f0;
    }
    .open-sidebar-icon{
        display: none;
        visibility: hidden;
        background-color: #fff;
        font-size: 1.5em;
    }
    .close-sidebar-icon{
        visibility: hidden;
        background-color: transparent;
    }

    /* Show hamburger menu on smaller screens */
    @media (max-width: 600px) {
        .sidebar {
            visibility: hidden; /* Uses visibility to hide sidebar as it can be transitioned but 'display' can't */
            position: fixed; /* The sidebar covers contents of screen to save space on small mobile screen */
            top: 0;
            left: 0;
            opacity: 0;
            transition: opacity 0.2s, visibility 0.2s;
        }
        .open-sidebar-icon{
            visibility: visible;
            display:block;
        }
        .show {
            visibility: visible;
            opacity: 1;
        }
        .close-sidebar-icon{
            visibility: visible;
        }
    }

    .theme-toggle{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2em;
        height: 2em;
        border: none;
    }
</style>