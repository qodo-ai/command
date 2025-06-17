#!/usr/bin/env node

/**
 * Script to automatically update the release notes manifest file
 * This should be run whenever new release notes HTML files are added
 */

const fs = require('fs');
const path = require('path');

const RELEASE_NOTES_DIR = path.join(__dirname, 'release-notes');
const MANIFEST_PATH = path.join(RELEASE_NOTES_DIR, 'manifest.json');

function updateManifest() {
    try {
        // Read all files in the release-notes directory
        const files = fs.readdirSync(RELEASE_NOTES_DIR);
        
        // Filter for HTML files only
        const htmlFiles = files
            .filter(file => file.endsWith('.html'))
            .sort(); // Sort alphabetically
        
        // Create manifest object
        const manifest = {
            files: htmlFiles,
            lastUpdated: new Date().toISOString(),
            description: "Manifest file for release notes - automatically updated by the release notes agent",
            count: htmlFiles.length
        };
        
        // Write manifest file
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        
        console.log(`✅ Manifest updated successfully!`);
        console.log(`📄 Found ${htmlFiles.length} release notes files:`);
        htmlFiles.forEach(file => console.log(`   - ${file}`));
        
    } catch (error) {
        console.error('❌ Error updating manifest:', error.message);
        process.exit(1);
    }
}

// Run the update
updateManifest();