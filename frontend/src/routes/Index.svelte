<script>
    import { location } from "svelte-spa-router"
    import confetti from "canvas-confetti"
    import FlashcardDeck from "../../lib/FlashcardDeck.svelte";
    import InlineStatus from "../../lib/InlineStatus.svelte";
    import Subtitles from "../../lib/Subtitles.svelte"
    import AiChatMediaBox from "../../lib/AIChatMediaBox.svelte";

    const peppaPigContent = {"wireMagic":"pb3","pens":[{}],"wsWinStyles":[{}],"wpWinPositions":[{}],"events":[{"tStartMs":10791,"dDurationMs":1508,"segs":[{"utf8":"Herr Vogelscheuche"}]},{"tStartMs":15535,"dDurationMs":4067,"segs":[{"utf8":"Peppa und Schorsch sind heute zu Besuch bei Oma und Opa Wutz."}]},{"tStartMs":23350,"dDurationMs":1641,"segs":[{"utf8":"Hallo Opa Wutz."}]},{"tStartMs":25960,"dDurationMs":3547,"segs":[{"utf8":"Huhu Hallo Peppa Hallo Schorsch."}]},{"tStartMs":29571,"dDurationMs":2317,"segs":[{"utf8":"Opa was machst du denn da?"}]},{"tStartMs":31897,"dDurationMs":2158,"segs":[{"utf8":"Ich pflanze einen Blumengarten."}]},{"tStartMs":34072,"dDurationMs":1579,"segs":[{"utf8":"Oh!"}]},{"tStartMs":35675,"dDurationMs":3720,"segs":[{"utf8":"Aus diesen Samen wachsen wunderschöne Blumen."}]},{"tStartMs":40090,"dDurationMs":3153,"segs":[{"utf8":"Ich streue die Samenkörner auf den Boden."}]},{"tStartMs":44163,"dDurationMs":2722,"segs":[{"utf8":"Dann decke ich sie mit Erde zu."}]},{"tStartMs":47211,"dDurationMs":1841,"segs":[{"utf8":"Oh wo sind sie denn?"}]},{"tStartMs":49110,"dDurationMs":1865,"segs":[{"utf8":"Die Samenkörner sind verschwunden."}]},{"tStartMs":50999,"dDurationMs":4049,"segs":[{"utf8":"Wie merkwürdig! \nIch bin sicher dass ich hier Samen verstaut hatte."}]},{"tStartMs":55076,"dDurationMs":2456,"segs":[{"utf8":"Ja Opa.\nWir haben es gesehen."}]},{"tStartMs":57932,"dDurationMs":1598,"segs":[{"utf8":"Ja!\nJetzt sind sie weg."}]},{"tStartMs":60167,"dDurationMs":3047,"segs":[{"utf8":"Na gut dann muss ich eben noch welche nehmen."}]},{"tStartMs":63522,"dDurationMs":4459,"segs":[{"utf8":"Wie schon sagte, ich treue die Samenkörner einfach auf den Boden."}]},{"tStartMs":70334,"dDurationMs":3534,"segs":[{"utf8":"Ein kleiner Vogel pickt die Samenkörner von Opa Wutz auf."}]},{"tStartMs":73960,"dDurationMs":765,"segs":[{"utf8":"Heyy!"}]},{"tStartMs":74776,"dDurationMs":1962,"segs":[{"utf8":"Lass meine Samenkörner!"}]},{"tStartMs":77137,"dDurationMs":2561,"segs":[{"utf8":"Also da sind meine ganzen Samen hin."}]},{"tStartMs":79709,"dDurationMs":3240,"segs":[{"utf8":"Im Bauch von dem kleinen Vogel."}]},{"tStartMs":83320,"dDurationMs":3741,"segs":[{"utf8":"Und noch zwei kleine Vögel picken Opa wird Samenkörner auf."}]},{"tStartMs":87180,"dDurationMs":1319,"segs":[{"utf8":"Oh Guck!"}]},{"tStartMs":88507,"dDurationMs":1987,"segs":[{"utf8":"Ah! Weg da Weg da!"}]},{"tStartMs":91405,"dDurationMs":1666,"segs":[{"utf8":"Was ist das für ein Lärm."}]},{"tStartMs":93256,"dDurationMs":3800,"segs":[{"utf8":"Oma Wutz!\nDie Vögel picken meine ganzen Blumensamen weg."}]},{"tStartMs":97138,"dDurationMs":2397,"segs":[{"utf8":"Und jetzt werden die Vögel weg."}]},{"tStartMs":99765,"dDurationMs":3239,"segs":[{"utf8":"Wegjagen hat keinen Zweck! Sie kommen einfach wieder."}]},{"tStartMs":103020,"dDurationMs":959,"segs":[{"utf8":"Guck!"}]},{"tStartMs":104823,"dDurationMs":2133,"segs":[{"utf8":"Wir brauchen eine Vogelscheuche."}]},{"tStartMs":106990,"dDurationMs":1964,"segs":[{"utf8":"Was ist eine Vogelscheuche?"}]},{"tStartMs":109017,"dDurationMs":3719,"segs":[{"utf8":"Eine Vogelscheuche ist ein Mann aus Stroh der den Vögeln Angst macht."}]},{"tStartMs":112761,"dDurationMs":2916,"segs":[{"utf8":"Das ist eine gute Idee Oma Wutz."}]},{"tStartMs":115697,"dDurationMs":1305,"segs":[{"utf8":"Ich baue eine."}]},{"tStartMs":117038,"dDurationMs":1663,"segs":[{"utf8":"Kommt alle mit."}]},{"tStartMs":119901,"dDurationMs":6213,"segs":[{"utf8":"Wiedersehen kleine Vögel. Wir bauen eine Vogelscheuche."}]},{"tStartMs":126387,"dDurationMs":2133,"segs":[{"utf8":"Das ist Opa Wutz Gartenschuppen."}]},{"tStartMs":128928,"dDurationMs":4022,"segs":[{"utf8":"Hier drin gibt es eine Menge Sachen um eine Vogelscheuche zu bauen."}]},{"tStartMs":133306,"dDurationMs":3583,"segs":[{"utf8":"Zuerst brauchen wir zwei Stöcke und etwas Kordel."}]},{"tStartMs":136913,"dDurationMs":2023,"segs":[{"utf8":"Das besorgen wir."}]},{"tStartMs":140720,"dDurationMs":4139,"segs":[{"utf8":"Peppa hat zwei Stücke gefunden Schorsch hat etwas Kordel gefunden."}]},{"tStartMs":144900,"dDurationMs":1090,"segs":[{"utf8":"Gut!"}]},{"tStartMs":146042,"dDurationMs":3400,"segs":[{"utf8":"Ich binde die Stöcke zusammen. Das wird der Körper."}]},{"tStartMs":149529,"dDurationMs":3666,"segs":[{"utf8":"Oma Wutz hat etwas Stroh gefunden und einen alten Sack."}]},{"tStartMs":153237,"dDurationMs":5544,"segs":[{"utf8":"Großartig!\nIch stecke das Stroh in den Sack. Das wird der Kopf."}]},{"tStartMs":158817,"dDurationMs":3276,"segs":[{"utf8":"Jetzt braucht die Vogelscheuche was zum anziehen."}]},{"tStartMs":162146,"dDurationMs":2129,"segs":[{"utf8":"Hier ist eine Tasche mit alten Kleidern."}]},{"tStartMs":164334,"dDurationMs":5122,"segs":[{"utf8":"Oh!\nSchorsch hat ein Kleid gefunden."}]},{"tStartMs":170717,"dDurationMs":6222,"segs":[{"utf8":"Dumber Schorsch!\nHerr Vogelscheuche hat doch kein Kleid an."}]},{"tStartMs":177184,"dDurationMs":2503,"segs":[{"utf8":"Peppa hat einen Mantel gefunden."}]},{"tStartMs":179918,"dDurationMs":1875,"segs":[{"utf8":"Sehr gut Peppa!"}]},{"tStartMs":183037,"dDurationMs":1961,"segs":[{"utf8":"Schorsch hat einen Hut gefunden."}]},{"tStartMs":185023,"dDurationMs":1709,"segs":[{"utf8":"Sehr gut Schorsch."}]},{"tStartMs":187126,"dDurationMs":2881,"segs":[{"utf8":"Herr Vogelscheuche braucht ein Gesicht."}]},{"tStartMs":190015,"dDurationMs":1000,"segs":[{"utf8":"Das Stimmt."}]},{"tStartMs":191285,"dDurationMs":2564,"segs":[{"utf8":"Willst du mit Schorch ein Gesicht für ihn malen."}]},{"tStartMs":193911,"dDurationMs":2596,"segs":[{"utf8":"Ja bitte."}]},{"tStartMs":196794,"dDurationMs":2467,"segs":[{"utf8":"Schorsch malt die Augen und die Nase."}]},{"tStartMs":199643,"dDurationMs":2004,"segs":[{"utf8":"Peppa malt den Mund."}]},{"tStartMs":202331,"dDurationMs":1949,"segs":[{"utf8":"Fantastisch!"}]},{"tStartMs":204305,"dDurationMs":1352,"segs":[{"utf8":"Herr Vogelscheuche ist fertig."}]},{"tStartMs":205689,"dDurationMs":1750,"segs":[{"utf8":"Hurraa"}]},{"tStartMs":208970,"dDurationMs":2877,"segs":[{"utf8":"Die kleinen Vögel suchen nach Opa Wutz Blumensamen."}]},{"tStartMs":211985,"dDurationMs":2704,"segs":[{"utf8":"Guck!\nDie kleinen Vögel sind wieder da."}]},{"tStartMs":214706,"dDurationMs":1327,"segs":[{"utf8":"Keine Sorge Peppa."}]},{"tStartMs":216041,"dDurationMs":2345,"segs":[{"utf8":"Die Vogelscheuche wird sie feucht."}]},{"tStartMs":223868,"dDurationMs":1266,"segs":[{"utf8":"Es funktioniert!"}]},{"tStartMs":225194,"dDurationMs":2491,"segs":[{"utf8":"Die Vogelscheuche hat die Vögel verscheucht."}]},{"tStartMs":227757,"dDurationMs":1528,"segs":[{"utf8":"Hurra!"}]},{"tStartMs":229296,"dDurationMs":726,"segs":[{"utf8":" Gut!"}]},{"tStartMs":230099,"dDurationMs":3049,"segs":[{"utf8":"Jetzt werden meine Blumensamen nicht mehr gefressen."}]},{"tStartMs":234964,"dDurationMs":4325,"segs":[{"utf8":"Oh Opa die kleinen Vögel sehen sehr traurig aus."}]},{"tStartMs":239329,"dDurationMs":2435,"segs":[{"utf8":"Ja sie haben sicher Hunger."}]},{"tStartMs":241820,"dDurationMs":1730,"segs":[{"utf8":"Dafür habe ich das hier."}]},{"tStartMs":243594,"dDurationMs":1951,"segs":[{"utf8":"Das ist das Oma?"}]},{"tStartMs":245561,"dDurationMs":1721,"segs":[{"utf8":"Eine Futterstation."}]},{"tStartMs":247307,"dDurationMs":5499,"segs":[{"utf8":"Opa gibst du mir bitte etwas von den Samen."}]},{"tStartMs":254689,"dDurationMs":3828,"segs":[{"utf8":"Kommt ihr Vögelchen. Essen Zeit."}]},{"tStartMs":259175,"dDurationMs":2599,"segs":[{"utf8":"Jetzt haben die Vögel ihre eigenen Samen."}]},{"tStartMs":262604,"dDurationMs":2274,"segs":[{"utf8":"Die kleinen Vögel sind wieder glücklich."}]},{"tStartMs":264903,"dDurationMs":3639,"segs":[{"utf8":"Peppa ist froh dass Opas Blumensamen nicht gefressen werden."}]},{"tStartMs":268644,"dDurationMs":8125,"segs":[{"utf8":"Aber noch vor ist sie dass die kleinen Vögel auch etwas zu fressen haben."}]}]}
    const subtitles = peppaPigContent.events
    console.log(subtitles)
    let musicHeader = $state()
    let videoHeader = $state()
    let flashcardHeader = $state()
    let chatAIHeader = $state()
    let statusMessage = $state("")
    let videoData = $state([])
    let usernameInputValue = $state()
    let player;
    let uid = $state("")
    let statusType = $state("")
    let username = $state()
    let playerLoaded = false;
    let videoLoaded = false;
    let currentLine = $state("Peppa Wutz")
    let slug = ""
 
    $effect(() => {
        const currentSlug = $location.split('/').pop()
        if (currentSlug === "welcome"){
            launchConfetti()     

        if (window.YT){ // If iframe exists
        onYouTubeIframeAPIReady()

        }
        else {
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady // Once iframe loads onYouTubeIframeAPIReady() 
        }
        }})



    function launchConfetti() {
        confetti({
            particleCount: 1000,
            spread: 150,
            origin: { y: 0 }
        })
    }

      // Use onMount so the function works in svelte components/routes
    function onYouTubeIframeAPIReady() {
      player = new YT.Player("player", { // "player" id
        events: {
          onReady: () => {
            setInterval(() => {
              const time = player.getCurrentTime()
              const milliseconds = Math.round(time * 1000)
              updateSubtitlesLive(milliseconds) 
            }, 1) // Every millisecond
          }
        }
      })
      
    }

       
    function updateSubtitlesLive(time) {
        let i = 0 // Counter so script knows what item of list the iteration is on
        subtitles.forEach((subtitle) => { // For every timestamp
            if(time > subtitle.tStartMs && time < subtitles[i+1].tStartMs){ // As the time will not always exactly match up to the timestamps of subtitles
            subtitle.segs.forEach((seg) => { // Every line
                // If the current subtitle line is not the same as the last one,
                // So it only updates once subtitles change
                if(currentLine !== seg.utf8){ 
                currentLine = seg.utf8 // Current line is set 
                console.log(seg.utf8) // Log the current subtitle line
                }

            })
            }
            i++
        })
      }


</script>
<svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script> <!-- For getting the current time on YT iframe embed -->
</svelte:head>
<main>
<header>
    <img src="https://github.com/Ewan-Dev/loquelis/blob/main/frontend/static/loquela.png?raw=true" class="logo">
    <p class="logo-text">Loquelis</p>
</header>
<section class="main-hero hero">
    <div class="text-button">
        <p class="main-hero-text languages-text">Languages</p>
        <p class="main-hero-text unlocked-text">Unlocked</p>
        <button class="main-hero-button">Get Started<span class="material-symbols-rounded arrow"><span class="material-symbols-outlined">arrow_forward</span></button>
    </div>
    <img src="https://github.com/Ewan-Dev/loquelis/blob/main/frontend/static/macbook.png?raw=true" class="macbook">
</section>
<section class="description-hero hero">
<p class="description">Learn with flashcards, AI chats, flashcards, live subtitles on videos and music.</p>
</section>
<section class="flashcard-hero hero">
<p class="description flashcards-desc">Create your own flashcard decks</p>
<img src=" https://raw.githubusercontent.com/Ewan-Dev/loquelis/refs/heads/main/frontend/static/flashcards.png?raw=true" class="flashcards">
</section>
<section class="video-hero hero">
<p class="description videos-desc">Upload videos/music from YouTube</p>
<img src=" https://raw.githubusercontent.com/Ewan-Dev/loquelis/refs/heads/main/frontend/static/videos.png?raw=true" class="videos">
</section>
<section class="characters-hero hero">
<p class="description characters-desc">Chat with AI characters</p>
<img src=" https://raw.githubusercontent.com/Ewan-Dev/loquelis/refs/heads/main/frontend/static/characters.png?raw=true" class="characters">
</section>
<section class="page-5 page " >
    <h1>Start your journey. <p class="blue">Today.</p></h1>
    <div class="sign-up-contact-container">
        <a href="./#/app/signup/" class="big-get-started-btn shadow">Get started! →</a>
        <a class="big-contact-btn shadow" href="./#/app/login/"> <span class="material-symbols-rounded" >login</span>Sign in</a>
    </div>
</section>
</main>
<style>
main{
    gap:0;
}
header{
    padding: 0.5em 0.25em;
    display: flex;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    gap:0.25em;
    border-bottom: #cccccc 1px solid;

}
.hero{
    max-width: 50em;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1em 2em;
}
.arrow{
    font-size: 1em;
}

.description{
    font-size: 2.5em;
    font-style: italic;
    margin: 0;
}
.description-hero{
    background-color: #F8F8F8;
    max-width: 50em;
    width: fit-content;
    height: 20%;
    padding:  2em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.video-hero{
    background-color: #F8F8F8;
}

.flashcards{
    width: 19em;
    height: auto;
    margin: 1em;
    margin-left: 0;
}
.flashcard-hero,
.video-hero,
.characters-hero{
    display: flex;
    width: fit-content;
    max-width: 52em;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.5em 0;
    padding-right: 1em;
    gap:1em;
}

.unlocked-text{
    font-style: italic;
}
.text-button{
    margin-left: 2em ;
    width: 0;
}
.main-hero-button{
    width: 7.1em;
    margin: 0.75em 0 ;
    background-color: #1B1B1B ;
    color: #fff;
    font-size: 1.15em;
    border-radius: 2em;
    box-shadow: inset 0 1px 1px #ffffff,
    0 1px 2px #00000010,
    0 2px 4px #00000015;    
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.main-hero-button:hover{
    width: 7.1em;
    margin: 0.75em 0 ;
    background-color: #2e2e2e ;
}
.main-hero{
    display: flex;
    flex-direction: row;
    align-items: center;
        justify-content:space-between;
    max-width: 54em;
    padding: 0;
}
        @media (max-width: 600px){
    main{
      display: flex;
      flex-direction: column !important;
    }
    .macbook{
        height: 15em;
        width: auto !important;
        position: relative;
        left: 4.5em;
    }
    .main-hero{
    height: 15em;
    }
    .description{
    font-size: 2em;
}
.description-hero{
    padding: 1em;
}
.flashcards{
    width: 11em !important;
    height: auto;
    margin: 0;
}
.videos,
.characters{
    width: 10em !important;
}
.flashcard-hero,
.video-hero,
.characters-hero{

        gap:0;
}
.hero{
    height: 12em;
}
  }
.macbook,
.videos,
.characters{
    width: 20em;
    z-index: 0;
}
.flashcards-desc,
.videos-desc,
.characters-desc{
    margin-left: 0.75em;
    width: 50% ;
}
.main-hero-text{
position: relative;
font-size: 2.75em;
margin: 0;
width:fit-content;
overflow: visible;
z-index: 2;
height: 1em;
}
.logo-text{
    font-size: 1.25em;
    margin: 0;
    margin-bottom: 3px;
    z-index: 2;
}
    .logo{
        height: 2em ;
        margin:0 0.5em;
    }
    h1,
    h2{
        text-align: center;
        margin: 0.4em;
        font-size: 2.5em;
        animation-name: fadeUp;
        animation-duration: 1.25s;
        animation-timing-function: ease-out;
    }
    main{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0;
        width: 100%
    
    }
    p{
        margin: 0 1em;
    }
    a{
        text-decoration: none;
        color: #ffffff;
    }

    .page{
        width: 95%;
        height: 100%;
        display: flex;
        justify-content:flex-start;
        align-items: center;
        flex-direction: column;
    }
    .media-p{
        font-size: 1.75em;
        margin: 0;
        align-self: flex-start;
    }
    .media-header{
        text-align: left;
        align-self: flex-start;
        margin: 0.5em 0 0;
    }
    .welcome {
        color: #ffffff; 
        font-weight: 90%;
        font-size: 4em;

        text-align: center;
        margin: 0 0.5em;
        animation-name: fadeUp;
        animation-duration: 1s;
        animation-timing-function: ease-out;
    }
    .page-2{
        height: fit-content;
        background-color: #f5f5f5;
        border-radius: 2em;
        padding: 0.5em;
        margin: 1em;
    }
    .media-box{
        width: 7em;
        height: 1.75em;
        padding: 0.1em 0.4em;
        font-size: 1.5em;
        display: flex;
        justify-content: start;
        gap: 0.5em;
        margin-right: 0.5em;
        align-items: center;
        background-color: #290c0c;
        border-radius: 0.5em;
    }
    .welcome-message{
        text-align: center;
        color: #ffffff;
        margin: 0;
        background-color: rgb(36, 42, 206);
        padding: 0.2em 0.3em;
        border-radius: 0.52em;
        animation-name: fadeUp;
        animation-duration: 1.25s;
        animation-timing-function: ease-out;
    }
    .hero-1{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1em;
        width: 90%;
        min-width: 1em;
        height: 100%;
        padding: 1em;
        margin: 1em;
        background-color: rgb(13, 63, 241);
        border-radius: 2em;
    }
    .get-started-btn{
        height: 2.5em;
        width: 12em;
        display: flex;
        align-items: center;
        justify-content:center ;
        padding: 0;
        background-color: rgb(33, 32, 32);
        color: #ffffff;
        font-weight: bold;
        border-radius: 2em;
        animation-name: fadeIn;
        animation-duration: 3s;
        animation-timing-function: ease-out;
    }
    .get-started-btn:hover{
        background-color: rgb(83, 83, 83);
        color: #ffffff;
        font-weight: bold;
        border-radius: 2em;
    }
    .flags{
        font-size:3.5em;
        text-align: center;
        margin:0.5em;
    }
    @keyframes fadeUp {
        from{
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes fadeIn {
        from{
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    
    @keyframes scrollText {
    0%   { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
    }
    .blue{
        color: rgb(32, 76, 210);
        margin: 0;
        display: inline-block;
    }
    .emoji{
        height: 1em;
        width: 1em;
        padding: 0.2em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.2em;
    }
    .music-media-box{
        background-color: #F0D1FB;
        }
    .music-emoji{
        background-color: #F4E0FC;

    }
    .videos-media-box{
        background-color: #CDFAD1;
        }
    .videos-emoji{
        background-color: #E6FDE9;

    }
    .flashcards-media-box{
        background-color: #F9E8B4;
        }
    .flashcards-emoji{
        background-color: #FEF1CF;

    }
    .ai-chats-media-box{
        background-color: #DFF7FD;
        }
    .ai-chats-emoji{
        background-color: #EDFBFE;

    }
    .media-list{
        display: flex;
        animation: scrollText 10s infinite linear;
        white-space: nowrap;
        width: max-content;
        margin: 0;
    }
    .media-list:hover{
        display: flex;
          animation-play-state: paused;
        white-space: nowrap;
        width: max-content;
        margin: 0;
    }
    .media-scroller{
        overflow: hidden;
        position: relative;
        width: 100%;
        overflow: hidden;
        margin: 0;
        margin-top: 1em;
    }
    .subtitles-container{
        width: 77.5%;
    }
    .video-container{
        display: flex;
        flex-wrap: wrap;
        flex-direction: unset;
        width: 100%;
        animation-name: fadeUp;
        animation-duration: 1.25s;
        animation-timing-function: ease-out;
        background-color: transparent;
    }
    .info-box{
        height: fit-content;
        width: 50%;
        margin-bottom: 1em;
        background-color: #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25em;
        padding: 0.5em 0.2em;
        border-radius: 0.5em;
        animation-name: fadeUp;
        animation-duration: 1.25s;
        animation-timing-function: ease-out;
    }
    .icon{
        font-size: 1.5em;
        height: fit-content;
        margin: 0;
    }
    .page-3{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1em;
        width: 100%;
        padding: 0;
    }
    .video-info-box{
        width: 25em;
        border: none;
        width: 100%;
        height: fit-content;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
    .media-img{
        height: 8em;
        border-radius: 1em;
    }
    .media-image-container{
        width: 95%;
        margin: 0.5em;
        align-self: flex-start;
        margin: 1em 0 3em 0;
    }
    .vid-media-img{
        aspect-ratio: 16 / 9;
        object-fit: cover;
    }
    .deck-media-img{
        border-radius: 0;
    }
    .ai-chat-img{
        height: 13em;
        border-radius: 1em;
        align-self: flex-start;
        margin: 0.5em 0;
    }
    .big-get-started-btn{
        height: 3em;
        width: 20em;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        font-size: 1em;
        background-color: #2e2e2e;
        color: #ffffff;
        font-weight: bold;
        border-radius: 1em;
    }
       .big-contact-btn{
        height: 3em;
        width: 20em;
        display: flex;
        align-items: center;
        justify-content: center;
        gap:0.3em;
        padding: 0;
        font-size: 1em;
        background-color: rgb(226, 226, 226);
        color: #202020;
        font-weight: bold;
        border-radius: 1em;
    }
        .big-get-started-btn:hover{
            background-color: #1c1c1c;
        }
    .big-contact-btn:hover{
        background-color: #dadada;
    }
    .page-5{
        padding: 1em;
        height: 15em;
    }
    .contact-p{
        color: #202020;
    }
    .sign-up-contact-container{
        display: flex;
        flex-direction: column;
        gap: 0.25em;
        margin-bottom: 1em;
    }
    .page-4{
        display: flex;
        height: fit-content;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 0;
    }
    .shadow{
              box-shadow: inset 0 1px 2px #ffffff,
                0 1px 2px #00000010,
                0 2px 4px #00000015;
    }
    span{
        margin: 0;
    }

  a{
            z-index: 1;
  }
</style>