import * as Discord from 'discord.js';
import { Lobby } from './lobby/lobby';

class State {
  lobbies: Lobby[];

  constructor() {
    this.lobbies = [];
  }

  async deleteLobbyForGuild(guild: Discord.Guild) {
    const lobby = this.lobbies.find((l) => l.category.guild.id === guild.id);
    if (lobby) {
      await lobby.finishGame();
    }
    this.lobbies = this.lobbies.filter((l) => l.category.guild.id !== guild.id);
  }

  async getLobbyForGuild(
    guild: Discord.Guild,
    category: Discord.CategoryChannel | null = null,
  ) {
    // tslint:disable-next-line
    for (const lobby of this.lobbies) {
      if (lobby.category.guild.id === guild.id) {
        return lobby;
      }
    }

    // Don't create a lobby if one doesn't exist and no category was provided
    if (!category) {
      return '';
    }

    const lobby = new Lobby(category);
    const err = await lobby.setup();
    if (err) {
      return err;
    } else {
      this.lobbies.push(lobby);
      return lobby;
    }
  }
}

const state = new State();
export default state;
