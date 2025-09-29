# 01: Architektura Techniczna

## 1. Architektura Wysokopoziomowa

Aplikacja NextFab jest zbudowana w oparciu o nowoczesną architekturę klient-serwer (client-server).

- **Klient (Frontend):** Aplikacja webowa typu Single Page Application (SPA) zbudowana w Next.js, odpowiedzialna za cały interfejs użytkownika.
- **Serwer (Backend):** Aplikacja Node.js z API typu REST, odpowiedzialna za logikę biznesową i komunikację z bazą danych.
- **Baza Danych:** System PostgreSQL zarządzany przez usługę Supabase, stanowiący centralne repozytorium danych.

Komunikacja między frontendem a backendem odbywa się poprzez wywołania API (HTTP/HTTPS), a aktualizacje w czasie rzeczywistym są obsługiwane przez mechanizmy subskrypcji Supabase.

## 2. Stos Technologiczny

Poniższa tabela przedstawia oficjalny i zatwierdzony stos technologiczny projektu.

| Warstwa      | Technologia                                                                                                     |
|--------------|-----------------------------------------------------------------------------------------------------------------|
| **Frontend** | Next.js 14+ (App Router), React 19, TypeScript, Chakra UI v3, TanStack React Query                                |
| **Backend** | Node.js, Express.js, TypeScript                                                                                 |
| **Baza Danych**| Supabase (PostgreSQL)                                                                                           |
| **Testowanie** | Vitest (testy jednostkowe), Playwright (testy End-to-End)                                                       |
| **Wdrożenie** | Docker                                                                                                          |

## 3. Architektura Frontendu

Frontend jest odpowiedzialny za renderowanie interfejsu i interakcję z użytkownikiem.

- **Routing:** Za routing odpowiada **App Router** z Next.js. Struktura folderów w `src/app` bezpośrednio odzwierciedla ścieżki URL aplikacji, zgodnie z `NAMING_CONVENTIONS.md`.
- **Komponenty:** Komponenty UI są budowane z użyciem biblioteki **Chakra UI v3**. Złożone, reużywalne komponenty aplikacyjne znajdują się w `src/components/`.
- **Zarządzanie Stanem:** Stan serwera (dane pobierane z API) jest zarządzany przez **TanStack React Query**, które obsługuje cache'owanie, odświeżanie danych w tle i optymistyczne aktualizacje. Globalny stan UI (np. stan otwartych modali) jest zarządzany za pomocą React Context lub prostych hooków.

## 4. Architektura Backendu

Backend jest sercem logiki biznesowej aplikacji.

- **API:** Backend wystawia **RESTful API**, które służy do wszystkich operacji CRUD (Create, Read, Update, Delete) na zasobach takich jak Projekty, Klienci, Elementy, Materiały.
- **Struktura:** Kod jest zorganizowany w logiczne moduły (routes, controllers, services), co ułatwia zarządzanie i rozwój.
- **Komunikacja z Bazą Danych:** Backend komunikuje się z bazą danych PostgreSQL na Supabase za pomocą klienta `supabase-js`, co pozwala na bezpieczne i wydajne operacje na danych.

## 5. Baza Danych

- **Schemat:** Schemat bazy danych jest zdefiniowany w pliku `10_DATA_MODELS.md` i odzwierciedla kluczowe encje biznesowe (projekty, klienci, elementy, materiały itd.).
- **Bezpieczeństwo:** Dostęp do danych jest chroniony przez mechanizm **Row Level Security (RLS)** w Supabase, co gwarantuje, że użytkownicy mają dostęp tylko do autoryzowanych dla nich informacji.
- **Czas Rzeczywisty:** Aplikacja wykorzystuje wbudowane w Supabase funkcje **Realtime Subscriptions**, aby na bieżąco aktualizować interfejs użytkownika w odpowiedzi na zmiany w bazie danych (np. zmiana statusu "Elementu").

## 6. Wdrożenie (Deployment)

Aplikacja jest zaprojektowana do wdrożenia z użyciem kontenerów **Docker**.

- **Konteneryzacja:** Zarówno aplikacja frontendowa, jak i backendowa posiadają własne pliki `Dockerfile`, które definiują ich środowiska uruchomieniowe.
- **Orkiestracja:** Plik `docker-compose.yml` służy do zarządzania i uruchamiania obu usług
