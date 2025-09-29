# NextFab - Przewodnik Użytkownika

## 🚀 Wprowadzenie

NextFab to nowoczesny system zarządzania projektami dekoratorskimi, scenograficznymi i produkcyjnymi. Aplikacja umożliwia kompleksowe zarządzanie całym cyklem życia projektu - od koncepcji, przez produkcję, aż po montaż i logistykę.

## 📋 Główna Strona - Lista Projektów

### Co widzisz na stronie głównej:
- **Lista projektów** w formie kart lub tabeli
- **Wyszukiwarka** po nazwie projektu
- **Dwa tabsy**: Aktualne/Archiwalne
- **Możliwość sortowania** po nazwie, datach
- **Przycisk "Dodaj Projekt"**

### Funkcjonalności:
- 🔍 **Wyszukiwanie**: Wpisz nazwę projektu w polu wyszukiwania
- 📊 **Filtrowanie**: Użyj tabsów do przełączania między projektami aktywnymi a archiwalnymi
- 📅 **Sortowanie**: Kliknij nagłówki kolumn aby sortować po nazwie lub datach
- ➕ **Nowy projekt**: Kliknij przycisk "Dodaj Projekt" aby rozpocząć kreator

## 🆕 Dodawanie Nowego Projektu

### Kreator 3-krokowy z progress barem

#### Krok 1: 📋 DANE PODSTAWOWE PROJEKTU

**🏢 INFORMACJE O PROJEKCIE:**
- **Nazwa projektu** * (wymagane)
- **Numer projektu** (auto-generowany)
- **Opis projektu**
- **Termin realizacji**
  - Możliwość różnych terminów i kamieni milowych

**👥 KLIENT:**
- **Wybór klienta** (dropdown/search)
- **"Dodaj nowego klienta"** (jeśli nie istnieje)
- **Kontakt do klienta**

**📍 LOKALIZACJA:**
- **Adres realizacji** * (wymagane)
- **Miasto** * (wymagane)
- **Kod pocztowy** * (wymagane)

#### Krok 2: 🔧 MODUŁY PROJEKTU

**📋 MODUŁY PODSTAWOWE (zawsze aktywne):**
- ✅ **Overview** - Przegląd projektu
- ✅ **Elementy** - Zarządzanie kafelkami
- ✅ **Wycena** - Kalkulacja kosztów
- ✅ **Harmonogram** - Planowanie czasowe
- ✅ **Pliki** - Zarządzanie dokumentami

**☑️ MODUŁY OPCJONALNE:**
- ☑️ **Koncepcja** - Concept board
- ☑️ **Materiały** - Zarządzanie materiałami
- ☑️ **Logistyka** - Transport i montaż
- ☑️ **Załoga** - Noclegi zespołów

#### Krok 3: 📁 DODATKOWE INFORMACJE

- **Dodanie opisu** i dodatkowych informacji o projekcie
- **Wgrywanie plików** otrzymanych od klienta
- **Dostarczanie plików** powiązanych z projektem

## 🏗️ Struktura Folderów

Podczas tworzenia projektu system automatycznie generuje strukturę folderów w zależności od wybranych modułów.

### Lokalizacja projektów:
```
Z:\_NoweRozdanie\
├── [NAZWA_KLIENTA]/
│   ├── [PROJEKT_1]/
│   ├── [PROJEKT_2]/
│   └── [PROJEKT_N]/
└── [INNY_KLIENT]/
```

### Struktura pojedynczego projektu:
```
📁 [NAZWA_PROJEKTU]/
├── 📁 KONCEPCJA/          # (jeśli moduł aktywny)
├── 📁 MATERIAŁY OD KLIENTA/
├── 📁 WYCENA/             # (jeśli moduł aktywny)
├── 📁 PRODUKCJA/
│   ├── 📁 [ELEMENT_1]/
│   │   ├── 📁 DOKUMENTACJA/
│   │   └── 📁 WYCINANIE/
│   └── 📁 [ELEMENT_2]/
├── 📁 DOKUMENTY/          # (zawsze)
└── 📁 ARCHIWUM/           # (zawsze)
```

## 🎯 Moduły Projektów

### 📊 Overview - Centrum Dowodzenia
**Zawsze aktywny** - to jest "główna siedziba" każdego projektu.

**Co znajdziesz:**
- Podstawowe informacje o projekcie
- Informacje o kliencie
- Historię zmian w projekcie
- Miejsce do wymiany informacjami i komentarzami
- Możliwość planowania i zapisywania spotkań z klientem
- Tworzenie zadań i list to-do w projekcie

### 📁 Pliki
**Podgląd plików** powiązanych z danym projektem.

**Funkcjonalności:**
- Przeglądanie struktury folderów
- Automatyczna struktura przy dodawaniu nowego projektu
- Możliwość przypinania określonych plików do szybkiego dostępu

### 🎨 Koncepcja - Kreatywne Planowanie
**Tworzenie i zarządzanie koncepcjami projektowymi**

**Funkcjonalności:**
- Workflow zatwierdzania (szkic → recenzja → zatwierdzenie)
- Załączniki z inspiracjami i rysunkami
- Historia decyzji projektowych

**Zastosowanie:**
- Projekty dla wymagających klientów
- Projekty konkursowe wymagające prezentacji koncepcji
- Duże projekty, gdzie zespół musi współpracować nad wizją

## 🧩 Elementy (Kafelki) - Serce Systemu

### 🎯 Definicja
System kafelków to centralny moduł zarządzania elementami projektów. Każdy kafelek reprezentuje pojedynczy element produkcyjny z kompletnymi danymi technicznymi, materiałowymi i finansowymi.

### 🎨 Tworzenie Elementów z Modeli 3D

**Blockout - prymitywny model:**
- Bryłowa reprezentacja ostatecznego produktu
- Orientacyjne wymiary i kształty
- Import z systemów 3D (Speckle, Rhino)
- Dzielenie na elementy w 3D Viewer

**Przypisywanie materiałów:**
- Orientacyjne koszty wyprodukowania
- Selekcja powierzchni w modelu 3D
- Przypisanie materiału z katalogu magazynowego
- Wstępna kalkulacja kosztów

### 🔄 Cykl Życia Kafelka

**Etapy produkcyjne:**
```
Tworzenie → Poczekalnia → Dział Projektowy → Aktualizacja 3D → Kolejka CNC → Produkcja → Montaż → Zakończenie
```

**Statusy kafelka:**
- 🆕 **Nowy** - utworzony z blockoutu
- ⏳ **W poczekalni** - oczekuje na przypisanie
- 🎨 **W projektowaniu** - u projektanta
- ✅ **Zaprojektowany** - gotowy do produkcji
- 🔄 **W kolejce CNC** - oczekuje na wycięcie
- ⚙️ **W produkcji** - w trakcie realizacji
- 📦 **Gotowy** - do montażu

### 📋 Poczekalnia Elementów

**Funkcjonalności:**
- Lista elementów do zaprojektowania
- Przypisywanie przez menedżera
- Samodzielne pobieranie przez projektantów

**Zarządzanie:**
- **Menedżer projektu** - przypisuje elementy
- **Projektanci** - pobierają do warsztatu
- **Kolejność** - priorytet i terminy
- **Status** - dostępny/zajęty

### 👨‍💻 Dział Projektowy

**Warsztat projektanta:**
- Pobieranie elementów z poczekalni
- Estymacja czasu - ile potrzeba na model 3D
- Timeline osobisty - zajętość pracy
- Status - nad czym pracuje

**Profil projektanta:**
- Aktualny projekt - nad czym pracuje
- Timeline projektowy - harmonogram zadań
- Timeline koncepcyjny - prace koncepcyjne
- Historia projektów - zrealizowane elementy

### ⚙️ Kolejka CNC

**Elementy gotowe do produkcji:**
- Modele 3D - gotowe do wycięcia
- Pliki CNC - programy do maszyn
- Materiały - dostępne na magazynie
- Priorytet - kolejność realizacji

**Statusy w CNC:**
- 🔄 **W kolejce** - oczekuje na maszynę
- ⚙️ **W trakcie cięcia** - na maszynie CNC
- ✅ **Wycięte** - gotowe elementy
- 📦 **Do montażu** - przekazane do montażu

## 💰 Wycena - Kalkulacja Kosztów

### 🎯 Cel Modułu
Centralne narzędzie do tworzenia, wersjonowania i eksportowania ofert handlowych.

### 🔧 Kluczowe Funkcjonalności

**1. Edytor Wyceny**
- Interaktywna tabela w stylu arkusza kalkulacyjnego
- Grupowanie kosztów w kategorie
- Edycja wierszy i komórek

**2. Automatyczne Generowanie Pozycji**
- **Z modułu "Załoga"**: Automatycznie dodaje koszty robocizny, cateringu i zakwaterowania
- **Z modułu "Logistyka"**: Automatycznie dodaje koszt transportu
- **Z modułu "Elementy"**: Automatycznie agreguje BOM (Bill of Materials)

**3. Generowanie Oferty PDF**
- Profesjonalny dokument dla klienta
- Logo i stopka firmy
- Dynamiczne sekcje z danymi klienta
- Tabela pozycji kosztowych
- Podsumowanie finansowe

## 🛒 Materiały - Zarządzanie Zapasami

### 🔧 Funkcjonalności

**Automatyczne generowanie list zakupów:**
- Z BOM wszystkich elementów
- Śledzenie kosztów materiałów
- Integracja z systemem magazynowym

**Kanban materiałów unikalnych:**
- **Do zamówienia** - materiały wymagające zamówienia
- **Zamówione** - materiały w trakcie realizacji zamówienia
- **Odebrane** - materiały dostarczone do magazynu

**Archiwizacja niestandardowych zamówień:**
- Każdy zamówiony materiał zapisywany w bazie danych
- Archiwalne ceny i linki do źródeł
- Miniatury elementów
- Specyfikacje techniczne

### 📋 Przykłady Użycia

**1. Gniazdka nablatowe w barze stoiska:**
- Poszukiwanie na stronach internetowych
- Zapisanie linku jako nowa karta materiału
- Automatyczne pobieranie miniatury i danych
- Możliwość dołączenia modelu 3D
- Archiwizacja dla przyszłych projektów

**2. Ekrany w zabudowie muzealnej:**
- Otrzymanie linku od inwestora
- Automatyczne pobieranie specyfikacji technicznych
- Określenie wymiarów i wagi
- Integracja z modelem 3D elementu

## 🚚 Logistyka - Transport i Montaż

### 🎯 Cel Modułu
Usprawnienie i centralizacja całego procesu przemieszczania elementów scenografii, narzędzi oraz załogi.

### 🔧 Kluczowe Funkcjonalności

**Zarządzanie Flotą i Transportem:**
- **Baza Pojazdów**: Ewidencja wszystkich pojazdów firmowych
- **Harmonogram Transportu**: Rezerwacja pojazdów na konkretne projekty
- **Integracja z kalendarzem**: Unikanie konfliktów i podwójnych rezerwacji

**Cyfrowe Listy Przewozowe i Pakowe:**
- Tworzenie list do każdego zaplanowanego transportu
- Powiązanie z elementami projektu
- Śledzenie statusu elementów w czasie rzeczywistym

**Zarządzanie Zadaniami na Miejscu:**
- Lista zadań montażowych i demontażowych
- Przypisywanie osób z modułu "Załoga"
- Zdalny wgląd w postęp prac

### 📋 Przepływ Pracy

**Planowanie Transportu:**
1. Kliknij "Zaplanuj transport" w zakładce "Logistyka"
2. Wybierz pojazd z floty
3. Wybierz kierowcę z modułu "Załoga"
4. Ustaw daty wyjazdu i powrotu

**Tworzenie Listy Pakowej:**
1. Po utworzeniu transportu przejdź do tworzenia listy pakowej
2. **Panel lewy**: Lista wszystkich elementów scenografii
3. **Panel prawy**: Pusta lista pakowa dla wybranego pojazdu
4. Przeciągnij elementy z lewej na prawą stronę
5. System pokazuje na bieżąco załadowanie pojazdu
6. Wydrukuj lub udostępnij cyfrowo zespołowi

## 👥 Załoga - Zarządzanie Personelom

### 🎯 Cel Modułu
Dynamiczne zarządzanie personelem projektowym z wizualnym planowaniem obsady.

### 🔧 Interfejs Użytkownika

**Baza Pracowników (Widok Globalny):**
- Karty pracowników z kluczowymi informacjami
- Zdjęcie, imię i nazwisko, specjalizacja
- Kolorowy wskaźnik statusu (🟢 Dostępny / 🔴 Zajęty)

**Interfejs Przypisywania w Projekcie:**
- **"Bank Pracowników"** (Panel boczny): Biblioteka dostępnych pracowników
- **"Etapy Projektu"** (Obszar główny): Wizualna reprezentacja zadań
- **Mechanizm Drag & Drop**: Przeciągnij kartę pracownika na etap projektu

### 🔄 Automatyzacje i Integracje

**Kalendarz i Status:**
- Natychmiastowa rezerwacja czasu w kalendarzu globalnym
- Zmiana statusu na "Zajęty"
- Uniemożliwienie podwójnych rezerwacji

**Wycena:**
- Automatyczne generowanie kosztów robocizny
- Koszty cateringu i zakwaterowania
- Integracja z harmonogramem projektu

## 🔮 Perspektywy Rozwoju

### 🚀 Krótkoterminowe
- **AI** - automatyczne estymacje czasu
- **ML** - optymalizacja kolejności zadań
- **IoT** - integracja z maszynami CNC

### 🌟 Długoterminowe
- **Digital Twin** - cyfrowy odpowiednik fizyczny
- **Automatyzacja** - robotyzacja procesów
- **AR/VR** - wizualizacja w czasie rzeczywistym

## 📞 Wsparcie

### 🆘 Pomoc i Dokumentacja
- **Dokumentacja techniczna**: `/docs/DEVELOPMENT.md`
- **API i integracje**: `/docs/API_INTEGRATION.md`
- **Przewodnik użytkownika**: Ten dokument

### 🔧 Rozwiązywanie Problemów

**Częste problemy:**
1. **Brak połączenia ze Speckle**: Sprawdź konfigurację serwera i token
2. **Błąd ładowania modelu 3D**: Sprawdź czy model istnieje w Speckle
3. **Problemy z uprawnieniami**: Skontaktuj się z administratorem

**Kontakt:**
- Email: support@nextfab.com
- Telefon: +48 123 456 789
- Dokumentacja: [link do dokumentacji]

---

**NextFab** - Nowoczesne zarządzanie projektami dekoratorskimi

*Ostatnia aktualizacja: Styczeń 2024*


