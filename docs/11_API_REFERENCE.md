# 11: Dokumentacja API (API Reference)

## 1. Wprowadzenie

Ten dokument jest oficjalnym źródłem prawdy dotyczącym RESTful API aplikacji NextFab. Opisuje on dostępne zasoby, metody, parametry i formaty odpowiedzi.

- **Base URL:** Wszystkie ścieżki w tym dokumencie są poprzedzone bazowym adresem URL API, np. `https://api.nextfab.com`.
- **Autentykacja:** Większość endpointów wymaga autentykacji. Wymaga to przesłania tokenu JWT w nagłówku `Authorization`.
```
Authorization: Bearer <TWÓJ_JWT_TOKEN>
```

- **Format Danych:** Wszystkie dane w ciałach żądań i odpowiedzi są w formacie `application/json`.

---

## 2. Zasób: Projekty (`/api/projects`)

Endpointy służące do zarządzania projektami.

### `GET /api/projects`
Pobiera listę wszystkich projektów z paginacją.

- **Opis:** Zwraca listę projektów, pozwalając na filtrowanie i sortowanie.
- **Parametry Query:**
  - `status?: string` - filtruj po statusie (np. 'active')
  - `search?: string` - szukaj po nazwie projektu
  - `page?: number` - numer strony (domyślnie 1)
  - `limit?: number` - liczba wyników na stronę (domyślnie 20)
- **Wymagane Nagłówki:** `Authorization`
- **Przykładowa Odpowiedź (200 OK):**
```json
{
  "data": [
    {
      "id": "proj-123",
      "name": "Projekt Stoisko 2025",
      "projectNumber": "P2025/01/15",
      "status": "active",
      "clientId": "client-abc"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 98
  }
}
```

### `POST /api/projects`
Tworzy nowy projekt.

- **Opis:** Przyjmuje podstawowe dane i tworzy nowy projekt w systemie.
- **Wymagane Nagłówki:** `Authorization`
- **Ciało Żądania:**
```json
{
  "name": "Nowy projekt dla Klienta X",
  "clientId": "client-xyz",
  "modules": ["wycena", "logistyka"]
}
```
- **Przykładowa Odpowiedź (201 Created):**
```json
{
  "id": "proj-456",
  "name": "Nowy projekt dla Klienta X",
  "projectNumber": "P2025/09/29",
  "status": "draft",
  "clientId": "client-xyz",
  "modules": ["wycena", "logistyka"],
  "createdAt": "2025-09-29T10:00:00Z"
}
```

## 3. Zasób: Klienci (`/api/clients`)

Endpointy służące do zarządzania bazą klientów.

### `GET /api/clients`
Pobiera listę wszystkich klientów.

- **Opis:** Zwraca uproszczoną listę wszystkich klientów, idealną do wypełnienia listy wyboru w formularzach.
- **Wymagane Nagłówki:** `Authorization`
- **Przykładowa Odpowiedź (200 OK):**
```json
[
  {
    "id": "client-abc",
    "name": "Klient ABC"
  },
  {
    "id": "client-xyz",
    "name": "Klient XYZ"
  }
]
```

## 4. Zasób: Magazyn / Materiały (`/api/materials`)

Endpointy służące do zarządzania materiałami.

### `GET /api/materials`
Pobiera listę materiałów z opcją filtrowania.

- **Opis:** Zwraca listę materiałów z bazy, pozwalając na wyszukiwanie i filtrowanie po kategorii.
- **Parametry Query:**
  - `search?: string` - szukaj po nazwie lub SKU
  - `category?: string` - filtruj po ścieżce kategorii (np. 'Płyty/MDF')
- **Wymagane Nagłówki:** `Authorization`
- **Przykładowa Odpowiedź (200 OK):**
```json
[
  {
    "id": "mat-001",
    "name": "PŁYTA WIÓROWA SUROWA 18MM",
    "sku": "PWS18",
    "unit": "szt",
    "stock": {
      "available": 150
    }
  }
]
```
