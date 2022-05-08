# HL Bot

Russian multipurpose Discord Bot for HL Server

## How to run
I am using `yarn 3` in a project but you can use any other package manager

- `git clone https://github.com/AgentRBY/HL_Bot`
- `cd HL_Bot`
- `yarn install`
- Create an `.env` file and fill it according to the pattern in `environment.d.ts`
- Required variables:
  - botToken - Bot token from [Discord Developer Portal](https://discord.com/developers/applications)
  - mongoURI - MongoDB URI, more info [here](https://www.mongodb.com/docs/manual/reference/connection-string)
- Optional variables: 
  - environment - Useless
  - prefix - Default bot prefix. If not specified will be used `>`
  - ownersID - User ID of the creators, separated by commas without a space (example: `123,435`)
  - mode - If set to `development`, then only the creators specified in the ownerID can use the bot. If set to `testing`, then only the testers can use the bot. Other values (including production) do nothing
  - sauceNAOToken - SauceNAO token from [SauceNAO API](https://saucenao.com/user.php?page=search-api). If not specified, the `findImage` command will not work.
  - yandexYU - Unique user ID in Yandex. I don’t know why it is needed, Yandex search command works without it
  - distubeCookie - Cookie from YouTube. Necessary for the stable operation of the music module. [How to get](https://github.com/fent/node-ytdl-core/blob/784c04eaf9f3cfac0fe0933155adffe0e2e0848a/example/cookies.js#L6-L12)
- For the music module to work, you also need to install FFmpeg. 
  - [Linux instruction](https://www.tecmint.com/install-ffmpeg-in-linux/)
  - [Windows instruction](https://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
  - For Heroku i use [Heroku Buildpack FFmpeg Lasted](https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest)
- Run `yarn dev` for development or `yarn build` and `yarn start` for production


## Modules
- `Image Search` - Search anime, manga and other images
- `Moderation` - Logging of all actions, the impact of the number of warnings / bans on the duration of the mute and more
- `Music` - Play music in voice channel. Support YouTube, Spotify and SoundCloud
- `Utils` - Various commands, like as search for random anime or hentai, anime information and more
- `AntiPing` - prevents mass mentions of people
- `AntiScam` - Deleting all messages containing nitro scam links
- `AniDBLink`, `AnilistLink`, `NHentaiLink` - Display information about anime or hentai when publishing a link to it

## All commands as of 05/08/2022:
![Commands](https://i.imgur.com/WPFKhIb.png)



