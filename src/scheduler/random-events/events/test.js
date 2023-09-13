import RandomEvent from "./random-event.js";
import { client } from "../../../client.js";
import discordJs, { ChannelType } from "discord.js";
import { fetchRandomSalute } from "../../../core/random-words.js";
import debugCtor from "debug";

const debug = debugCtor('random-event:test');

export default class Test extends RandomEvent {

  async handler() {
    const { salute, gifUrl } = await fetchRandomSalute('test');

    for (const channelId of this.enabledChannelsIds()) {
      debug('running for channel %o', channelId);

      /** @var {discordJs.TextChannel} channel */
      const channel = await client.channels.fetch(channelId);
      console.assert(channel.type === ChannelType.GuildText);

      await channel.send({
        body: `${salute}\n\n${gifUrl}`
      });
    }
  }

  get cron() {
    return '00,10,20,30,40,50 22,23 * * *';
  }
}