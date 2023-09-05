import discordJs, { ChannelType, SlashCommandBuilder, userMention } from "discord.js";
import { respondWithResult, userInputError, userSuccess } from "../../core/response.js";
import { randomInt as nativeRandomInt } from "crypto";
import { promisify } from "util";
import { getRandomAbusiveWordNamedUser } from "../../core/random-swear.js";

const randomInt = promisify(nativeRandomInt);

export const definition = new SlashCommandBuilder()
  .setName("losuj-gracza")
  .setDescription("wybierz losowo gracza z kanału")
  .addChannelOption((opt) => opt
    .setName("channel")
    .setDescription("kanał z jakiego pobrać członków")
    .setRequired(true)
    .addChannelTypes(
      ChannelType.GuildText
      | ChannelType.GuildVoice
    )
  );

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const channel = interaction.options.getChannel("channel", true);
  const members = channel.members;

  if (members.size < 2) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userInputError(`nie ma z kogo wybierać :<`)
    });
  }

  const keys = members.keys();
  let value = await randomInt(0, members.size + 1);
  while (--value > 0) {
    keys.next();
  }

  const selected = keys.next().value;

  return respondWithResult({
    interaction,
    msgOk: userSuccess(`🎲 wylosowany ${getRandomAbusiveWordNamedUser()} - ${userMention(selected)} 🎲`),
    hidden: false
  });
};