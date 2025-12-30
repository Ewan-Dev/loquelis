# Loquelis
#### Video Demo : <https://www.youtube.com/watch?v=F8ah2x43W84>
## 📚 Table of Contents

- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Setup](#-setup)
- [Tested with](#-tested-with)

## 🔍 Overview
A language learning website where you learn through music and videos (with live subtitles and translations), articles, flashcards and AI chats

<img src="./frontend/static/video-view.png">

> [!TIP]
> Click on a word to get its definition and you can then add it to a flashcard deck

### Learn through media such as:
- 📹 Videos
- 🎧 Music
- 💬 AI Chats
- 🗃️ Flashcards

### ℹ️ Prerequisites
- Node.js
- npm
- Vite (with Svelte plugin)
- Supabase

## 💾 Setup
1. Create a Supabase project
2. Create the tables (🔑 Means primary column):

| Table    | Columns |
| -------- | ------- |
| `profiles`  | 🔑 `user_id`(`uuid`) `created_at`(`timestamptz`), `email`(`text`), `username`(`text`)    |
| `character_fields` | 🔑 `id`(`int8`), `type`(`text`), `name`(`text`) |
| `flashcard_decks`     | 🔑 `id`(`int8`), `created_at`(`timestamptz`), `content`(`text[]`), `language`(`text`), `country_code`(`text`), `author`(`uuid`), `author_username`(`text`)|
| `ai-characters`   | 🔑 `id`(`int8`), `created_at`(`timestamptz`), `name`(`text`), `occupation`(`text`), `trait`(`text`), `language`(`text`), `image`(`text`), `country`(`text`)|
| `languages` |🔑 `short`(`text`), `name`(`text`), `emoji`(`text`), `country_code`(`text`)|
| `media` |🔑 `id`(`int8`) `name`(`text`), `artist`(`text`), `level`(`text`),  `language`(`text`), `cover`(`text`), `embed_link`(`text`), `content`(`json`), `media_type`(`text`), `video_link`(`text`), `category`(`text`) |


2. Add your own RLS policies based on your preferences.

3. Run on your CLI `git clone git@github.com:Ewan-Dev/loquelis.git`

4. Run `npm install` at root to install all dependencies

5. Run `cd frontend` to move into the frontend folder

6. Run `npm install --save-dev @sveltejs/vite-plugin-svelte svelte` to install the Svelte Vite plugin.


7. Create a `.env` file in `./frontend` and in that file type(replacing with your own url and key):
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
```

8. Create a `.env` in `./backend` for login details to YOUR OWN Supabase project users. This will be your admin account which will upload all video requests in this format:

``` 
EMAIL=your_email
PASSWORD=your_password
```

9. Run `node fetchSubtitles.js` and it should print
```
Subscribed to languages channel
[ 'en', 'zh' ]
Listening...
```
Maybe a DeprecationWarning (ignore)
`Signin successful` - Your .env file login was successful!

10. In another terminal but in the same directory run `node updateLanguages.js` to fetch the languages from `languages` table and should print lines of:
Maybe a DeprecationWarning (ignore) 
`Broadcast result: ok`
 
11. Run `npm run dev` to run the frontend.

12. From the upload page, when a user uploads successfully your console will print something along the lines of:
```
Received subtitles{...}
Language: en
URL: https://www.youtube.com/watch?v=j59BM6bOeUs
true
Success!
{...}
C1
```
## ✅ Tested with
- Node.js v22.9.0 
- Vite 6.3.5
- Chromium 139.0.7258.67
- Arc Browser
- MacOS 14.0
