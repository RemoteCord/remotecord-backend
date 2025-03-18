import Crypto from "node:crypto";
export const generateRandomHex = () =>
  Crypto.randomBytes(48)
    .toString("base64")
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
