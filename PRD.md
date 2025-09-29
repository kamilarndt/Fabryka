# NextFab - Product Requirements Document

## Przegląd Produktu
NextFab to kompleksowy system do zarządzania produkcją w Fabryce Dekoracji, lidera na polskim rynku scenografii.

## Cele Biznesowe
- Centralizacja informacji projektowych
- Atomizacja procesu produkcji
- Precyzyjne wyceny oparte na rzeczywistych danych
- Automatyzacja procesów logistycznych

## Główne Funkcjonalności MVP
1. **Projekty** - centralne zarządzanie projektami z modułowym interfejsem
2. **Klienci** - system CRM z bazą kontaktów
3. **Materiały** - UMMS (Uniwersalny System Zarządzania Materiałami)

## Tech Stack
- **Frontend**: Next.js 14, React 19, TypeScript, Chakra UI v3
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Supabase PostgreSQL
- **Testing**: Vitest, Playwright
- **Deployment**: Docker

## Success Metrics
- Redukcja czasu tworzenia wycen o 60%
- Eliminacja błędów w zarządzaniu materiałami
- Zwiększenie transparentności procesów o 100%

## User Stories

### Jako Manager Projektu
- Chcę tworzyć nowe projekty z wyborem odpowiednich modułów
- Chcę śledzić postęp projektów w czasie rzeczywistym
- Chcę generować precyzyjne wyceny na podstawie rzeczywistych kosztów

### Jako Pracownik Produkcji
- Chcę widzieć kolejkę zadań na tablicy Kanban
- Chcę aktualizować status elementów podczas produkcji
- Chcę mieć dostęp do dokumentacji technicznej

### Jako Kierownik
- Chcę mieć wgląd w KPI wszystkich projektów
- Chcę zarządzać zasobami i planować harmonogramy
- Chcę generować raporty i analizy

## Funkcjonalności Szczegółowe

### Moduł Projekty
- Lista projektów z wyszukiwaniem i filtrowaniem
- Kreator tworzenia projektu (3-krokowy)
- Widok szczegółowy z dynamicznymi modułami
- Zarządzanie statusami projektów
- Timeline i kamienie milowe

### Moduł Klienci
- Baza klientów z wyszukiwaniem
- Profil klienta z danymi kontaktowymi
- Historia projektów klienta
- Zarządzanie osobami kontaktowymi
- Notatki i dokumenty

### Moduł Materiały
- Katalog materiałów z kategoriami
- Wyszukiwanie i filtrowanie
- Specyfikacje techniczne
- Ceny i dostawcy
- Zarządzanie kategoriami

## Wymagania Niefunkcjonalne

### Performance
- Czas ładowania strony < 2 sekundy
- API response time < 500ms
- Support dla 100+ concurrent users

### Security
- JWT authentication
- Role-based access control
- Data encryption at rest
- HTTPS only

### Usability
- Responsive design (mobile-first)
- Accessibility compliance (WCAG 2.1)
- Intuitive navigation
- Error handling z user-friendly messages

### Reliability
- 99.9% uptime
- Automated backups
- Error monitoring i alerting
- Graceful degradation

## Architektura Systemu

### Frontend Architecture
- Next.js 14 z App Router
- React 19 z Server Components
- Chakra UI v3 dla design system
- TanStack React Query dla state management
- TypeScript dla type safety

### Backend Architecture
- Node.js z Express.js
- RESTful API design
- Supabase PostgreSQL database
- JWT authentication
- Structured logging

### Deployment
- Docker containers
- Environment-based configuration
- CI/CD pipeline
- Health checks i monitoring

## Roadmap

### Faza 1: MVP (Miesiąc 1-2)
- Podstawowe moduły: Projekty, Klienci, Materiały
- Authentication i authorization
- Basic CRUD operations
- Responsive UI

### Faza 2: Rozszerzenie (Miesiąc 3-4)
- Moduł Elementy (kafelki)
- System wycen
- Integracje z zewnętrznymi systemami
- Advanced reporting

### Faza 3: Optymalizacja (Miesiąc 5-6)
- Performance optimization
- Advanced analytics
- Mobile app
- API dla partnerów

## Kryteria Akceptacji

### Projekty
- [ ] Użytkownik może utworzyć nowy projekt
- [ ] Użytkownik może przeglądać listę projektów
- [ ] Użytkownik może filtrować projekty po statusie
- [ ] Użytkownik może edytować szczegóły projektu
- [ ] System generuje unikalny numer projektu

### Klienci
- [ ] Użytkownik może dodać nowego klienta
- [ ] Użytkownik może przeglądać listę klientów
- [ ] Użytkownik może wyszukiwać klientów po nazwie
- [ ] Użytkownik może edytować dane klienta
- [ ] System waliduje dane kontaktowe

### Materiały
- [ ] Użytkownik może przeglądać katalog materiałów
- [ ] Użytkownik może filtrować materiały po kategorii
- [ ] Użytkownik może wyszukiwać materiały
- [ ] Użytkownik może dodawać nowe materiały
- [ ] System zarządza kategoriami hierarchicznie

## Assumptions i Constraints

### Assumptions
- Użytkownicy mają podstawową wiedzę o systemach ERP
- Dostęp do internetu jest stabilny
- Zespół ma doświadczenie z nowoczesnymi technologiami web

### Constraints
- Budżet ograniczony do MVP w pierwszej fazie
- Timeline: 6 miesięcy na pełną implementację
- Zgodność z istniejącymi systemami firmy
- Wymagania bezpieczeństwa danych klientów

## Risk Assessment

### Technical Risks
- **High**: Integracja z istniejącymi systemami
- **Medium**: Performance przy dużej ilości danych
- **Low**: Scalability issues

### Business Risks
- **High**: User adoption
- **Medium**: Change management
- **Low**: Competitive pressure

### Mitigation Strategies
- Prototypowanie kluczowych funkcji
- Regularne testy z użytkownikami
- Szkolenia i wsparcie techniczne
- Iteracyjny development approach
