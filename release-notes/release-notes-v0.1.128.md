# Release Notes v0.1.128

*Released: 2025-06-17*

[View on GitHub](https://github.com/qodo-ai/qodo-gen-cli/releases/tag/v0.1.128)

## Summary

This release introduces automated release notes generation capabilities and includes several important bug fixes and improvements. The major addition is a comprehensive release notes agent that can automatically generate professional release notes from GitHub pull requests, along with workflow improvements and documentation updates.

## 🚀 Features

- **Release Notes Agent**: Added a comprehensive release notes generation agent that automatically creates professional release notes by analyzing GitHub PRs merged since the last version
- **Release Notes Workflow**: Implemented GitHub Actions workflow for automated release notes generation and publishing to a dedicated website branch
- **HTML and Markdown Templates**: Added professional templates for both HTML and Markdown release notes with modern styling and tabbed navigation

## 🐛 Bug Fixes

- **Double Action Running**: Fixed issue with GitHub Actions running duplicate workflows
- **CI Error Handling**: Improved error handling in CI pipeline and fixed various CI-related issues
- **Repository Configuration**: Fixed repository name typos and configuration issues in release notes workflow
- **Workflow Triggers**: Removed unnecessary push triggers and optimized workflow execution

## ⚠️ Breaking Changes

None in this release.

## 📚 Documentation

- **Spelling and Grammar**: Fixed numerous spelling and grammar issues across agent configurations and documentation
- **README Updates**: Improved documentation clarity and fixed grammatical errors
- **Agent Configuration**: Updated agent configuration documentation and examples

## ⚡ Performance

None in this release.

## 🔧 Refactoring

- **Workflow Optimization**: Reordered release notes workflow steps for better efficiency
- **Configuration Cleanup**: Simplified release notes workflow by improving repository checkout process
- **Agent Structure**: Improved agent configuration structure and organization

## 📦 Dependencies

- **Package Updates**: Updated various package dependencies and configurations
- **Build Process**: Improved build process and dependency management

## 🔄 Other Changes

- **CI/CD Improvements**: Enhanced continuous integration and deployment processes
- **Workflow Management**: Added verification steps and improved environment variable handling
- **Branch Management**: Improved branch handling and merge processes

## 🙏 Contributors

- **AdamWalker-112358**: Release notes agent implementation, workflow fixes, and CI improvements
- **Ori Kotek**: Workflow optimization, bug fixes, and repository management
- **runner**: Automated spelling and grammar corrections

---

*This release notes file was generated automatically by the Qodo CLI release notes agent.*