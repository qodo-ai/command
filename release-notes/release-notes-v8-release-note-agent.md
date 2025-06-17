# Release Notes v8-release-note-agent

*Released: 2025-06-17*

[View on GitHub](https://github.com/qodo-ai/qodo-gen-cli/releases/tag/v8-release-note-agent)

## Summary

This release focuses on improving the CI/CD workflow for release notes generation with enhanced debugging capabilities, better error handling, and more robust validation processes. The changes ensure more reliable execution of the Qodo CLI release notes generator and provide better visibility into the workflow execution process.

## 🚀 Features

No new features were added in this release.

## 🐛 Bug Fixes

- **Enhanced CI Error Handling**: Fixed CI workflow execution by adding `continue-on-error` flag to prevent workflow failures from stopping the release notes generation process
- **Improved Workflow Validation**: Added comprehensive validation steps to check git state, tags, and repository status before executing release notes generation
- **Better Directory Verification**: Enhanced verification logic to properly check for the creation of the `release-notes` directory and provide detailed error messages when issues occur

## ⚠️ Breaking Changes

No breaking changes were introduced in this release.

## 📚 Documentation

No documentation changes were made in this release.

## ⚡ Performance

No performance improvements were made in this release.

## 🔧 Refactoring

- **Workflow Debugging Enhancement**: Refactored the GitHub Actions workflow to include extensive debugging information including git tags, status, current branch, and recent commits
- **Error Message Improvements**: Improved error messaging and validation logic in the release notes verification process

## 📦 Dependencies

No dependency changes were made in this release.

## 🔄 Other Changes

- **Added Comprehensive Logging**: Introduced detailed logging for git state validation including available tags, git status, current branch, and recent commits
- **Enhanced Debug Output**: Added debug steps to list directory contents and verify the presence of generated release notes files
- **Workflow Robustness**: Improved overall workflow reliability by adding proper error handling and validation at each step

## 🙏 Contributors

- **AdamWalker-112358** (@AdamWalker-112358) - Fixed CI error and enhanced workflow debugging

---

*This release notes file was generated automatically by the Qodo CLI release notes agent.*