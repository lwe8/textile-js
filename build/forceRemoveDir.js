import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Recursively and forcefully removes a directory and all its contents.
 * @param {string} dirPath - The path to the directory to remove.
 */
async function forceRemoveDir(dirPath) {
  if (!existsSync(dirPath)) return;
  for (const entry of await fs.readdir(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    const stat = await fs.lstat(fullPath);
    if (stat.isDirectory()) {
      await forceRemoveDir(fullPath);
    } else {
      await fs.unlink(fullPath);
    }
  }
  await fs.rmdir(dirPath);
}

export default forceRemoveDir;
