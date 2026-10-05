# Kiro University Challenge - Video Script (2 MINUTES)
## Task Management API Demo

**Duration**: 2:00 minutes  
**Presenter**: Sanneela  
**Project**: Personal Task Management API  

---

## 🎬 OPENING (0:00 - 0:10)

**[SCREEN: Dashboard at http://localhost:3000/test]**

> "Hi! I'm Sanneela. This is my Kiro University Challenge - a Task Management API demonstrating all 7 lessons. Let's dive in!"

---

## 🎯 QUICK DEMO (0:10 - 0:25)

**[ACTION SEQUENCE - Fast and fluid]**
1. Register user → "demo@kiro.com"
2. Create task → "Kiro Challenge" - High priority
3. Update status → "in-progress"

**[SCREEN: Point to API Response JSON]**

> "Working API with authentication, task CRUD, and standard JSON responses. Now the 7 lessons."

---

## 📚 ALL 7 LESSONS (0:25 - 1:40)

### LESSON 1: SPEC (0:25 - 0:35)
**[SCREEN: .kiro/specs/task-management-api.md - scroll quickly]**

> "Lesson 1 - Complete feature spec with EARS notation. Every requirement defined: authentication, tasks, notifications, with acceptance criteria."

---

### LESSON 2: STEERING (0:35 - 0:45)
**[SCREEN: Show all 4 .kiro/steering/ files in split view]**

> "Lesson 2 - Four steering documents: API standards, security, error handling, and code style. Enforced automatically."

---

### LESSON 3: HOOKS (0:45 - 0:55)
**[SCREEN: .kiro/hooks/ folder - show all 3]**

> "Lesson 3 - Three hooks: review-writes validates code changes, lint-on-save, and test-after-task. Automated workflow."

---

### LESSON 4: PROPERTY TESTS (0:55 - 1:05)
**[SCREEN: tests/property/ - show priority-validation.test.js]**

> "Lesson 4 - Property-based testing with fast-check. Random inputs verify business rules - priority, status transitions, dates, email validation."

---

### LESSON 5: POWERS (1:05 - 1:13)
**[SCREEN: docs/mint.json]**

> "Lesson 5 - Mintlify power for API documentation. Complete endpoint reference, auth guides, generated from code."

---

### LESSON 6: MCP (1:13 - 1:20)
**[SCREEN: Mention MCP or show quick glimpse]**

> "Lesson 6 - Model Context Protocol configured for external integrations and webhooks."

---

### LESSON 7: CUSTOM AGENTS (1:20 - 1:40)
**[SCREEN: .kiro/agents/ - show all 3 agents quickly]**

> "Lesson 7 - Three custom agents: backend-dev with steering rules loaded, testing-agent for QA, docs-agent for documentation. Specialized AI teammates."

---

## 🏗️ ARCHITECTURE (1:40 - 1:50)

**[SCREEN: VS Code src/ folder expanded]**

> "Production architecture: controllers, services, repositories. Layered design, async/await, bcrypt security, JWT auth, SQL injection protection."

---

## 🌟 CLOSING (1:50 - 2:00)

**[SCREEN: Dashboard with overlay text showing all 7 lessons checked]**

> "All 7 Kiro lessons in one production-ready API. Built WITH Kiro. Check the code on GitHub - thanks for watching!"

**[TEXT OVERLAY:]**
```
✅ All 7 Kiro University Lessons
🚀 Production-Ready Code
📂 GitHub: [your-link]
#KiroUniversity #BuildWithKiro
```

---

## 🎥 RECORDING TIPS

**[SCREEN: Show test.html dashboard]**

> "Hi! I'm Sanneela, and this is my Kiro University Challenge submission - a complete Task Management API that demonstrates all 7 required lessons."

**[Quick pan across the beautiful dashboard interface]**

> "Let me show you what we've built, and more importantly, how Kiro helped me build it."

---

## 🎯 QUICK DEMO (0:15 - 0:45)

**[SCREEN: Test interface at http://localhost:3000/test]**

> "First, let's see the API in action."

**[ACTION: Register a new user]**
- Type: "demo@kiro.com"
- Password: "password123"
- Click "Register & Login"

> "User registration with bcrypt password hashing..."

**[ACTION: Create a task]**
- Title: "Submit Kiro Challenge"
- Priority: "High"
- Tags: "kiro, nodejs, api"
- Click "Create Task"

> "Task created! Notice the standardized JSON response format..."

**[SCREEN: Scroll to API Response section showing the JSON]**

> "...and here's the live task list with filtering, status updates, and delete operations."

**[ACTION: Update task status to "in-progress"]**

---

## 📚 LESSON 1: SPEC-DRIVEN DEVELOPMENT (0:45 - 0:55)

**[SCREEN: Open .kiro/specs/task-management-api.md in VS Code]**

> "Lesson 1 - Everything started with a comprehensive feature spec using EARS notation."

**[SCROLL: Show Requirements section with WHEN/THE SYSTEM SHALL]**

> "Every requirement is clearly defined: user authentication, task CRUD, notifications, with acceptance criteria and property tests built right into the spec."

---

## 📋 LESSON 2: STEERING DOCUMENTS (0:55 - 1:05)

**[SCREEN: Show .kiro/steering/ folder with 4 files]**

> "Lesson 2 - Four steering documents enforce our standards automatically."

**[CLICK: api-standards.md, briefly show the standard response format]**

> "API standards for consistent responses..."

**[CLICK: security-standards.md, show bcrypt example]**

> "Security best practices with bcrypt and JWT..."

**[QUICK FLASH: error-handling.md and code-style.md]**

> "...error handling patterns, and code style conventions."

---

## 🪝 LESSON 3: HOOKS (1:05 - 1:15)

**[SCREEN: Show .kiro/hooks/ folder with 3 files]**

> "Lesson 3 - Hooks automate our workflow."

**[CLICK: review-writes.json]**

> "This hook reviews every code change against our standards before it's written..."

**[SCREEN: Split screen showing hook trigger message from earlier]**

> "...see? It caught my changes and validated them in real-time."

**[QUICK FLASH: lint-on-save.json and test-after-task.json]**

> "Plus auto-linting on save and automatic testing after tasks."

---

## 🧪 LESSON 4: PROPERTY-BASED TESTING (1:15 - 1:25)

**[SCREEN: Show tests/property/ folder with 4 test files]**

> "Lesson 4 - Property-based testing using fast-check."

**[CLICK: priority-validation.test.js, show the code]**

> "This test generates random inputs and verifies that priority ONLY accepts low, medium, or high - never invalid values."

**[SCREEN: Show terminal running npm test]**

```bash
npm run test:property
```

**[Show: Tests passing with multiple iterations]**

> "Hundreds of random test cases, all passing."

---

## ⚡ LESSON 5: POWERS (1:25 - 1:35)

**[SCREEN: Show docs/mint.json]**

> "Lesson 5 - I used the Mintlify power to generate professional API documentation."

**[SCREEN: Show the mint.json navigation structure]**

> "Complete with endpoint references, authentication guides, and interactive examples - all generated from our code."

---

## 🔌 LESSON 6: MCP (1:35 - 1:40)

**[SCREEN: Show .kiro/settings/mcp.json or mention it]**

> "Lesson 6 - Model Context Protocol configured for external integrations and webhook notifications."

---

## 🤖 LESSON 7: CUSTOM AGENTS (1:40 - 1:50)

**[SCREEN: Show .kiro/agents/ folder with 3 agents]**

> "Lesson 7 - Three specialized custom agents."

**[CLICK: backend-dev.json]**

> "Backend-dev for API implementation..."

**[SHOW: The resources array with steering files]**

> "...automatically loaded with all our steering rules..."

**[QUICK FLASH: testing-agent.json and docs-agent.json]**

> "...a testing agent for QA, and a docs agent for documentation."

---

## 🏗️ ARCHITECTURE SHOWCASE (1:50 - 2:05)

**[SCREEN: VS Code Explorer showing src/ folder structure]**

> "The complete architecture: layered design with controllers, services, and repositories..."

**[EXPAND: src/ tree]**

```
src/
├── controllers/      # Request handlers
├── services/         # Business logic
├── repositories/     # Data access
├── middleware/       # Auth & validation
└── routes/          # API routes
```

> "...proper separation of concerns, async/await throughout, comprehensive error handling, and JWT authentication."

---

## 🔐 SECURITY HIGHLIGHTS (2:05 - 2:15)

**[SCREEN: Show src/services/authService.js - the bcrypt hashing code]**

> "Security first: bcrypt password hashing with 10 salt rounds..."

**[SCREEN: Show middleware/auth.js - JWT verification]**

> "...JWT token authentication..."

**[SCREEN: Show repositories - parameterized queries]**

> "...and parameterized queries preventing SQL injection. Every user can only access their own data."

---

## 📊 LIVE API TEST (2:15 - 2:35)

**[SCREEN: Back to test.html dashboard]**

> "Let's see everything working together."

**[ACTION SEQUENCE - Quick and smooth]**
1. Login as existing user
2. Create task: "Final Kiro Demo" - High priority
3. See it appear in task list instantly
4. Update status to "completed"
5. Check notifications

**[SCREEN: API Response panel showing JSON responses]**

> "Every operation returns consistent JSON - success status, data payload, and error handling."

**[ACTION: Deliberately create invalid task with empty title]**

> "And look - validation errors with field-level details, exactly as specified in our API standards."

---

## 🎯 ROOT ENDPOINT (2:35 - 2:45)

**[SCREEN: Browser - navigate to http://localhost:3000]**

> "The API root returns a complete endpoint map in JSON..."

**[SHOW: The JSON response with all endpoint listings]**

```json
{
  "success": true,
  "data": {
    "name": "Task Management API",
    "endpoints": {
      "test_interface": "http://localhost:3000/test",
      "auth": { ... },
      "tasks": { ... }
    }
  }
}
```

> "...while the test interface lives at /test."

---

## 🌟 CLOSING (2:45 - 3:00)

**[SCREEN: Quick montage showing all 7 lesson folders]**

> "So there you have it - all 7 Kiro University lessons in one complete project:"

**[TEXT OVERLAY as you speak]:**
```
✅ Lesson 1: Spec-driven Development
✅ Lesson 2: Steering Documents  
✅ Lesson 3: Hooks
✅ Lesson 4: Property-based Testing
✅ Lesson 5: Powers (Mintlify)
✅ Lesson 6: MCP Configuration
✅ Lesson 7: Custom Agents
```

**[SCREEN: Back to beautiful dashboard with tasks displayed]**

> "A production-ready Task Management API built WITH Kiro, demonstrating WHY Kiro is the future of development."

**[FINAL SCREEN: Show project structure in VS Code with all folders visible]**

> "Check out the full code on GitHub. Thanks for watching, and happy building with Kiro!"

**[FADE TO: GitHub repository URL or project info]**

---

## 📝 ALTERNATIVE SHORTER VERSION (1:30 total)

If you need to stay under 2 minutes, here's a condensed version:

### OPENING (0:00 - 0:10)
- Quick intro
- Show dashboard

### LIVE DEMO (0:10 - 0:30)
- Register user
- Create task
- Update status
- Show API responses

### ALL 7 LESSONS RAPID-FIRE (0:30 - 1:15)
- **5 seconds each lesson** - Show folder, explain in one sentence:
  - Lesson 1: "Comprehensive spec with EARS notation"
  - Lesson 2: "Four steering files for standards"
  - Lesson 3: "Three hooks automating workflow"
  - Lesson 4: "Property tests with fast-check"
  - Lesson 5: "Mintlify power for docs"
  - Lesson 6: "MCP for integrations"
  - Lesson 7: "Three custom agents"

### CLOSING (1:15 - 1:30)
- Quick architecture overview
- Final message
- CTA

---

## 🎥 FILMING TIPS

### Before Recording:
1. **Clear browser cache** - Fresh API responses
2. **Restart server** - `npm start` running cleanly
3. **Prepare test data** - Know exactly what you'll type
4. **Close unnecessary apps** - Clean desktop
5. **Zoom settings** - VS Code font size 16+, browser at 125%

### Recording Settings:
- **Screen resolution**: 1920x1080
- **Frame rate**: 30fps minimum
- **Audio**: Clear microphone, no background noise
- **Cursor**: Enable cursor highlighting if possible

### Pacing:
- Speak **clearly and confidently**
- **Pause briefly** between sections (editing will tighten)
- **Don't rush** - Better to be clear than fast
- If you make a mistake, **pause 3 seconds** and restart that section

### Energy:
- **Smile** - It comes through in your voice!
- **Enthusiasm** - You built something awesome!
- **Confidence** - You know this project inside and out

---

## 🎬 SHOT LIST / RECORDING CHECKLIST

### Setup Checklist:
- [ ] Server running (`npm start`)
- [ ] Browser at `http://localhost:3000/test`
- [ ] VS Code open with project
- [ ] Terminal ready
- [ ] Test credentials ready
- [ ] All folders expanded in VS Code for quick access

### Record These Screens:
1. [ ] Dashboard home page
2. [ ] Registration flow
3. [ ] Task creation
4. [ ] Task list with filtering
5. [ ] API response panel
6. [ ] Each lesson folder in VS Code
7. [ ] Test files running
8. [ ] docs/mint.json
9. [ ] Project structure overview
10. [ ] Final dashboard with completed demo

### B-Roll Options (Optional):
- Terminal showing `npm test` passing
- VS Code IntelliSense showing code completion
- Git commits showing Kiro's changes
- Quick code snippets (bcrypt, JWT, validation)

---

## 🎯 KEY MESSAGES TO EMPHASIZE

1. **"Built WITH Kiro"** - not just documented in Kiro
2. **"Production-ready"** - real authentication, validation, security
3. **"All 7 lessons"** - comprehensive demonstration
4. **"Working code"** - live demo, not mockups
5. **"Proper architecture"** - professional structure

---

## 📤 AFTER RECORDING

### Video Editing:
- Add **lesson number overlays** (Lesson 1, Lesson 2, etc.)
- Add **timestamps** in description
- Include **background music** (soft, non-distracting)
- Add **text callouts** for key features
- Include **zoom-ins** on important code sections

### Description Template:
```
Kiro University Challenge Submission - Task Management API

This video demonstrates all 7 required lessons through a fully functional Task Management API built with Kiro:

⏱️ TIMESTAMPS:
0:00 - Introduction & Live Demo
0:45 - Lesson 1: Spec-driven Development
0:55 - Lesson 2: Steering Documents
1:05 - Lesson 3: Hooks
1:15 - Lesson 4: Property-based Testing
1:25 - Lesson 5: Powers (Mintlify)
1:35 - Lesson 6: MCP Configuration
1:40 - Lesson 7: Custom Agents
1:50 - Architecture & Security
2:35 - Final Demo & Closing

🚀 PROJECT FEATURES:
✅ JWT Authentication
✅ Task CRUD with filtering
✅ Notification system
✅ Property-based testing
✅ Security best practices
✅ Standard API responses
✅ Comprehensive documentation

📂 GitHub Repository: [Your URL]

#KiroUniversity #BuildWithKiro #API #NodeJS #JWT #RESTful
```

---

## 🎊 YOU'VE GOT THIS!

Remember:
- **You built something real** - Be proud!
- **You learned Kiro** - Show it off!
- **You completed the challenge** - Confidence!

Good luck with your submission! 🚀
