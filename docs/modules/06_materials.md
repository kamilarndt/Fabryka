# Moduł: Materiały (UMMS - MVP)

## 1. Cel Modułu

Celem modułu "Materiały" w wersji MVP jest stworzenie **centralnego, ujednoliconego katalogu (Material Master)** wszystkich materiałów wykorzystywanych w firmie. Moduł ten ma służyć jako jedyne, kanoniczne źródło prawdy o materiałach i ich kosztach, dostarczając precyzyjnych danych do innych części systemu, zwłaszcza do modułu `Wycena`.

## 2. Kluczowe Funkcjonalności (MVP)

Wersja MVP skupia się wyłącznie na funkcjonalności katalogu. Śledzenie stanów magazynowych jest planowane w kolejnych etapach rozwoju.

### 2.1. Katalog Materiałów
- **Interfejs:** Głównym widokiem strony `/magazyn` jest przeszukiwalna i filtrowalna lista wszystkich materiałów w bazie.
- **Widoki:** Użytkownik ma możliwość przełączania widoku między siatką kart (z miniaturkami) a tabelą.
- **Kategorie:** Materiały są zorganizowane w hierarchiczną strukturę kategorii (np. `Płyty > MDF > Surowe`), co ułatwia nawigację.
- **Funkcjonalności:**
    - **Wyszukiwanie:** Po nazwie, SKU.
    - **Filtrowanie:** Po kategorii.
    - **Dodawanie/Edycja:** Możliwość dodawania nowych materiałów do katalogu oraz edycji istniejących za pomocą formularza.

### 2.2. Karta Materiału
Każdy materiał w katalogu posiada szczegółowe informacje, zgodne z modelem danych.

## 3. Model Danych (MVP)

W wersji MVP, skupiamy się na definicji materiału, pomijając jego stan magazynowy.

```typescript
interface Material {
  id: string;                     // Unikalny identyfikator materiału
  name: string;                   // Pełna nazwa materiału (np. "PŁYTA WIÓROWA SUROWA 18MM")
  sku: string;                    // Kod SKU lub inny unikalny identyfikator dostawcy
  category: string[];             // Ścieżka kategorii (np. ['Płyty', 'MDF', 'Surowe'])
  specification: {                // Szczegółowe parametry techniczne
    thickness?: number;           // Grubość w mm
    width?: number;               // Szerokość w mm
    height?: number;              // Wysokość w mm
    color?: string;
  };
  unit: 'szt' | 'm' | 'm2' | 'kg'; // Podstawowa jednostka miary
  defaultPrice: number;           // Domyślna cena zakupu za jednostkę
}
```

## 4. Integracje z Innymi Modułami

- **Wycena (`03_quotation.md`):** Jest to kluczowa integracja w wersji MVP. Moduł Wycena używa katalogu materiałów jako źródła danych przy dodawaniu pozycji materiałowych do kosztorysu, automatycznie pobierając ich nazwy, jednostki i ceny.
- **Elementy (`02_elements.md`):** Przy tworzeniu listy materiałów (BOM) dla "Elementu", użytkownik wybiera materiały z tego centralnego katalogu.

## 5. Perspektywy Rozwoju (Poza MVP)

Ten moduł ma ogromny potencjał rozwoju. Następne kroki będą obejmować:

- Wprowadzenie śledzenia stanów magazynowych (Stock).
- Implementacja dokumentów magazynowych (PZ - Przyjęcie Zewnętrzne, WZ - Wydanie Zewnętrzne).
- Automatyzacja zamówień i zarządzanie dostawcami.
- Rezerwacje materiałów na potrzeby konkretnych projektów.
