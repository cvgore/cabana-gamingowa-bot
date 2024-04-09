import discordJs, { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { fatalError, respondWithResult } from "../../core/response.js";
import debugCtor from "debug";
import { fetchToiletMode } from "../../core/random-things.js";

const debug = debugCtor("info-command");

export const definition = new SlashCommandBuilder()
  .setName("sram")
  .setDescription("tylko nie driftuj na tej porcelanie za mocno");

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<unknown>}
 */
export const handler = async (interaction) => {
  await interaction.deferReply();

  return (await fetchToiletMode()).mapOrElse(
    (err) => {
      debug('got error - unknown');
      return respondWithResult({
        interaction,
        msgFail: fatalError(`coś się grubo zesrało, ale to na pewno nie ty �`),
        result: false,
        followup: true,
        hidden: false,
      });
    },
    ({text}) => {
      debug('got valid toilet mode, yay');
      return respondWithResult({
        interaction,
        msgOk: text,
        result: true,
        followup: true,
        hidden: false,
      });
    }
  );
};