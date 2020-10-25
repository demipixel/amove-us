# Amove Us

[![Discord](https://img.shields.io/discord/755618288678994042?color=%237289DA&label=Chat%20on%20Discord&logo=discord&logoColor=white)](https://discord.gg/WsR8T7v)

An automated Discord bot for Among Us!

**Features**

- Automatically move users to separate channels or bring them back depending on the % of users that are muted
- Allow users to mark themselves as dead and move them to a channel with other ghosts. They are automatically muted during discussion time (but can listen in!)
- Allow users to mark themselves as the imposter so they can secretly chat with the other imposter during "shhh" time.

## Add it to your server

### Setup

**To add the bot to your Discord, click the following link:**

https://discord.com/oauth2/authorize?client_id=755655561260826654&scope=bot&permissions=29428816

**Setting things up**

The server owner should use `!amoveus generate` in any channel and everything should be setup automatically!

**Don't trust the bot with all those permissions?**

You should be able to just create a category called "Amove Us" and give the bot permissions to do everything in just that category (e.g. manage channels, mute members, etc). You can generate the channels and everything (should) work.

### Support

[![Discord](https://img.shields.io/discord/755618288678994042?color=%237289DA&label=Chat%20on%20Discord&logo=discord&logoColor=white)](https://discord.gg/WsR8T7v)

## Install it yourself

First download a zip or clone the repo:

```
git clone https://github.com/demipixel/amove-us.git
```

Next, create a file named `.env` and put the following in it:

```
DISCORD_TOKEN=<YOUR TOKEN HERE>
```

For example:

```
DISCORD_TOKEN=AAbbCCddEEff...
```

Then:

```
npm install
npm run start
```

## Contributing

For information on how to contribute, see [CONRTIBUTE.md](CONTRIBUTE.md).
