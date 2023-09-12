import RandomEvent from "./random-event.js";
import { client } from "../../../client.js";
import discordJs, { ChannelType } from "discord.js";
import { fetchRandomSalute } from "../../../core/random-words.js";

export default class Nnn extends RandomEvent {

  async handler() {
    const { salute, gifUrl } = await fetchRandomSalute('nnn');

    for (const channelId of this.enabledChannelsIds()) {
      /** @var {discordJs.TextChannel} channel */
      const channel = await client.channels.fetch(channelId);
      console.assert(channel.type === ChannelType.GuildText);

      await channel.send({
        body: `${salute}\n\n${gifUrl}`
      });
    }
  }

  get cron() {
    return '00 09 01 11 *';
  }
}