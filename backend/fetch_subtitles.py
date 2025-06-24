import os
import glob

video_url = "https://www.youtube.com/watch?v=tjrvnlHkcBc" 
lang = "en-GB"  

# Remove existing .json3 files 
for file in glob.glob("*.json3"):
    os.remove(file)

os.system(f"yt-dlp --skip-download --write-sub --sub-lang {lang} --sub-format json3 '{video_url}'") # Command to fetch subtitles
