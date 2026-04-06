# Entity Implementation Guide

## Overview

This guide documents the process for adding new domain entities to the Solverse Booking system and exposing them via REST APIs. It follows the established patterns from User, Business, and Service entities.

## Architecture Overview

### Layered Architecture

```
Domain Layer (packages/domain/)     - Business logic, entities, usecases
Persistence Layer (packages/persistence/) - Database repositories, schemas
Shared Layer (packages/shared/)     - API interfaces, shared types
API Layer (apps/api/)               - Controllers, DTOs, documentation
```

### Key Patterns

1. **Domain-Driven Design** - Entities, aggregates, value objects
2. **Hexagonal Architecture** - Ports (interfaces) and adapters (implementations)
3. **Effect Pattern** - Functional error handling with typed errors
4. **Repository Pattern** - Data access abstraction
5. **Clean Architecture** - Dependency rule: inner layers don't depend on outer layers

## Step-by-Step Implementation Process

## Phase 1: Domain Layer Implementation

### 1.1 Analyze Existing Entity Patterns

**Location**: `/packages/domain/src/entities/{existing-entity}/`

**Examine**:

- `{entity}.entity.ts` - Schema definition
- `{entity}.aggregate.ts` - Business logic methods
- `value-objects/` - Domain value objects
- `errors/` - Domain-specific errors
- `usecases/` - Usecase interfaces
- `repository/` - Repository interface

### 1.2 Create Entity Structure

**Directory**: `/packages/domain/src/entities/{new-entity}/`

**Required Files**:

```
{new-entity}/
├── entry.ts                      # Main exports
├── {new-entity}.entity.ts        # Schema definition
├── {new-entity}.aggregate.ts     # Business logic
├── {new-entity}.entity.test.ts   # Tests (optional)
├── errors/
│   ├── entry.ts
│   └── *.ts                      # Domain errors
├── value-objects/
│   ├── entry.ts
│   └── *.ts                      # Value objects (ID, name, etc.)
├── usecases/
│   ├── entry.ts
│   └── *.ts                      # Usecase interfaces
└── repository/
    └── {new-entity}.repository.ts # Repository interface
```

### 1.3 Entity Schema Definition

**File**: `{new-entity}.entity.ts`

**Pattern**:

```typescript
import { Schema } from 'effect'
import { AuditSchema } from '../common/entry'

export const {Entity}Schema = Schema.Struct({
  id: {Entity}Id,
  // Entity-specific fields
  name: {Entity}Name,
  description: Schema.NullOr(Schema.String),
  status: {Entity}Status,
  // Audit fields (required)
  ...AuditSchema.fields,
})

export type {Entity}Data = typeof {Entity}Schema.Type
```

**Key Points**:

- Always include `AuditSchema.fields` for consistent audit tracking
- Use value objects for domain concepts (ID, name, status, etc.)
- Define validation rules in schemas
- Always add custom validation messages and write unit tests using vitest to validate if we are getting the validation messages.

### 1.4 Aggregate Definition

**File**: `{new-entity}.aggregate.ts`

**Pattern**:

```typescript
export class {Entity} {
  private constructor(private readonly data: {Entity}Data) {}

  // Getters for all fields
  get id(): {Entity}Id { return this.data.id }
  get name(): {Entity}Name { return this.data.name }
  // ... other getters

  // Factory method
  static create(params: {
    id: {Entity}Id
    name: {Entity}Name
    createdBy: {Entity}Data['createdBy']
    // ... other required fields
  }): {Entity} {
    const now = new Date()
    return new {Entity}({
      ...params,
      createdAt: now,
      createdBy: params.createdBy,
      updatedAt: now,
      updatedBy: params.createdBy,
      deletedAt: null,
      deletedBy: null,
      isDeleted: false,
    })
  }

  // Reconstitution method
  static fromRaw(raw: unknown): Effect.Effect<{Entity}, ParseError> {
    return Schema.decodeUnknown({Entity}Schema)(raw).pipe(
      Effect.map((data) => new {Entity}(data)),
    )
  }

  // Business methods (immutable)
  updateDetails(
    details: Partial<{/* updatable fields */}>,
    updatedBy: {Entity}Data['updatedBy'],
  ): Effect.Effect<{Entity}, {Entity}DeletedError> {
    if (this.data.isDeleted) {
      return Effect.fail(new {Entity}DeletedError({/* ... */}))
    }
    return Effect.succeed(
      new {Entity}({
        ...this.data,
        ...details,
        updatedAt: new Date(),
        updatedBy,
      }),
    )
  }

  // Serialization
  toRaw(): {Entity}Data {
    return this.data
  }
}
```

**Key Points**:

- Private constructor ensures validity
- Immutable updates return new instances
- Business methods return `Effect` with typed errors
- Include `isDeleted` check in mutation methods

### 1.5 Value Objects

**Location**: `value-objects/`

**Pattern**:

```typescript
// Example: ID value object
export const {Entity}Id = Schema.String.pipe(
  Schema.pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
  Schema.brand('{Entity}Id'),
)

export type {Entity}Id = typeof {Entity}Id.Type

// Example: Status value object
export const {Entity}Status = Schema.Literal('active', 'inactive', 'pending')
export type {Entity}Status = typeof {Entity}Status.Type
```

**Key Points**:

- Please ensure to provide all the custom validation messages.

### 1.6 Domain Errors

**Location**: `errors/`

**Pattern**:

```typescript
import { Schema } from 'effect'

export class {Entity}NotFoundError extends Schema.TaggedError<{Entity}NotFoundError>()(
  '{Entity}NotFoundError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}

export class {Entity}DeletedError extends Schema.TaggedError<{Entity}DeletedError>()(
  '{Entity}DeletedError',
  { message: Schema.String, cause: Schema.String },
) {
  readonly sendToFrontEnd = true
}
```

**Key Points**:

- Extend `Schema.TaggedError`
- Include `sendToFrontEnd = true` for client-facing errors
- Use descriptive error names
- Make sure to add only string types for message and cause. Only keep these two attributes

### 1.7 Usecase Interfaces

**Location**: `usecases/`

**Pattern**:

```typescript
import { Effect } from 'effect'
import { DatabaseFailure, InvalidInputError } from '../../../errors/entry'
import { {Entity} } from '../{entity}.aggregate'
import { {Entity}NotFoundError, {Entity}DeletedError } from '../errors/entry'

export const ICreate{Entity}Usecase = Symbol('ICreate{Entity}Usecase')

export interface Create{Entity}Usecase {
  execute(params: {
    id: string           // Primitive types, not Effect schemas
    name: string
    createdBy: string
    // ... other parameters
  }): Effect.Effect<
    {Entity},
    InvalidInputError | DatabaseFailure | /* domain errors */
  >
}
```

**Key Points**:

- Use primitive TypeScript types in interfaces (`string`, `number`, not Effect schemas)
- Return `Effect` with typed errors
- Include `Symbol` for dependency injection
- Follow CRUD+L naming: `create`, `get`, `update`, `delete`, `list`

### 1.8 Repository Interface

**File**: `repository/{new-entity}.repository.ts`

**Pattern**:

```typescript
import { Effect, Option } from 'effect'
import { DatabaseFailure } from '../../../errors/entry'
import { {Entity} } from '../{entity}.aggregate'
import { {Entity}Id } from '../entry'

export const I{Entity}Repository = Symbol('I{Entity}Repository')

export interface {Entity}Repository {
  findById(id: {Entity}Id): Effect.Effect<Option.Option<{Entity}>, DatabaseFailure>

  // List with filtering options
  findBy{Parent}Id(
    parentId: ParentId,
    options?: {
      status?: {Entity}Status
      includeDeleted?: boolean
    }
  ): Effect.Effect<{Entity}[], DatabaseFailure>

  // Count for pagination
  countBy{Parent}Id(
    parentId: ParentId,
    options?: {
      status?: {Entity}Status
      includeDeleted?: boolean
    }
  ): Effect.Effect<number, DatabaseFailure>

  // Validation methods
  nameExistsFor{Parent}(
    parentId: ParentId,
    name: {Entity}Name,
    exclude{Entity}Id?: {Entity}Id
  ): Effect.Effect<boolean, DatabaseFailure>

  save({entity}: {Entity}): Effect.Effect<void, DatabaseFailure>
  delete(id: {Entity}Id): Effect.Effect<void, DatabaseFailure>
}
```

**Key Points**:

- Include filtering options for list methods
- Add count methods for pagination
- Include validation methods (e.g., name uniqueness)
- `delete` method typically does hard delete; soft delete uses `save`

## Phase 2: Persistence Layer Implementation

### 2.1 Create Database Schema

**Location**: `/packages/persistence/src/schema/{entity}.table.ts`

**Pattern**:

```typescript
import { pgTable, uuid, varchar, integer, pgEnum } from 'drizzle-orm/pg-core'
import { auditColumns } from './audit.columns'

export const {entity}StatusEnum = pgEnum('{entity}_status', [
  'active',
  'inactive',
  // ... other statuses
])

export const {entity}sTable = pgTable('{entity}s', {
  id: uuid('id').primaryKey(),
  // Foreign keys
  parentId: uuid('parent_id').notNull().references(() => parentsTable.id),
  // Entity fields
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
  status: {entity}StatusEnum('status').notNull().default('active'),
  // ... other fields
  ...auditColumns,
})
```

### 2.2 Implement Repository

**Location**: `/packages/persistence/src/repositories/{entity}.repository.impl.ts`

**Pattern**:

```typescript
@Injectable()
export class {Entity}RepositoryImpl implements {Entity}Repository {
  constructor(
    private readonly persistenceMapperFactory: PersistenceMapperFactory,
  ) {}

  findById(id: {Entity}Id): Effect.Effect<Option.Option<{Entity}>, DatabaseFailure> {
    return Effect.gen(this, function* () {
      const [row] = yield* dbEffect(
        db
          .select()
          .from({entity}sTable)
          .where(eq({entity}sTable.id, id))
          .limit(1),
      )
      if (!row) return Option.none()
      const entity = yield* this.persistenceMapperFactory.{entity}PersistenceMapper.toDomain(row)
      return Option.some(entity)
    })
  }

  // Implement all repository interface methods
  // Handle TypeScript null checks for array results
}
```

**Key Points**:

- Use `Effect.gen` for sequential operations
- Handle `Option` type for single results
- Check `result[0]` exists before accessing properties
- Use `and(...conditions)` for filtered queries

## Phase 3: Usecase Implementations

### 3.1 Create API Module Structure

**Location**: `/apps/api/src/modules/{entity}/`

```
{entity}/
├── {entity}.module.ts          # NestJS module
├── {entity}.controller.ts      # REST controller
├── mapper/
│   └── {entity}.mapper.ts      # Domain to API mapping
├── dto/
│   └── *.dto.ts               # Data Transfer Objects
├── docs/
│   └── *.doc.ts               # Swagger documentation
└── usecases/
    ├── entry.ts               # Provider exports
    ├── {entity}.usecases.factory.ts
    └── *.usecase.impl.ts      # Usecase implementations
```

### 3.2 Implement Usecases

**Location**: `/apps/api/src/modules/{entity}/usecases/`

**Pattern**:

```typescript
@Injectable()
export class Create{Entity}UsecaseImpl implements Create{Entity}Usecase {
  constructor(private readonly repositoryFactory: RepositoryFactory) {}

  execute({
    id,
    name,
    createdBy,
    // ... other params
  }: {
    id: string
    name: string
    createdBy: string
    // ...
  }): Effect.Effect<
    import('@solverse/domain').{Entity},
    InvalidInputError | DatabaseFailure | /* domain errors */
  > {
    return Effect.gen(this, function* () {
      // Validate inputs
      const decodedId = yield* decodeOrFail({Entity}Id)(id)
      const decodedName = yield* decodeOrFail({Entity}Name)(name)

      // Business validation
      const nameTaken = yield* this.repositoryFactory.{entity}Repository.nameExistsFor{Parent}(
        parentId,
        decodedName,
      )

      if (nameTaken) {
        return yield* Effect.fail(new {Entity}NameTakenError({/* ... */}))
      }

      // Create entity
      const entity = {Entity}.create({
        id: decodedId,
        name: decodedName,
        createdBy,
        // ...
      })

      // Persist
      yield* this.repositoryFactory.{entity}Repository.save(entity)

      return entity
    })
  }
}
```

**Key Points**:

- Use `decodeOrFail` to validate inputs and convert to domain types
- Perform business validation before operations
- Return domain aggregates (not raw data)
- Handle all error cases

### 3.3 Create Usecases Factory

**File**: `{entity}.usecases.factory.ts`

**Pattern**:

```typescript
@Injectable()
export class {Entity}UsecasesFactory {
  @Inject(ICreate{Entity}Usecase)
  public readonly create{Entity}Usecase!: Create{Entity}Usecase

  @Inject(IGet{Entity}Usecase)
  public readonly get{Entity}Usecase!: Get{Entity}Usecase

  // ... other usecases
}
```

### 3.4 Create Providers Entry

**File**: `usecases/entry.ts`

**Pattern**:

```typescript
import { Provider } from '@nestjs/common'
import {
  ICreate{Entity}Usecase,
  IGet{Entity}Usecase,
  // ... other usecase symbols
} from '@solverse/domain'
import { Create{Entity}UsecaseImpl } from './create.{entity}.usecase.impl'
import { Get{Entity}UsecaseImpl } from './get.{entity}.usecase.impl'
// ... other implementations
export { {Entity}UsecasesFactory } from './{entity}.usecases.factory'

export const {ENTITY}_USECASES: Provider[] = [
  { provide: ICreate{Entity}Usecase, useClass: Create{Entity}UsecaseImpl },
  { provide: IGet{Entity}Usecase, useClass: Get{Entity}UsecaseImpl },
  // ... other providers
]
```

## Phase 4: API Layer Implementation

### 4.1 Create Shared API Types

**Location**: `/packages/shared/src/api/{entity}/`

**File**: `{entity}.api.ts`

**Pattern**:

```typescript
export namespace {Entity}Api {
  export type StatusType = 'active' | 'inactive' | /* other statuses */

  export namespace Create {
    export interface Request {
      // Request parameters
      name: string
      parentId: string
      createdBy: string
      // ... optional fields
    }
    export interface Response {
      // Response fields (subset of entity)
      id: string
      name: string
      status: StatusType
      createdAt: string
    }
  }

  export namespace Get{Entity} {
    export interface Response {
      // Full entity response
      id: string
      parentId: string
      name: string
      description: string | null
      status: StatusType
      createdAt: string
      updatedAt: string
      createdBy: string | null  // Note: nullable from domain
      updatedBy: string | null  // Note: nullable from domain
    }
  }

  // ... other endpoints
}
```

**Key Points**:

- Create separate namespaces for each endpoint
- `Create.Response` typically returns minimal data
- `Get.Response` returns full entity data
- Match domain nullability for audit fields

### 4.2 Create DTOs

**Location**: `/apps/api/src/modules/{entity}/dto/`

**Pattern**:

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { {Entity}Api } from '@solverse/shared'

export class Create{Entity}Dto implements {Entity}Api.Create.Request {
  @ApiProperty({ example: 'Entity Name' })
  name!: string

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  parentId!: string

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  createdBy!: string

  @ApiPropertyOptional({ example: 'Entity description' })
  description?: string | null

  @ApiPropertyOptional({ enum: ['active', 'inactive'], example: 'active' })
  status?: 'active' | 'inactive'
}
```

**Key Points**:

- Implement corresponding `{Entity}Api` interface
- Use Swagger decorators for documentation
- Include examples for all fields
- Mark optional fields with `ApiPropertyOptional`

### 4.3 Create Swagger Documentation

**Location**: `/apps/api/src/modules/{entity}/docs/`

**Pattern**:

```typescript
export const Create{Entity}Doc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new {entity}',
      description: 'Creates a new {entity} with the provided details.',
    }),
    ApiBody({ type: Create{Entity}Dto }),
    ApiCreatedResponse({
      description: '{Entity} created successfully',
      schema: {
        properties: {
          statusCode: { type: 'number', example: HttpStatus.CREATED },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
              name: { type: 'string', example: 'Entity Name' },
              // ... other response fields
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiConflictResponse({
      description: '{Entity} name already taken',
      schema: { /* error response schema */ },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input fields',
      schema: { /* error response schema */ },
    }),
  )
```

**Key Points**:

- Document all possible responses (success and errors)
- Include examples for all fields
- Use appropriate HTTP status codes
- Document error scenarios

### 4.4 Create Mapper

**File**: `mapper/{entity}.mapper.ts`

**Pattern**:

```typescript
export class {Entity}Mapper {
  static {entity}AggregateToCreateResponse({entity}: {Entity}): {Entity}Api.Create.Response {
    const data = {entity}.toRaw()
    return {
      id: data.id,
      name: data.name,
      status: data.status,
      createdAt: data.createdAt.toISOString(),
    }
  }

  static {entity}AggregateToGetResponse({entity}: {Entity}): {Entity}Api.Get{Entity}.Response {
    const data = {entity}.toRaw()
    return {
      id: data.id,
      parentId: data.parentId,
      name: data.name,
      description: data.description,
      status: data.status,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      createdBy: data.createdBy,  // nullable from domain
      updatedBy: data.updatedBy,  // nullable from domain
    }
  }

  static {entity}AggregatesToListResponse({entity}s: {Entity}[]): {Entity}Api.List{Entity}s.Response {
    return {
      {entity}s: {entity}s.map({entity} => {
        const data = {entity}.toRaw()
        return {
          id: data.id,
          name: data.name,
          status: data.status,
          createdAt: data.createdAt.toISOString(),
          updatedAt: data.updatedAt.toISOString(),
        }
      })
    }
  }
}
```

**Key Points**:

- Different response shapes for different endpoints
- Handle date conversion to ISO strings
- Preserve nullability from domain
- Create list responses with pagination if needed

### 4.5 Create Controller

**File**: `{entity}.controller.ts`

**Pattern**:

```typescript
@ApiTags('{Entities}')
@Controller('{entity}s')
export class {Entity}Controller {
  constructor(private readonly {entity}UsecaseFactory: {Entity}UsecasesFactory) {}

  @Post()
  @Create{Entity}Doc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner')  // Appropriate roles
  public async create{Entity}(
    @Body() body: Create{Entity}Dto,
  ): Promise<ApiResponse<{Entity}Api.Create.Response>> {
    const result = await Effect.runPromise(
      this.{entity}UsecaseFactory.create{Entity}Usecase.execute({
        id: crypto.randomUUID(),
        name: body.name,
        parentId: body.parentId,
        createdBy: body.createdBy,
        description: body.description,
        status: body.status,
      }),
    )
    return ApiResponse.created({Entity}Mapper.{entity}AggregateToCreateResponse(result))
  }

  @Get(':{entity}Id')
  @Get{Entity}Doc()
  @UseGuards(RoleGuard)
  @Roles('businessOwner', 'locationOwner', 'superAdmin')
  public async get{Entity}(
    @Param('{entity}Id') {entity}Id: string,
  ): Promise<ApiResponse<{Entity}Api.Get{Entity}.Response>> {
    const {entity} = await Effect.runPromise(
      this.{entity}UsecaseFactory.get{Entity}Usecase.execute({ {entity}Id }),
    )
    return ApiResponse.ok({Entity}Mapper.{entity}AggregateToGetResponse({entity}))
  }

  // ... other endpoints
}
```

**Key Points**:

- Use appropriate HTTP methods (POST, GET, PATCH, DELETE)
- Apply Swagger documentation decorators
- Use `RoleGuard` with appropriate roles
- Generate UUID for new entities
- Use `Effect.runPromise` to execute usecases
- Return `ApiResponse` with appropriate status

### 4.6 Create Module

**File**: `{entity}.module.ts`

**Pattern**:

```typescript
@Module({
  imports: [CommonModule],
  controllers: [{Entity}Controller],
  providers: [...{ENTITY}_USECASES, {Entity}UsecasesFactory],
  exports: [{Entity}UsecasesFactory],
})
export class {Entity}Module {}
```

## Phase 5: Integration and Testing

### 5.1 Update Main API Entry

**Location**: `/packages/shared/src/api/entry.ts`

```typescript
export * from "./{entity}/entry";
```

### 5.2 Register Module in App

**Location**: `/apps/api/src/app.module.ts`

Add `{Entity}Module` to imports array.

### 5.3 Testing Strategy

**Unit Tests**:

- Domain logic (aggregate methods)
- Usecase implementations
- Repository implementations
- Mapper functions

**Integration Tests**:

- API endpoints
- Database operations
- Error scenarios

**Manual Testing**:

- Swagger documentation
- Role-based access control
- Validation rules

## Common Pitfalls and Solutions

### 1. Type Mismatch: Domain vs API

**Problem**: Domain uses branded types, API expects primitive types
**Solution**: Use primitive types in usecase interfaces, validate with `decodeOrFail`

### 2. Nullable Audit Fields

**Problem**: Domain `createdBy`/`updatedBy` are nullable, API expects strings
**Solution**: Make API fields nullable (`string | null`)

### 3. Soft Delete Implementation

**Problem**: Repository has `delete` (hard), aggregate has `softDelete`
**Solution**: Usecases call `softDelete()` then `save()`, not repository `delete()`

### 4. TypeScript Array Access

**Problem**: `result[0]` could be undefined
**Solution**: Always check `if (!row) return Option.none()` or `if (!row) return 0`

### 5. Error Handling

**Problem**: Forgetting to handle all error cases
**Solution**: Ensure usecase `Effect` return type includes all possible errors

## Best Practices

### 1. Consistency

- Follow existing naming conventions
- Use same patterns as other entities
- Maintain consistent directory structure

### 2. Validation

- Validate at domain boundaries
- Use Effect schemas for type safety
- Include business rule validation

### 3. Security

- Always use `RoleGuard` on endpoints
- Validate ownership/permissions in usecases
- Never expose internal errors to clients

### 4. Documentation

- Complete Swagger documentation
- Include examples for all fields
- Document error scenarios

### 5. Testing

- Test domain logic independently
- Test error scenarios
- Test role-based access

## Template Files

Templates for each file type are available in the codebase. Copy from existing entities (User, Business, Service) and adapt for new entities.

## Summary

This guide provides a complete roadmap for implementing new entities in the Solverse Booking system. By following these patterns, new entities will integrate seamlessly with the existing architecture, maintain consistency, and leverage all established patterns for security, validation, and error handling.

