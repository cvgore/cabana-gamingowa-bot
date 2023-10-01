import discordJs, {
  SlashCommandSubcommandBuilder
} from "discord.js";
import { respondWithResult, userInputError } from "../../core/response.js";
import debugCtor from "debug";
import { getFancyFontGif } from "../../core/random-things.js";

const debug = debugCtor('cmd:fonts-fire');

export const definition = new SlashCommandSubcommandBuilder()
  .setName("fire")
  .setDescription("łogień font")
  .addStringOption((opt) => opt
    .setName("text")
    .setDescription("co chcesz napisać?")
    .setRequired(true)
  );

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<unknown>}
 */
export const handler = async (interaction) => {
  const text = interaction.options.getString("text", true);

  await interaction.deferReply({
    ephemeral: true,
  });

  return (await getFancyFontGif("fire", text)).mapOrElse(
    (err) => {
      debug('got error - %o', err);
      if (err === "payload_too_large") {
        return respondWithResult({
          interaction,
          msgFail: userInputError(`tekst jest za długi (${text.length} znaków)`),
          result: false
        });
      }

      if (err === "invalid_input_value:text") {
        return respondWithResult({
          interaction,
          msgFail: userInputError(`tekst zawiera niedozwolone znaki`),
          result: false
        });
      }
    },
    (gifBase64) => {
      debug('got valid gif, yay');
      return interaction.reply({
        files: [
          { data: gifBase64, name: "fancy.gif", contentType: "image/gif", key: "fancy" }
        ],
        embeds: [
          {
            title: text,
            image: {
              url: "attachment://fancy.gif"
            }
          }
        ]
      });
    }
  );
};