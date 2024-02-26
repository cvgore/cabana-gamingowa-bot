import discordJs, {
  AttachmentBuilder,
  SlashCommandSubcommandBuilder
} from "discord.js";
import { respondWithResult, userInputError } from "../../core/response.js";
import debugCtor from "debug";
import { getEPrescriptionImage } from "../../core/random-things.js";

const debug = debugCtor('cmd:eprescription-make');

export const definition = new SlashCommandSubcommandBuilder()
  .setName("make")
  .setDescription("wypisz recepte")
  .addStringOption((opt) => opt
    .setName("patient_name")
    .setDescription("pacjent")
    .setRequired(true)
  )
  .addStringOption((opt) => opt
    .setName("item_name")
    .setDescription("na co wypisac recepte")
    .setRequired(true)
  )
  .addStringOption((opt) => opt
    .setName("issuer_name")
    .setDescription("kto wystawia")
    .setRequired(false)
  )
  .addStringOption((opt) => opt
    .setName("dose_text")
    .setDescription("jaka dawka wariacie, tylko żeby cie z butów nie wyjebało")
    .setRequired(false)
  )
  .addStringOption((opt) => opt
    .setName("code")
    .setDescription("kod recepty - inny niż 2137 nie przyjme")
    .setRequired(false)
  )
;

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<unknown>}
 */
export const handler = async (interaction) => {
  const patientName = interaction.options.getString("patient_name", true);
  const itemName = interaction.options.getString("item_name", true);
  const issuerName = interaction.options.getString("issuer_name");
  const doseText = interaction.options.getString("dose_text");
  const code = interaction.options.getString("code");

  await interaction.deferReply();

  return (await getEPrescriptionImage(patientName, itemName, issuerName, doseText, code)).mapOrElse(
    (err) => {
      debug('got error - %o', err);
      if (err === "payload_too_large") {
        return respondWithResult({
          interaction,
          msgFail: userInputError(`pewnie za długi tekst podałeś`),
          result: false,
          followup: true,
        });
      }
    },
    (imageBuffer) => {
      const image = new AttachmentBuilder(imageBuffer, {
        name: "recepta.jpg",
      })
      debug('got valid jpg, yay');
      return interaction.editReply({
        files: [
          image
        ]
      });
    }
  );
};