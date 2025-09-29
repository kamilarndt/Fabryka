# NextFab - Konwencje Nazewnictwa

## 📋 Przegląd

Ten dokument definiuje jasne konwencje nazewnictwa dla całego projektu NextFab, aby zapewnić spójność i zrozumiałość w całym systemie.

## 🏠 **STRONY (Pages)** - Główne sekcje aplikacji

### Definicja
Strony to główne ścieżki URL w Next.js App Router, każda reprezentuje osobną sekcję aplikacji.

### Lista Stron
- `/calendar` - Kalendarz i harmonogramy
- `/cnc` - Maszyny CNC i zadania  
- `/demands` - Zapotrzebowania na materiały
- `/klienci` - Zarządzanie klientami
- `/magazyn` - System magazynowy (UMMS)
- `/produkcja` - Zlecenia produkcyjne
- `/projects` - Lista projektów
- `/projekt/[id]` - Szczegóły konkretnego projektu
- `/projektowanie` - Design i CAD
- `/settings` - Ustawienia systemu
- `/subcontractors` - Podwykonawcy

### Struktura Plików
```
src/app/
├── calendar/page.tsx          # Strona kalendarza
├── cnc/page.tsx              # Strona maszyn CNC
├── demands/page.tsx          # Strona zapotrzebowań
├── klienci/page.tsx          # Strona klientów
├── magazyn/page.tsx          # Strona magazynu
├── produkcja/page.tsx        # Strona produkcji
├── projects/page.tsx         # Strona listy projektów
├── projekt/[id]/page.tsx     # Strona szczegółów projektu
├── projektowanie/page.tsx    # Strona projektowania
├── settings/page.tsx         # Strona ustawień
└── subcontractors/page.tsx   # Strona podwykonawców
```

## 🔧 **ELEMENTY PROJEKTU** - Konkretne komponenty meblarskie

### Definicja
Elementy projektu to poszczególne fragmenty, które składają się na projekt meblarski. Każdy element to konkretny komponent fizyczny.

### Przykłady Elementów
- **Szuflady** - elementy wysuwane w meblach
- **Drzwi** - drzwi szafek, szaf
- **Półki** - półki wiszące, stałe
- **Blaty** - blaty robocze, dekoracyjne
- **Nogi** - nogi mebli, podpory
- **Fronty** - fronty szafek, drzwi
- **Korpusy** - korpusy mebli, konstrukcje

### Struktura Plików
```
src/app/projekt/[id]/element/[elementId]/page.tsx  # Strona szczegółów elementu
src/components/elements/                           # Komponenty elementów
├── ElementCard.tsx                               # Karta elementu
├── ElementForm.tsx                               # Formularz elementu
├── ElementBOM.tsx                                # BOM elementu
└── ElementViewer.tsx                             # Podgląd elementu
```

### Właściwości Elementu
- **BOM** - Lista materiałów potrzebnych do wykonania
- **Wymiary** - Dokładne wymiary elementu
- **Materiały** - Materiały użyte do produkcji
- **Model 3D** - Model 3D elementu (Speckle/Rhino)
- **Status** - Status produkcji elementu
- **Koszt** - Koszt wykonania elementu

## 🏗️ **MODUŁY PROJEKTU** - Dynamiczne funkcjonalności

### Definicja
Moduły projektu to funkcjonalności w szczegółach projektu, które można włączać/wyłączać podczas tworzenia projektu. System dynamicznie dostosowuje interfejs do potrzeb konkretnego projektu.

### 📋 **MODUŁY PODSTAWOWE** (zawsze aktywne)

#### Overview
- **Funkcja**: Przegląd projektu, dashboard, metryki
- **Zawartość**: 
  - Progress ring projektu
  - Wykres budżetu
  - Timeline Gantt
  - Ostatnie aktywności
  - Kluczowe metryki

#### Pliki
- **Funkcja**: Zarządzanie dokumentami, upload, organizacja
- **Zawartość**:
  - Upload plików
  - Organizacja w folderach
  - Podgląd dokumentów
  - Wersjonowanie plików

### ☑️ **MODUŁY OPCJONALNE** (wybierane podczas tworzenia projektu)

#### Koncepcja
- **Funkcja**: Concept board, inspiracje, workflow zatwierdzania
- **Zawartość**:
  - Moodboard
  - Inspiracje wizualne
  - Workflow zatwierdzania
  - Notatki koncepcyjne

#### Harmonogram
- **Funkcja**: Planowanie czasowe, kamienie milowe, Gantt
- **Zawartość**:
  - Gantt chart
  - Kamienie milowe
  - Zadania i terminy
  - Zarządzanie zasobami

#### Model 3D
- **Funkcja**: Integracja ze Speckle, modele Rhino, viewer
- **Zawartość**:
  - Speckle viewer
  - Modele Rhino
  - Podgląd 3D
  - Eksport modeli

#### Materiały
- **Funkcja**: Zarządzanie zapasami, listy zakupów, katalog materiałów
- **Zawartość**:
  - Lista materiałów projektu
  - Zapotrzebowania
  - Katalog materiałów
  - Rezerwacje

#### Wycena
- **Funkcja**: Kalkulacja kosztów, kosztorysy, oferty
- **Zawartość**:
  - Kalkulator kosztów
  - Kosztorysy
  - Oferty dla klienta
  - Analiza rentowności

#### Logistyka
- **Funkcja**: Transport, montaż, planowanie tras
- **Zawartość**:
  - Planowanie transportu
  - Harmonogram montażu
  - Mapy i trasy
  - Zarządzanie dostawami

#### Załoga
- **Funkcja**: Noclegi zespołów, zarządzanie personelem
- **Zawartość**:
  - Rezerwacje noclegów
  - Zarządzanie zespołem
  - Harmonogram pracy
  - Koszty załogi

### Implementacja Modułów

#### Struktura Komponentów
```
src/components/projects/modules/
├── OverviewModule.tsx         # Moduł przeglądu
├── ConceptModule.tsx          # Moduł koncepcji
├── ScheduleModule.tsx         # Moduł harmonogramu
├── Model3DModule.tsx          # Moduł modelu 3D
├── MaterialsModule.tsx        # Moduł materiałów
├── QuotationModule.tsx        # Moduł wyceny
├── LogisticsModule.tsx        # Moduł logistyki
└── CrewModule.tsx             # Moduł załogi
```

#### Dynamiczne Tabsy
```typescript
const getActiveTabs = (modules: ProjectModule[]) => {
  const tabs = [
    { id: 'overview', label: 'Przegląd', icon: FiHome, always: true },
    { id: 'concept', label: 'Koncepcja', icon: FiLightbulb, module: 'concept' },
    { id: 'schedule', label: 'Harmonogram', icon: FiCalendar, module: 'schedule' },
    { id: 'model3d', label: 'Model 3D', icon: FiBox, module: 'model3d' },
    { id: 'materials', label: 'Materiały', icon: FiPackage, module: 'materials' },
    { id: 'quotation', label: 'Wycena', icon: FiDollarSign, module: 'quotation' },
    { id: 'logistics', label: 'Logistyka', icon: FiTruck, module: 'logistics' },
    { id: 'crew', label: 'Załoga', icon: FiUsers, module: 'crew' }
  ];

  return tabs.filter(tab => tab.always || modules.includes(tab.module));
};
```

## 🧩 **KOMPONENTY** - Elementy UI

### Definicja
Komponenty to elementy interfejsu użytkownika, które można wielokrotnie używać w różnych miejscach aplikacji.

### Kategorie Komponentów

#### Karty i Listy
- **MaterialCard** - Karta materiału
- **ProjectCard** - Karta projektu
- **ElementCard** - Karta elementu
- **ClientCard** - Karta klienta

#### Formularze i Kreatory
- **ProjectWizard** - Kreator projektu
- **ElementForm** - Formularz elementu
- **ClientForm** - Formularz klienta
- **MaterialForm** - Formularz materiału

#### Zaawansowane Komponenty
- **SpeckleViewer** - Podgląd Speckle
- **GanttChart** - Wykres Gantt
- **KanbanBoard** - Tablica Kanban
- **DataTable** - Tabela danych

### Struktura Plików
```
src/components/
├── warehouse/                 # Komponenty magazynowe
│   ├── MaterialCard.tsx
│   ├── MaterialList.tsx
│   └── MaterialFilters.tsx
├── projects/                  # Komponenty projektów
│   ├── ProjectCard.tsx
│   ├── ProjectWizard.tsx
│   └── ProjectDashboard.tsx
├── elements/                  # Komponenty elementów
│   ├── ElementCard.tsx
│   ├── ElementForm.tsx
│   └── ElementBOM.tsx
└── ui/                        # Komponenty UI
    ├── DataTable.tsx
    ├── Modal.tsx
    └── Form.tsx
```

## 🎣 **HOOKS** - Logika React

### Definicja
Hooks to funkcje React, które zawierają logikę biznesową i stan aplikacji.

### Kategorie Hooks

#### Hooks Biznesowe
- **useWarehouse** - Logika magazynowa
- **useProject** - Logika projektów
- **useElements** - Logika elementów
- **useClients** - Logika klientów

#### Hooks Utility
- **useDebouncedSearch** - Wyszukiwanie z opóźnieniem
- **useStockStatus** - Status magazynowy
- **useMaterialAvailability** - Dostępność materiałów
- **useProjectModules** - Moduły projektu

### Struktura Plików
```
src/hooks/
├── useWarehouse.ts            # Hooks magazynowe
├── useProjects.ts             # Hooks projektów
├── useElements.ts             # Hooks elementów
├── useClients.ts              # Hooks klientów
└── useCalendar.ts             # Hooks kalendarza
```

## 📁 **API SERVICES** - Warstwa API

### Definicja
API Services to warstwa komunikacji z backendem, zawierająca funkcje do pobierania i modyfikacji danych.

### Struktura Plików
```
src/lib/api/
├── warehouse.ts               # API magazynu
├── projects.ts                # API projektów
├── elements.ts                # API elementów
├── clients.ts                 # API klientów
└── calendar.ts                # API kalendarza
```

## 🏷️ **TYPES** - Definicje TypeScript

### Definicja
Types to definicje typów TypeScript, które zapewniają type safety w całej aplikacji.

### Struktura Plików
```
src/types/
├── warehouse.ts               # Typy magazynowe
├── project.ts                 # Typy projektów
├── elements.ts                # Typy elementów
├── clients.ts                 # Typy klientów
└── common.ts                  # Typy wspólne
```

## 🎨 **STYLING** - Style i Design System

### Definicja
Styling to system stylów i design system używany w całej aplikacji.

### Technologie
- **Chakra UI v3** - Główny system komponentów
- **CSS Modules** - Lokalne style komponentów
- **CSS Variables** - Zmienne CSS dla themingu

### Struktura Plików
```
src/styles/
├── globals.css                # Style globalne
├── components.css             # Style komponentów
└── themes.css                 # Style tematów
```

## 📚 **DOKUMENTACJA** - Dokumentacja projektu

### Definicja
Dokumentacja to pliki opisujące funkcjonalności, API i strukturę projektu.

### Struktura Plików
```
docs/
├── README.md                  # Główna dokumentacja
├── PROJECTS_PAGE.md           # Dokumentacja strony projektów
├── WAREHOUSE_PAGE.md          # Dokumentacja strony magazynu
├── API_DOCUMENTATION.md       # Dokumentacja API
└── NAMING_CONVENTIONS.md      # Ten plik
```

## 🔄 **WORKFLOW** - Procesy i przepływy

### Definicja
Workflow to procesy biznesowe i przepływy pracy w aplikacji.

### Przykłady Workflow
- **Tworzenie projektu** - Kreator 3-krokowy
- **Zarządzanie elementami** - CRUD elementów
- **Proces wyceny** - Kalkulacja kosztów
- **Zarządzanie magazynem** - Ruch materiałów

## 🧪 **TESTING** - Testy aplikacji

### Definicja
Testing to testy jednostkowe, integracyjne i E2E aplikacji.

### Struktura Plików
```
tests/
├── unit/                      # Testy jednostkowe
├── integration/               # Testy integracyjne
├── e2e/                       # Testy E2E
└── fixtures/                  # Dane testowe
```

---

**NextFab Naming Conventions** - Kompletny przewodnik nazewnictwa

*Ostatnia aktualizacja: Styczeń 2025*



