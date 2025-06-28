const { exec } = require("child_process")
const lang = "en-GB"
const video_url = "https://www.youtube.com/watch?v=tjrvnlHkcBc"


exec(`yt-dlp --skip-download --write-sub --sub-lang ${lang} --sub-format json3 '${video_url}'`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
    console.log(`Success: ${stdout}`)
});
