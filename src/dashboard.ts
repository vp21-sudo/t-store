import prompts from "prompts";
import {
  listCommands,
  addCommand,
  updateCommand,
  deleteCommand,
  runCommand,
  commandExists,
} from "./commands";
import { getBinDir } from "./storage";
import type { StoredCommand } from "./storage";

export async function showDashboard(): Promise<void> {
  console.clear();
  console.log("╔═══════════════════════════════════════╗");
  console.log("║         T-STORE DASHBOARD             ║");
  console.log("║   Terminal Command Storage Manager    ║");
  console.log("╚═══════════════════════════════════════╝\n");

  while (true) {
    const commands = await listCommands();

    console.log("\n📋 Available Commands:");
    if (commands.length === 0) {
      console.log("   (No commands stored yet)");
    } else {
      commands.forEach((cmd) => {
        const desc = cmd.description ? ` - ${cmd.description}` : "";
        console.log(`   • ${cmd.name}${desc}`);
      });
    }

    const { action } = await prompts({
      type: "select",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { title: "➕ Add new command", value: "add" },
        { title: "✏️  Edit command", value: "edit" },
        { title: "🗑️  Delete command", value: "delete" },
        { title: "▶️  Run command", value: "run" },
        { title: "📜 View command details", value: "view" },
        { title: "❌ Exit", value: "exit" },
      ],
    });

    if (!action || action === "exit") {
      console.log("\n👋 Goodbye!");
      process.exit(0);
    }

    switch (action) {
      case "add":
        await handleAddCommand();
        break;
      case "edit":
        await handleEditCommand(commands);
        break;
      case "delete":
        await handleDeleteCommand(commands);
        break;
      case "run":
        await handleRunCommand(commands);
        break;
      case "view":
        await handleViewCommand(commands);
        break;
    }
  }
}

async function handleAddCommand(): Promise<void> {
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

  const exists = await commandExists(name);
  if (exists) {
    console.log(`⚠️  Command "${name}" already exists.`);
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: "Do you want to overwrite it?",
      initial: false,
    });
    if (!overwrite) return;
  }

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
  console.log("\n✨ Command added successfully!");
  console.log(`   Run it with: tstore ${name} or ${name} (if PATH is configured)`);
  console.log(`\n   📌 Add to your .bashrc/.zshrc:`);
  console.log(`   export PATH="${getBinDir}:$PATH"`);
}

async function handleEditCommand(commands: StoredCommand[]): Promise<void> {
  if (commands.length === 0) {
    console.log("⚠️  No commands to edit.");
    return;
  }

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

  await updateCommand(
    selected,
    newCommand,
    newDescription || undefined
  );
}

async function handleDeleteCommand(commands: StoredCommand[]): Promise<void> {
  if (commands.length === 0) {
    console.log("⚠️  No commands to delete.");
    return;
  }

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

async function handleRunCommand(commands: StoredCommand[]): Promise<void> {
  if (commands.length === 0) {
    console.log("⚠️  No commands to run.");
    return;
  }

  const { selected } = await prompts({
    type: "select",
    name: "selected",
    message: "Select command to run:",
    choices: commands.map((cmd) => ({
      title: cmd.name,
      value: cmd.name,
      description: cmd.description || cmd.command.slice(0, 50),
    })),
  });

  if (!selected) return;

  await runCommand(selected);
}

async function handleViewCommand(commands: StoredCommand[]): Promise<void> {
  if (commands.length === 0) {
    console.log("⚠️  No commands to view.");
    return;
  }

  const { selected } = await prompts({
    type: "select",
    name: "selected",
    message: "Select command to view:",
    choices: commands.map((cmd) => ({
      title: cmd.name,
      value: cmd.name,
      description: cmd.description || cmd.command.slice(0, 50),
    })),
  });

  if (!selected) return;

  const cmd = commands.find((c) => c.name === selected);
  if (!cmd) return;

  console.log("\n📋 Command Details:");
  console.log(`   Name:        ${cmd.name}`);
  console.log(`   Command:     ${cmd.command}`);
  console.log(`   Description: ${cmd.description || "(none)"}`);
  console.log(`   Created:     ${new Date(cmd.createdAt).toLocaleString()}`);
  console.log(`   Updated:     ${new Date(cmd.updatedAt).toLocaleString()}`);

  await prompts({
    type: "confirm",
    name: "continue",
    message: "Press enter to continue",
    initial: true,
  });
}
