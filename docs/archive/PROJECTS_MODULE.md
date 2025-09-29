# NextFab - Moduły Projektów

## 📋 Przegląd

System modułów w NextFab to **inteligentny sposób organizacji funkcjonalności** aplikacji, który pozwala dostosować narzędzie do konkretnych potrzeb każdego projektu. Zamiast pokazywać użytkownikowi wszystkie możliwe funkcje naraz, system **dynamicznie dostosowuje interfejs** do tego, co jest rzeczywiście potrzebne w danym projekcie.

## 🎯 Filozofia Modularności

### "Nie jeden rozmiar dla wszystkich"
Każdy projekt w firmie dekoratorskiej ma inne wymagania:
- **Mały projekt lokalny** (np. dekoracja sklepu w mieście) - nie potrzebuje zakwaterowania ani skomplikowanej logistyki
- **Duży projekt międzynarodowy** (np. stoisko na targach w Londynie) - wymaga pełnej logistyki, zakwaterowania, transportu
- **Projekt studyjny** (np. projektowanie dla klienta) - może nie wymagać modułu produkcji

### "Widzisz tylko to, czego potrzebujesz"
System pokazuje tylko te zakładki i funkcje, które są aktywne dla danego projektu:
- **Czystszy interfejs** - mniej zakłóceń
- **Szybsza praca** - nie musisz szukać wśród niepotrzebnych opcji
- **Mniej błędów** - nie ma ryzyka użycia niewłaściwego modułu

## 📋 Moduły Podstawowe (zawsze aktywne)

### 🏠 Overview - Centrum dowodzenia
**Zawsze aktywny** - to jest "główna siedziba" każdego projektu.

**Funkcjonalności:**
- Podstawowe informacje o projekcie
- Informacje o kliencie
- Historia zmian w projekcie
- Miejsce do wymiany informacjami i komentarzami osób biorących udział w projekcie
- Możliwość planowania i zapisywania spotkań z klientem (online lub w realu)
- Tworzenie zadań, list to-do w projekcie

### 📁 Pliki - Zarządzanie dokumentami
**Zawsze aktywny** - podstawowe zarządzanie plikami projektu.

**Funkcjonalności:**
- Podgląd plików które są powiązane z danym projektem
- Możliwość przeglądania struktury folderów tworzonej automatycznie przy dodawaniu nowego projektu
- Możliwość przypinania określonych plików do których chcemy mieć szybki dostęp
- Upload i organizacja dokumentów

## ☑️ Moduły Opcjonalne (wybierane podczas tworzenia projektu)

### 🎨 Koncepcja - Kreatywne planowanie
**Cel:** Tworzenie i zarządzanie koncepcjami projektowymi

**Funkcjonalności:**
- Tworzenie i zarządzanie koncepcjami projektowymi
- Workflow zatwierdzania (szkic → recenzja → zatwierdzenie)
- Załączniki z inspiracjami i rysunkami
- Historia decyzji projektowych

**Zastosowanie:**
- Projekty dla wymagających klientów, którzy chcą zatwierdzać każdy etap
- Projekty konkursowe wymagające prezentacji koncepcji
- Duże projekty, gdzie zespół musi współpracować nad wizją

### 📦 Elementy (Kafelki) - Serce systemu produkcyjnego
**Cel:** Zarządzanie wszystkimi fizycznymi komponentami składającymi się na projekt

**Kluczowe koncepcje:**
- **Element**: Projekt lub wzór jednego, unikalnego komponentu scenografii (np. "Pulpit kandydata", "Totem świetlny")
- **Egzemplarz**: Konkretna, fizyczna kopia danego Elementu (jeśli projekt wymaga 5 totemów, będzie jeden Element i 5 Egzemplarzy)

**Cykl życia elementu:**
1. **Projekt/Koncepcja** - Nowy element, zdefiniowany, ale niezatwierdzony
2. **Akceptacja Klienta** - Projekt elementu został zaakceptowany
3. **Przygotowanie Technologiczne/CNC** - Przygotowywanie plików i programów na maszyny
4. **W Produkcji** - Element jest fizycznie produkowany w warsztacie
5. **Montaż Wstępny/Kontrola Jakości** - Sprawdzanie i składanie elementów
6. **Gotowe do Transportu** - Element spakowany i czeka na załadunek
7. **Na Miejscu** - Element dostarczony do lokalizacji docelowej

**Interfejs:**
- **Widok Siatki** - galeria interaktywnych kart z miniaturami i wskaźnikami postępu
- **Widok Kanban** - tablica z kolumnami odpowiadającymi etapom cyklu życia

**Szczegóły elementu:**
- Podgląd modelu 3D przez viewer
- Lista materiałów (BOM) potrzebnych do wyprodukowania
- Dokumentacja (plany PDF, pliki DXF dla CNC)
- Lista wszystkich egzemplarzy z ich statusami

### 🛒 Materiały - Zarządzanie zapasami
**Cel:** Kompleksowe zarządzanie materiałami i zasobami projektu

**Funkcjonalności:**
- Automatyczne generowanie list zakupów z BOM wszystkich elementów
- Śledzenie kosztów materiałów
- Integracja z systemem magazynowym
- Planowanie zamawiania unikalnych materiałów

**Kanban materiałów unikalnych:**
- **Do zamówienia** - materiały zidentyfikowane do zakupu
- **Zamówione** - materiały w trakcie dostawy
- **Odebrane** - materiały dostarczone i gotowe do użycia

**Archiwizacja materiałów:**
- Każdy zamówiony materiał zapisywany z archiwalnymi cenami
- Link do źródła zamówienia
- Miniatura elementu
- Automatyczne pobieranie specyfikacji technicznych z linków

### 💰 Wycena - Kalkulacja kosztów
**Cel:** Centralne narzędzie do tworzenia, wersjonowania i eksportowania ofert handlowych

**Funkcjonalności:**
- Edytor wyceny w stylu arkusza kalkulacyjnego
- Grupowanie kosztów w kategorie
- Automatyczne generowanie pozycji z innych modułów:
  - Z modułu "Załoga": Robocizna, Catering, Zakwaterowanie
  - Z modułu "Logistyka": Transport na podstawie lokalizacji
- Generowanie oferty PDF z profesjonalnym szablonem

### 🚚 Logistyka - Transport i montaż
**Cel:** Usprawnienie procesu przemieszczania elementów, narzędzi i załogi

**Zarządzanie flotą:**
- Baza pojazdów firmowych (busy, ciężarówki)
- Dane: nazwa, nr rejestracyjny, ładowność, pojemność, koszt za kilometr
- Harmonogram transportu z rezerwacją pojazdów

**Cyfrowe listy przewozowe:**
- Tworzenie list pakowych dla każdego transportu
- Powiązanie z elementami projektu
- Śledzenie statusu elementów: W magazynie → Załadowane → Na miejscu → Spakowane → Wróciło

**Zarządzanie zadaniami na miejscu:**
- Lista zadań montażowych i demontażowych
- Przypisywanie zadań do osób z modułu "Załoga"
- Oznaczanie zadań jako wykonane

**Integracja z wyceną:**
- Automatyczne obliczanie dystansu na podstawie lokalizacji
- Generowanie pozycji "Transport" w module wyceny

### 👥 Załoga - Zarządzanie personelem
**Cel:** Dynamiczne zarządzanie personelem projektowym

**Baza pracowników:**
- Karty pracowników z kluczowymi informacjami
- Zdjęcie, imię, nazwisko, specjalizacja
- Kolorowy wskaźnik statusu (Dostępny/Zajęty)

**Interfejs przypisywania:**
- **Bank Pracowników** - biblioteka dostępnych pracowników z filtrowaniem po specjalizacji
- **Etapy Projektu** - wizualna reprezentacja zadań wymagających obsady
- **Mechanizm Drag & Drop** - przeciąganie kart pracowników do etapów

**Automatyzacje:**
- Rezerwacja czasu w kalendarzu globalnym
- Zmiana statusu na "Zajęty"
- Automatyczne generowanie kosztów w module "Wycena"

**Kierunek rozwoju - Inteligentne wyszukiwanie zakwaterowania:**
- Integracja z API platform rezerwacyjnych (Booking.com, Airbnb)
- Automatyczne zapytania o dostępne obiekty w okolicy projektu
- Sugerowanie 3-5 opcji hoteli/apartamentów z cenami i odległościami

### 📅 Harmonogram - Planowanie czasowe
**Cel:** Zarządzanie timeline'em projektu i kamieniami milowymi

**Funkcjonalności:**
- Planowanie czasowe z kamieniami milowymi
- Wykres Gantta
- Integracja z modułem Załogi dla przypisywania zadań
- Automatyczne aktualizacje statusów na podstawie postępu elementów

### 🔧 Model 3D - Integracja z systemami 3D
**Cel:** Zarządzanie modelami 3D i integracją ze Speckle

**Funkcjonalności:**
- Integracja ze Speckle Server
- Podgląd modeli Rhino
- Viewer 3D w przeglądarce
- Powiązanie modeli z elementami projektu

## 🏗️ Struktura Folderów

System automatycznie generuje strukturę folderów w zależności od wybranych modułów:

**Lokalizacja**: `Z:\_NoweRozdanie\[KLIENT]\[PROJEKT]`

```
📁 [NAZWA_PROJEKTU]/
├── 📁 KONCEPCJA/              # (jeśli moduł aktywny)
│   ├── 📁 inspiracje/
│   ├── 📁 szkice/
│   ├── 📁 moodboard/
│   └── 📄 notatki_koncepcyjne.md
├── 📁 MATERIAŁY OD KLIENTA/   # (zawsze)
│   ├── 📁 zdjęcia/
│   ├── 📁 pliki_3d/
│   └── 📁 inne/
├── 📁 WYCENA/                 # (jeśli moduł aktywny)
│   ├── 📁 oferty/
│   ├── 📁 kalkulacje/
│   ├── 📁 kosztorysy/
│   └── 📁 faktury/
├── 📁 PRODUKCJA/              # (jeśli moduł elements aktywny)
│   ├── 📁 [ELEMENT_1]/
│   │   ├── 📁 DOKUMENTACJA/
│   │   └── 📁 WYCINANIE/
│   └── 📁 [ELEMENT_2]/
├── 📁 DOKUMENTY/              # (zawsze)
│   ├── 📁 umowy/
│   ├── 📁 protokoły/
│   ├── 📁 certyfikaty/
│   └── 📁 korespondencja/
└── 📁 ARCHIWUM/               # (zawsze)
    ├── 📁 stare_wersje/
    ├── 📁 backup/
    └── 📄 log_zmian.md
```

## 🔄 Integracje Między Modułami

### Przepływ danych:
- **Elementy → Wycena**: Suma BOM automatycznie generuje sekcję "Materiały" w kosztorysie
- **Załoga → Wycena**: Automatyczne dodawanie kosztów robocizny, cateringu i zakwaterowania
- **Logistyka → Wycena**: Automatyczne dodawanie kosztów transportu
- **Elementy → Logistyka**: Tylko elementy "Gotowe do Transportu" na listach pakowych
- **Materiały → Magazyn**: Automatyczne zgłaszanie zapotrzebowania na surowce

### Synchronizacja:
- **Real-time** - natychmiastowe aktualizacje
- **Event-driven** - reakcja na zmiany statusów
- **Transactional** - spójność danych
- **Notifications** - powiadomienia o zmianach

## 🎯 Wartość Biznesowa

### Operacyjna:
- **Kontrola przepływu** - każdy element ma swoją ścieżkę
- **Optymalizacja zasobów** - efektywne wykorzystanie projektantów
- **Transparentność** - widoczność postępu
- **Jakość** - kontrola na każdym etapie

### Strategiczna:
- **Skalowalność** - obsługa większych projektów
- **Efektywność** - szybsze realizacje
- **Kontrola kosztów** - dokładne kalkulacje
- **Rozwój** - dane do optymalizacji procesów

---

**NextFab Project Modules** - Kompletna dokumentacja modułów projektowych

*Ostatnia aktualizacja: Styczeń 2024*
