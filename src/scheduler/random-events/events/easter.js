import RandomEvent from "./random-event.js";
import { client } from "../../../client.js";
import discordJs, { ChannelType } from "discord.js";
import { fetchNextEaster, fetchRandomSalute } from "../../../core/random-words.js";
import { isSameDay } from "date-fns";

export default class Easter extends RandomEvent {

  async handler() {
    const { nextEasterAt } = await fetchNextEaster();

    if (!isSameDay(new Date(), nextEasterAt)) {
      return Promise.resolve();
    }

    const { salute, gifUrl } = await fetchRandomSalute('easter');

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
    return '00 10 * * *';
  }
}