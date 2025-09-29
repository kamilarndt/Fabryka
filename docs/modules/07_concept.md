# Moduł: Koncepcja (Concept)

## 1. Cel Modułu

Celem modułu "Koncepcja" jest stworzenie zintegrowanej przestrzeni do pracy kreatywnej na wczesnym etapie projektu. Moduł ma za zadanie umożliwić zbieranie inspiracji, tworzenie wizualnych moodboardów oraz zarządzanie formalnym procesem akceptacji koncepcji, zanim projekt przejdzie do fazy technicznej.

## 2. Kluczowe Funkcjonalności

### 2.1. Zarządzanie Tablicami Koncepcyjnymi (Integracja z Miro)
Rdzeniem modułu jest głęboka integracja z zewnętrznym narzędziem Miro, które służy jako platforma do tworzenia "Concept Boardów".

- **Tworzenie Nowych Tablic:** Użytkownik (np. projektant) może z poziomu interfejsu NextFab stworzyć nową, pustą tablicę Miro dedykowaną dla danej koncepcji. Aplikacja, poprzez integrację z API Miro, automatycznie zakłada tablicę na koncie firmowym i powiązuje ją z projektem.
- **Osadzanie Tablic (Embed):** Każda stworzona tablica Miro jest osadzona (embedded) bezpośrednio w interfejsie modułu `Koncepcja`. Pozwala to na pracę na tablicy bez opuszczania ekosystemu NextFab.
- **Zarządzanie Wersjami:** Użytkownik może tworzyć wiele tablic koncepcyjnych dla jednego projektu, np. "Koncepcja Wersja 1", "Koncepcja Wersja 2".

### 2.2. Workflow Zatwierdzania
Każda tablica koncepcyjna w NextFab posiada prosty system statusów, który pozwala na formalne zarządzanie procesem akceptacji.

- **Statusy:**
    1.  `Szkic (Draft):` Koncepcja w trakcie tworzenia.
    2.  `Do Recenzji (In Review):` Projektant oznaczył koncepcję jako gotową do oceny przez managera lub klienta.
    3.  `Wymaga Poprawek (Changes Required):` Koncepcja wymaga dalszych modyfikacji.
    4.  `Zatwierdzony (Approved):` Koncepcja została finalnie zaakceptowana. Ten status może odblokowywać kolejne etapy pracy w module `Projektowanie`.
    5.  `Odrzucony (Rejected):` Koncepcja nie będzie dalej rozwijana.

### 2.3. Zarządzanie Załącznikami
Oprócz tablic Miro, moduł pozwala na dołączanie dodatkowych plików, takich jak briefy od klienta, zdjęcia, szkice czy dokumenty.

## 3. Integracje z Innymi Modułami

- **Projekty (`20_FEATURE_PROJECTS.md`):** Moduł jest jedną z opcjonalnych zakładek w widoku szczegółów projektu.
- **Projektowanie (`26_FEATURE_PROJEKTOWANIE.md`):** "Elementy" mogą być tworzone na podstawie `Zatwierdzonej` koncepcji.
- **API Zewnętrzne:** Kluczowa jest integracja z API Miro w celu tworzenia i zarządzania tablicami
