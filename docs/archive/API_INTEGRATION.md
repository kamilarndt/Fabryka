# NextFab - Dokumentacja API i Integracji

## 🔌 Integracja Speckle

### Konfiguracja Speckle Server

#### Lokalny Serwer Speckle
```yaml
# docker-compose.yml
services:
  speckle-server:
    image: speckle/speckle-server:2
    environment:
      CANONICAL_URL: 'http://127.0.0.1:8081'
      SESSION_SECRET: 'your-secret-key'
      POSTGRES_URL: 'postgres://speckle:speckle@postgres:5432/speckle'
      REDIS_URL: 'redis://redis:6379'
    ports:
      - '127.0.0.1:3002:3000'
```

#### Zmienne Środowiskowe
```env
NEXT_PUBLIC_SPECKLE_SERVER=http://127.0.0.1:3002
NEXT_PUBLIC_SPECKLE_TOKEN=your_speckle_token_here
```

### Speckle API Service

#### GraphQL Client
```typescript
// src/lib/speckle.ts
import { GraphQLClient, gql } from 'graphql-request';

const SPECKLE_SERVER_URL = process.env.NEXT_PUBLIC_SPECKLE_SERVER;
const SPECKLE_TOKEN = process.env.NEXT_PUBLIC_SPECKLE_TOKEN;

const client = new GraphQLClient(`${SPECKLE_SERVER_URL}/graphql`, {
  headers: {
    Authorization: `Bearer ${SPECKLE_TOKEN}`,
  },
});
```

#### Zapytania GraphQL

**Lista projektów (streams):**
```graphql
query {
  streams(query: "") {
    items {
      id
      name
      description
      updatedAt
      commits {
        totalCount
      }
    }
  }
}
```

**Lista wersji projektu:**
```graphql
query Stream($streamId: String!) {
  stream(id: $streamId) {
    id
    name
    commits {
      items {
        id
        message
        authorName
        createdAt
      }
    }
  }
}
```

**Test połączenia:**
```graphql
query {
  serverInfo {
    name
    company
    canonicalUrl
  }
}
```

### Komponenty Speckle

#### SpeckleViewer
```typescript
import SpeckleViewer from '@/components/speckle/SpeckleViewer';

<SpeckleViewer
  streamId="stream-id"
  commitId="commit-id"
  title="Model 3D"
  onStreamSelect={(stream) => console.log('Selected stream:', stream)}
  onCommitSelect={(commit) => console.log('Selected commit:', commit)}
  showControls={true}
  height="500px"
/>
```

#### ModelViewer z Speckle
```typescript
import ModelViewer from '@/components/advanced/ModelViewer';

<ModelViewer
  modelType="speckle"
  title="Element 3D"
  speckleStreamId="stream-id"
  speckleCommitId="commit-id"
  onSpeckleStreamSelect={(stream) => handleStreamSelect(stream)}
  onSpeckleCommitSelect={(commit) => handleCommitSelect(commit)}
/>
```

## 🏗️ Backend API

### Endpoints Projektów

#### Lista projektów
```http
GET /api/projects
Authorization: Bearer <token>

Response:
{
  "projects": [
    {
      "id": "proj-123",
      "name": "Projekt Stoisko 2025",
      "client": "Klient ABC",
      "status": "active",
      "modules": ["overview", "elements", "quotation"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    }
  ]
}
```

#### Szczegóły projektu
```http
GET /api/projects/:id
Authorization: Bearer <token>

Response:
{
  "id": "proj-123",
  "name": "Projekt Stoisko 2025",
  "description": "Stoisko targowe dla klienta ABC",
  "client": {
    "id": "client-456",
    "name": "Klient ABC",
    "email": "kontakt@klientabc.pl",
    "phone": "+48 123 456 789"
  },
  "location": {
    "address": "ul. Przykładowa 123",
    "city": "Kraków",
    "postalCode": "30-001"
  },
  "modules": {
    "overview": true,
    "concept": false,
    "elements": true,
    "quotation": true,
    "schedule": true,
    "files": true,
    "materials": false,
    "logistics": false,
    "crew": false
  },
  "timeline": {
    "startDate": "2024-02-01",
    "endDate": "2024-03-15",
    "milestones": [
      {
        "id": "milestone-1",
        "name": "Koncepcja",
        "dueDate": "2024-02-15",
        "status": "completed"
      }
    ]
  }
}
```

#### Tworzenie projektu
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nowy Projekt",
  "description": "Opis projektu",
  "clientId": "client-456",
  "location": {
    "address": "ul. Przykładowa 123",
    "city": "Kraków",
    "postalCode": "30-001"
  },
  "modules": ["overview", "elements", "quotation"],
  "timeline": {
    "startDate": "2024-02-01",
    "endDate": "2024-03-15"
  }
}

Response:
{
  "id": "proj-789",
  "name": "Nowy Projekt",
  "status": "created",
  "createdAt": "2024-01-20T12:00:00Z"
}
```

### Endpoints Elementów

#### Lista elementów projektu
```http
GET /api/projects/:id/elements
Authorization: Bearer <token>

Response:
{
  "elements": [
    {
      "id": "elem-123",
      "name": "Pulpit Kandydata",
      "code": "PK-001",
      "category": "Meblarstwo",
      "status": "in_progress",
      "model3d": "https://speckle.xyz/streams/da9e320064/commits/550e12a20e",
      "bom": [
        {
          "id": "bom-1",
          "name": "Płyta MDF 18mm",
          "quantity": 2,
          "unit": "szt",
          "material": "MDF",
          "cost": 150
        }
      ],
      "instances": [
        {
          "id": "inst-1",
          "number": 1,
          "status": "production",
          "assignedTo": "Jan Kowalski"
        }
      ]
    }
  ]
}
```

#### Szczegóły elementu
```http
GET /api/projects/:id/elements/:elementId
Authorization: Bearer <token>

Response:
{
  "id": "elem-123",
  "name": "Pulpit Kandydata",
  "code": "PK-001",
  "category": "Meblarstwo",
  "description": "Pulpit dla kandydata z miejscem na laptop",
  "model3d": "https://speckle.xyz/streams/da9e320064/commits/550e12a20e",
  "status": "in_progress",
  "bom": [
    {
      "id": "bom-1",
      "name": "Płyta MDF 18mm",
      "description": "Płyta MDF 18mm",
      "quantity": 2,
      "unit": "szt",
      "material": "MDF",
      "cost": 150,
      "supplier": "Dostawca ABC"
    }
  ],
  "productionSteps": [
    {
      "id": "step-1",
      "name": "Cięcie płyt",
      "status": "completed",
      "assignedTo": "Jan Kowalski",
      "dueDate": "2024-07-10",
      "estimatedHours": 4
    }
  ],
  "attachments": [
    {
      "id": "att-1",
      "name": "projekt_pulpitu.pdf",
      "url": "/files/projekt_pulpitu.pdf",
      "type": "document",
      "uploadedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Endpoints Wycen

#### Lista wycen projektu
```http
GET /api/projects/:id/quotations
Authorization: Bearer <token>

Response:
{
  "quotations": [
    {
      "id": "quot-123",
      "name": "Wycena główna",
      "version": "1.0",
      "status": "draft",
      "totalAmount": 15000.00,
      "currency": "PLN",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    }
  ]
}
```

#### Szczegóły wyceny
```http
GET /api/projects/:id/quotations/:quotationId
Authorization: Bearer <token>

Response:
{
  "id": "quot-123",
  "name": "Wycena główna",
  "version": "1.0",
  "status": "draft",
  "items": [
    {
      "id": "item-1",
      "category": "Materiały",
      "name": "Płyta MDF 18mm",
      "description": "Płyta MDF 18mm do pulpitu",
      "quantity": 2,
      "unit": "szt",
      "unitPrice": 75.00,
      "totalPrice": 150.00,
      "source": "bom",
      "sourceId": "bom-1"
    },
    {
      "id": "item-2",
      "category": "Robocizna",
      "name": "Projektowanie",
      "description": "Czas projektanta",
      "quantity": 8,
      "unit": "h",
      "unitPrice": 100.00,
      "totalPrice": 800.00,
      "source": "crew",
      "sourceId": "crew-1"
    }
  ],
  "summary": {
    "subtotal": 14850.00,
    "tax": 0.00,
    "total": 14850.00,
    "currency": "PLN"
  }
}
```

## 🔄 WebSocket Events

### Real-time Updates

#### Połączenie WebSocket
```typescript
const ws = new WebSocket('ws://localhost:3001/ws');

ws.onopen = () => {
  console.log('WebSocket connected');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  handleWebSocketMessage(data);
};
```

#### Eventy Elementów
```typescript
// Aktualizacja statusu elementu
{
  "type": "element.status.updated",
  "data": {
    "projectId": "proj-123",
    "elementId": "elem-123",
    "status": "completed",
    "updatedBy": "user-456",
    "timestamp": "2024-01-20T15:30:00Z"
  }
}

// Nowy element dodany
{
  "type": "element.created",
  "data": {
    "projectId": "proj-123",
    "element": {
      "id": "elem-789",
      "name": "Nowy Element",
      "status": "draft"
    }
  }
}
```

#### Eventy Wycen
```typescript
// Aktualizacja wyceny
{
  "type": "quotation.updated",
  "data": {
    "projectId": "proj-123",
    "quotationId": "quot-123",
    "totalAmount": 16000.00,
    "updatedBy": "user-456"
  }
}
```

## 🔐 Autoryzacja

### JWT Token
```typescript
// Dodawanie tokenu do requestów
const token = localStorage.getItem('authToken');

fetch('/api/projects', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Role i Uprawnienia
```typescript
interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'designer' | 'viewer';
  permissions: string[];
}

// Sprawdzanie uprawnień
function hasPermission(user: User, permission: string): boolean {
  return user.permissions.includes(permission) || user.role === 'admin';
}
```

## 📊 Error Handling

### Standardowe Kody Błędów
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Przykłady błędów
const errors = {
  'PROJECT_NOT_FOUND': 'Projekt nie został znaleziony',
  'ELEMENT_NOT_FOUND': 'Element nie został znaleziony',
  'INSUFFICIENT_PERMISSIONS': 'Brak uprawnień do wykonania operacji',
  'VALIDATION_ERROR': 'Błąd walidacji danych',
  'SPECKLE_CONNECTION_ERROR': 'Błąd połączenia ze Speckle Server'
};
```

### Error Boundary
```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Alert status="error">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Wystąpił błąd</Alert.Title>
        <Alert.Description>{error.message}</Alert.Description>
        <Button onClick={resetErrorBoundary}>Spróbuj ponownie</Button>
      </Alert.Content>
    </Alert>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <YourComponent />
</ErrorBoundary>
```

## 🧪 Testowanie API

### Mock Data
```typescript
// src/mocks/projects.ts
export const mockProjects = [
  {
    id: 'proj-123',
    name: 'Projekt Stoisko 2025',
    client: 'Klient ABC',
    status: 'active',
    modules: ['overview', 'elements', 'quotation'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  }
];
```

### API Testing
```typescript
// __tests__/api/projects.test.ts
import { listProjects, getProject } from '@/lib/api/projects';

describe('Projects API', () => {
  it('should fetch projects list', async () => {
    const projects = await listProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe('Projekt Stoisko 2025');
  });

  it('should fetch project details', async () => {
    const project = await getProject('proj-123');
    expect(project.id).toBe('proj-123');
    expect(project.modules).toContain('elements');
  });
});
```

## 📈 Performance

### Caching Strategy
```typescript
// React Query cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minut
      cacheTime: 10 * 60 * 1000, // 10 minut
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});
```

### Lazy Loading
```typescript
// Lazy loading komponentów
const SpeckleViewer = lazy(() => import('@/components/speckle/SpeckleViewer'));

<Suspense fallback={<Spinner />}>
  <SpeckleViewer streamId={streamId} />
</Suspense>
```

---

**NextFab API Documentation** - Kompletna dokumentacja integracji


