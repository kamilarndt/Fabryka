# Moduł: Załoga (Crew)

## 1. Cel Modułu

Dynamiczne zarządzanie personelem projektowym. Moduł umożliwia wizualne planowanie obsady, przypisywanie pracowników do konkretnych zadań w harmonogramie oraz automatyczną rezerwację ich czasu i aktualizację statusu w całym systemie.

## 2. Interfejs Użytkownika i Przepływ Pracy

Głównym widokiem modułu w ramach projektu będzie interaktywna tablica do planowania obsady.

### 2.1. Baza Pracowników (Widok Globalny)
- Poza projektami, w głównej sekcji aplikacji `/załoga`, znajduje się baza danych wszystkich pracowników.
- Każda osoba jest reprezentowana przez **kartę pracownika** zawierającą kluczowe informacje: zdjęcie, imię i nazwisko, główną specjalizację oraz kolorowy wskaźnik statusu (`🟢 Dostępny` / `🔴 Zajęty`).

### 2.2. Interfejs Przypisywania w Projekcie
- W zakładce "Załoga" danego projektu interfejs podzielony jest na dwie strefy:
    - **"Bank Pracowników" (Panel boczny):** Biblioteka kart pracowników, którzy są **dostępni** w okresie trwania projektu. Użytkownik może filtrować bank według specjalizacji (np. pokaż tylko montażystów).
    - **"Etapy Projektu" (Obszar główny):** Wizualna reprezentacja zadań z harmonogramu wymagających obsady (np. "Montaż Scenografii: 01.12 - 06.12"). Każdy etap jest osobną strefą docelową.

### 2.3. Mechanizm Drag & Drop
1.  Użytkownik wybiera kartę pracownika z "Banku" i przeciąga ją w kierunku etapów projektu.
2.  W trakcie przeciągania, w strefach docelowych (etapach) pojawiają się **dynamiczne placeholdery**, wskazujące możliwe miejsce upuszczenia karty.
3.  Po upuszczeniu karty na wybrany etap, jest ona **automatycznie układana w schludnym rzędzie** obok innych przypisanych już pracowników.
4.  System prosi o finalne potwierdzenie dat, po czym następuje automatyczna synchronizacja.

## 3. Automatyzacje i Integracje

- **Kalendarz i Status:** Przypisanie pracownika natychmiast rezerwuje jego czas w kalendarzu globalnym i zmienia jego status na "Zajęty", uniemożliwiając podwójne rezerwacje.
- **Wycena (`03_quotation.md`):** Zapisanie obsady na etapie **wysyła sygnał do modułu "Wycena"**, aby automatycznie zasugerować wygenerowanie powiązanych z tym kosztów (robocizna, catering, zakwaterowanie).

## 4. Kierunek Rozwoju: Inteligentne Wyszukiwanie Zakwaterowania

Jako przyszłe, strategiczne usprawnienie, planowana jest integracja z zewnętrznym API platform rezerwacyjnych (np. Booking.com).

- **Koncepcja:** W momencie, gdy moduł "Załoga" generuje w wycenie pozycję `Zakwaterowanie`, system mógłby proaktywnie pomóc kierownikowi produkcji w znalezieniu noclegu.
- **Implementacja:** System, znając adres lokalizacji projektu oraz wymagane daty, wysyłałby w tle zapytanie do API o dostępne obiekty w najbliższej okolicy i prezentował listę 3-5 sugerowanych hoteli/apartamentów wraz z szacunkową ceną i odległością.
- **Korzyść:** Drastyczne skrócenie czasu potrzebnego na research i logistykę.
