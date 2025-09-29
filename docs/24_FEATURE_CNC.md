# 24: Specyfikacja Funkcjonalna - Strona CNC

## 1. Cel Strony

Celem strony `/cnc` jest stworzenie prostego i czytelnego interfejsu dla operatorów maszyn CNC do zarządzania kolejką zadań produkcyjnych. Strona ma minimalizować czas potrzebny na znalezienie informacji i aktualizację statusu, koncentrując się wyłącznie na przepływie "Elementów" przez proces obróbki.

## 2. Kluczowe Widoki i Funkcjonalności

### 2.1. Główny Widok (`/cnc`) - Tablica Kanban
Głównym i jedynym elementem strony jest interaktywna tablica Kanban, która wizualizuje proces produkcyjny.

- **Kolumny Tablicy:**
    1.  **Do Zrobienia (Queue):** Lista "Elementów", które zostały zatwierdzone przez dział projektowy i oczekują na rozpoczęcie obróbki. Elementy są tu sortowane według priorytetu ustalonego przez kierownika produkcji.
    2.  **W Trakcie (In Progress):** "Elementy", które są aktualnie obrabiane na maszynie CNC. W tej kolumnie powinien znajdować się tylko jeden, maksymalnie kilka elementów jednocześnie, w zależności od liczby maszyn.
    3.  **Ukończone (Completed):** "Elementy", których obróbka została zakończona. Po przeniesieniu do tej kolumny, są gotowe do przekazania na stanowisko montażowe.

- **Interakcje:**
    - **Przeciągnij i Upuść (Drag & Drop):** Operator może łatwo przesuwać "Elementy" (karty) między kolumnami, aby zaktualizować ich status.
    - **Filtrowanie:** Możliwość szybkiego filtrowania zadań po nazwie projektu, do którego należą.

### 2.2. Karta "Elementu" na Tablicy
Każde zadanie na tablicy jest reprezentowane przez kartę z kluczowymi informacjami.

- **Wyświetlane Informacje:**
    - **Nazwa Elementu** i jego unikalny kod (np. "Panel Boczny Lewy", `PBL-007`).
    - **Nazwa Projektu**, do którego należy element.
    - **Materiał:** Rodzaj i grubość materiału (np. "MDF 18mm").
    - **Ikonka Pliku DXF:** Klikalna ikona otwierająca podgląd pliku.

### 2.3. Podgląd Pliku DXF
Kliknięcie na kartę "Elementu" lub ikonkę DXF otwiera modal z podglądem pliku technicznego.

- **Funkcjonalności Modala:**
    - **Podgląd geometrii:** Wizualizacja ścieżek cięcia.
    - **Przełącznik warstw:** Możliwość włączania i wyłączania poszczególnych warstw pliku DXF, aby lepiej zrozumieć operacje do wykonania.

## 3. Integracje z Innymi Modułami

- **Elementy / Kafelki (`20_FEATURE_PROJECTS.md`):** Strona CNC jest bezpośrednio zasilana danymi z modułu Elementów. Gdy "Element" w widoku projektu osiągnie status np. `design_approved`, automatycznie pojawia się w kolumnie "Do Zrobienia" na tablicy CNC.
- **Aktualizacja Statusu:** Zmiana statusu na tablicy Kanban (np. przesunięcie do "Ukończone") musi automatycznie aktualizować status tego "Elementu" w całym systemie, aby był on widoczny w widoku projektu.
