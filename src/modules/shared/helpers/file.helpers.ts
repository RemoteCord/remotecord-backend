import fs from "fs";
import { promisify } from "util";
import path from "path";

const pathRoot = path.join(process.cwd(), "static");

/**
 * Check if a file exists at a given path.
 *
 * @param {string} path
 *
 * @returns {boolean}
 */
export const checkIfFileOrDirectoryExists = (path: string): boolean => {
  return fs.existsSync(path);
};

/**
 * Gets file data from a given path via a promise interface.
 *
 * @param {string} path
 * @param {string} encoding
 *
 * @returns {Promise<Buffer>}
 */
export const getFile = async (
  fileName: string,
  encoding?: BufferEncoding,
): Promise<string | Buffer> => {
  const readFile = promisify(fs.readFile);

  const resultPath = path.join(pathRoot, fileName);

  return encoding ? readFile(resultPath, { encoding }) : readFile(resultPath);
};

/**
 * Writes a file at a given path via a promise interface.
 *
 * @param {string} path
 * @param {string} fileName
 * @param {string} data
 *
 * @return {Promise<void>}
 */
export const createFile = async (
  fileName: string,
  data: ArrayBuffer,
): Promise<string> => {
  //   console.log(rootFolder, process.cwd());

  if (!checkIfFileOrDirectoryExists(pathRoot)) {
    fs.mkdirSync(pathRoot);
  }

  const resultPath = path.join(pathRoot, fileName);

  const writeFile = promisify(fs.writeFile);
  //   const path = path.join()
  await writeFile(resultPath, Buffer.from(data));

  return resultPath;
};

/**
 * Delete file at the given path via a promise interface
 *
 * @param {string} path
 *
 * @returns {Promise<void>}
 */
export const deleteFile = async (pathFile: string): Promise<void> => {
  const unlink = promisify(fs.unlink);

  const resultPath = path.join(pathRoot, pathFile);

  return await unlink(resultPath);
};
