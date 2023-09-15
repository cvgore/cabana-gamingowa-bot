import RandomEvent from "./random-event.js";
import { client } from "../../../client.js";
import discordJs, { ChannelType } from "discord.js";
import { fetchRandomSalute } from "../../../core/random-words.js";

export default class Wtc extends RandomEvent {

  async handler() {
    const { salute, gifUrl } = await fetchRandomSalute('wtc');

    for (const channelId of this.enabledChannelsIds()) {
      /** @var {discordJs.TextChannel} channel */
      const channel = await client.channels.fetch(channelId);
      console.assert(channel.type === ChannelType.GuildText);

      await channel.send({
        content: `${salute}\n\n${gifUrl}`,
      });
    }
  }

  get cron() {
    return '00 12 11 9 *';
  }
}