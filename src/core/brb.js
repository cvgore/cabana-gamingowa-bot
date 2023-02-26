import { BRB_ROLE_ID } from "../env.js";
import { logger } from "../logger.js";
import { unzzzifyNickname, zzzifyNickname } from "./helpers.js";

export const setBrbNicknameToUser = async (user, mins) => {
  try {
    await user.setNickname(
      zzzifyNickname(unzzzifyNickname(user.nickname), mins),
      `brb:set(mins=${mins})`
    );
  } catch (ex) {
    logger.warn(`failed to set brb status for ${user.id}`, ex);
  }
};

export const setBrbToUser = async (user, mins) => {
  try {
    await user.roles.add(BRB_ROLE_ID);
  } catch (ex) {
    logger.warn(`failed to remove BRB_ROLE from ${user.id}`, ex);
  }

  return setBrbNicknameToUser(user, mins);
};

export const removeBrbFromUser = async (user) => {
  try {
    await user.roles.remove(BRB_ROLE_ID);
  } catch (ex) {
    logger.warn(`failed to remove BRB_ROLE from ${user.id}`, ex);
  }

  try {
    await user.setNickname(unzzzifyNickname(user.nickname), "brb:remove");
  } catch (ex) {
    logger.warn(`failed to unzzzifyNickname from ${user.id}`, ex);
  }
};
