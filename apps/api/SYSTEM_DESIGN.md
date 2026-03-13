# DashPage Backend System Design

## Overview

DashPage is a full-stack portfolio and digital business card platform built with a Cloudflare Workers backend using Hono framework. It uses Supabase for authentication, PostgreSQL (via Drizzle ORM) for database, and integrates with Razorpay for premium theme payments.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Bun (Cloudflare Workers) |
| **Framework** | Hono v4 |
| **Database** | PostgreSQL via Drizzle ORM |
| **Auth** | Supabase (JWT with ES256) |
| **Storage** | Supabase Storage (avatars, project images) |
| **Payments** | Razorpay |
| **Validation** | Zod |

---

## Architecture

```
                                    ┌─────────────────────┐
                                    │    Supabase Auth    │
                                    │  (JWT Generation)   │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │   Cloudflare        │
                                    │   Workers API       │
                                    │   (Hono)            │
                                    └──────────┬──────────┘
                                               │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
           ┌────────▼────────┐        ┌─────────▼─────────┐       ┌────────▼────────┐
           │  PostgreSQL    │        │  Supabase        │       │   Razorpay     │
           │  (Drizzle)     │        │  Storage         │       │   Payments     │
           └────────────────┘        └───────────────────┘       └────────────────┘
```

---

## Project Structure

```
dashpage/apps/api/
├── src/
│   ├── index.ts                 # App entry point & route mounting
│   ├── db/
│   │   ├── index.ts            # Database connection (Drizzle)
│   │   ├── schema.ts           # All database schemas
│   │   └── seed-themes.ts      # Theme seeding script
│   ├── middleware/
│   │   └── auth.ts             # Supabase JWT verification middleware
│   ├── routes/
│   │   ├── profile.ts          # Profile CRUD (public & protected)
│   │   ├── experiences.ts       # Work experience management
│   │   ├── educations.ts       # Education history management
│   │   ├── projects.ts         # Portfolio projects management
│   │   ├── tags.ts             # Profile tags management
│   │   ├── themes.ts           # Theme listing & application
│   │   ├── bookmarks.ts       # Save other profiles
│   │   ├── payments.ts        # Razorpay order creation & verification
│   │   └── upload.ts           # Avatar & project image uploads
│   ├── services/
│   │   ├── profileService.ts
│   │   ├── experienceService.ts
│   │   ├── educationService.ts
│   │   ├── projectService.ts
│   │   ├── tagService.ts
│   │   ├── themeService.ts
│   │   ├── bookmarkService.ts
│   │   └── paymentService.ts
│   ├── validators/
│   │   ├── profileValidator.ts
│   │   ├── experienceValidator.ts
│   │   ├── educationValidator.ts
│   │   └── projectValidator.ts
│   └── utils/
│       └── jwks.ts             # Supabase public key fetching
├── drizzle.config.ts           # Drizzle Kit configuration
└── package.json
```

---

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | Core user profile (linked to Supabase auth) |
| `profileTags` | Searchable tags for profiles |
| `experiences` | Work experience entries |
| `educations` | Education history entries |
| `projects` | Portfolio project showcases |
| `themes` | Pre-built themes (free + premium) |
| `bookmarks` | User-saved profiles |
| `purchases` | Theme purchase records (Razorpay) |

### Relationships

```
profiles (1) ──── (N) profileTags
profiles (1) ──── (N) experiences
profiles (1) ──── (N) educations
profiles (1) ──── (N) projects
profiles (1) ──── (N) bookmarks
profiles (1) ──── (1) themes (themeId)
themes (1) ──── (N) purchases
users (Supabase) ──── (N) bookmarks
users (Supabase) ──── (N) purchases
```

---

## API Routes

### Public Routes (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/profiles/:username` | Get public profile |
| GET | `/api/profiles/:username/experiences` | Public experiences |
| GET | `/api/profiles/:username/projects` | Public projects |
| GET | `/api/profiles/:username/tags` | Public tags |
| GET | `/api/username/check?q=...` | Check username availability |
| GET | `/api/themes` | List all themes (with unlock status) |

### Protected Routes (Auth Required)

All protected routes require `Authorization: Bearer <token>` header with valid Supabase JWT.

#### Profile Management (`/api/me/profile`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me/profile` | Get own profile |
| POST | `/api/me/profile` | Create profile |
| PATCH | `/api/me/profile` | Update profile |

#### Experiences (`/api/me/experiences`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me/experiences` | List experiences |
| POST | `/api/me/experiences` | Create experience |
| PATCH | `/api/me/experiences/:id` | Update experience |
| DELETE | `/api/me/experiences/:id` | Delete experience |
| PATCH | `/api/me/experiences/reorder` | Reorder experiences |

#### Educations (`/api/me/educations`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me/educations` | List educations |
| POST | `/api/me/educations` | Create education |
| PATCH | `/api/me/educations/:id` | Update education |
| DELETE | `/api/me/educations/:id` | Delete education |
| PATCH | `/api/me/educations/reorder` | Reorder educations |

#### Projects (`/api/me/projects`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me/projects` | List projects |
| POST | `/api/me/projects` | Create project |
| PATCH | `/api/me/projects/:id` | Update project |
| DELETE | `/api/me/projects/:id` | Delete project |
| PATCH | `/api/me/projects/reorder` | Reorder projects |

#### Tags (`/api/tags`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me/tags` | Get own tags |
| PUT | `/api/me/tags` | Replace all tags |

#### Bookmarks (`/api/me/bookmarks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me/bookmarks` | List bookmarks |
| POST | `/api/me/bookmarks` | Toggle bookmark |

#### Themes (`/api/themes` & `/api/me/themes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/themes` | List all themes |
| POST | `/api/themes` | Apply theme to profile |

#### Payments (`/api/me/payments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/me/payments/create-order` | Create Razorpay order |
| POST | `/api/me/payments/verify` | Verify & complete payment |

#### Uploads (`/api/upload`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/me/avatar` | Upload avatar image |
| POST | `/api/upload/me/projects/:id/image` | Upload project image |
| DELETE | `/api/upload/me/projects/:id/image` | Delete project image |

---

## Authentication Flow

1. **Client** logs in via Supabase Auth (email/password, OAuth, etc.)
2. **Supabase** returns JWT access token
3. **Client** sends requests with `Authorization: Bearer <token>`
4. **Auth Middleware** (`src/middleware/auth.ts`):
   - Extracts token from header
   - Fetches Supabase JWKS public key
   - Verifies JWT signature (ES256)
   - Extracts `userId` from token `sub` claim
   - Checks if user has a profile in our DB
   - Sets `userId`, `username`, `hasProfile` in request context

---

## Payment Flow (Razorpay)

1. User selects premium theme in UI
2. Client calls `POST /api/me/payments/create-order`
3. Server creates Razorpay order, returns order ID
4. Client shows Razorpay checkout
5. User completes payment
6. Client calls `POST /api/me/payments/verify` with payment details
7. Server verifies signature, records purchase
8. Theme becomes "unlocked" for user

---

## Upload Flow

1. Client uploads file to `/api/upload/me/avatar` or `/api/upload/me/projects/:id/image`
2. Server validates:
   - File type (JPEG, PNG, WebP, GIF)
   - File size (2MB avatar, 5MB project)
3. Server uploads to Supabase Storage (`avatars/` or `projects/` bucket)
4. Server gets public URL
5. Server updates profile/project with URL

---

## Theme System

- **Free Themes**: Available to all users immediately
- **Premium Themes**: Require purchase via Razorpay
- Theme config stored as JSONB in `themes` table
- Applied theme config rendered on public profile page

---

## Request Flow Example

```
GET /api/profiles/johndoe

┌─────────────────────────────────────────────────────────────┐
│  index.ts                                                  │
│    - Applies CORS middleware                               │
│    - Mounts route: app.route("/api", profileRoutes)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│  routes/profile.ts                                         │
│    GET /:username                                          │
│      → calls profileService.getByUsername(username)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│  services/profileService.ts                                │
│    db.query.profiles.findFirst({                          │
│      where: eq(profiles.username, username),               │
│      with: { experiences, educations, projects, tags }    │
│    })                                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│  Drizzle ORM → PostgreSQL                                  │
│    SELECT * FROM profiles WHERE username = 'johndoe' ... │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for storage) |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook signing secret |
| `WEB_URL` | Frontend URL |
| `CORS_ORIGIN` | Allowed CORS origin |

---

## Running the API

```bash
# Development
cd apps/api
bun run dev

# Build for production
bun run build

# Database migrations
bun run db:generate  # Generate migration files
bun run db:migrate   # Run migrations

# Seed themes
bun run db:seed
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/index.ts` | Main app, middleware, route mounting |
| `src/db/schema.ts` | All Drizzle table definitions + relations |
| `src/middleware/auth.ts` | JWT verification logic |
| `src/services/*Service.ts` | Business logic for each entity |
| `src/validators/*Validator.ts` | Zod schemas for request validation |
| `src/routes/*.ts` | HTTP handlers (route definitions) |
| `src/utils/jwks.ts` | Supabase public key caching |
