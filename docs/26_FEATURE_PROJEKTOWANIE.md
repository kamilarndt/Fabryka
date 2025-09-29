# 26: Specyfikacja Funkcjonalna - Strona Projektowania

## 1. Cel Strony

Celem strony `/projektowanie` jest stworzenie scentralizowanego i wydajnego środowiska pracy dla działu projektowego. Strona ta ma za zadanie zarządzać przepływem zadań projektowych ("Elementów"), od momentu ich zdefiniowania, aż po finalne zatwierdzenie i przekazanie do produkcji.

## 2. Kluczowe Widoki i Funkcjonalności

Interfejs strony składa się z dwóch głównych komponentów, które wspierają elastyczny model pracy.

### 2.1. Poczekalnia Zadań (Task Pool)
Jest to ogólna pula wszystkich "Elementów", które wymagają pracy projektowej i czekają na przypisanie.

- **Widok:** Tabela lub lista kart.
- **Wyświetlane Informacje:** Nazwa "Elementu", nazwa projektu, priorytet, data utworzenia.
- **Funkcjonalności:**
    - **Filtrowanie:** Możliwość filtrowania zadań po projekcie lub priorytecie.
    - **Akcje:** Przyciski lub menu kontekstowe dla każdego zadania, umożliwiające realizację obu modeli pracy (patrz sekcja 3).

### 2.2. Mój Warsztat (My Workshop)
Jest to osobista tablica Kanban dla każdego zalogowanego projektanta, na której widoczne są tylko zadania mu przypisane.

- **Widok:** Tablica Kanban.
- **Kolumny Tablicy:**
    1.  **Do Zrobienia (To Do):** Zadania przypisane, ale jeszcze nie rozpoczęte.
    2.  **W Trakcie (In Progress):** Zadanie, nad którym projektant aktywnie pracuje.
    3.  **Do Akceptacji (For Review):** Ukończone projekty "Elementów", które oczekują na zatwierdzenie przez kierownika lub klienta.
    4.  **Ukończone (Completed):** Finalnie zatwierdzone "Elementy", gotowe do przekazania na produkcję.
- **Interakcje:** Projektant zarządza swoją pracą, przesuwając karty (zadania) między kolumnami.

## 3. Przepływ Pracy (Workflow) - Model Mieszany

Aplikacja wspiera dwa modele przypisywania zadań, aby zapewnić maksymalną elastyczność:

1.  **Model "Pull" (Projektant pobiera zadanie):**
    - Projektant wchodzi na widok "Poczekalni Zadań".
    - Wybiera interesujący go "Element".
    - Klika przycisk **[Pobierz zadanie]**.
    - Zadanie znika z "Poczekalni" i pojawia się w pierwszej kolumnie jego osobistej tablicy "Mój Warsztat".

2.  **Model "Push" (Manager przypisuje zadanie):**
    - Kierownik projektu lub manager wchodzi na widok "Poczekalni Zadań".
    - Przy wybranym "Elemencie" rozwija menu akcji i wybiera opcję **[Przypisz do...]**.
    - Z listy wybiera dostępnego projektanta.
    - Zadanie znika z "Poczekalni" i pojawia się w pierwszej kolumnie na tablicy "Mój Warsztat" wybranego projektanta.

## 4. Integracje z Innymi Modułami

- **Projekty (`20_FEATURE_PROJECTS.md`):** Nowo tworzone "Elementy" w projektach automatycznie trafiają do "Poczekalni Zadań".
- **Produkcja (`25_FEATURE_PRODUKCJA.md`):** "Element", który w "Moim Warsztacie" zostanie przesunięty do kolumny "Ukończone", musi automatycznie pojawić się w pierwszej kolumnie na tablicy produkcyjnej.
- **Integracje 3D (Speckle/Rhino):** Każda karta "Elementu" na tablicy "Mój Warsztat" musi b
