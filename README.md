# My Turborepo

This is a monorepo managed with Turborepo. It contains multiple packages and applications, including backend services, a frontend application, and shared libraries.

## Project Structure

## Applications

### Excalidraw Frontend

A Next.js application for the Excalidraw frontend.

- **Location**: `apps/excalidraw-frontend`
- **Scripts**:
  - `dev`: Start the development server
  - `build`: Build the application
  - `start`: Start the production server
  - `lint`: Lint the code

### HTTP Backend

An Express.js application for the HTTP backend.

- **Location**: `apps/http-backend`
- **Scripts**:
  - `dev`: Build and start the development server
  - `build`: Build the application
  - `start`: Start the production server

### Web

A Next.js application for the web frontend.

- **Location**: `apps/web`
- **Scripts**:
  - `dev`: Start the development server
  - `build`: Build the application
  - `start`: Start the production server
  - `lint`: Lint the code
  - `check-types`: Check TypeScript types

### WS Backend

A WebSocket backend application.

- **Location**: `apps/ws-backend`
- **Scripts**:
  - `dev`: Build and start the development server
  - `build`: Build the application
  - `start`: Start the production server

## Packages

### Backend Common

Shared backend utilities and configurations.

- **Location**: `packages/backend-common`

### Common

Shared types and schemas.

- **Location**: `packages/common`

### DB

Database client and configurations.

- **Location**: `packages/db`

### ESLint Config

Shared ESLint configurations.

- **Location**: `packages/eslint-config`

### TypeScript Config

Shared TypeScript configurations.

- **Location**: `packages/typescript-config`

### UI

Shared UI components.

- **Location**: `packages/ui`

## Getting Started

### Prerequisites

- Node.js >= 18
- PNPM

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd my-turborepo