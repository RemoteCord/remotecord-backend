import Crypto from "node:crypto";
export const generateRandomHash = () =>
  Crypto.randomBytes(48)
    .toString("base64")
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
