# NextFab - Dokumentacja Deweloperska

## 🏗️ Architektura Techniczna

### Stack Technologiczny
- **Next.js 15.5.4** - React framework z App Router
- **React 19** - Najnowsza wersja React
- **Chakra UI v3** - Komponentowa biblioteka UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **TanStack React Query** - State management i cache
- **TypeScript** - Statyczne typowanie
- **Turbopack** - Szybki bundler Next.js

### Struktura Katalogów
```
nextfab/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css              # Globalne style
│   │   ├── layout.tsx               # Główny layout
│   │   ├── page.tsx                 # Strona główna
│   │   └── projekt/                 # Routing projektów
│   │       └── [id]/                # Dynamiczne ID
│   │           ├── page.tsx         # Lista projektów
│   │           └── element/         # Elementy projektu
│   │               └── [elementId]/ # Szczegóły elementu
│   │                   └── page.tsx
│   ├── components/                   # Komponenty React
│   │   ├── advanced/                # Zaawansowane komponenty
│   │   │   └── ModelViewer.tsx      # Uniwersalny viewer 3D
│   │   ├── speckle/                 # Integracja Speckle
│   │   │   └── SpeckleViewer.tsx    # Speckle 3D viewer
│   │   └── quotation/               # Moduł wycen
│   │       └── EnhancedQuotationModule.tsx
│   ├── hooks/                       # Custom React hooks
│   │   └── useProjectModules.ts     # Hook do modułów projektu
│   └── lib/                         # Utilities i serwisy
│       └── speckle.ts               # Speckle API service
├── public/                          # Statyczne pliki
├── docs/                           # Dokumentacja
└── package.json                    # Zależności projektu
```

## 🎯 Kluczowe Komponenty

### 1. ModelViewer (`src/components/advanced/ModelViewer.tsx`)
Uniwersalny komponent do wyświetlania różnych typów modeli 3D.

**Props:**
```typescript
interface ModelViewerProps {
  modelUrl?: string;
  modelType: '3d' | 'dxf' | 'speckle';
  title?: string;
  onLoad?: (model: any) => void;
  onError?: (error: string) => void;
  readonly?: boolean;
  showControls?: boolean;
  showInfo?: boolean;
  // Speckle-specific props
  speckleStreamId?: string;
  speckleCommitId?: string;
  onSpeckleStreamSelect?: (stream: any) => void;
  onSpeckleCommitSelect?: (commit: any) => void;
}
```

**Funkcjonalności:**
- Obsługa różnych typów modeli (3D, DXF, Speckle)
- Kontrolki zoom, obrót, fullscreen
- Informacje o modelu (wierzchołki, powierzchnie, materiały)
- Integracja z SpeckleViewer dla modeli Speckle

### 2. SpeckleViewer (`src/components/speckle/SpeckleViewer.tsx`)
Dedykowany komponent do wyświetlania modeli 3D z Speckle.

**Props:**
```typescript
interface SpeckleViewerProps {
  streamId?: string;
  commitId?: string;
  title?: string;
  onStreamSelect?: (stream: SpeckleStream) => void;
  onCommitSelect?: (commit: SpeckleCommit) => void;
  readonly?: boolean;
  showControls?: boolean;
  height?: string;
}
```

**Funkcjonalności:**
- Wybór projektów (streams) z dropdown
- Wybór wersji (commits) modelu
- Testowanie połączenia ze Speckle Server
- Wyświetlanie modeli w iframe
- Informacje o projekcie i wersji

### 3. Speckle API Service (`src/lib/speckle.ts`)
Serwis do komunikacji z Speckle Server przez GraphQL.

**Funkcje:**
```typescript
// Pobieranie listy projektów
export async function listStreams(): Promise<SpeckleStream[]>

// Pobieranie wersji projektu
export async function listCommits(streamId: string): Promise<SpeckleCommit[]>

// Pobieranie szczegółów projektu
export async function getStream(streamId: string): Promise<SpeckleStream>

// Budowanie URL do viewer
export async function buildViewerUrl(streamId: string, commitId?: string): Promise<string>

// Testowanie połączenia
export async function testConnection(): Promise<boolean>
```

## 🔧 Konfiguracja Środowiska

### Zmienne Środowiskowe
```env
# Backend configuration
BACKEND_URL=http://localhost:3001

# Next.js configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Speckle Configuration
NEXT_PUBLIC_SPECKLE_SERVER=http://127.0.0.1:3002
NEXT_PUBLIC_SPECKLE_TOKEN=your_speckle_token_here
```

### Konfiguracja Speckle
1. **Lokalny Speckle Server**: Uruchom Docker Compose z konfiguracją Speckle
2. **Token autoryzacyjny**: Wygeneruj token w Speckle Manager lub na stronie profilu
3. **Test połączenia**: Aplikacja automatycznie testuje połączenie przy starcie

## 🎨 Design System

### Chakra UI v3
Aplikacja wykorzystuje najnowszą wersję Chakra UI z nową składnią komponentów:

**Przykład użycia Select:**
```typescript
import { Select, createListCollection } from '@chakra-ui/react';

const collection = createListCollection({
  items: options.map(option => ({
    label: option.name,
    value: option.id,
    data: option
  }))
});

<Select.Root value={selectedValue} onValueChange={handleChange}>
  <Select.Trigger>
    <Select.Value placeholder="Wybierz opcję..." />
  </Select.Trigger>
  <Select.Content>
    {collection.items.map((item) => (
      <Select.Item key={item.value} value={item.value}>
        {item.label}
      </Select.Item>
    ))}
  </Select.Content>
</Select.Root>
```

### Kolory i Motywy
- **Primary**: Niebieski (#3182ce)
- **Secondary**: Szary (#718096)
- **Success**: Zielony (#38a169)
- **Warning**: Pomarańczowy (#dd6b20)
- **Error**: Czerwony (#e53e3e)

## 📱 Responsywność

Aplikacja jest w pełni responsywna z breakpointami:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

**Przykład responsywnego layoutu:**
```typescript
<SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
  <Box gridColumn={{ base: 'auto', lg: 'span 2' }}>
    {/* Główna zawartość */}
  </Box>
  <Box>
    {/* Panel boczny */}
  </Box>
</SimpleGrid>
```

## 🔄 State Management

### TanStack React Query
Aplikacja wykorzystuje React Query do zarządzania stanem serwera:

```typescript
import { useQuery } from '@tanstack/react-query';

function useStreams() {
  return useQuery({
    queryKey: ['streams'],
    queryFn: listStreams,
    staleTime: 5 * 60 * 1000, // 5 minut
  });
}
```

### Local State
Lokalny stan komponentów zarządzany przez React hooks:
- `useState` - podstawowy stan
- `useEffect` - efekty uboczne
- `useRef` - referencje do DOM

## 🧪 Testowanie

### Struktura Testów
```
__tests__/
├── components/
│   ├── ModelViewer.test.tsx
│   └── SpeckleViewer.test.tsx
├── lib/
│   └── speckle.test.ts
└── setup.ts
```

### Przykład Testu
```typescript
import { render, screen } from '@testing-library/react';
import { ModelViewer } from '@/components/advanced/ModelViewer';

describe('ModelViewer', () => {
  it('renders Speckle viewer when modelType is speckle', () => {
    render(
      <ModelViewer
        modelType="speckle"
        title="Test Model"
        speckleStreamId="test-stream"
      />
    );
    
    expect(screen.getByText('Test Model')).toBeInTheDocument();
  });
});
```

## 🚀 Deployment

### Build Production
```bash
npm run build
npm run start
```

### Environment Variables
Upewnij się, że wszystkie zmienne środowiskowe są ustawione:
- `NEXT_PUBLIC_SPECKLE_SERVER`
- `NEXT_PUBLIC_SPECKLE_TOKEN`
- `BACKEND_URL`

### Docker (opcjonalnie)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Debugging

### React Query DevTools
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Aplikacja */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### Console Logging
```typescript
// Włącz szczegółowe logi w development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## 📚 Przydatne Linki

- [Next.js Documentation](https://nextjs.org/docs)
- [Chakra UI v3 Documentation](https://v3.chakra-ui.com/)
- [TanStack React Query](https://tanstack.com/query/latest)
- [Speckle Documentation](https://speckle.guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

### Code Style
- Używaj TypeScript dla wszystkich komponentów
- Preferuj functional components z hooks
- Używaj Chakra UI komponentów zamiast custom CSS
- Pisz testy dla nowych funkcjonalności

### Git Workflow
1. Stwórz branch z nazwą feature/opis
2. Commituj zmiany z opisowymi wiadomościami
3. Stwórz Pull Request z opisem zmian
4. Po review i approval, merge do main

---

**NextFab Development Team** - Dokumentacja techniczna


