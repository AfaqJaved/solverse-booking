# Solverse Booking - Domain Entities Documentation

## Project Overview
Solverse Booking is a modern appointment scheduling system built with a monorepo architecture using TurboRepo. The system follows Domain-Driven Design (DDD) principles with a clean separation of concerns between domain entities, application services, and infrastructure.

## Domain Entities

### 1. User Entity (`packages/domain/src/entities/user/`)
**Core Entity**: Represents system users with authentication and profile management.

**Key Fields:**
- `id`: UUID v4 identifier
- `username`: Unique login identifier (3-30 chars, lowercase alphanumeric)
- `password`: Hashed password (bcrypt/argon2)
- `name`: Full name value object (first/last name)
- `email`: Validated email address
- `phone`: Optional E.164 phone number
- `role`: User role (`superAdmin`, `businessOwner`, `locationOwner`)
- `status`: Account status (`pending_verification`, `active`, `inactive`, `suspended`)
- `timezone`: IANA timezone identifier
- `notificationPreferences`: Email/SMS/push notification settings

**Structure:**
- `user.entity.ts`: Main entity schema with validation
- `user.aggregate.ts`: Aggregate root with business logic
- `value-objects/`: Email, phone, timezone, user ID validations
- `usecases/`: Domain use cases (create, update, authenticate)
- `repository/`: Repository interface definitions
- `errors/`: Domain-specific error types

### 2. Business Entity (`packages/domain/src/entities/business/`)
**Core Entity**: Represents businesses offering services through the platform.

**Key Fields:**
- `id`: UUID v4 identifier
- `ownerId`: Reference to User (must be `businessOwner`)
- `name`: Business display name (2-100 chars)
- `slug`: URL-safe unique identifier for booking links
- `email`: Business contact email
- `phone`: Optional E.164 contact number
- `timezone`: Default IANA timezone
- `status`: Business status (`pending_verification`, `active`, `inactive`, `suspended`)
- `plan`: Subscription plan (`free`, `starter`, `pro`, `enterprise`)
- `currency`: ISO 4217 currency code (3 uppercase letters)

**Structure:**
- `business.entity.ts`: Main entity schema
- `business.aggregate.ts`: Aggregate with business logic
- `value-objects/`: Email, phone, timezone validations
- `usecases/`: Business management operations
- `repository/`: Repository interfaces

### 3. Service Entity (`packages/domain/src/entities/service/`)
**Core Entity**: Represents bookable services offered by businesses.

**Key Fields:**
- `id`: UUID v4 identifier
- `businessId`: Reference to Business
- `name`: Service display name
- `description`: Optional service description (max 500 chars)
- `duration`: Service duration in minutes (5-480)
- `bufferTime`: Post-appointment buffer time (minutes)
- `price`: Price in smallest currency unit (cents)
- `status`: Service visibility status
- `color`: Optional hex color for calendar display
- `maxBookingsPerSlot`: Maximum concurrent bookings per time slot

**Structure:**
- `service.entity.ts`: Main entity schema
- `service.aggregate.ts`: Aggregate with service logic
- `value-objects/`: Service-specific validations
- `usecases/`: Service management operations

### 4. Working Hours Entity (`packages/domain/src/entities/working-hours/`)
**Core Entity**: Defines business operating hours by day of week.

**Key Fields:**
- `id`: UUID v4 identifier
- `businessId`: Reference to Business
- `dayOfWeek`: Day name (`monday` through `sunday`)
- `isOpen`: Boolean indicating if business is open
- `openTime`: Opening time in HH:MM (24h format)
- `closeTime`: Closing time in HH:MM (24h format)

**Structure:**
- `working.hours.entity.ts`: Main entity schema
- `working.hours.aggregate.ts`: Aggregate with scheduling logic
- `value-objects/`: Time validation (HH:MM format)
- `usecases/`: Working hours management

### 5. Break Entity (`packages/domain/src/entities/break/`)
**Core Entity**: Represents breaks within working hours (lunch, maintenance, etc.).

**Key Fields:**
- `id`: UUID v4 identifier
- `workingHoursId`: Reference to WorkingHours
- `label`: Break description (max 100 chars)
- `startTime`: Break start time in HH:MM
- `endTime`: Break end time in HH:MM

**Structure:**
- `break.entity.ts`: Main entity schema
- `break.aggregate.ts`: Aggregate with break logic
- `value-objects/`: Time validation
- `usecases/`: Break management operations

### 6. TimeOff Entity (`packages/domain/src/entities/timeoff/`)
**Core Entity**: Represents when a business is closed and not accepting bookings (holidays, vacations, maintenance, etc.) with various cadences.

**Key Fields:**
- `id`: UUID v4 identifier
- `businessId`: Reference to Business
- `label`: Descriptive label (1-200 chars)
- `allDay`: Boolean indicating if the time off is for the entire day
- `cadence`: Recurrence pattern (`once`, `daily`, `weekly`, `monthly`, `yearly`)
- `status`: Current status (`active`, `cancelled`)
- `startDate` / `endDate`: Date range (inclusive)
- `startTime` / `endTime`: Time range (HH:MM format, required when `allDay` is false, null when `allDay` is true)

**Structure:**
- `timeoff.entity.ts`: Main entity schema with validation
- `timeoff.aggregate.ts`: Aggregate with business logic
- `value-objects/`: Time validation (HH:MM format)
- `usecases/`: Business closure management operations
- `repository/`: Repository interface definitions
- `errors/`: Domain-specific error types

### 7. Common Module (`packages/domain/src/entities/common/`)
**Shared Components**: Audit trail fields used across all entities.

**Audit Fields (included in all entities):**
- `createdAt` / `createdBy`: Record creation timestamp and actor
- `updatedAt` / `updatedBy`: Last update timestamp and actor
- `deletedAt` / `deletedBy`: Soft-delete timestamp and actor
- `isDeleted`: Fast filter flag for soft-delete

## Technical Architecture

### Schema Validation
- Uses **Effect Schema** for runtime type validation
- Validation occurs at system boundaries (database reads, API payloads)
- Rich error messages with entity-specific context
- Never used deep inside domain logic

### Value Objects
Each entity has dedicated value objects for:
- Email validation
- Phone number validation (E.164 format)
- Timezone validation (IANA identifiers)
- Time validation (HH:MM 24h format)
- ID validation (UUID v4)

### Aggregate Design
- Each entity has an aggregate that encapsulates business logic
- Aggregates enforce invariants and business rules
- Use cases operate on aggregates, not raw data

### Repository Pattern
- Interface definitions in each entity's `repository/` directory
- Implementation in `packages/persistence/`
- Clean separation between domain and infrastructure

## Project Structure
```
solverse-booking/
├── apps/
│   ├── api/          # NestJS API server
│   └── web/          # Frontend application
├── packages/
│   ├── domain/       # Domain entities and business logic
│   ├── persistence/  # Database access layer
│   ├── shared/       # Shared utilities and types
│   └── typescript-config/ # TypeScript configuration
└── turbo.json        # TurboRepo configuration
```

## Development Commands
- `bunx turbo dev --filter=@solverse/api`: Start API server
- `bunx turbo build`: Build all packages
- `bunx turbo lint`: Run linting
- `bunx turbo test`: Run tests

## Key Design Principles
1. **Domain-Driven Design**: Entities reflect real business concepts
2. **Clean Architecture**: Separation of concerns between layers
3. **Type Safety**: Full TypeScript support with runtime validation
4. **Soft Delete**: All entities support soft deletion with audit trail
5. **Validation First**: Input validation at system boundaries
6. **Effect Library**: Functional programming patterns for error handling