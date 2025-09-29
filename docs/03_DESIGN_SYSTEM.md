# 03: Design System

## 1. Wprowadzenie

Ten dokument definiuje fundamenty wizualne i zbiór zasad dotyczących interfejsu użytkownika (UI) w aplikacji NextFab. Celem jest zapewnienie spójności, przyspieszenie prac deweloperskich i stworzenie intuicyjnego doświadczenia dla użytkownika. Design System jest naszym jedynym źródłem prawdy w kwestiach UI/UX.

## 2. Fundamenty Wizualne

### 2.1. Biblioteka Komponentów
Oficjalną biblioteką komponentów UI dla projektu jest **Chakra UI v3**. Wszystkie nowe komponenty powinny być budowane w oparciu o jej system i filozofię.

### 2.2. Design Tokens
Tokeny to atomowe wartości, które definiują wygląd aplikacji.

#### Paleta Kolorów (Dark Mode First)
Aplikacja jest projektowana z myślą o trybie ciemnym (Dark Mode) jako domyślnym. Używamy neutralnej palety z akcentami kolorystycznymi.

- **Tła (Backgrounds):**
  - `bg-surface`: `#1A202C` (Główne tło aplikacji)
  - `bg-element`: `#2D3748` (Tło dla kart, paneli i elementów)
- **Tekst (Text):**
  - `text-primary`: `#FFFFFF` (Główny tekst)
  - `text-secondary`: `#A0AEC0` (Tekst pomocniczy, etykiety)
- **Kolory Główne (Primary):**
  - `primary`: `#3182CE` (Niebieski - dla przycisków, linków i aktywnych elementów)
- **Kolory Statusów (Statuses):**
  - `success`: `#38A169` (Zielony - dla operacji zakończonych sukcesem)
  - `warning`: `#DD6B20` (Pomarańczowy - dla ostrzeżeń)
  - `error`: `#E53E3E` (Czerwony - dla błędów i operacji niebezpiecznych)

#### Typografia
Używamy systemowego stosu fontów, aby zapewnić natywny wygląd i wysoką wydajność na każdym urządzeniu.

- **Krój pisma:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Skala Tekstu:**
  - `Heading 1 (h1)`: 24px, bold
  - `Heading 2 (h2)`: 20px, bold
  - `Body`: 16px, regular
  - `Label`: 14px, medium

#### Odstępy (Spacing)
Stosujemy system odstępów oparty na siatce **4px**. Wszystkie marginesy, paddingi i odległości między elementami powinny być wielokrotnością tej wartości (np. 4px, 8px, 12px, 16px, 24px, 32px).

### 2.3. Ikonografia
Oficjalną biblioteką ikon jest **`react-icons`**. Aby zachować spójność, preferujemy używanie ikon z zestawu **Feather Icons** (`react-icons/fi`).

## 3. Biblioteka Komponentów

Nasze komponenty dzielimy na dwie logiczne kategorie.

### 3.1. Komponenty Prymitywne (UI Kit)
Są to podstawowe, reużywalne "klocki", z których budujemy interfejs. Są to najczęściej stylizowane wersje komponentów z Chakra UI.
- `Button`
- `Card`
- `Modal`
- `Input`
- `Select`
- `Badge` (np. do oznaczania statusów)
- `Tooltip`

### 3.2. Komponenty Złożone (Aplikacyjne)
Są to specyficzne dla domeny NextFab komponenty, zbudowane z mniejszych, prymitywnych części. Odpowiadają one za konkretne funkcje biznesowe.
- `ProjectCard`: Karta wyświetlająca podsumowanie projektu na liście.
- `ElementsKanbanBoard`: Tablica Kanban do zarządzania "Elementami".
- `MaterialDetailsPanel`: Panel boczny ze szczegółami materiału w Magazynie.
- `ProjectCreationWizard`: Trzykrokowy kreator nowego projektu.
- `ModuleTabs`: Dynamicznie generowane zakładki w widoku szczegółów projektu.
