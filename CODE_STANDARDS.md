# Mini Agent Workbench — Code Standards

## 1. General Principles

The project follows these principles:

1. Readability over cleverness.
2. Explicit types over implicit assumptions.
3. Simple implementations over premature abstractions.
4. Consistent conventions over personal preferences.
5. Clear responsibilities over excessive code reuse.
6. Correctness and maintainability over implementation speed.

All code should be understandable by the Project Owner.

Do not introduce abstractions, dependencies or patterns solely for hypothetical future requirements.

---

## 2. Naming Conventions

Use consistent naming across the project.

| Element | Convention | Example |
|---|---|---|
| React Components | PascalCase | AgentChat.tsx |
| Functions | camelCase | sendMessage() |
| Variables | camelCase | messageList |
| Types / Interfaces | PascalCase | AgentRequest |
| Constants | camelCase | maxRetryCount |
| Environment Variables | UPPER_SNAKE_CASE | LLM_API_KEY |
| Custom Hooks | use + PascalCase | useAgent() |
| Tool Modules | kebab-case | query-expenses.tool.ts |

### General Rules

- Use descriptive names.
- Avoid meaningless abbreviations.
- Boolean variables should communicate state, preferably using is, has, can or should.
- Event handlers should use handle prefixes where appropriate.
- Functions should describe their actions or return values.
- Avoid names that depend on implementation details rather than business meaning.

---

## 3. TypeScript Standards

TypeScript is the primary language for frontend, backend and shared contracts.

### Type Safety

- Avoid `any`.
- Use `unknown` for values with uncertain types.
- Avoid unnecessary type assertions.
- Allow local type assertions when supported by a clear and documented invariant.
- Prefer explicit return types for exported functions and important public APIs.
- Use type inference for straightforward local variables.
- Do not duplicate types that can be inferred from existing schemas.

### Type Modeling

- Prefer union types for finite state variations.
- Prefer literal types over unrestricted strings when the domain is known.
- Use generics when they express reusable type relationships.
- Avoid overly complex conditional or recursive types without a real requirement.
- Keep public types small and focused.

### Type and Interface

Use `type` and `interface` according to their purpose.

- Use `type` for unions, intersections and derived types.
- Use `interface` for object contracts when extension is useful.
- Do not introduce both forms for the same purpose without a reason.

### Runtime Validation

TypeScript types do not validate external runtime data.

Use Zod to validate:

- HTTP request bodies
- External API responses when necessary
- Model-generated tool arguments
- Environment configuration
- Other untrusted input

Never assume external data is valid merely because it has a TypeScript annotation.

---

## 4. React Standards

### Component Design

- Prefer functional components and Hooks.
- Organize components around business features and responsibilities.
- Avoid splitting components solely to reduce line count.
- Extract components when they have independent responsibilities, meaningful reuse or substantial internal complexity.
- Keep component Props explicit and meaningful.
- Avoid excessively large components.
- Do not introduce abstractions that make simple data flows harder to understand.

Component boundaries should reflect actual business responsibilities rather than arbitrary file-size limits.

### State Management

- Keep state as close as practical to where it is used.
- Lift state to the nearest common owner when sharing is required.
- Avoid duplicated state.
- Derive values from existing state instead of storing redundant copies.
- Use functional state updates when the next state depends on the previous state.

### Hooks

- Follow the Rules of Hooks.
- Keep Hooks at the top level of components or custom Hooks.
- Use custom Hooks to encapsulate reusable stateful behavior.
- Avoid creating custom Hooks for trivial one-line expressions.

### useEffect

Use effects primarily to synchronize React with external systems.

Examples:

- Event subscriptions
- Timers
- External browser APIs
- Third-party integrations

Avoid using useEffect for:

- Values that can be calculated during rendering
- Simple event-driven operations
- State synchronization that can be expressed through a direct state update

Always consider effect cleanup when subscriptions or external resources are involved.

### Performance

- Do not use memoization by default.
- Use React.memo, useMemo and useCallback when there is a concrete performance or referential-stability reason.
- Prefer measuring actual problems over speculative optimization.
- Use stable keys when rendering lists.

### Data Requests

- Keep HTTP request logic outside presentation components when appropriate.
- Represent asynchronous states clearly.
- Handle loading, success and error states.
- Avoid triggering duplicate requests unintentionally.
- Do not place server-side credentials in frontend code.

---

## 5. Node.js Backend Standards

### General Rules

- Use TypeScript and async/await.
- Keep asynchronous operations explicit.
- Validate external input at system boundaries.
- Handle rejected promises and unexpected errors.
- Avoid blocking operations in request-handling paths.
- Do not expose internal implementation details to API clients.

### Routes

Routes should focus on HTTP concerns:

- Receive requests
- Validate input
- Call application services
- Return appropriate responses

Avoid putting complex business logic directly in route handlers.

### Services

Services should focus on application workflows and business operations.

- Keep functions focused.
- Avoid unnecessary dependencies between services.
- Separate business logic from HTTP-specific details.
- Do not introduce service abstractions without a real responsibility.

### Configuration

- Read environment variables through a centralized configuration boundary when configuration is introduced.
- Validate required configuration at startup.
- Never hardcode credentials.
- Avoid scattering direct environment variable access throughout business logic.

### Error Handling

- Handle errors at the appropriate layer.
- Preserve useful debugging information internally.
- Return safe and meaningful error responses.
- Avoid silently swallowing exceptions.
- Do not use empty catch blocks without justification.
- Avoid introducing a complex custom error hierarchy prematurely.

---

## 6. Shared Contracts and Zod

The Contracts workspace uses Zod as the source of truth for shared runtime schemas.

### Rules

- Define shared request and response schemas in Contracts.
- Infer TypeScript types using `z.infer`.
- Avoid maintaining duplicate schema and type definitions.
- Keep shared schemas independent of frontend and backend implementation details.
- Keep server-specific internal schemas inside Server when they are not part of a shared boundary.

### Example

```ts
import { z } from 'zod'

export const AgentRequestSchema = z.object({
  message: z.string().min(1),
})

export type AgentRequest = z.infer<
  typeof AgentRequestSchema
>
```

### Validation Responsibilities

- Frontend validation improves user experience.
- Backend validation protects the system boundary.
- Backend validation is authoritative.

Never trust frontend validation alone.

---

## 7. Agent and Tool Development Standards

Agent-related code must distinguish probabilistic model behavior from deterministic program execution.

### Agent Runtime

- Keep the execution loop explicit.
- Define maximum execution steps.
- Define clear termination conditions.
- Handle model timeouts and invalid responses.
- Preserve useful execution traces.
- Avoid mixing HTTP handling with runtime logic.

### Tool Development

Every tool should have:

- A unique name
- A clear description
- An input schema
- A predictable execution function
- A defined result structure

### Security and Reliability

- Validate model-generated arguments before execution.
- Only execute explicitly registered tools.
- Do not execute arbitrary model-generated code.
- Handle tool failures independently.
- Do not assume the model always chooses a valid tool.
- Keep tool side effects explicit.

Tools should be deterministic where practical.

---

## 8. CSS and UI Standards

The project adopts Tailwind CSS as its primary styling approach.

### General Rules

- Prefer Tailwind utility classes for component styling.
- Keep styles close to the components they belong to.
- Avoid introducing CSS Modules or CSS-in-JS without a concrete requirement.
- Avoid excessive arbitrary values when existing utility classes are sufficient.
- Avoid excessively long and duplicated class strings.
- Extract reusable styling patterns when repetition becomes meaningful.
- Use responsive utilities for different viewport sizes.
- Ensure interactive elements communicate their state.

### Design Consistency

- Prefer consistent spacing, typography and color scales.
- Reuse design tokens when repeated values justify them.
- Avoid introducing arbitrary visual values throughout the application.
- Keep visual styling separate from business logic.

### Custom CSS

Custom CSS is allowed when Tailwind utilities are insufficient.

Appropriate use cases include:

- Global styles and resets
- Complex animations
- Third-party component overrides
- Specialized visual effects

Avoid using `@apply` as a default replacement for utility classes.

Do not introduce additional CSS frameworks or component libraries without approval.

---

## 9. Testing Standards

Tests should verify behavior, not merely implementation details.

The project adopts a core-logic-first testing strategy.

### Testing Priorities

Prioritize:

1. Shared schema validation
2. Utility functions
3. Business logic
4. Backend service behavior
5. Agent execution branches
6. Tool execution and failure handling
7. Important API behavior

UI tests should be added when interactions or state transitions have meaningful complexity or risk.

### Testing Rules

- Cover important normal and exceptional paths.
- Avoid tests that simply duplicate implementation logic.
- Avoid excessive mocking that hides integration problems.
- Keep tests independent and repeatable.
- Fix the implementation rather than weakening tests to obtain a passing result.
- Focus on meaningful behavior rather than test quantity.

Vitest is the planned testing framework when testing infrastructure is introduced.

Do not introduce arbitrary coverage percentage requirements at this stage.

---

## 10. Code Review Checklist

Before completing a task, review the following:

### Correctness

- Does the implementation meet the requirement?
- Are edge cases handled?
- Are asynchronous operations handled correctly?

### Type Safety

- Are types meaningful?
- Is `any` avoided?
- Is external input validated?

### Architecture

- Are module responsibilities clear?
- Are dependencies pointing in the correct direction?
- Is unnecessary abstraction avoided?

### Maintainability

- Are names descriptive?
- Is the code easy to understand?
- Is there unnecessary duplication?
- Are React components organized around meaningful responsibilities?
- Are Tailwind classes consistent and maintainable?

### Verification

- Does TypeScript checking pass?
- Does ESLint pass?
- Do relevant tests pass?
- Has the actual behavior been verified?

Report any checks that could not be executed.

---

## 11. Final Principle

Code standards exist to improve consistency and maintainability,
not to restrict reasonable engineering decisions.

Follow existing conventions where possible.

Introduce new patterns only when they solve a real problem.

**Write code that another developer can understand,
modify and maintain — including your future self.**
