# Kiro Hooks - Lesson 3

This directory contains automation hooks that demonstrate Lesson 3 of the Kiro University Challenge.

## Created Hooks

### 1. Lint on Save (lint-on-save.json)
**Trigger**: `PostFileSave`  
**Matcher**: `\.(js|ts)$`  
**Action**: Command - `npm run lint -- --fix`

Automatically runs ESLint with auto-fix on all JavaScript and TypeScript files when they are saved. This ensures code quality and consistent formatting throughout the project.

**How it works:**
- When you save any `.js` or `.ts` file
- The hook triggers and runs the linter
- Code is automatically formatted and fixed where possible
- Any remaining lint errors are reported

### 2. Run Tests After Task (test-after-task.json)
**Trigger**: `PostTaskExec`  
**Action**: Command - `npm test`

Automatically runs the complete test suite after completing any spec task. This ensures that each implementation step is verified before moving forward.

**How it works:**
- When a spec task is marked as completed
- The hook triggers and runs all tests
- Test results are displayed
- Helps catch regressions early

### 3. Review File Writes (review-writes.json)
**Trigger**: `PreToolUse`  
**Matcher**: `fs_write|str_replace`  
**Action**: Agent prompt

Reviews all file write operations before they happen to ensure code follows project standards from the steering files.

**How it works:**
- Before Kiro writes to a file (fs_write or str_replace)
- The hook triggers an agent review
- Agent checks compliance with:
  - API response standards
  - Error handling patterns
  - Security best practices
  - Code style guidelines
- Only proceeds if standards are met

## Testing the Hooks

### Test lint-on-save:
1. Edit any `.js` file in the project
2. Save the file
3. Watch the linter run automatically
4. See formatting corrections applied

### Test test-after-task:
1. Work in a spec session
2. Complete a task
3. Watch tests run automatically
4. See test results

### Test review-writes:
1. Try to create or modify a file using Kiro
2. The agent will review the code first
3. Ensures compliance with steering standards

## Hook Configuration

All hooks follow the v2 format:
```json
{
  "version": "v1",
  "hooks": [{
    "name": "Hook Name",
    "trigger": "TriggerType",
    "matcher": "optional-regex",
    "action": {
      "type": "command|agent",
      "command": "shell command",
      "prompt": "agent prompt"
    }
  }]
}
```

## Available Triggers

- `SessionStart` - When a new session begins
- `Stop` - When agent execution completes
- `UserPromptSubmit` - When user sends a message
- `PreToolUse` - Before a tool is executed
- `PostToolUse` - After a tool is executed
- `PreTaskExec` - Before a spec task starts
- `PostTaskExec` - After a spec task completes
- `PostFileSave` - When a file is saved
- `PostFileCreate` - When a file is created
- `PostFileDelete` - When a file is deleted

## Notes

- Hooks are activated on session start
- Command hooks receive session context via stdin
- Agent hooks inject prompts into the model context
- Exit codes matter for command hooks:
  - `0` = success
  - `2` = block action (for Pre* triggers)
  - other = silent failure

## Lesson 3 Demonstration

These hooks demonstrate:
✅ **Automation**: Repetitive tasks run automatically  
✅ **Quality**: Code is linted and tested automatically  
✅ **Consistency**: Standards are enforced via agent review  
✅ **Workflow Integration**: Hooks work seamlessly with Kiro  
✅ **Productivity**: Reduces manual steps and prevents errors
