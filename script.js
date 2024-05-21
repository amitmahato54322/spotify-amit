console.log('lets list the songs here....')
// all variable name is in small (not camel font)

// making songs global; can be accessed by both functions
let songs;

// making it a global variable
let currentsong = new Audio();

let currfolder;


// function to convert seconds in minutes:seconds format
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`


}






async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`)

  let response = await a.text()
  console.log(response)
  // we got response in the form of table and we need to parse that data to get the songs only, which are located inside td tags and in a tags to be precise. So instead of getting the tds, we want to get a's  

  let div = document.createElement("div") // creating a div element with js instead of using HTML
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")// as is not tag name, a is correct inside " "


  songs = []

  for (let index = 0; index < as.length; index++) {
    const element = as[index]
    if (element.href.endsWith(".mp3")) {
      // songs.push(element.href.split('/songs/'))[1]
      songs.push(element.href.split(`/${folder}/`)[1])

      //-----------------------------------------

      // const words = sentence.split(' ');

      // // Get the last word
      // const lastWord = words[words.length - 1];



      //------------------------------------------

    }


  }
  //console.log(songs), we got all the songs in a correct way, now we should return this songs through this main function, and will be returned whenever this main() function is called. 

// *****************************************************************


// show all the songs in the playlist 
let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]

songul.innerHTML = ""
for (const song of songs) {
  songul.innerHTML = songul.innerHTML + ` <li> 
   <img class="invert" src="music.svg" alt="music">
            <div class="info">
              <div>${song}</div>
              <div class="artist">Amit</div>
            </div>
            <div class="playnow">

              <span>Play Now</span>
              <img class="invert" src="play.svg" alt="play">
            </div>
            </li>`;

}

// attach an event listener to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
  e.addEventListener("click", element => {
    console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    // .trim() removes all the spaces from the text

  })


})
  //***************************************************************** */


  return songs


}


/*
let songs = getSongs()
console.log(songs)

I did this but got "promise pending".
So the problem here is that everything is returned by the async function, which returns promise everytime.  

*/

// so let's create main function to handle this situation

// so the concept is: when you want to call the async function, it should be called by another async function with await keyword for each items that's being returned

const playmusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentsong.src = `/${currfolder}/` + track
  if (!pause) {
    currentsong.play()
    play.src = "pause.svg"
  }

  // this will ensure that while song is not playing, by default, button will be play.svg while the song is puased
  document.querySelector(".abovebar .songinfo").innerHTML = decodeURI(track)
  document.querySelector(".abovebar .songtime").innerHTML = "00:00/00:00"
// ---------------------------------------------------------------------

 


  // --------------------------------------------------------------------
}

async function displayalbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors= div.getElementsByTagName("a")
    Array.from(anchors).forEach(async e=>{
      if (e.href.includes("/songs")){
        let folder = e.href.split("/").slice(-2)[0]
        // get the meta data of the folder 
        let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
        let response = await a.json()
        console.log(response)
        cardContainer.innerHTML = cardContainer.innerHTML
      }
    })
    

}

// getting the list of songs in Array.
async function main() {



  // getting the list of songs
  await getSongs("songs/arijit")
  console.log(songs)
  playmusic(songs[0], true)


  // display all the albums on the page
  
 

  // attach an event listener to previous, play,and next.  

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play()
      // function to play song in currentsong variable
      play.src = "pause.svg"
      // play.src will help change the icons 
    }
    else {
      currentsong.pause()
      // function to pause the song in currentsong variable
      play.src = "play.svg"
      //  paused.src will help change the icons
    }
  })

  // listen for timeupdate event
  currentsong.addEventListener("timeupdate", () => {

    console.log(currentsong.currentTime, currentsong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
    // now we need to change the circle's position as the time of the song increases
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    // this will eventually change the position of the the circle in percentage and will automatically update the value in css


  })

  // adding an event listener to seekbar 
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100;
  })



  // now let's invoke the main function which will extract the song file from the getSongs function. 


  // adding an event listener for the hamburger menu
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })

  //adding event listener for the close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
  })


  // now let's work on previous and next button

  // adding an event listener to previous 
  previous.addEventListener("click", () => {
    console.log("previous selected...")
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    console.log(songs, index)
    if ((index) > 0) {

      playmusic(songs[index - 1])
    }
  })

  // and next button
  next.addEventListener("click", () => {
    console.log("next selected...")

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    console.log(songs, index)
    if ((index + 1) < songs.length) {

      playmusic(songs[index + 1])
    }
  })


  // adding an event listener to the volume slide-bar

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value)
    console.log("setting volume to", e.target.value, "out of 100")
    currentsong.volume = parseInt(e.target.value) / 100
  })


  // load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {

    e.addEventListener("click", async item => {
      console.log(item, item.currentTarget.dataset)
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

    })
  })






}

main()



