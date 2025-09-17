import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { routeCommand, CommandResult } from '../router.js';
import { Result } from 'meow';

// Mock all external dependencies that the commands might use
jest.mock('../../auth/index.js', () => ({
  validateKey: jest.fn(),
  saveApiKey: jest.fn()
}));

jest.mock('../../utils/serverData.js', () => ({
  ServerData: {
    init: jest.fn().mockResolvedValue({
      getAvailableModels: jest.fn().mockReturnValue(['gpt-4', 'claude-3'])
    })
  }
}));

jest.mock('../../api/auth.js', () => ({
  default: jest.fn()
}));

describe('Command Rename: models → list-models', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.log output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Helper to create a mock CLI result
  function createMockCli(input: string[], flags: any = {}): Result<any> {
    return {
      input,
      flags,
      pkg: {},
      help: '',
      showHelp: jest.fn(),
      showVersion: jest.fn()
    } as Result<any>;
  }

  describe('New list-models command', () => {
    it('should route list-models command and exit successfully', async () => {
      const cli = createMockCli(['list-models']);
      
      const result: CommandResult = await routeCommand(cli);
      
      expect(result.shouldExit).toBe(true);
      expect(result.shouldWait).toBe(false);
      expect(result.exitCode).toBe(0);
    });

    it('should handle list-models command with additional flags', async () => {
      const cli = createMockCli(['list-models'], { verbose: true });
      
      const result: CommandResult = await routeCommand(cli);
      
      expect(result.shouldExit).toBe(true);
      expect(result.shouldWait).toBe(false);
      expect(result.exitCode).toBe(0);
    });
  });

  describe('Old models command', () => {
    it('should not route models command (should fall through to default)', async () => {
      const cli = createMockCli(['models']);
      
      const result: CommandResult = await routeCommand(cli);
      
      // Should fall through to default case (not handled by router)
      expect(result.shouldExit).toBe(false);
      expect(result.shouldWait).toBe(false);
      expect(result.exitCode).toBeUndefined();
    });

    it('should not route models command even with flags', async () => {
      const cli = createMockCli(['models'], { verbose: true });
      
      const result: CommandResult = await routeCommand(cli);
      
      // Should fall through to default case
      expect(result.shouldExit).toBe(false);
      expect(result.shouldWait).toBe(false);
    });
  });

  describe('Command routing verification', () => {
    it('should only respond to exact list-models command', async () => {
      // Test variations that should NOT trigger the command
      const variations = [
        'models',
        'list-model',  // singular
        'listmodels',  // no dash
        'list_models', // underscore
        'LIST-MODELS', // case sensitive
        'list-models-extra' // with suffix
      ];

      for (const variation of variations) {
        const cli = createMockCli([variation]);
        const result = await routeCommand(cli);
        
        // All these should fall through to default (not handled)
        expect(result.shouldExit).toBe(false);
      }

      // Test the exact command that SHOULD work
      const cli = createMockCli(['list-models']);
      const result = await routeCommand(cli);
      
      expect(result.shouldExit).toBe(true);
      expect(result.exitCode).toBe(0);
    });
  });

  describe('Command behavior differences', () => {
    it('should demonstrate the difference between old and new commands', async () => {
      // Old command should not be handled
      const oldCli = createMockCli(['models']);
      const oldResult = await routeCommand(oldCli);
      
      expect(oldResult.shouldExit).toBe(false);
      expect(oldResult.shouldWait).toBe(false);
      
      // New command should be handled
      const newCli = createMockCli(['list-models']);
      const newResult = await routeCommand(newCli);
      
      expect(newResult.shouldExit).toBe(true);
      expect(newResult.shouldWait).toBe(false);
      expect(newResult.exitCode).toBe(0);
      
      // Verify they behave differently
      expect(oldResult.shouldExit).not.toBe(newResult.shouldExit);
    });
  });

  describe('Regression test', () => {
    it('should verify that the command rename is complete', async () => {
      // This test ensures that the old 'models' command is completely removed
      // and the new 'list-models' command works as expected
      
      const testCases = [
        { command: 'models', shouldWork: false },
        { command: 'list-models', shouldWork: true }
      ];
      
      for (const testCase of testCases) {
        const cli = createMockCli([testCase.command]);
        const result = await routeCommand(cli);
        
        if (testCase.shouldWork) {
          expect(result.shouldExit).toBe(true);
          expect(result.exitCode).toBe(0);
        } else {
          expect(result.shouldExit).toBe(false);
        }
      }
    });
  });
});