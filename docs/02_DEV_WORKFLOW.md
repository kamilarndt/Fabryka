# 02: Workflow i Standardy Pracy Dewelopera

## 1. Wprowadzenie

Ten dokument jest przewodnikiem dla każdego dewelopera pracującego nad projektem NextFab. Opisuje on proces od konfiguracji środowiska, przez codzienną pracę, aż po standardy jakości, które zapewniają spójność i stabilność naszej aplikacji. Przestrzeganie tych zasad jest obowiązkowe.

## 2. Konfiguracja Środowiska Deweloperskiego

### 2.1. Wymagane Narzędzia
- **Node.js** (wersja 18 lub wyższa)
- **npm** (wersja 9 lub wyższa)
- **Git**
- **Docker Desktop** (rekomendowany)

### 2.2. Uruchomienie Projektu (Rekomendowana Metoda: Docker)
Preferowaną metodą uruchamiania środowiska jest Docker, ponieważ gwarantuje spójność między maszynami deweloperów a środowiskiem produkcyjnym.

1.  **Sklonuj repozytorium:**
    ```bash
    git clone [URL-do-repozytorium]
    cd nextfab
    ```
2.  **Skonfiguruj zmienne środowiskowe:**
    - Stwórz plik `.env` w folderze `backend/` na podstawie `backend/env.example`.
    - Stwórz plik `.env.local` w folderze `nextfab/` na podstawie `nextfab/env.example`.
    - Wypełnij je wymaganymi kluczami (np. do Supabase).
3.  **Uruchom kontenery:**
    ```bash
    docker-compose up --build
    ```
    Aplikacja frontendowa będzie dostępna pod `http://localhost:3000`, a backend pod `http://localhost:5000`.

### 2.3. Uruchomienie Projektu (Metoda Alternatywna: Lokalnie)
Jeśli praca z Dockerem jest niemożliwa, projekt można uruchomić lokalnie, pamiętając o konieczności ręcznego zarządzania zależnościami i bazą danych. Wymaga to uruchomienia frontendu i backendu w osobnych terminalach.

## 3. Praca z Gitem (Git Flow)

Stosujemy prosty i sprawdzony model pracy z Gitem, oparty na gałęziach funkcyjnych (feature branches).

- **Gałąź `main`:** Jest naszą główną, stabilną gałęzią. Kod znajdujący się na `main` musi być zawsze działający i gotowy do wdrożenia.
- **Tworzenie Nowych Funkcjonalności:**
    1.  Zawsze twórz nową gałąź z aktualnej wersji `main`.
    2.  Nazwij gałąź zgodnie ze schematem: `feature/nazwa-funkcjonalnosci` (np. `feature/project-list-filters`).
    3.  Pracuj w małych, atomowych commitach z jasnymi opisami (zgodnie ze standardem Conventional Commits).
    4.  Po zakończeniu pracy i przetestowaniu, stwórz Pull Request do `main`.

## 4. Standardy Jakości Kodu

- **Linting (ESLint):** Przed każdym commitem i wysłaniem kodu na serwer, deweloper jest zobowiązany do uruchomienia lintera (`npm run lint`) i naprawienia wszystkich błędów.
- **Formatowanie (Prettier):** Projekt jest skonfigurowany do automatycznego formatowania kodu za pomocą Prettier przy każdym zapisie pliku. Zapewnia to 100% spójność stylu w całym projekcie.
- **TypeScript:** Stosujemy ścisłe zasady TypeScript. Unikamy używania typu `any`. Wszystkie funkcje i modele danych muszą mieć zdefiniowane typy.

## 5. Nasze Podejście do Testowania (TDD)

Wszystkie nowe funkcjonalności, zwłaszcza te zawierające logikę biznesową, muszą być tworzone w metodologii **Test-Driven Development (TDD)**.

### 5.1. Cykl TDD
Pracujemy w cyklu **Red-Green-Refactor**:
1.  **Czerwony (Red):** Napisz test dla funkcjonalności, której jeszcze nie ma. Uruchom go i upewnij się, że **nie przechodzi** (jest czerwony).
2.  **Zielony (Green):** Napisz **najprostszy możliwy kod**, który sprawi, że test zacznie przechodzić (stanie się zielony).
3.  **Refaktor (Refactor):** Popraw napisany kod (usuń duplikacje, popraw nazwy, zoptymalizuj), upewniając się, że testy wciąż przechodzą.

### 5.2. Przykład
Chcemy stworzyć funkcję, która generuje unikalny kod dla nowego "Elementu".

**Krok 1: Piszemy test (Red)**
```typescript
// file: /lib/elements.test.ts
import { generateElementCode } from './elements';

describe('generateElementCode', () => {
  it('should return a string starting with EL-', () => {
    const code = generateElementCode();
    expect(code.startsWith('EL-')).toBe(true);
  });
});
```
Uruchomienie testu teraz zakończy się błędem, bo funkcja nie istnieje.

**Krok 2: Piszemy kod (Green)**
```typescript
// file: /lib/elements.ts
export const generateElementCode = (): string => {
  return 'EL-12345';
};
```
Teraz test przechodzi.

**Krok 3: Robimy refaktor (Refactor)**
```typescript
// file: /lib/elements.ts
import { nanoid } from 'nanoid';

export const generateElementCode = (): string => {
  const uniqueId = nanoid(8).toUpperCase();
  return `EL-${uniqueId}`;
};
```
Kod jest lepszy, a test wciąż przechodzi. TDD zostało wykonane poprawnie.

## 7. Zaawansowane Praktyki i Automatyzacja

Aby zapewnić najwyższą jakość i spójność naszego kodu, stosujemy zautomatyzowane narzędzia, które wspierają nasz workflow.

### 7.1. Haki Gita (Git Hooks) z użyciem Husky
W projekcie skonfigurowane jest narzędzie **Husky**, które automatycznie uruchamia skrypty w kluczowych momentach pracy z Gitem.

- **Pre-commit Hook:** Przed każdym wykonaniem komendy `git commit`, Husky automatycznie uruchomi:
    1.  **Linter (ESLint):** W celu sprawdzenia spójności kodu.
    2.  **Testy jednostkowe (Vitest):** W celu weryfikacji logiki biznesowej.
- **Cel:** Ten mechanizm działa jak automatyczny strażnik jakości. Uniemożliwia wysłanie do repozytorium kodu, który zawiera błędy lub nie przechodzi podstawowych testów.

### 7.2. Standard Wiadomości Commitów (Conventional Commits)
Stosujemy i wymuszamy standard **Conventional Commits** dla wszystkich wiadomości w repozytorium.

- **Format:** `typ(zakres): opis` (np. `feat(projects): dodanie filtrowania po statusie`).
- **Narzędzie:** Używamy `commitlint`, zintegrowanego z Husky, który blokuje commity z nieprawidłowo sformatowaną wiadomością.
- **Cel:** Utrzymanie czytelnej i spójnej historii zmian oraz możliwość automatycznego generowania `CHANGELOG.md`.

### 7.3. Testy End-to-End z Playwright
Oprócz testów jednostkowych, integralną częścią naszego procesu jest testowanie End-to-End (E2E), które symuluje rzeczywiste działania użytkownika w przeglądarce.

- **Narzędzie:** Używamy **Playwright** do tworzenia i uruchamiania testów E2E.
- **Workflow:** Deweloper jest zobowiązany do uruchomienia kluczowych testów E2E (`npm run test:e2e`) lokalnie przed stworzeniem Pull Requestu dla dużych zmian, aby upewnić się, że nie zepsuł najważniejszych ścieżek użytkownika (np. procesu tworzenia projektu).
- **CI/CD:** Pełen zestaw testów Playwright jest również automatycznie uruchamiany w naszym procesie Continuous Integration po każdym pushu do `main`.
