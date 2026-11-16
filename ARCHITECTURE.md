# Mini Agent Workbench — Architecture

## 1. Architecture Overview

Mini Agent Workbench adopts a lightweight full-stack architecture based on pnpm Workspace.

The system consists of three primary workspaces:

- **Web**: Frontend application and user interaction
- **Server**: HTTP APIs, application services and Agent runtime
- **Contracts**: Shared data contracts and runtime validation schemas

### Architecture Principles

1. Keep module responsibilities explicit.
2. Maintain one-way dependency relationships.
3. Keep frontend and backend independently executable.
4. Use shared contracts to define communication boundaries.
5. Separate Agent execution from application-level orchestration.
6. Prefer simple architecture and evolve only when necessary.
7. Keep model reasoning separate from deterministic execution.

This project does not adopt microservices or distributed architecture. The architecture should remain small enough for the Project Owner to understand the complete execution flow.

---

## 2. Monorepo Structure

```text
Mini_Agent_Workbench/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── components/
│   │       ├── features/
│   │       ├── lib/
│   │       ├── App.tsx
│   │       └── main.tsx
│   │
│   └── server/
│       └── src/
│           ├── routes/
│           ├── services/
│           ├── agent/
│           │   ├── runtime.ts
│           │   └── provider.ts
│           ├── tools/
│           │   ├── registry.ts
│           │   └── definitions/
│           └── server.ts
│
├── packages/
│   └── contracts/
│       └── src/
│           ├── index.ts
│           ├── api.ts
│           └── agent.ts
│
├── package.json
├── pnpm-workspace.yaml
├── AGENTS.md
└── ARCHITECTURE.md
```

The directory structure is a target organization, not a requirement to create every directory in advance. Create modules and directories only when actual functionality requires them.

---

## 3. Workspace Responsibilities

### 3.1 Web — Frontend Application

**Technology:** React, TypeScript, Vite

Responsibilities:

- Render the user interface.
- Manage client-side interaction state.
- Collect user input.
- Communicate with backend APIs.
- Display Agent responses and execution traces.
- Handle loading, error and empty states.

Restrictions:

- Must not directly access server-side secrets.
- Must not call LLM providers using private API keys.
- Must not execute backend business logic.
- Must not duplicate backend authoritative state.

Frontend state should remain local to components when practical. Introduce global state management only when shared state complexity justifies it.

### 3.2 Server — Backend Application

**Technology:** Node.js, TypeScript, Fastify, Zod for request validation through shared Contracts.

Responsibilities:

- Expose HTTP APIs.
- Validate incoming requests.
- Execute application services.
- Manage Agent execution.
- Register and execute tools.
- Communicate with LLM providers.
- Handle errors and execution limits.

The Server adopts a simple internal structure:

**Routes → Services → Agent / Tools**

#### Routes

Responsible for:

- HTTP endpoint definitions
- Request and response handling
- Request validation
- Calling application services

Routes should remain lightweight. Business logic should not be implemented directly inside route handlers.

#### Services

Responsible for:

- Application-level business operations
- Coordinating internal modules
- Managing application workflows
- Calling Agent Runtime when required

Services act as the application orchestration layer.

#### Agent Runtime

Responsible for:

- Agent execution loop
- Model interaction orchestration
- Tool-call processing
- Execution history
- Maximum execution steps
- Termination conditions

Agent Runtime is an independent internal module. It must not be tightly coupled to HTTP route implementations and should be callable by application services.

#### Tools

Responsible for:

- Tool definitions
- Tool registration
- Parameter validation
- Tool execution
- Tool result formatting

Tool execution must be controlled by the backend. The Agent Runtime coordinates tool execution through the tool registry.

### 3.3 Contracts — Shared Contracts

**Technology:** TypeScript, Zod

Responsibilities:

- Define frontend/backend request schemas.
- Define frontend/backend response schemas.
- Define shared business types.
- Provide runtime validation schemas.
- Export TypeScript types inferred from Zod schemas.

Example:

```ts
import { z } from 'zod'

export const AgentRequestSchema = z.object({
  message: z.string().min(1),
})

export type AgentRequest = z.infer<
  typeof AgentRequestSchema
>
```

Rules:

1. Use Zod schemas as the source of truth for shared runtime contracts.
2. Infer TypeScript types through `z.infer` where applicable.
3. Avoid maintaining duplicated schema and type definitions.
4. Keep contracts independent of frontend and backend implementations.
5. Server-side validation remains authoritative.

Restrictions:

- Must not depend on Web.
- Must not depend on Server.
- Must not contain UI components.
- Must not contain database implementation details.
- Must not contain business execution logic.

Contracts describe what modules exchange, not how those modules implement their behavior.

---

## 4. Dependency Rules

The project follows a one-way workspace dependency relationship.

```text
       Web
        |
        v
    Contracts
        ^
        |
      Server
```

Rules:

1. Web may depend on Contracts.
2. Server may depend on Contracts.
3. Contracts must not depend on Web or Server.
4. Web must not import Server implementation modules.
5. Server must not depend on frontend implementation details.
6. No circular workspace dependencies.

Shared Contracts define the communication boundary between frontend and backend.

Within Server, maintain the following responsibility direction:

```text
Routes
   |
   v
Services
   |
   v
Agent Runtime
   |
   +------> Model Provider
   |
   +------> Tool Registry
                |
                v
          Tool Execution
```

Internal modules should avoid circular dependencies. Dependencies should be passed explicitly when required.

---

## 5. Communication Architecture

The frontend communicates with the backend through HTTP APIs.

Initial communication pattern:

**Request → Response**

Streaming communication may be introduced later if Agent execution requires incremental output.

### Request Flow

```text
User Interaction
       |
       v
React Component
       |
       v
API Client
       |
       v
HTTP Request
       |
       v
Server Route
       |
       v
Zod Validation
       |
       v
Application Service
       |
       v
Business / Agent Execution
       |
       v
HTTP Response
       |
       v
React State Update
```

### API Responsibilities

- Frontend is responsible for request initiation and presentation.
- Backend is responsible for request validation and execution.
- Contracts define the communication data structure.
- Backend owns authoritative execution results.

The frontend may use shared Zod schemas for early input validation. However, client-side validation must never replace server-side validation.

---

## 6. Agent Runtime Architecture

The Agent Runtime is hosted inside the Server application. It is an independent module, not an independent microservice.

The browser interacts with the Agent only through backend APIs.

### Module Responsibilities

#### Agent Runtime

Coordinates the complete execution lifecycle.

#### Model Provider

Handles communication with external LLM providers.

Responsible for:

- Model API requests
- Model response normalization
- Provider-specific communication
- Model errors and timeouts

Provider-specific implementation details should not leak into application services.

#### Tool Registry

Responsible for:

- Registering available tools
- Resolving tool names
- Validating tool arguments
- Dispatching tool execution
- Returning execution results

#### Tool Definitions

Each tool defines:

- Tool name
- Description
- Input schema
- Execution implementation
- Result format

### Execution Flow

```text
User Request
     |
     v
Agent Service
     |
     v
Agent Runtime
     |
     v
Model Provider
     |
     v
Model Decision
     |
     +--------------------+
     |                    |
     v                    v
Final Response        Tool Call
                          |
                          v
                    Tool Registry
                          |
                          v
                    Resolve Tool
                          |
                          v
                    Validate Arguments
                          |
                          v
                    Execute Tool
                          |
                          v
                    Tool Result
                          |
                          v
                    Return to Model
                          |
                          v
                     Next Decision
                          |
                          v
                    Final Response
```

### Runtime Responsibilities

The Agent Runtime must control:

- Tool availability
- Tool argument validation
- Tool execution
- Execution history
- Maximum execution steps
- Termination conditions
- Model and tool errors

### Important Boundary

The LLM decides what action to request. The backend decides whether that action is allowed and performs the actual execution.

Model output is untrusted input. Never execute arbitrary code generated by the model.

---

## 7. State Ownership

Different types of state belong to different layers.

### Frontend State

Examples:

- Input content
- Selected conversation
- Loading status
- Display preferences
- Temporary UI state

### Backend Execution State

Examples:

- Current Agent execution
- Tool-call records
- Execution status
- Model responses
- Runtime errors

### Persistent State

Persistent storage may be introduced when required.

Examples:

- Conversation history
- Execution history
- User configuration

Do not introduce a database solely for architectural completeness. The initial implementation may use in-memory storage when persistence is not required.

State ownership must remain explicit. Avoid maintaining multiple competing sources of truth.

---

## 8. Error Handling

Errors should be handled at the layer where they occur.

### Frontend

Responsible for:

- Network failures
- Request timeouts
- User-facing error messages
- Loading state recovery

### Routes

Responsible for:

- HTTP request validation errors
- HTTP response formatting
- Mapping application errors to appropriate responses

### Services

Responsible for:

- Business operation failures
- Application workflow errors
- Handling errors from internal modules

### Agent Runtime

Responsible for:

- Invalid tool arguments
- Tool execution failures
- Maximum-step exhaustion
- Model timeout
- Invalid model responses

Internal errors should be logged appropriately. Sensitive implementation details must not be exposed to clients.

---

## 9. Security Boundaries

- LLM API keys must remain on the server.
- Environment variables must be used for secrets.
- Frontend code must never contain private credentials.
- External inputs must be validated.
- Tool execution must follow an explicit allowlist.
- Model-generated arguments must be validated before execution.
- Tool permissions must be explicitly defined.
- Sensitive information must not be written to logs unnecessarily.

---

## 10. Architecture Evolution

Architecture should evolve according to actual requirements.

The following capabilities are not mandatory in the initial implementation:

- Global state management libraries
- Database and ORM
- Redis
- Message queues
- Vector databases
- Multi-Agent orchestration
- Microservices
- Streaming responses
- Container orchestration

Introduce these capabilities only when a concrete requirement justifies them.

Every significant architectural change should explain:

1. The problem being solved
2. Why the current design is insufficient
3. The proposed solution
4. The affected modules
5. The trade-offs

Do not create abstractions solely for hypothetical future requirements.

---

## 11. Final Principle

Architecture exists to manage complexity, not to create complexity.

The project should remain small enough for the Project Owner to understand the complete execution flow.

Keep boundaries clear.  
Keep dependencies simple.  
Separate orchestration from execution.  
Evolve architecture through real requirements.

**The architecture should support learning, not become an obstacle to implementation.**
