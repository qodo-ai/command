# GitHub Actions Workflows

## Pages Build Notification

This workflow (`pages-build-notification.yml`) automatically sends a Slack notification whenever GitHub Pages finishes building your site after a new release note is added.

### Features

- 🚀 Triggers automatically when GitHub Pages build completes
- 📱 Sends rich Slack notifications with all relevant links
- 🔗 Includes links to:
  - The specific new release note
  - The complete release notes index page
  - GitHub changelog/releases page
  - The repository
- 🛡️ Robust error handling and fallback notification methods
- 🐛 Debug information for troubleshooting

### Setup Instructions

#### 1. Create a Slack Webhook

1. Go to your Slack workspace
2. Navigate to **Apps** → **Incoming Webhooks**
3. Click **Add to Slack**
4. Choose the channel where you want notifications
5. Copy the webhook URL

#### 2. Add Slack Webhook to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `SLACK_WEBHOOK_URL`
5. Value: Your Slack webhook URL
6. Click **Add secret**

#### 3. Enable GitHub Pages (if not already enabled)

1. Go to **Settings** → **Pages**
2. Select your source (usually `main` branch)
3. Save the configuration

### How It Works

1. **Trigger**: The workflow triggers on the `page_build` event, which fires when GitHub Pages finishes building
2. **Data Extraction**: It reads your `release-notes/manifest.json` to find the latest release note
3. **URL Generation**: It constructs URLs for:
   - Your GitHub Pages site index
   - The specific release note
   - GitHub releases page
4. **Notification**: Sends a formatted Slack message with all the information

### Notification Format

The Slack notification includes:

```
🚀 GitHub Pages Build Complete
Release Notes Published - Version [VERSION]

📋 All Release Notes: [Link to index.html]
📝 GitHub Changelog: [Link to GitHub releases]
🆕 Latest Release Note: [Link to specific release note]
🏗️ Repository: [Link to repository]
Build Time: [Timestamp]
```

### Troubleshooting

If the workflow fails:

1. Check the **Actions** tab in your GitHub repository
2. Look at the workflow run logs for error messages
3. The workflow includes debug information that will show:
   - Repository information
   - Directory contents
   - Manifest file contents

### Customization

You can customize the workflow by:

- **Changing the Slack message format**: Edit the `custom_payload` section
- **Adding more information**: Extract additional data from your release notes
- **Changing notification conditions**: Modify the trigger conditions
- **Adding other notification channels**: Add steps for email, Discord, etc.

### File Structure Expected

The workflow expects this structure:
```
/
├── index.html (GitHub Pages index)
├── release-notes/
│   ├── manifest.json
│   ├── release-notes-v1.0.0.html
│   └── release-notes-v1.1.0.html
└── .github/
    └── workflows/
        └── pages-build-notification.yml
```

### Manifest.json Format

Your `manifest.json` should look like:
```json
{
  "files": [
    "release-notes-v1.0.0.html",
    "release-notes-v1.1.0.html"
  ],
  "lastUpdated": "2025-01-01T12:00:00.000Z",
  "description": "Manifest file for release notes",
  "count": 2
}
```

The workflow will use the last file in the `files` array as the latest release.