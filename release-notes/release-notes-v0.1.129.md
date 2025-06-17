# Release Notes v0.1.129

*Released: 2025-06-16*

[View on GitHub](https://github.com/qodo-ai/qodo-cli/releases/tag/v0.1.129)

## Summary

This release introduces a comprehensive automated release notes generation system and includes various documentation improvements and configuration updates. The major highlight is the new release notes agent that automatically generates professional release notes from GitHub pull requests and commits.

## 🚀 Features

- **Automated Release Notes Generation**: Added a complete release notes generation system with both markdown and HTML output formats
  - New release notes agent with comprehensive templates and styling
  - GitHub workflow for automatic release notes generation on new releases
  - Professional HTML output with tabbed navigation and responsive design
  - Integration with release-notes-website branch for publishing

## 🐛 Bug Fixes

*No bug fixes in this release.*

## ⚠️ Breaking Changes

*No breaking changes in this release.*

## 📚 Documentation

- **README Improvements**: Fixed grammar and formatting issues in the main README
  - Corrected "Qodo Merge, and Qodo Aware" to "Qodo Merge and Qodo Aware"
  - Simplified agent configuration documentation
  - Updated configuration file references for consistency
- **Agent Configuration Updates**: Various improvements to agent TOML files
  - Fixed typos in agent descriptions and instructions
  - Updated output schema property names for consistency
  - Improved error handling in test generation agents

## ⚡ Performance

*No performance improvements in this release.*

## 🔧 Refactoring

- **Build Configuration**: Streamlined Docker and npm configurations
  - Simplified .dockerignore and .npmignore files
  - Removed unnecessary build dependencies and scripts
  - Cleaned up package.json dependencies

## 📦 Dependencies

- **Package Updates**: Reverted some dependency versions for stability
  - Restored eventsource to v4.0.0
  - Removed unnecessary tar and yaml dependencies
  - Cleaned up package-lock.json inconsistencies

## 🔄 Other Changes

- **Configuration Cleanup**: Removed obsolete configuration files and examples
  - Deleted unused YAML agent example
  - Removed ripgrep binary and download scripts (now using bundled version)
  - Cleaned up test configuration files
- **Workflow Improvements**: Enhanced GitHub Actions workflows
  - Added release notes generation workflow
  - Improved CI pipeline configuration

## 🙏 Contributors

- **AdamWalker-112358** (@AdamWalker-112358) - Release notes system implementation and documentation improvements

---

*This release notes file was generated automatically by the Qodo CLI release notes agent.*