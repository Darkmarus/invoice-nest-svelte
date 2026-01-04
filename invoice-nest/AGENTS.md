# AGENTS.md

## Project Overview

**invoice-nest** is a NestJS application implementing a products management system with file upload capabilities. The project follows Domain-Driven Design (DDD) principles with Clean Architecture.

## Architecture

The project is organized into three main layers following DDD principles:

### Domain Layer (`libs/domain/`)

- **Purpose**: Contains core business logic and domain models
- **Contents**:
  - Models: `Product`, `File`, `ImageProduct`
  - Repository interfaces: `ProductRepository`, `FileRepository`, `ImageProductRepository`
  - Domain errors: `ProductNotFound`, `InvalidProductData`
  - Unit of Work interface for transaction management

### Application Layer (`libs/application/`)

- **Purpose**: Orchestrates use cases through Commands and Queries (CQRS pattern)
- **Contents**:
  - Commands: `CreateProductWithFiles`, `UpdateProduct`, `DeleteProduct`
  - Queries: `GetAllProducts`, `GetProductById`
  - Command/Query handlers
  - Command Bus and interfaces

### Infrastructure Layer (`libs/infrastructure/`)

- **Purpose**: Implements external concerns and provides technical services
- **Contents**:
  - REST Controllers: `ProductController`, `FileController`
  - DTOs: `CreateProductDto`, `UpdateProductDto`, `ProductResponseDto`
  - Mappers: Transform between DTOs and domain models
  - Repository implementations: PostgreSQL via Knex.js
  - File storage service
  - Configuration: Command bus, static files

### Application Root (`src/`)

- **Purpose**: Bootstraps the application
- **Contents**:
  - `AppModule`: Root module configuration
  - `main.ts`: Application entry point

## Directory Structure

```
invoice-nest/
├── database/                    # SQL migrations and diagrams
├── libs/
│   ├── application/            # Use cases and orchestration
│   │   └── src/
│   │       ├── file/          # File-related commands
│   │       ├── product/       # Product commands/queries
│   │       └── utils/         # Command/query interfaces
│   ├── domain/                # Core domain logic
│   │   └── src/
│   │       ├── errors/        # Domain errors
│   │       ├── models/        # Domain models
│   │       └── repositories/  # Repository interfaces
│   └── infrastructure/        # Technical implementations
│       └── src/
│           ├── config/        # Configuration services
│           ├── in/rest/       # REST API layer
│           └── out/           # External services (DB, storage)
├── src/                       # Application bootstrap
├── test/                      # E2E tests
└── package.json
```

## Technology Stack

- **Framework**: NestJS 11.1.9
- **Language**: TypeScript 5.9.3
- **Database**: PostgreSQL with Knex.js
- **Validation**: class-validator, class-transformer
- **API Documentation**: @nestjs/swagger
- **Testing**: Jest
- **Linting**: ESLint + TypeScript ESLint + Prettier
- **Node**: 24.12.0 (managed by Volta)
- **npm**: 11.7.0

## Code Conventions

### Naming Conventions

- **Files**: kebab-case (`create-product.command.ts`)
- **Classes**: PascalCase (`CreateProductCommand`)
- **Interfaces**: PascalCase with `I` prefix (`ICommandHandler`)
- **Methods**: camelCase (`execute()`, `create()`)

### Path Aliases

```typescript
import { CreateProductCommand } from '@app/application/product/command/create-product-with-files.command';
import { Product } from '@app/domain/models/product.model';
import { ProductController } from '@app/infrastructure/in/rest/product.controller';
```

### Domain Models

- Use `private constructor` pattern
- Implement `static create()` for new entities
- Implement `static rehydrate()` for persistence retrieval
- Keep all business logic within the model

### Command/Query Pattern

- Commands: Named with action (`CreateProduct`, `UpdateProduct`)
- Queries: Named with retrieval intent (`GetAllProducts`, `GetProductById`)
- Handlers: Implement `ICommandHandler<TCommand>` or `IQueryHandler<TQuery>`
- Manual registration in `CommandModule.onModuleInit()` using `HandlerRegistryService`
- Add handler bindings to the `handlerBindings` array for automatic registration

### Controllers

- Use NestJS decorators for routing (`@Get`, `@Post`, `@Put`, `@Delete`)
- Validate DTOs with `class-validator`
- Use `@ApiOperation`, `@ApiResponse` for Swagger documentation
- Map DTOs to commands/queries using mappers

### Repository Pattern

- Define interfaces in `libs/domain/src/repositories/`
- Implement in `libs/infrastructure/src/out/persistence/`
- Use Unit of Work pattern for transactions
- Return domain models, not database entities

## Available Scripts

```bash
# Development
npm run start:dev           # Start with HMR

# Production
npm run build              # Build the application
npm run start:prod         # Start production build

# Testing
npm run test               # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Run tests with coverage
npm run test:watch        # Watch mode

# Code Quality
npm run lint              # Run ESLint with auto-fix
npm run format            # Format with Prettier
```

## Development Workflow

1. **Adding a new feature**:
   - Define domain models in `libs/domain/src/models/`
   - Create repository interfaces in `libs/domain/src/repositories/`
   - Implement commands/queries in `libs/application/`
   - Create handlers with decorators
   - Implement repositories in `libs/infrastructure/src/out/persistence/`
   - Expose via controllers in `libs/infrastructure/src/in/rest/`
   - Create DTOs and mappers

2. **Running tests**:
   - Unit tests: `npm run test`
   - E2E tests: `npm run test:e2e`
   - Always ensure tests pass before committing

3. **Code quality**:
   - Run `npm run lint` before committing
   - Run `npm run format` for code formatting
   - No comments unless explicitly requested

## Database

- **ORM**: Knex.js via nest-knexjs
- **Migrations**: Located in `database/` directory
- **Connection**: PostgreSQL via `pg` driver
- **Transaction Management**: Unit of Work pattern

## File Upload

- Files are stored using `FileStorageService`
- Images are associated with products via `ImageProduct` relationship
- Files served via `@nestjs/serve-static`
- Support for multiple file uploads per product

## Important Notes

- This project uses monorepo structure with libs
- All imports use path aliases (`@app/*`)
- Domain logic is isolated in domain layer
- No explicit comments in code
- Follow existing patterns when adding new features
- Always validate DTOs with `class-validator`
- Use TypeScript strict mode features where applicable
