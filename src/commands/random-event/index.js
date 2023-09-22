import {
  SlashCommandBuilder
} from "discord.js";
import { runRandomEventsForAllEnabledGuilds } from "../../scheduler/random-events/index.js";

import * as manage from "../random-event/manage.js";
import * as eventBlacklist from "../random-event/eventBlacklist.js";

export const definition = new SlashCommandBuilder()
  .setName("losowe-eventy")
  .setDescription("nigdy nie wiesz co sie stanie")
;

export const subcommands = [
  manage,
  eventBlacklist
];

runRandomEventsForAllEnabledGuilds();