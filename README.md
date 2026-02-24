# 🚀 T-Store

**Terminal Command Store** - Save frequently used terminal commands with easy-to-remember aliases.

[![npm version](https://badge.fury.io/js/t-store.svg)](https://www.npmjs.com/package/t-store)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Command Aliases** - Save long commands as short, memorable names
- 📦 **Interactive Dashboard** - Beautiful TUI to manage all commands
- 🔧 **PATH Integration** - Run aliases directly without `tstore` prefix
- 📝 **Full CRUD** - Add, edit, delete, and view stored commands
- 🚀 **Zero Config** - Works out of the box
- 💻 **Cross Platform** - Works on Linux, macOS, and Windows

## 📦 Installation

### Via npm (Recommended)

```bash
npm install -g @vp21-sudo/t-store
# or
bun install -g @vp21-sudo/t-store
```

### Via GitHub Releases (Standalone Binary)

Download the latest binary for your platform from [GitHub Releases](https://github.com/vp21-sudo/t-store/releases).

```bash
# Linux/macOS
chmod +x tstore-linux
cp tstore-linux /usr/local/bin/tstore

# Windows
# Add tstore-windows.exe to your PATH
```

## 🚀 Quick Start

### 1. Setup PATH (One-time)

Add this to your `~/.bashrc`, `~/.zshrc`, or `~/.config/fish/config.fish`:

```bash
export PATH="$HOME/.tstore/bin:$PATH"
```

Then reload your shell:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

### 2. Open Dashboard

```bash
tstore
```

### 3. Add Your First Command

```bash
tstore add
```

Or use the dashboard to add commands interactively!

## 📖 Usage

### Dashboard

```bash
tstore
```

Opens an interactive TUI to manage all commands.

### Add Command

```bash
tstore add
# Follow the prompts to enter name, command, and description
```

Example:

- Name: `tqnpm`
- Command: `clear; export AWS_PROFILE=tq; npm run dev`
- Description: `Run dev with tq AWS profile`

### List Commands

```bash
tstore list
```

### Run Command

```bash
# Via tstore
tstore tqnpm

# Or directly (after PATH setup)
tqnpm
```

### Edit Command

```bash
tstore edit
```

### Delete Command

```bash
tstore delete
```

### Setup Help

```bash
tstore setup
```

## 💡 Use Cases

- **Environment Switching**: `dev`, `staging`, `prod` profiles
- **Project Commands**: `start`, `build`, `deploy` with project-specific settings
- **Complex Commands**: Multi-step commands with environment variables
- **Workflow Automation**: Repeated terminal workflows

## 📁 Storage

Commands are stored in:

- **JSON Database**: `~/.tstore/commands.json`
- **Executable Scripts**: `~/.tstore/bin/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Show Your Support

If you find T-Store helpful, please give it a star on GitHub!

---

**Made with ❤️ for the terminal-loving developer**
