# Moduł: Logistyka (Logistics)

## 1. Cel Modułu

Usprawnienie i centralizacja całego procesu przemieszczania elementów scenografii, narzędzi oraz załogi pomiędzy magazynem a lokalizacją projektu. Moduł ma na celu zapewnienie, że odpowiednie zasoby znajdą się we właściwym miejscu i czasie, przy jednoczesnej optymalizacji kosztów i transparentności procesu.

## 2. Kluczowe Funkcjonalności

### 2.1. Zarządzanie Flotą i Transportem
- **Baza Pojazdów:** Ewidencja wszystkich pojazdów firmowych (busy, ciężarówki) z kluczowymi danymi: nazwa, nr rejestracyjny, ładowność (kg), pojemność (m³), status (dostępny, w trasie, w serwisie) oraz koszt za kilometr.
- **Harmonogram Transportu:** Możliwość rezerwacji pojazdów na konkretne projekty i terminy. System będzie zintegrowany z głównym kalendarzem, aby unikać konfliktów i podwójnych rezerwacji.

### 2.2. Cyfrowe Listy Przewozowe i Pakowe
- **Tworzenie List:** Do każdego zaplanowanego transportu (zarówno na montaż, jak i na demontaż) będzie można stworzyć dedykowaną listę pakową.
- **Powiązanie z Elementami Projektu:** Interfejs tworzenia listy będzie pozwalał na bezpośrednie dodawanie "Elementów" z danego projektu. Użytkownik będzie widział listę wszystkich komponentów i przypisywał je do konkretnego transportu.
- **Śledzenie Statusu Elementów:** Każdy element na liście będzie posiadał status, który załoga będzie mogła aktualizować (np. na urządzeniu mobilnym): `W magazynie` ➡️ `Załadowane` ➡️ `Na miejscu` ➡️ `Spakowane do powrotu` ➡️ `Wróciło do magazynu`.

### 2.3. Zarządzanie Zadaniami na Miejscu
- W ramach każdego projektu, moduł logistyki pozwoli na stworzenie listy zadań montażowych i demontażowych.
- Kierownik produkcji będzie mógł zdefiniować zadania (np. "Rozładunek Tira 1", "Montaż podestów") i przypisać do nich osoby z modułu `Załoga`.
- Załoga na miejscu będzie mogła oznaczać zadania jako wykonane, co da kierownikowi produkcji zdalny wgląd w postęp prac.

## 3. Interfejs Użytkownika i Przepływ Pracy

### 3.1. Planowanie Transportu
1.  W zakładce "Logistyka" projektu, użytkownik klika `[Zaplanuj transport]`.
2.  W oknie modalnym wybiera pojazd z floty, kierowcę (z modułu `Załoga`) oraz daty wyjazdu i planowanego powrotu.

### 3.2. Tworzenie Listy Pakowej
1.  Po utworzeniu transportu, użytkownik przechodzi do tworzenia listy pakowej.
2.  Otwiera się widok z dwoma panelami:
    - **Po lewej:** Lista wszystkich "Elementów" należących do projektu.
    - **Po prawej:** Pusta lista pakowa dla wybranego pojazdu, z informacją o jego ładowności.
3.  Użytkownik przeciąga elementy z lewej strony na prawą. System może na bieżąco pokazywać, jak bardzo załadowany jest pojazd.
4.  Gotową listę można wydrukować lub udostępnić cyfrowo zespołowi.

## 4. Integracja z Modułem "Wycena"
- Po wybraniu lokalizacji projektu i zaplanowaniu transportu, system automatycznie oblicza dystans.
- Na podstawie dystansu i zdefiniowanego w bazie floty kosztu za kilometr, system automatycznie generuje lub aktualizuje pozycję `Transport` w module `Wycena`.
