import * as badRankings from "./bad-rankings/index.js";
import * as rollDice from "./roll-dice/index.js";
import * as rollDiceMember from "./roll-dice-member/index.js";
import * as info from "./info/index.js";
import * as brb from "./brb/index.js";
import * as rightback from "./rightback/index.js";
import * as admin from "./admin/index.js";
import * as muted from "./muted/index.js";
import * as remind from "./remind/index.js";
import { Collection } from "discord.js";
import debugCtor from "debug";

const debug = debugCtor("commands:register");

const commands = [
  badRankings,
  rollDice,
  rollDiceMember,
  info,
  brb,
  rightback,
  admin,
  muted,
  remind,
];
export const BOT_COMMANDS = new Collection(
  commands.map((cmd) => {
    const subcommands = new Map();
    debug("processing cmd %o", cmd.definition.name);

    if ("subcommands" in cmd) {
      debug("found subcommands in %o", cmd.definition.name);

      for (const subCmd of cmd.subcommands) {
        debug(
          "adding subCmd %o to %o",
          subCmd.definition.name,
          cmd.definition.name
        );
        cmd.definition.addSubcommand(subCmd.definition);

        subcommands.set(subCmd.definition.name, subCmd);
      }
    }

    return [
      cmd.definition.name,
      {
        ...cmd,
        subcommands,
      },
    ];
  })
);



export const BOT_COMMANDS_REGISTRABLE = Array.from(BOT_COMMANDS.values()).map(
  (cmd) => {
    debug("serializing cmd %o into json", cmd.definition.name);
    return cmd.definition.toJSON();
  }
);
