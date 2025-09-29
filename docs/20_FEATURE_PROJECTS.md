# 20: Specyfikacja Funkcjonalna - Strona Projektów

## 1. Cel Strony

Strona `/projekty` jest centralnym hubem do zarządzania całym cyklem życia projektu. Odpowiada za trzy kluczowe procesy:
1.  Przeglądanie i wyszukiwanie wszystkich projektów.
2.  Tworzenie nowych projektów za pomocą prowadzącego użytkownika kreatora.
3.  Szczegółowy wgląd i zarządzanie pojedynczym projektem poprzez dynamiczny, modułowy interfejs.

## 2. Widok Główny: Lista Projektów (`/projekty`)

Główny widok strony prezentuje listę wszystkich projektów w systemie.

- **Interfejs:** Domyślnie widok kart (`ProjectCard`), z opcją przełączenia na widok tabelaryczny.
- **Funkcjonalności:**
    - **Wyszukiwanie i Filtrowanie:** Umożliwia wyszukiwanie po nazwie oraz filtrowanie po statusie projektu.
    - **Zakładki:** Domyślne filtry "Aktualne" i "Archiwalne".
    - **Sortowanie:** Możliwość sortowania po dacie utworzenia, nazwie lub ostatniej modyfikacji.
    - **Akcja Główna:** Wyraźnie widoczny przycisk `[+ Nowy Projekt]`, który uruchamia kreator.

## 3. Kreator Nowego Projektu

Tworzenie projektu odbywa się za pomocą 3-krokowego kreatora (`ProjectCreationWizard`), który upraszcza proces i zapewnia kompletność danych.

- **Krok 1: Dane Podstawowe**
    - **Pola:** Nazwa projektu (wymagane), Numer projektu (auto-generowany), Klient (pole wyboru z listy, z opcją dodania nowego), Lokalizacja, Termin realizacji.
- **Krok 2: Wybór Modułów**
    - **Interfejs:** Lista checkboxów, gdzie użytkownik wybiera opcjonalne moduły (np. `Wycena`, `Logistyka`, `Załoga`), które będą aktywne dla tego projektu.
    - **Moduły Podstawowe:** Moduły `Overview` i `Pliki` są zawsze aktywne i nie można ich odznaczyć.
- **Krok 3: Dodatkowe Informacje**
    - **Pola:** Pole na dodatkowy opis, opcja wgrania początkowych plików od klienta.

## 4. Widok Szczegółów Projektu (`/projekt/[id]`)

Jest to dynamiczny widok, którego interfejs dopasowuje się do konfiguracji danego projektu.

### 4.1. Nagłówek Projektu
Zawiera kluczowe informacje i akcje: nazwa projektu, status, klient, oś czasu z postępem, przyciski akcji (np. `[Edytuj]`, `[Archiwizuj]`).

### 4.2. System Zakładek (Moduły)
Poniżej nagłówka znajduje się system zakładek (`ModuleTabs`), które są dynamicznie generowane na podstawie modułów wybranych w kreatorze.

### 4.3. Moduł `Overview` (Przegląd) - Zawsze Aktywny
Jest to "centrum dowodzenia" projektu. Składa się z siatki "widżetów", zaprojektowanej z myślą o przyszłej rozbudowie.

- **Widżety w wersji MVP:**
    1.  **Podstawowe Dane:** Panel z kluczowymi informacjami (klient, terminy, lokalizacja).
    2.  **Status "Elementów":** Podsumowanie liczby "Elementów" w poszczególnych statusach produkcyjnych (np. "5 w produkcji", "12 gotowych").
    3.  **Podsumowanie Budżetu:** Prosty wskaźnik pokazujący planowane vs. wydane środki (widoczny, jeśli moduł `Wycena` jest aktywny).
    4.  **Kluczowe Terminy:** Lista nadchodzących kamieni milowych z osi czasu.
    5.  **Ostatnia Aktywność:** "Feed" z ostatnimi zdarzeniami w projekcie.

### 4.4. Inne Moduły (Przykłady)
- **Zakładka `Elementy`:** Jeśli aktywny jest moduł `Elementy`, w tej zakładce pojawi się główny interfejs do zarządzania "kafelkami" – tablica Kanban lub lista, zgodnie ze specyfikacją `ELEMENTS_MODULE.md`.
- **Zakładka `Wycena`:** Jeśli aktywny, pojawi się tu interfejs do tworzenia kosztorysu.
- ...i tak dalej dla każdego aktywnego modułu.
