# NextFab - Moduł Elementy (Kafelki)

## 📋 Przegląd

Moduł **Elementy (Kafelki)** to serce całego systemu produkcyjnego NextFab. Jest to centralny moduł zarządzania elementami projektów, który umożliwia przekształcenie cyfrowego projektu w listę fizycznych, zarządzalnych komponentów przechodzących przez pełny cykl produkcyjny.

## 🎯 Cel Modułu

Stworzenie centralnego repozytorium dla **wszystkich fizycznych komponentów** składających się na dany projekt. Moduł ten ma za zadanie zidentyfikować, śledzić i zarządzać każdym elementem scenografii – od koncepcji, przez produkcję, aż po montaż na miejscu. Jest to pomost między wirtualnym modelem 3D a rzeczywistością warsztatową i montażową.

## 🔑 Kluczowe Koncepcje

### Element vs Egzemplarz

Aby precyzyjnie zarządzać produkcją, wprowadzamy dwa fundamentalne pojęcia:

#### 📦 **Element**
- Jest to **projekt** lub **wzór** jednego, unikalnego komponentu scenografii
- Przykłady: "Pulpit kandydata", "Totem świetlny", "Budka kontrolna", "Panel frontowy"
- Element jest definicją, która zawiera:
  - Listę materiałów (BOM - Bill of Materials)
  - Dokumentację techniczną
  - Pliki CNC
  - Powiązany model 3D
  - Specyfikacje techniczne

#### 🏷️ **Egzemplarz**
- Jest to **konkretna, fizyczna kopia** danego Elementu
- Jeśli projekt wymaga zbudowania pięciu identycznych totemów, będziemy mieli:
  - **Jeden Element**: "Totem świetlny"
  - **Pięć Egzemplarzy**: #1, #2, #3, #4, #5
- Każdy Egzemplarz ma swój własny, niezależny status w cyklu produkcyjnym i logistycznym

Ta separacja pozwala na precyzyjne śledzenie produkcji i logistyki każdego pojedynczego obiektu.

## 🔄 Cykl Życia Elementu

Każdy Element (a dokładniej jego Egzemplarze) przechodzi przez zdefiniowany cykl życia, który jest wizualizowany jako tablica Kanban.

### Etapy Cyklu Życia

#### 1. 🆕 **Projekt/Koncepcja**
- **Status**: Nowy element, zdefiniowany, ale jeszcze niezatwierdzony do produkcji
- **Opis**: Element został utworzony z blockoutu lub koncepcji
- **Akcje**: Weryfikacja wymiarów, materiałów, możliwości produkcyjnych

#### 2. ✅ **Akceptacja Klienta**
- **Status**: Projekt elementu został zaakceptowany przez klienta
- **Opis**: Element przeszedł proces zatwierdzania i może przejść do produkcji
- **Akcje**: Finalizacja dokumentacji, przygotowanie do produkcji

#### 3. 🔧 **Przygotowanie Technologiczne/CNC**
- **Status**: Przygotowywanie plików i programów na maszyny
- **Opis**: Tworzenie programów CNC, optymalizacja cięcia, przygotowanie materiałów
- **Akcje**: Generowanie plików DXF, programowanie maszyn, rezerwacja materiałów

#### 4. ⚙️ **W Produkcji**
- **Status**: Element jest fizycznie produkowany w warsztacie
- **Opis**: Proces cięcia, obróbki, montażu wstępnego
- **Akcje**: Monitoring postępu, kontrola jakości, dokumentacja

#### 5. 🔍 **Montaż Wstępny/Kontrola Jakości**
- **Status**: Sprawdzanie i składanie elementów w warsztacie
- **Opis**: Kontrola jakości, testy funkcjonalne, montaż wstępny
- **Akcje**: Inspekcja, poprawki, dokumentacja jakości

#### 6. 📦 **Gotowe do Transportu**
- **Status**: Element jest spakowany i czeka na załadunek
- **Opis**: Elementy są zabezpieczone, spakowane i gotowe do wysyłki
- **Akcje**: Pakowanie, etykietowanie, dodanie do listy transportowej

#### 7. 🚚 **Na Miejscu**
- **Status**: Element został dostarczony do lokalizacji docelowej
- **Opis**: Element dotarł na miejsce realizacji projektu
- **Akcje**: Rozpakowanie, montaż końcowy, odbiór przez klienta

## 🎨 Tworzenie Elementów z Modeli 3D

### Blockout - Prymitywny Model
- **Bryłowa reprezentacja** ostatecznego produktu
- **Orientacyjne wymiary** i kształty
- **Import z systemów 3D** (Speckle, Rhino)
- **Dzielenie na elementy** w 3D Viewer

### Przypisywanie Materiałów
- **Orientacyjne koszty** wyprodukowania
- **Selekcja powierzchni** w modelu 3D
- **Przypisanie materiału** z katalogu magazynowego
- **Wstępna kalkulacja** kosztów

## 🖥️ Interfejs Użytkownika

### Widok Siatki (Grid View)
**Domyślny widok** - galeria interaktywnych kart (komponent `Card` z Chakra UI)

**Elementy karty:**
- **Miniatura** (render z modelu 3D)
- **Nazwa elementu**
- **Wskaźnik postępu** produkcji (np. "3 z 5 Egzemplarzy gotowe")
- **Status** z kolorowym wskaźnikiem
- **Szybkie akcje** (edytuj, duplikuj, usuń)

### Widok Kanban (Kanban View)
**Tablica przedstawiająca** cykl życia elementu

**Kolumny:**
- Każda kolumna odpowiada etapowi cyklu życia
- **Karty reprezentują Egzemplarze** (nie Elementy)
- **Drag & Drop** między kolumnami aktualizuje status
- **Kolorowe wskaźniki** postępu

### Szczegóły Elementu
**Pełna strona** z kompletnymi informacjami o elemencie

**Centralny punkt:**
- **Podgląd modelu 3D** przez viewer (Speckle integration)

**Boczna szuflada (Drawer):**
- **Dane podstawowe**: Nazwa, opis, kod identyfikacyjny
- **Specyfikacje techniczne**: Wymiary, waga, materiały
- **Historia zmian**: Log wszystkich modyfikacji
- **Komentarze**: Notatki zespołu

**Dolna szuflada:**
- **Materiały (BOM)**: Lista materiałów potrzebnych do wyprodukowania
- **Kalkulacja kosztów**: Orientacyjne i finalne koszty
- **Dokumentacja**: Pliki PDF, DXF, instrukcje montażu

**Sekcja Egzemplarzy:**
- **Lista wszystkich** fizycznych egzemplarzy
- **Status każdego** egzemplarza na tablicy Kanban
- **Historia** każdego egzemplarza
- **Lokalizacja** (magazyn, transport, na miejscu)

## 📋 Poczekalnia Elementów

### Funkcjonalności
- **Lista elementów** do zaprojektowania
- **Przypisywanie przez menedżera** projektu
- **Samodzielne pobieranie** przez projektantów
- **Kolejność** - priorytet i terminy
- **Status** - dostępny/zajęty

### Zarządzanie
- **Menedżer projektu** - przypisuje elementy do projektantów
- **Projektanci** - pobierają elementy do warsztatu
- **System kolejkowania** - optymalna kolejność realizacji

## 👨‍💻 Dział Projektowy

### Warsztat Projektanta
- **Pobieranie elementów** z poczekalni
- **Estymacja czasu** - ile potrzeba na model 3D
- **Timeline osobisty** - zajętość pracy
- **Status** - nad czym aktualnie pracuje

### Profil Projektanta
- **Aktualny projekt** - nad czym pracuje
- **Timeline projektowy** - harmonogram zadań
- **Timeline koncepcyjny** - prace koncepcyjne
- **Historia projektów** - zrealizowane elementy

### Proces Projektowy
1. **Pobranie elementu** z poczekalni
2. **Określenie czasu** potrzebnego na model
3. **Projektowanie** - tworzenie modelu 3D
4. **Generowanie plików** do CNC
5. **Dostarczenie** do kolejki CNC

## ⚙️ Kolejka CNC

### Elementy Gotowe do Produkcji
- **Modele 3D** - gotowe do wycięcia
- **Pliki CNC** - programy do maszyn
- **Materiały** - dostępne na magazynie
- **Priorytet** - kolejność realizacji

### Statusy w CNC
- 🔄 **W kolejce** - oczekuje na maszynę
- ⚙️ **W trakcie cięcia** - na maszynie CNC
- ✅ **Wycięte** - gotowe elementy
- 📦 **Do montażu** - przekazane do montażu

## 🎯 Zarządzanie Przepływem

### Menedżer Projektu
- **Przypisywanie elementów** do projektantów
- **Kontrola postępu** - timeline projektów
- **Priorytetyzacja** - ważne elementy
- **Koordynacja** - między działami

### Projektanci
- **Samodzielne pobieranie** - z poczekalni
- **Estymacja czasu** - planowanie pracy
- **Aktualizacja statusów** - postęp prac
- **Dostarczanie** - gotowych modeli

### Automatyzacja
- **Powiadomienia** - o nowych elementach
- **Aktualizacja statusów** - automatyczna
- **Kolejkowanie** - optymalna kolejność
- **Kontrola terminów** - alerty opóźnień

## 📊 Timeline i Harmonogramy

### Oś Czasu Projektanta
- **Zajętość pracy** - co robi i kiedy
- **Wolne terminy** - dostępność
- **Deadline'y** - terminy realizacji
- **Obciążenie** - ile ma pracy

### Harmonogram Projektu
- **Etapy elementów** - timeline każdego kafelka
- **Zależności** - co musi być zrobione wcześniej
- **Krytyczna ścieżka** - najdłuższa droga
- **Bufor czasowy** - margines bezpieczeństwa

## 💰 Kalkulacja Kosztów

### Etapy Kalkulacji
1. **Blockout** - orientacyjne koszty materiałów
2. **Po projektowaniu** - dokładne wymiary i materiały
3. **Po produkcji** - rzeczywiste koszty
4. **Finalne** - koszt końcowy elementu

### Składniki Kosztu
- **Materiały** - z katalogu magazynowego
- **Robocizna projektowa** - czas projektanta
- **Robocizna produkcyjna** - czas CNC/montażu
- **Narzuty** - marża i koszty ogólne

## 🔄 Integracja Systemowa

### Przepływ Danych
```
Model 3D → Kafelek → Poczekalnia → Projektant → CNC → Produkcja → Montaż
```

### Synchronizacja
- **Real-time** - natychmiastowe aktualizacje
- **Event-driven** - reakcja na zmiany statusów
- **Transactional** - spójność danych
- **Notifications** - powiadomienia o zmianach

### Integracje z Innymi Modułami

#### Wycena
- Suma list materiałowych (BOM) ze wszystkich Elementów **automatycznie wygeneruje** sekcję "Materiały" w kosztorysie

#### Załoga
- Poszczególne etapy produkcji (np. "Produkcja", "Montaż Wstępny") będą mogły być przypisane w harmonogramie do konkretnych pracowników lub zespołów

#### Logistyka
- Tylko **Egzemplarze** o statusie "Gotowe do Transportu" pojawią się na liście komponentów możliwych do dodania na cyfrową **listę pakową**

#### Magazyn
- Zapotrzebowanie na materiały (wynikające z BOM) będzie automatycznie zgłaszane do modułu Magazynu w celu rezerwacji lub zamówienia surowców

## 🎯 Wartość Biznesowa

### Operacyjna
- **Kontrola przepływu** - każdy element ma swoją ścieżkę
- **Optymalizacja zasobów** - efektywne wykorzystanie projektantów
- **Transparentność** - widoczność postępu
- **Jakość** - kontrola na każdym etapie

### Strategiczna
- **Skalowalność** - obsługa większych projektów
- **Efektywność** - szybsze realizacje
- **Kontrola kosztów** - dokładne kalkulacje
- **Rozwój** - dane do optymalizacji procesów

## 🚀 Perspektywy Rozwoju

### Krótkoterminowe
- **AI** - automatyczne estymacje czasu
- **ML** - optymalizacja kolejności zadań
- **IoT** - integracja z maszynami CNC

### Długoterminowe
- **Digital Twin** - cyfrowy odpowiednik fizyczny
- **Automatyzacja** - robotyzacja procesów
- **AR/VR** - wizualizacja w czasie rzeczywistym

## 📋 Przykłady Użycia

### Projekt Stoisko Targowe
```
📦 Element: "Panel Frontowy"
├── 🏷️ Egzemplarz #1 - Status: Na miejscu
├── 🏷️ Egzemplarz #2 - Status: Na miejscu
├── 🏷️ Egzemplarz #3 - Status: Gotowe do transportu
└── 🏷️ Egzemplarz #4 - Status: W produkcji

📦 Element: "Totem LED"
├── 🏷️ Egzemplarz #1 - Status: Na miejscu
└── 🏷️ Egzemplarz #2 - Status: W montażu wstępnym
```

### Projekt Muzeum
```
📦 Element: "Gablota Ekspozycyjna"
├── 🏷️ Egzemplarz #1 - Status: Na miejscu
├── 🏷️ Egzemplarz #2 - Status: Na miejscu
├── 🏷️ Egzemplarz #3 - Status: Na miejscu
└── 🏷️ Egzemplarz #4 - Status: Na miejscu

📦 Element: "System Oświetlenia"
├── 🏷️ Egzemplarz #1 - Status: Na miejscu
└── 🏷️ Egzemplarz #2 - Status: Na miejscu
```

---

**NextFab Elements Module** - Kompletna dokumentacja modułu elementów projektowych

*Ostatnia aktualizacja: Styczeń 2024*
