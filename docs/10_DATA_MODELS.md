# 10: Kluczowe Modele Danych

## 1. Wprowadzenie

Ten dokument jest centralnym repozytorium definicji kluczowych modeli danych (encje biznesowe) używanych w całej aplikacji. Stanowi on "wspólny język" dla deweloperów frontendu i backendu. Każdy model jest zdefiniowany jako interfejs TypeScript z komentarzami wyjaśniającymi przeznaczenie poszczególnych pól.

## 2. Domena: Projekty i Produkcja

Modele te definiują serce aplikacji – projekty i ich policzalne komponenty produkcyjne.

### `Project`
Reprezentuje pojedynczy projekt lub zlecenie.
```typescript
interface Project {
  id: string;                     // Unikalny identyfikator projektu
  name: string;                   // Nazwa projektu widoczna dla użytkownika
  projectNumber: string;          // Unikalny, czytelny numer projektu (np. "P2025/01/15")
  status: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled'; // Aktualny status projektu
  clientId: string;               // ID klienta powiązanego z projektem
  modules: string[];              // Lista aktywnych modułów dla tego projektu (np. ['wycena', 'logistyka'])
  timeline: {                     // Ramy czasowe projektu
    startDate?: Date;
    endDate?: Date;
  };
  createdAt: Date;                // Data utworzenia projektu
  updatedAt: Date;                // Data ostatniej modyfikacji
}
```

### `Element` (Kafelek / Tile)
Reprezentuje pojedynczy, policzalny komponent produkcyjny w ramach projektu.
```typescript
interface Element {
  id: string;                     // Unikalny identyfikator elementu
  name: string;                   // Nazwa elementu (np. "Panel Frontowy")
  code: string;                   // Kod produkcyjny (np. "PF-001")
  projectId: string;              // ID projektu, do którego należy element
  status: 'concept' | 'design' | 'production' | 'assembly' | 'ready'; // Status w cyklu produkcyjnym
  bom: BomItem[];                 // Lista materiałów potrzebnych do wyprodukowania (Bill of Materials)
  attachments: {                  // Załączniki techniczne
    dxfFile?: string;             // Ścieżka do pliku DXF
    pdfDrawing?: string;          // Ścieżka do rysunku technicznego PDF
  };
}
```

### `BomItem`
Reprezentuje pojedynczą pozycję na liście materiałów (BOM) dla danego Elementu.
```typescript
interface BomItem {
  id: string;                     // Unikalny identyfikator pozycji BOM
  materialId: string;             // ID materiału z modułu Magazynu
  quantity: number;               // Wymagana ilość materiału
  unit: 'szt' | 'm' | 'm2' | 'kg'; // Jednostka miary
}
```

## 3. Domena: Zasoby i Magazyn

Modele te definiują materiały, ich stany magazynowe i procesy zaopatrzeniowe.

### `Material`
Reprezentuje definicję materiału w bazie (Material Master).
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

### `Stock`
Reprezentuje fizyczny stan magazynowy danego Materiału.
```typescript
interface Stock {
  materialId: string;             // ID materiału, którego dotyczy stan
  quantity: {
    available: number;            // Ilość dostępna od ręki
    reserved: number;             // Ilość zarezerwowana pod projekty
    ordered: number;              // Ilość zamówiona u dostawców
  };
  location?: string;              // Opcjonalne oznaczenie lokalizacji w magazynie
}
```

## 4. Domena: Relacje Biznesowe

Modele te definiują zewnętrzne podmioty, z którymi firma współpracuje.

### `Client`
Reprezentuje firmę klienta.
```typescript
interface Client {
  id: string;                     // Unikalny identyfikator klienta
  name: string;                   // Nazwa firmy
  contactPeople: ContactPerson[]; // Lista powiązanych osób kontaktowych
  taxId?: string;                 // NIP
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}
```

### `ContactPerson`
Reprezentuje osobę kontaktową u Klienta.
```typescript
interface ContactPerson {
  id: string;                     // Unikalny identyfikator osoby
  name: string;                   // Imię i nazwisko
  email: string;
  phone?: string;
  position?: string;              // Stanowisko
}
```

### `Subcontractor`
Reprezentuje firmę podwykonawcy.
```typescript
interface Subcontractor {
  id: string;                     // Unikalny identyfikator podwykonawcy
  name: string;                   // Nazwa firmy
  specializations: string[];      // Lista specjalizacji (np. ['spawanie', 'lakierowanie'])
  contactInfo: {
    email: string;
    phone?: string;
  };
}
```
