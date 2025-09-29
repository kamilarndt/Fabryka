# Moduł: Harmonogram (Schedule)

## 1. Cel Modułu

Celem modułu "Harmonogram" jest stworzenie centralnego, interaktywnego narzędzia do wizualnego planowania i zarządzania czasem trwania projektu. Moduł ma za zadanie przekształcić listę zadań w dynamiczną oś czasu, umożliwiając managerom aktywne planowanie pracy, identyfikację ścieżki krytycznej i zarządzanie zależnościami między zadaniami.

## 2. Kluczowe Funkcjonalności

### 2.1. Interaktywny Wykres Gantta
Głównym elementem interfejsu modułu jest w pełni interaktywny wykres Gantta.

- **Wizualizacja Zadań:** Każde kluczowe zadanie w projekcie (np. produkcja konkretnego "Elementu", etap montażu przypisany do "Załogi") jest reprezentowane jako pasek na osi czasu.
- **Interaktywność (Drag & Drop):**
    - **Przesuwanie:** Użytkownik może przesuwać paski zadań w lewo i w prawo, aby zmieniać ich daty rozpoczęcia i zakończenia.
    - **Rozciąganie:** Użytkownik może "łapać" krawędzie pasków, aby zmieniać czas trwania zadania.
    - **Tworzenie Zależności:** Możliwość wizualnego łączenia zadań, aby stworzyć między nimi zależności (np. zadanie B nie może się zacząć, dopóki zadanie A się nie skończy).

### 2.2. Kamienie Milowe (Milestones)
Użytkownik może dodawać na osi czasu specjalne znaczniki – "kamienie milowe" – które reprezentują kluczowe terminy i wydarzenia w projekcie (np. "Deadline na akceptację klienta", "Start montażu").

## 3. Integracje z Innymi Modułami (Dwukierunkowa Synchronizacja)

Siła tego modułu leży w jego dwukierunkowej integracji z resztą systemu. Zmiany w jedną stronę powodują aktualizacje w drugą.

- **Elementy (`02_elements.md`):**
    - **Pobieranie Danych:** Zadania produkcyjne dla "Elementów" automatycznie pojawiają się na wykresie Gantta.
    - **Wysyłanie Danych:** Zmiana terminu lub czasu trwania zadania na wykresie Gantta **automatycznie aktualizuje** powiązane terminy w szczegółach danego "Elementu".

- **Załoga (`05_crew.md`):**
    - **Pobieranie Danych:** Etapy pracy, do których przypisano pracowników (np. "Montaż Scenografii"), pojawiają się na wykresie jako zadania.
    - **Wysyłanie Danych:** Przesunięcie zadania na osi czasu **automatycznie aktualizuje** rezerwacje w globalnym kalendarzu przypisanej do niego "Załogi".

- **Automatyczne Aktualizacje:** Postęp raportowany w innych modułach (np. ukończenie "Elementu") może być wizualnie odzwierciedlony na wykresie Gantta (np. poprzez zmianę koloru lub paska postępu na zadaniu).
