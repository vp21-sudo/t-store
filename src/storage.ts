import { mkdir, readFile, writeFile, symlink, unlink, readdir, chmod } from "fs/promises";
import { existsSync } from "fs";
import { resolve, join } from "path";

export interface StoredCommand {
  name: string;
  command: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CommandsStore {
  version: number;
  commands: Record<string, StoredCommand>;
}

const TSTORE_DIR = resolve(process.env.HOME || "", ".tstore");
const COMMANDS_FILE = join(TSTORE_DIR, "commands.json");
const BIN_DIR = join(TSTORE_DIR, "bin");

export async function ensureTstoreDir(): Promise<void> {
  if (!existsSync(TSTORE_DIR)) {
    await mkdir(TSTORE_DIR, { recursive: true });
  }
  if (!existsSync(BIN_DIR)) {
    await mkdir(BIN_DIR, { recursive: true });
  }
}

export async function loadCommands(): Promise<CommandsStore> {
  await ensureTstoreDir();

  if (!existsSync(COMMANDS_FILE)) {
    const defaultStore: CommandsStore = { version: 1, commands: {} };
    await writeFile(COMMANDS_FILE, JSON.stringify(defaultStore, null, 2));
    return defaultStore;
  }

  const content = await readFile(COMMANDS_FILE, "utf-8");
  return JSON.parse(content);
}

export async function saveCommands(store: CommandsStore): Promise<void> {
  await ensureTstoreDir();
  await writeFile(COMMANDS_FILE, JSON.stringify(store, null, 2));
}

export async function createAliasScript(name: string, command: string): Promise<void> {
  await ensureTstoreDir();

  const scriptPath = join(BIN_DIR, name);
  const shebang = "#!/bin/bash\n";
  const scriptContent = shebang + `exec bash -c "${command.replace(/"/g, '\\"')}"`;

  await writeFile(scriptPath, scriptContent);
  await chmod(scriptPath, 0o755);
}

export async function removeAliasScript(name: string): Promise<void> {
  const scriptPath = join(BIN_DIR, name);
  if (existsSync(scriptPath)) {
    await unlink(scriptPath);
  }
}

export async function listAliasScripts(): Promise<string[]> {
  await ensureTstoreDir();
  const files = await readdir(BIN_DIR);
  return files.filter(f => !f.startsWith("."));
}

export function getTstoreDir(): string {
  return TSTORE_DIR;
}

export function getBinDir(): string {
  return BIN_DIR;
}
