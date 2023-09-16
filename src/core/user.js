import { OWNER_ID } from "../env.js";

export const isUserOwner = (userId) => {
  return OWNER_ID === userId;
};
