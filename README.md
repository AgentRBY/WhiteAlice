# White Alice

Russian multipurpose Discord Bot

## How to run

I am using `pnpm` in a project but you can use any other package manager

- `git clone https://github.com/AgentRBY/White_Alice`
- `cd White_Alice`
- `pnpm install`
- Create an `.env` file and fill it according to the pattern in `environment.d.ts` or `.env.example`
- Required variables:
    - botToken — Bot token from [Discord Developer Portal](https://discord.com/developers/applications)
- Optional variables:
    - mongoURI — MongoDB URI, more info [here](https://www.mongodb.com/docs/manual/reference/connection-string)
    - environment — development or production. If development, application commands set to dev guild (see next)
    - devGuildID — Development Guild ID, used to add application commands if environment set to development
    - prefix — Default bot prefix. If not specified will be used `>`
    - ownersID — User ID of the creators, separated by commas without a space (example: `123,435`)
    - mode — If set to `development`, then only the creators specified in the ownerID can use the bot. If set
      to `testing`, then only the testers can use the bot. Other values (including production) do nothing
    - sauceNAOToken — SauceNAO token from [SauceNAO API](https://saucenao.com/user.php?page=search-api). If not
      specified, the `findImage` command will not work.
    - yandexYU — Unique user ID in Yandex. I don’t know why it is needed, Yandex search command works without it
    - auddToken — Audd.io token from [Audd.io API](https://docs.audd.io/). If not specified, the `findMusic` command
      will not work.
- Run `pnpm dev` for development or `pnpm build` and `pnpm start` for production

### **Bot settings:**

Turn on this intents in [Discord Developer Portal](https://discord.com/developers/applications):

- Presence intent
- Server members intent
- Message content intent

## Commands and modules

### **Common commands:**

- `Image Search` — Search anime, manga and other by images
- `Moderation` — Logging of all actions, the impact of the number of warnings / bans on the duration of the mute and
  more
- `Utils` — Various commands, like as search for random anime, get information about anime and more
- `Voice` — Custom user voices module

### **Context commands:**

- `Report` — Report user to moderators

### **Slash commands:**

- `Moderation` — Mute command, in future — other moderation commands from Common commands

### **Modules:**

- `AntiPing` — prevents mass mentions of people
- `AntiScam` — Deleting all messages containing nitro scam links
- `AniDBLink`, `AnilistLink` — Display information about anime or hentai when publishing a link to it
- `MediaChannel` — Create a channel for media (any posts that do not contain links or attachments will be deleted)

## All commands as of 06/04/2023:

![Commands](https://i.imgur.com/rsYdOFl.png)



