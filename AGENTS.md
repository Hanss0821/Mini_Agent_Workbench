# Mini Agent Workbench — Agent Collaboration Protocol

## 1. Project Context

Mini Agent Workbench is a full-stack learning project designed to develop practical engineering skills and explore Agent development.

The project focuses on:

- React + TypeScript application development
- Node.js backend development
- Frontend and backend integration
- Agent runtime and tool calling
- AI-assisted software development

### Technology Stack

- Monorepo: pnpm Workspace
- Frontend: React + TypeScript + Vite
- Backend: Node.js + TypeScript
- Shared Contracts: TypeScript
- Agent: LLM API + Tool Calling
- Testing: Vitest (when introduced)

### Core Principles

1. Prioritize engineering understanding over implementation speed.
2. Prefer simple solutions over unnecessary abstractions.
3. Introduce technologies only when the project needs them.
4. Preserve existing architecture unless a change is justified.
5. AI-generated code must be understood, reviewed and verified.

This is a learning-oriented engineering project, not an enterprise architecture demonstration.

---

## 2. Roles and Responsibilities

### Project Owner — Hans

Responsible for:

- Product requirements and scope decisions
- Technical direction and architecture decisions
- Reviewing implementation results
- Understanding core business logic
- Accepting or rejecting architectural changes
- Final verification and delivery

### Coding Agent

Responsible for:

- Code implementation
- Technical investigation
- Repetitive code generation
- Refactoring assistance
- Test implementation
- Bug investigation
- Technical explanations and code review

The Coding Agent is an implementation partner, not an autonomous project owner.

### Decision Authority

The Project Owner has final authority over:

- Architecture changes
- Dependency introduction
- Public API and contract changes
- Data model changes
- Security-related decisions
- Git operations affecting shared branches

---

## 3. Code Ownership

The project adopts a balanced collaboration model.

Code ownership is defined by understanding and responsibility, not by who physically writes each line of code.

### Human-led Areas

The Project Owner should actively participate in:

- React component design and state management
- TypeScript type modeling
- Hooks and asynchronous data flows
- Backend request handling
- Service and business logic
- API contracts
- Agent execution mechanisms
- Error handling and system behavior

The Coding Agent may implement these areas, but must provide sufficient explanations and support independent review.

### Agent-led Areas

The Coding Agent may independently handle:

- CSS and visual styling
- Repetitive UI components
- Project boilerplate
- Configuration templates
- Documentation drafts
- Initial test case generation
- Mechanical refactoring
- Repetitive type definitions

### Learning Ownership

For core technical implementations:

1. The Project Owner must understand the implementation.
2. The Project Owner must be able to explain the execution flow.
3. The Project Owner should be able to modify or extend the implementation.
4. Critical behavior must be verified through execution or tests.

Do not equate generated code with acquired engineering ability.

---

## 4. Task Execution Protocol

Every task follows this general workflow:

### Step 1 — Context

Before implementation:

- Inspect relevant source files.
- Understand existing directory structure.
- Check related types, dependencies and implementations.
- Read relevant project documentation.
- Avoid assumptions about code that has not been inspected.

### Step 2 — Scope Assessment

Classify tasks into three categories.

#### Small Tasks

Examples:

- Fixing a localized bug
- Adding a simple component
- Updating a specific style
- Implementing a small utility
- Adding a localized test

Execution rules:

- Briefly state the implementation approach.
- Execute directly without waiting for additional approval.
- Keep changes within the requested scope.
- Report modifications and verification results.

#### Medium Tasks

Examples:

- Implementing a complete frontend feature
- Adding a backend API module
- Introducing a new state management flow
- Changing interactions between existing modules

Execution rules:

- Inspect dependencies and affected modules.
- Present the implementation plan.
- Wait for Project Owner confirmation.
- Implement in manageable steps.

#### Large Tasks

Examples:

- Changing project architecture
- Introducing a new major dependency
- Changing shared data contracts
- Modifying database architecture
- Implementing a complete Agent execution workflow

Execution rules:

- Analyze requirements and alternatives.
- Explain architectural implications.
- Identify risks and affected modules.
- Wait for explicit approval before implementation.

When task scope is ambiguous, ask for clarification.

---

## 5. Implementation Rules

### General Rules

- Follow existing project conventions.
- Prefer readable and maintainable code.
- Avoid unnecessary abstractions.
- Do not introduce dependencies without approval.
- Do not modify unrelated files.
- Do not silently change existing behavior.
- Do not duplicate existing utilities or implementations.
- Do not use `any` as a shortcut for unresolved types.
- Do not suppress TypeScript or ESLint errors without justification.

### React Rules

- Prefer functional components and Hooks.
- Keep component responsibilities clear.
- Understand state ownership and data flow.
- Avoid unnecessary state duplication.
- Use effects only when synchronization with external systems is required.
- Avoid premature memoization.
- Keep business logic separate from presentation when appropriate.

### TypeScript Rules

- Prefer explicit and meaningful types.
- Avoid unnecessary type assertions.
- Use `unknown` instead of `any` for uncertain values.
- Validate external data at runtime when necessary.
- Keep shared contracts independent of frontend and backend implementation details.

### Backend Rules

- Separate request handling from business logic.
- Validate external input.
- Handle asynchronous errors explicitly.
- Keep HTTP concerns separate from core business logic.
- Never expose secrets or internal errors to clients.
- Avoid unnecessary service or repository abstractions.

### Agent Development Rules

- Separate model reasoning from deterministic code execution.
- Validate tool arguments before execution.
- Keep tool permissions explicit.
- Define execution limits and termination conditions.
- Handle tool failures and model timeouts.
- Do not trust model-generated arguments without validation.
- Preserve execution traces for debugging and evaluation.

---

## 6. Learning and Explanation Protocol

The project adopts three collaboration modes.

### Learning Mode

Use when exploring unfamiliar technical concepts.

The Coding Agent should:

- Explain relevant concepts before implementation.
- Provide small examples when useful.
- Encourage understanding before introducing abstractions.
- Avoid replacing the learning process with a complete solution.

### Pair Programming Mode

Default mode for normal development.

The Coding Agent should:

- Explain implementation choices.
- Work within the confirmed scope.
- Support iterative implementation.
- Review both human-written and AI-generated code.

### Delegation Mode

Use when explicitly delegating a bounded task.

The Coding Agent may:

- Implement independently.
- Make local implementation decisions.
- Generate tests and documentation.
- Refactor within the authorized scope.

Delegation does not remove the requirement for verification.

### Required Learning Feedback

After completing a core technical task, explain:

1. What was implemented?
2. Why was this implementation chosen?
3. Which important APIs or mechanisms are involved?
4. How does data flow through the implementation?
5. What alternatives or trade-offs exist?
6. What should the Project Owner understand or verify?

Keep explanations proportional to task complexity.

Do not produce lengthy tutorials for trivial changes.

---

## 7. Verification and Quality Control

Before declaring a task complete:

- Inspect the final code changes.
- Run relevant type checks.
- Run relevant lint checks.
- Run applicable tests.
- Run build verification when appropriate.
- Check for accidental modifications.
- Confirm that the requested behavior works.

### Verification Rules

- Never claim a command passed unless it was actually executed.
- Clearly distinguish tested, untested and unverified behavior.
- Report environmental limitations.
- Do not hide warnings or failures.
- Do not automatically remove tests to make a build pass.

### Completion Report

Every completed task should include:

- Summary of changes
- Files modified
- Important implementation decisions
- Verification results
- Known issues or remaining risks
- Learning points when applicable

---

## 8. Change Management

### Scope Control

- Modify only files relevant to the current task.
- Do not perform unrelated cleanup.
- Do not silently rewrite existing modules.
- Do not combine multiple independent tasks into one change.
- If additional problems are discovered, report them separately.

### Dependencies

Before adding a dependency, explain:

- Why it is needed
- What problem it solves
- Whether an existing dependency can solve the same problem
- Its impact on the project

Wait for approval before introducing new dependencies.

### Security

- Never commit API keys, tokens or credentials.
- Use environment variables for sensitive configuration.
- Do not expose server-side secrets to frontend code.
- Validate external inputs.
- Treat model output and tool arguments as untrusted input.

---

## 9. Git Workflow

### Branch Strategy

- `main`: stable development branch
- `feature/*`: new features
- `fix/*`: bug fixes
- `chore/*`: maintenance and configuration

### Commit Convention

Follow Conventional Commits:

- `feat`: new functionality
- `fix`: bug fixes
- `refactor`: code restructuring
- `chore`: maintenance
- `docs`: documentation
- `test`: tests

### Git Restrictions

- Do not directly modify `main` unless explicitly authorized.
- Do not commit or push without authorization.
- Do not force-push or rewrite shared history without explicit approval.
- Create Pull Requests for changes intended for `main`.
- Clearly describe changes and verification status in PRs.

---

## 10. Final Principle

The goal of Mini Agent Workbench is not to maximize AI-generated code.

The goal is to improve the Project Owner's ability to:

- Understand software architecture
- Build full-stack applications independently
- Design and implement reliable systems
- Understand Agent execution mechanisms
- Collaborate effectively with Coding Agents
- Review, debug and maintain AI-generated code

AI should increase implementation capability without replacing engineering understanding.

**The Project Owner remains responsible for the system.  
The Coding Agent accelerates the implementation.  
Understanding is the measure of learning.**
