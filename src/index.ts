#!/usr/bin/env bun
import { Command } from "commander";
import { showDashboard } from "./dashboard";
import {
  addCommand,
  listCommands,
  updateCommand,
  deleteCommand,
  runCommand,
} from "./commands";
import { getBinDir, getTstoreDir } from "./storage";

const program = new Command();

program
  .name("tstore")
  .description("Terminal Command Store - Save and run commands with aliases")
  .version("1.0.0");

// Custom help text
program.addHelpText('beforeAll', `
╔═══════════════════════════════════════╗
║         T-STORE                       ║
║   Terminal Command Storage Manager    ║
╚═══════════════════════════════════════╝
`);

program
  .argument("[name]", "Command name to run (or 'add', 'list', 'edit', 'delete', 'setup')")
  .action(async (name) => {
    if (!name) {
      await showDashboard();
      return;
    }

    switch (name.toLowerCase()) {
      case "add":
        await showAddWizard();
        break;
      case "list":
        await showList();
        break;
      case "edit":
        await showEditWizard();
        break;
      case "delete":
        await showDeleteWizard();
        break;
      case "setup":
        showSetup();
        break;
      default:
        await runCommand(name);
    }
  });

async function showAddWizard(): Promise<void> {
  const prompts = (await import("prompts")).default;

  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "Enter command name (alias):",
    validate: (value) => {
      if (!value || value.trim().length === 0) return "Name is required";
      if (value.includes(" ")) return "Name cannot contain spaces";
      return true;
    },
  });

  if (!name) return;

  const { command } = await prompts({
    type: "text",
    name: "command",
    message: "Enter the command to execute:",
    validate: (value) =>
      value && value.trim().length > 0 ? true : "Command is required",
  });

  if (!command) return;

  const { description } = await prompts({
    type: "text",
    name: "description",
    message: "Enter description (optional):",
  });

  await addCommand(name, command, description);
}

async function showList(): Promise<void> {
  const commands = await listCommands();

  if (commands.length === 0) {
    console.log("📭 No commands stored yet.");
    console.log(`   Storage location: ${getTstoreDir()}/commands.json`);
    return;
  }

  console.log("\n📋 Stored Commands:");
  console.log("─".repeat(60));
  commands.forEach((cmd) => {
    console.log(`\n  🔹 ${cmd.name}`);
    if (cmd.description) {
      console.log(`     ${cmd.description}`);
    }
    console.log(`     Command: ${cmd.command}`);
  });
  console.log("\n" + "─".repeat(60));
  console.log(`\n   Run a command: tstore <name>`);
  console.log(`   Or directly:   <name> (if PATH is configured)`);
}

async function showEditWizard(): Promise<void> {
  const commands = await listCommands();

  if (commands.length === 0) {
    console.log("⚠️  No commands to edit.");
    return;
  }

  const prompts = (await import("prompts")).default;

  const { selected } = await prompts({
    type: "select",
    name: "selected",
    message: "Select command to edit:",
    choices: commands.map((cmd) => ({
      title: cmd.name,
      value: cmd.name,
      description: cmd.description || cmd.command.slice(0, 50),
    })),
  });

  if (!selected) return;

  const cmd = commands.find((c) => c.name === selected);
  if (!cmd) return;

  const { newCommand } = await prompts({
    type: "text",
    name: "newCommand",
    message: "Enter the new command:",
    initial: cmd.command,
    validate: (value) =>
      value && value.trim().length > 0 ? true : "Command is required",
  });

  if (!newCommand) return;

  const { newDescription } = await prompts({
    type: "text",
    name: "newDescription",
    message: "Enter new description (optional):",
    initial: cmd.description || "",
  });

  await updateCommand(selected, newCommand, newDescription || undefined);
}

async function showDeleteWizard(): Promise<void> {
  const commands = await listCommands();

  if (commands.length === 0) {
    console.log("⚠️  No commands to delete.");
    return;
  }

  const prompts = (await import("prompts")).default;

  const { selected } = await prompts({
    type: "select",
    name: "selected",
    message: "Select command to delete:",
    choices: commands.map((cmd) => ({
      title: cmd.name,
      value: cmd.name,
      description: cmd.description || cmd.command.slice(0, 50),
    })),
  });

  if (!selected) return;

  const { confirm } = await prompts({
    type: "confirm",
    name: "confirm",
    message: `Are you sure you want to delete "${selected}"?`,
    initial: false,
  });

  if (confirm) {
    await deleteCommand(selected);
  }
}

function showSetup(): void {
  console.log("\n🔧 T-Store Setup Instructions");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("1. Add to your shell configuration file (.bashrc, .zshrc, etc.):");
  console.log("\n   # T-Store PATH configuration");
  console.log(`   export PATH="${getBinDir}:$PATH"`);
  console.log("\n2. Reload your shell configuration:");
  console.log("   source ~/.zshrc  # or source ~/.bashrc");
  console.log("\n3. Storage locations:");
  console.log(`   Commands JSON:  ${getTstoreDir()}/commands.json`);
  console.log(`   Command aliases: ${getBinDir()}/`);
  console.log("\n✅ You're all set!");
}

program.parse();
