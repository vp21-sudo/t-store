# Publishing Guide

## 1. Update Placeholders

Before publishing, update these placeholders in the following files:

### package.json
- `YOUR_NAME <YOUR_EMAIL@example.com>` → Your actual name and email
- `YOUR_USERNAME` → Your GitHub username (3 occurrences)
- `version` → Set to your desired version (e.g., "1.0.0")

### LICENSE
- `YOUR_NAME` → Your name

### README.md
- `YOUR_USERNAME` → Your GitHub username (3 occurrences)
- Update npm badge URL if package name changes
- Update GitHub Releases URL

## 2. Test Locally

```bash
# Install dependencies
bun install

# Test the CLI
./bin/tstore list
./bin/tstore add

# Build TypeScript (optional, for npm)
bun run build
```

## 3. Publish to npm

### Option A: Manual Publish

```bash
# Login to npm (first time only)
npm login

# Publish
npm publish --access public
```

### Option B: Via GitHub Actions (Recommended)

1. Create an npm account if you don't have one: https://www.npmjs.com/signup

2. Generate an npm access token:
   - Go to https://www.npmjs.com/settings/tokens
   - Click "Create New Token" → "Classic Token"
   - Select "Publish" scope
   - Copy the token

3. Add the token to your GitHub repository:
   - Go to your repo on GitHub
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token
   - Click "Add secret"

4. Create a GitHub release:
   ```bash
   # Update version in package.json
   # Commit your changes
   git add .
   git commit -m "Prepare for v1.0.0"
   
   # Create and push a tag
   git tag v1.0.0
   git push origin v1.0.0
   ```

   This will automatically:
   - Build binaries for Linux, macOS, and Windows
   - Create a GitHub Release with the binaries attached
   - Publish to npm

## 4. Verify Installation

After publishing, test the installation:

```bash
# Test npm install
npm install -g @vp21-sudo/t-store
tstore --help

# Or with bun
bun install -g @vp21-sudo/t-store
tstore --help
```

## 5. Update GitHub Repository

Make sure to:
1. Push all code to GitHub
2. Enable GitHub Actions (Settings → Actions → General)
3. Create a release to trigger the workflow

## Troubleshooting

### npm publish fails
- Check if the package name is available: `npm view t-store`
- Ensure you're logged in: `npm whoami`
- Check if version already exists: update version in package.json

### GitHub Actions fails
- Check Actions tab for error logs
- Ensure `NPM_TOKEN` secret is set correctly
- Make sure you're pushing tags: `git push origin --tags`

### Binary builds fail
- Check if Bun is properly installed in CI
- Review the build targets in release.yml
