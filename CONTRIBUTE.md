## Formatting and Linting

Prettier is used for formatting (I have format-on-save enabled). [You can install for VSCode here.](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Before committing, run:

```
npm run lint
```

## Architecture

File names should include extensions that make it easier to tell what they're all about.

Example

**NOT**: `how-to-play.ts`

**DO**: `how-to-play.embed.ts`

- `src/embeds`: The different types of embeds that are sent by the bot
- `src/events`: Event handlers for Discord events (e.g. somebody joined, somebody left, etc). Called from `main.ts`
- `src/message-handler`: Handles a specific command. Match for the command and return `false` if there's no match. Any non-false return value will stop other message handlers from being called. Don't forget to add your message handler to `src/message-handler/index.ts`!
- `src/reaction-handler`: Handles a specific reaction _only_ on a message created by the bot. Return and adding reaction handlers is equivalent to message handlers.
- `src/lobby/lobby.ts`: Managing a lobby for a single server. State should be preserved in redis (and loaded on restart) in case there is a restart/update mid-game.
- `src/utils`: ~~Random junk~~

## Testing

Make sure you've set up your .env file as specified in the README (as well as running `npm install`). Then:

```
npm run start:dev
```
