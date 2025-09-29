# Moduł: Pliki (Files)

## 1. Cel Modułu

Celem modułu "Pliki" jest stworzenie centralnego, zorganizowanego repozytorium dla wszystkich plików związanych z projektem. Interfejs modułu ma działać jako **bezpośrednie, lustrzane odbicie** fizycznej struktury folderów na dysku sieciowym (np. `Z:\_NoweRozdanie\[KLIENT]\[PROJEKT]`), zapewniając łatwy dostęp do dokumentacji z poziomu aplikacji.

## 2. Kluczowe Funkcjonalności

### 2.1. Przeglądarka Plików i Folderów
Głównym elementem interfejsu jest przeglądarka, która w czasie rzeczywistym odzwierciedla zawartość dedykowanego folderu projektu na dysku sieciowym.

- **Nawigacja:** Użytkownik może nawigować po folderach i podfolderach tak, jak w standardowym menedżerze plików.
- **Operacje na Plikach:** Interfejs umożliwia podstawowe operacje:
    - **Wgrywanie (Upload):** Możliwość wgrywania nowych plików, które są fizycznie zapisywane w odpowiedniej lokalizacji na dysku sieciowym.
    - **Pobieranie (Download):** Możliwość pobierania plików.
    - **Podgląd:** Integracja z prostymi viewerami dla popularnych formatów (PDF, obrazy).

### 2.2. Automatyczna Struktura Folderów
Struktura folderów dla każdego projektu jest tworzona **automatycznie** przez system w momencie aktywacji poszczególnych modułów.

- **Logika Tworzenia:** Gdy użytkownik włącza dla projektu nowy moduł (np. `Wycena`), aplikacja sprawdza, czy na dysku sieciowym w folderze projektu istnieje odpowiadający mu podfolder (`/WYCENA`). Jeśli nie, tworzy go.
- **Przykładowa Struktura:**
```
📁 [NAZWA_PROJEKTU]/
├── 📁 KONCEPCJA/      # (Tworzony, gdy moduł Koncepcja jest aktywny)
├── 📁 WYCENA/         # (Tworzony, gdy moduł Wycena jest aktywny)
└── 📁 PRODUKCJA/      # (Tworzony, gdy moduł Elementy jest aktywny)
```

### 2.3. Funkcja "Przypnij do Ulubionych"
Aby ułatwić dostęp do kluczowych dokumentów (np. finalna oferta, główny rysunek techniczny), użytkownik ma możliwość "przypięcia" najważniejszych plików.

- **Interfejs:** "Przypięte" pliki pojawiają się w osobnej, łatwo dostępnej sekcji na górze widoku modułu.

## 3. Wymagania Techniczne i Architektura

- **Bezpośredni Dostęp do Dysku:** Backend aplikacji musi mieć stały dostęp do dysku sieciowego (`Z:\_NoweRozdanie` lub inna skonfigurowana ścieżka) z odpowiednimi uprawnieniami do odczytu i zapisu.
- **API:** Backend musi wystawiać endpointy API do listowania zawartości folderów, wgrywania i pobierania plików, które będą działać jako proxy między frontendem a systemem plików na serwerze.
