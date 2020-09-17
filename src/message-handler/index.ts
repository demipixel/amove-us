import * as Discord from 'discord.js';
import { GenerateChannels } from './generate-channels.mh';
import { HelpMessageHandler } from './help.mh';
import { ServerCountHandler } from './server-count.mh';

export type MessageHandler = (msg: Discord.Message) => Promise<boolean | void>;

const messageHandlers: MessageHandler[] = [
  GenerateChannels,
  HelpMessageHandler,
  ServerCountHandler,
];

export const handleMessage = async (msg: Discord.Message) => {
  for (const handler of messageHandlers) {
    const end = await handler(msg);
    if (end !== false) {
      break;
    }
  }
};
