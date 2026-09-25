# T-Solve - Ticket Solution Repository Application

Knowledge layer that sits next to a ticket tracker (Jira, ...): it imports **resolved tickets**, turns valuable resolutions into
**reviewed solutions**, and lets handlers **search and reuse** them. T-Solve owns the *solution* lifecycle; the source tracker owns the *ticket* lifecycle.

```
Resolved Ticket -> Knowledge Candidate -> Review -> Published Solution -> Search / Reuse -> Feedback
```

## Repository layout

```
t-solve/
├── backend/               Spring Boot 3 (Java 21, Maven) - modular monolith
│   └── src/main/java/vn/tsolve/
│       ├── ticket/        resolved-ticket snapshots + idempotent import
│       ├── knowledge/     solution + lifecycle (DRAFT -> ... -> ARCHIVED)
│       ├── identity/      (planned) login, RBAC/ABAC
│       ├── workspace/     (planned) workspaces and taxonomy
│       ├── search/        (planned) keyword + semantic search
│       ├── analytics/     (planned) dashboard, reuse metrics, audit
│       └── common/        config, error handling
│   └── src/main/resources/db/migration/   Flyway migrations (schema owner)
├── frontend/              React + TypeScript + Vite
├── docker-compose.yml     PostgreSQL 16 + pgvector for local dev
└── .env.example
```

## Prerequisites

JDK 21, Maven 3.9+, Node 20+, Docker (for PostgreSQL).

## Run locally

```bash
# 1. database
docker compose up -d db

# 2. backend  (http://localhost:8080, health: /actuator/health)
cd backend
mvn spring-boot:run

# 3. frontend (http://localhost:5173, proxies /api -> :8080)
cd frontend
npm install
npm run dev
```

## Tests

```bash
cd backend  && mvn test
cd frontend && npm run build
```

## API (current skeleton)

| Method | Path | Description |
|---|---|---|
| POST | `/api/tickets/import` | Import a resolved ticket snapshot (idempotent on `source` + `externalId`) |
| GET | `/api/tickets`, `/api/tickets/{id}` | List / read ticket snapshots |
| POST | `/api/solutions` | Create a DRAFT solution |
| PUT | `/api/solutions/{id}` | Edit a DRAFT solution |
| POST | `/api/solutions/{id}/transition?to=IN_REVIEW` | Move through the lifecycle (illegal moves return 409) |
| GET | `/api/solutions[?status=]` | List solutions; **PUBLISHED by default** |

## Branching and conventions

- `main` is always deployable; work on `feature/<short-name>` branches and merge through pull requests reviewed by another member.
- Schema changes only through new Flyway migrations (`V<n>__description.sql`); never edit an applied migration.
- Only `PUBLISHED` solutions appear in default reuse results.
