import { spawn } from "child_process";
import {
  loadCommands,
  saveCommands,
  createAliasScript,
  removeAliasScript,
} from "./storage";
import type { StoredCommand } from "./storage";

export async function addCommand(
  name: string,
  command: string,
  description?: string
): Promise<void> {
  const store = await loadCommands();
  const now = Date.now();

  store.commands[name] = {
    name,
    command,
    description,
    createdAt: store.commands[name]?.createdAt || now,
    updatedAt: now,
  };

  await saveCommands(store);
  await createAliasScript(name, command);

  console.log(`✅ Added command: ${name}`);
  console.log(`   Run with: tstore ${name} or just ${name} (if PATH is set)`);
}

export async function listCommands(): Promise<Array<StoredCommand>> {
  const store = await loadCommands();
  return Object.values(store.commands).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCommand(name: string): Promise<StoredCommand | null> {
  const store = await loadCommands();
  return store.commands[name] || null;
}

export async function updateCommand(
  name: string,
  newCommand: string,
  newDescription?: string
): Promise<void> {
  const store = await loadCommands();

  if (!store.commands[name]) {
    throw new Error(`Command "${name}" not found`);
  }

  store.commands[name].command = newCommand;
  if (newDescription !== undefined) {
    store.commands[name].description = newDescription;
  }
  store.commands[name].updatedAt = Date.now();

  await saveCommands(store);
  await createAliasScript(name, newCommand);

  console.log(`✅ Updated command: ${name}`);
}

export async function deleteCommand(name: string): Promise<void> {
  const store = await loadCommands();

  if (!store.commands[name]) {
    throw new Error(`Command "${name}" not found`);
  }

  delete store.commands[name];
  await saveCommands(store);
  await removeAliasScript(name);

  console.log(`✅ Deleted command: ${name}`);
}

export async function runCommand(name: string): Promise<void> {
  const cmd = await getCommand(name);

  if (!cmd) {
    throw new Error(`Command "${name}" not found. Run "tstore list" to see available commands.`);
  }

  console.log(`🚀 Running: ${cmd.name}`);
  console.log(`   Command: ${cmd.command}\n`);

  return new Promise((resolve, reject) => {
    const child = spawn(cmd.command, [], {
      shell: true,
      stdio: "inherit",
      env: process.env,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });

    child.on("error", reject);
  });
}

export async function commandExists(name: string): Promise<boolean> {
  const store = await loadCommands();
  return name in store.commands;
}