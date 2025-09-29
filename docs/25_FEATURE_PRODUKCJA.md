# 25: Specyfikacja Funkcjonalna - Strona Produkcji

## 1. Cel Strony

Celem strony `/produkcja` jest stworzenie centralnego **centrum dowodzenia dla kierownika produkcji**. Strona ta ma za zadanie wizualizować i zarządzać całym fizycznym procesem wytwarzania "Elementów", od momentu zakończenia prac projektowych, aż po przygotowanie ich do transportu.

## 2. Kluczowe Widoki i Funkcjonalności (MVP)

W wersji MVP, głównym i jedynym widokiem strony będzie interaktywna tablica Kanban.

### 2.1. Tablica Kanban Produkcyjna
Tablica wizualizuje przepływ "Elementów" przez wszystkie kluczowe etapy produkcyjne.

- **Kolumny Tablicy:** Kolumny odzwierciedlają pełen cykl życia "Elementu" na hali produkcyjnej, zgodnie z dokumentacją `PROJECT_MODULES.md`.
    1.  **Przygotowanie Technologiczne / CNC:** Tutaj trafiają wszystkie "Elementy" gotowe do produkcji. Dział CNC pobiera zadania z tej kolumny.
    2.  **W Produkcji:** "Elementy" aktualnie obrabiane na maszynach CNC lub na innych stanowiskach (np. spawanie, lakierowanie).
    3.  **Montaż Wstępny / Kontrola Jakości:** "Elementy" po obróbce, które są składane, sprawdzane i przygotowywane do dalszych etapów.
    4.  **Gotowe do Transportu:** Finalne, zweryfikowane "Elementy", które zostały spakowane i oczekują na załadunek przez dział logistyki.

- **Karta "Elementu":** Każda karta na tablicy powinna wyświetlać kluczowe informacje: nazwę elementu, kod, nazwę projektu oraz priorytet.

## 3. Przepływ Pracy (Workflow)

1.  Gdy "Element" w module projektu (`20_FEATURE_PROJECTS.md`) zostanie zatwierdzony przez projektanta, automatycznie pojawia się w pierwszej kolumnie tablicy Produkcji.
2.  Kierownik produkcji lub liderzy poszczególnych działów (CNC, montaż) przesuwają karty między kolumnami, aktualizując status w czasie rzeczywistym.
3.  Przesunięcie karty do ostatniej kolumny ("Gotowe do Transportu") wysyła sygnał do modułu Logistyki, że dany element jest gotowy do zaplanowania wysyłki.

## 4. Integracje z Innymi Modułami

- **Projekty:** Strona Produkcji jest nierozerwalnie związana z modułem `Elementów`. Każda zmiana statusu na tej tablicy musi być odzwierciedlona w głównym widoku projektu.
- **CNC (`24_FEATURE_CNC.md`):** Strona `/cnc` może być postrzegana jako "widok-dziecko" dla strony Produkcji. Kolumny na tablicy CNC (`Do Zrobienia`, `W Trakcie`) są bardziej szczegółowym odzwierciedleniem tego, co dzieje się w ramach kolumny `Przygotowanie Technologiczne / CNC` na głównej tablicy produkcyjnej.

## 5. Perspektywy Rozwoju (Skalowalność)

Zgodnie z zasadą modułowości, strona ta jest zaprojektowana z myślą o przyszłej rozbudowie:

- **Widok Harmonogramu:** W przyszłości planowane jest dodanie przełącznika widoku, który pozwoli wyświetlić te same zadania produkcyjne na **harmonogramie (wykresie Gantta)**. Umożliwi to precyzyjne planowanie pracy w czasie i alokację zasobów.
- **Raportowanie:** Możliwość generowania raportów dotyczących wydajności, czasów przejścia
