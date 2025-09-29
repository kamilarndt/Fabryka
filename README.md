# NextFab - System Zarządzania Produkcją

Kompleksowy system do zarządzania produkcją w Fabryce Dekoracji, lidera na polskim rynku scenografii.

## 🚀 Szybki Start

### Opcja 1: Docker (Rekomendowana)
```bash
# Sklonuj repozytorium
git clone [URL-repozytorium]
cd nextfab

# Uruchom z Docker
docker-compose up --build

# Aplikacja będzie dostępna pod:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432
```

### Opcja 2: Lokalne środowisko
```bash
# Instaluj dependencies
npm run setup

# Uruchom development environment
npm run dev

# Lub użyj skryptów
npm run dev:setup
```

## 🛠️ Dostępne Skrypty

```bash
# Development
npm run dev              # Uruchom frontend + backend
npm run dev:frontend     # Tylko frontend
npm run dev:backend      # Tylko backend

# Build
npm run build            # Build frontend + backend
npm run build:frontend   # Tylko frontend
npm run build:backend    # Tylko backend

# Testy
npm run test             # Wszystkie testy
npm run test:frontend    # Testy frontendu
npm run test:backend     # Testy backendu

# Linting
npm run lint             # Lint całego projektu
npm run lint:frontend    # Lint frontendu
npm run lint:backend     # Lint backendu

# Utilities
npm run setup            # Instalacja dependencies
npm run clean            # Czyszczenie node_modules
```

## 📁 Struktura Projektu

```
nextfab/
├── frontend/            # Next.js aplikacja
├── backend/             # Node.js/Express API
├── docs/               # Dokumentacja
├── scripts/            # Skrypty automatyzacji
├── .cursor/            # Konfiguracja Cursor IDE
├── docker-compose.yml  # Docker setup
└── package.json        # Workspace configuration
```

## 🎯 Stack Technologiczny

- **Frontend:** Next.js 14+, React 19, Chakra UI v3, TanStack React Query, TypeScript
- **Backend:** Node.js, Express.js, TypeScript
- **Baza Danych:** Supabase (PostgreSQL)
- **Testowanie:** Vitest, Playwright
- **Deployment:** Docker

## 📚 Dokumentacja

Wszystka dokumentacja znajduje się w folderze `/docs`:
- `00_OVERVIEW.md` - Przegląd i wizja aplikacji
- `01_ARCHITECTURE.md` - Architektura techniczna
- `02_DEV_WORKFLOW.md` - Workflow deweloperski
- `03_DESIGN_SYSTEM.md` - Design system
- `10_DATA_MODELS.md` - Modele danych
- `11_API_REFERENCE.md` - Dokumentacja API

## 🔧 Konfiguracja Środowiska

1. Skopiuj `.env.example` do `.env`
2. Wypełnij zmienne środowiskowe
3. Uruchom `npm run setup`
4. Uruchom `npm run dev`

## 🧪 Testowanie

```bash
# Wszystkie testy
npm run test

# Testy z coverage
npm run test:coverage

# Testy E2E
npm run test:e2e
```

## 🚀 Deployment

```bash
# Build production
npm run build

# Docker deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Przeczytaj dokumentację w `/docs`
2. Zastosuj TDD (Test-Driven Development)
3. Używaj konwencji nazewnictwa z `NAMING_CONVENTIONS.md`
4. Przetestuj zmiany przed commitem

## 📄 Licencja

Prywatny projekt Fabryki Dekoracji.