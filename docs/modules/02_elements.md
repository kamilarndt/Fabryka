# Moduł: Elementy (Kafelki)

## 1. Cel Modułu

Moduł "Elementy" jest sercem systemu produkcyjnego NextFab. Jego celem jest przekształcenie cyfrowego projektu w listę fizycznych, zarządzalnych i śledzonych komponentów, które przechodzą przez pełny cykl produkcyjny.

## 2. Kluczowe Koncepcje

### 2.1. Element vs Egzemplarz
To fundamentalne rozróżnienie jest kluczem do precyzyjnego zarządzania produkcją:
- **📦 Element:** Jest to **projekt** lub **wzór** jednego, unikalnego komponentu (np. "Pulpit kandydata"). Zawiera on listę materiałów (BOM), dokumentację techniczną i pliki dla maszyn.
- **🏷️ Egzemplarz:** Jest to **konkretna, fizyczna kopia** danego Elementu. Jeśli projekt wymaga 5 pulpitów, będziemy mieli jeden "Element" i pięć "Egzemplarzy", każdy z własnym, indywidualnie śledzonym statusem.

## 3. Cykl Życia Elementu

Każdy "Egzemplarz" przechodzi przez zdefiniowane etapy, które są odzwierciedlone jako kolumny na tablicy Kanban:
1.  **Projekt/Koncepcja:** Nowy, zdefiniowany, ale niezatwierdzony.
2.  **Akceptacja Klienta:** Projekt "Elementu" został zaakceptowany.
3.  **Przygotowanie Technologiczne/CNC:** Przygotowywanie plików i programów na maszyny.
4.  **W Produkcji:** "Element" jest fizycznie produkowany.
5.  **Montaż Wstępny/Kontrola Jakości:** Sprawdzanie i składanie.
6.  **Gotowe do Transportu:** Spakowany i czeka na załadunek.
7.  **Na Miejscu:** Dostarczony do lokalizacji docelowej.

## 4. Interfejs Użytkownika

Interfejs modułu oferuje dwa widoki, z łatwo dostępnym przełącznikiem.

### 4.1. Widok Domyślny: Tablica Kanban
Głównym narzędziem pracy jest tablica Kanban, która wizualizuje przepływ "Egzemplarzy" przez cykl życia. Kolumny na tablicy odpowiadają statusom opisanym w punkcie 3.

### 4.2. Widok Alternatywny: Siatka (Grid)
Użytkownik może przełączyć się na widok siatki, który prezentuje "Elementy" jako galerię interaktywnych kart. Ten widok jest idealny do szybkiego, wizualnego przeglądu wszystkich komponentów w projekcie.

## 5. Widok Szczegółów Elementu

Kliknięcie na "Element" (niezależnie od widoku) otwiera panel lub modal ze szczegółowymi informacjami:
- **Podgląd modelu 3D** (zintegrowany viewer, np. Speckle).
- **Lista Materiałów (BOM)** potrzebnych do wyprodukowania jednego "Egzemplarza".
- **Dokumentacja Techniczna** (pliki PDF, DXF).
- **Lista wszystkich Egzemplarzy** tego "Elementu" wraz z ich aktualnymi statusami.

## 6. Integracje z Innymi Modułami

- **Wycena:** Suma materiałów z BOM wszystkich "Elementów" i ich "Egzemplarzy" automatycznie zasila moduł `Wycena`.
- **Logistyka:** Tylko "Egzemplarze" ze statusem "Gotowe do Transportu" mogą być dodane do cyfrowych listów przewozowych.
- **Produkcja i CNC:** Statusy na tablicach `/produkcja` i `/cnc` są bezpośrednio powiązane ze statusami "Egzemplarzy" w tym module.
