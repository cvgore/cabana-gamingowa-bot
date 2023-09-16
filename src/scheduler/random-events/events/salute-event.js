import RandomEvent from "./random-event.js";
import { client } from "../../../client.js";
import discordJs, { ChannelType } from "discord.js";
import debugCtor from "debug";
import { fetchRandomSalute } from "../../../core/random-words.js";

const debug = debugCtor('random-event:salute-event');

export default class SaluteEvent extends RandomEvent {

  saluteCall() {
    return fetchRandomSalute(this.saluteCategory)
  }

  /**
   * @return {string}
   */
  get saluteCategory() {
    throw new Error(`${this.name} does not implement required saluteCategory method`);
  }

  async handler() {
    debug('running salute event for %o - category %o', this.name, this.saluteCategory);

    const { salute, gifUrl } = await this.saluteCall();

    for (const channelId of this.enabledChannelsIds()) {
      /** @var {discordJs.TextChannel} channel */
      const channel = await client.channels.fetch(channelId);
      console.assert(channel.type === ChannelType.GuildText);

      await channel.send({
        content: gifUrl ? `${salute}\n${gifUrl}` : salute,
      });
    }
  }
}