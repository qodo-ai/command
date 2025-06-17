# Dynamic Release Notes System

This project includes a dynamic release notes system that automatically discovers and displays all HTML release notes files in the `release-notes/` folder.

## How It Works

### 1. Index Page (`index.html`)
The main index page dynamically scans for release notes files using multiple discovery methods:

1. **Manifest File** (preferred): Reads `release-notes/manifest.json` for a list of available files
2. **GitHub API**: Fetches directory listing from GitHub API when hosted on GitHub Pages
3. **Pattern Matching**: Falls back to checking common version patterns

### 2. Manifest File (`release-notes/manifest.json`)
Contains metadata about available release notes:

```json
{
  "files": ["release-notes-v0.1.128.html"],
  "lastUpdated": "2024-12-15T15:45:00Z",
  "description": "Manifest file for release notes - automatically updated by the release notes agent",
  "count": 1,
  "latestVersion": "0.1.128",
  "versions": [
    {
      "version": "0.1.128",
      "file": "release-notes-v0.1.128.html",
      "date": "2024-12-15",
      "title": "Release Notes v0.1.128"
    }
  ]
}
```

### 3. Automatic Discovery
The system automatically:
- Extracts metadata from HTML files (title, date, summary, version)
- Sorts releases by date (newest first)
- Updates the current version badge
- Provides navigation between index and individual release notes

## Adding New Release Notes

### Method 1: Update Manifest (Recommended)
1. Add your new HTML file to the `release-notes/` folder
2. Update `release-notes/manifest.json` to include the new file
3. Run `node update-manifest.js` to automatically update the manifest

### Method 2: Automatic Discovery
Simply add your HTML file to the `release-notes/` folder. The system will attempt to discover it automatically using pattern matching.

## File Structure

```
/
├── index.html                          # Main release notes index page
├── update-manifest.js                  # Script to update manifest file
├── release-notes/
│   ├── manifest.json                   # Manifest file (optional but recommended)
��   ├── release-notes-v0.1.128.html    # Individual release notes
│   └── release-notes-v0.1.129.html    # Additional release notes
└── RELEASE_NOTES_README.md             # This documentation
```

## HTML File Requirements

Release notes HTML files should include:
- `<h1>` tag with the release title
- `.release-date` element with "Released: YYYY-MM-DD" format
- `.summary p` element with a brief description
- Version number in filename or title (e.g., "v0.1.128")

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Automatic Metadata Extraction**: Pulls title, date, summary, and version from HTML files
- **Multiple Discovery Methods**: Robust fallback system for finding files
- **Navigation**: Back-to-index links in individual release notes
- **Version Badge**: Automatically updates to show latest version
- **Loading States**: Shows loading spinner and empty states
- **Error Handling**: Graceful degradation when files can't be loaded

## Browser Compatibility

- Modern browsers with ES6+ support
- Fetch API support required
- DOMParser API support required

## Deployment

This system works with:
- **GitHub Pages**: Uses GitHub API for file discovery
- **Static Hosting**: Uses manifest file or pattern matching
- **Local Development**: All methods work locally

## Maintenance

The `update-manifest.js` script can be integrated into your CI/CD pipeline to automatically update the manifest file when new release notes are added.

Example GitHub Action:
```yaml
- name: Update Release Notes Manifest
  run: node update-manifest.js
```