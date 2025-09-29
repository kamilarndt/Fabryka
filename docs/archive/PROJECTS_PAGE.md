# NextFab - Strona Projektów

## 📋 Przegląd

Strona Projektów to centralny element systemu NextFab, umożliwiający kompleksowe zarządzanie projektami dekoratorskimi, scenograficznymi i produkcyjnymi. Każdy projekt w systemie ma swoją unikalną strukturę, moduły i cykl życia.

## 🏠 Strona Główna - Lista Projektów

### Interfejs Użytkownika

**Lokalizacja**: `/` (strona główna)

**Elementy interfejsu:**
- **Lista projektów** w formie kart lub tabeli
- **Wyszukiwarka** po nazwie projektu
- **Dwa tabsy**: Aktualne/Archiwalne
- **Sortowanie** po nazwie, datach
- **Przycisk "Dodaj Projekt"**

### Funkcjonalności

#### 🔍 Wyszukiwanie i Filtrowanie
```typescript
// Przykład komponentu wyszukiwania
<Input
  placeholder="Szukaj projektów..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  leftIcon={<FiSearch />}
/>
```

#### 📊 Sortowanie
- **Po nazwie** (A-Z, Z-A)
- **Po dacie utworzenia** (najnowsze, najstarsze)
- **Po dacie modyfikacji** (ostatnio edytowane)
- **Po statusie** (aktywne, zakończone, wstrzymane)

#### 📑 Tabsy
- **Aktualne**: Projekty w trakcie realizacji
- **Archiwalne**: Zakończone projekty

### Struktura Danych Projektu

```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  location: {
    address: string;
    city: string;
    postalCode: string;
  };
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  modules: ProjectModule[];
  timeline: {
    startDate: string;
    endDate: string;
    milestones: Milestone[];
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

## 🆕 Kreator Nowego Projektu

### Kreator 3-krokowy z Progress Barem

**Lokalizacja**: `/projects/new`

#### Krok 1: 📋 DANE PODSTAWOWE PROJEKTU

**Komponenty formularza:**

##### 🏢 INFORMACJE O PROJEKCIE
```typescript
interface ProjectBasicInfo {
  name: string;           // Wymagane
  description?: string;
  projectNumber?: string; // Auto-generowany
  timeline: {
    startDate: string;
    endDate: string;
    milestones?: Milestone[];
  };
}
```

**Pola formularza:**
- **Nazwa projektu** * (wymagane)
- **Numer projektu** (auto-generowany)
- **Opis projektu** (opcjonalne)
- **Termin realizacji** z możliwością różnych terminów i kamieni milowych

##### 👥 KLIENT
```typescript
interface ClientInfo {
  id?: string;        // Jeśli istniejący klient
  name: string;       // Jeśli nowy klient
  email: string;
  phone?: string;
  company?: string;
}
```

**Funkcjonalności:**
- **Wybór klienta** (dropdown/search)
- **"Dodaj nowego klienta"** (jeśli nie istnieje)
- **Kontakt do klienta** (email, telefon)

##### 📍 LOKALIZACJA
```typescript
interface LocationInfo {
  address: string;    // Wymagane
  city: string;       // Wymagane
  postalCode: string; // Wymagane
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
```

**Pola formularza:**
- **Adres realizacji** * (wymagane)
- **Miasto** * (wymagane)
- **Kod pocztowy** * (wymagane)
- **Kraj** (opcjonalne)

#### Krok 2: 🔧 MODUŁY PROJEKTU

**Lokalizacja**: `/projects/new/modules`

##### 📋 MODUŁY PODSTAWOWE (zawsze aktywne)
```typescript
interface BasicModules {
  overview: true;      // Przegląd projektu
  elements: true;      // Zarządzanie kafelkami
  quotation: true;     // Kalkulacja kosztów
  schedule: true;      // Planowanie czasowe
  files: true;         // Zarządzanie dokumentami
}
```

##### ☑️ MODUŁY OPCJONALNE
```typescript
interface OptionalModules {
  concept?: boolean;     // Concept board
  materials?: boolean;   // Zarządzanie materiałami
  logistics?: boolean;   // Transport i montaż
  crew?: boolean;        // Noclegi zespołów
}
```

**Interfejs wyboru modułów:**
```typescript
<CheckboxGroup value={selectedModules} onChange={setSelectedModules}>
  <VStack align="start" spacing={4}>
    <Checkbox value="concept">
      <VStack align="start" spacing={1}>
        <Text fontWeight="medium">Koncepcja</Text>
        <Text fontSize="sm" color="gray.600">
          Concept board, inspiracje, workflow zatwierdzania
        </Text>
      </VStack>
    </Checkbox>
    <Checkbox value="materials">
      <VStack align="start" spacing={1}>
        <Text fontWeight="medium">Materiały</Text>
        <Text fontSize="sm" color="gray.600">
          Zarządzanie zapasami, listy zakupów, katalog materiałów
        </Text>
      </VStack>
    </Checkbox>
    {/* ... inne moduły */}
  </VStack>
</CheckboxGroup>
```

#### Krok 3: 📁 DODATKOWE INFORMACJE

**Lokalizacja**: `/projects/new/details`

**Funkcjonalności:**
- **Dodanie opisu** i dodatkowych informacji o projekcie
- **Wgrywanie plików** otrzymanych od klienta
- **Dostarczanie plików** powiązanych z projektem
- **Podgląd struktury folderów** która zostanie utworzona

### Walidacja i Zapisywanie

#### Walidacja na każdym kroku
```typescript
const validateStep = (step: number, data: any): ValidationResult => {
  switch (step) {
    case 1:
      return validateBasicInfo(data);
    case 2:
      return validateModules(data);
    case 3:
      return validateDetails(data);
    default:
      return { isValid: false, errors: [] };
  }
};
```

#### Zapisywanie postępu
- **Auto-save** co 30 sekund
- **Możliwość powrotu** do poprzednich kroków
- **Walidacja przed przejściem** do następnego kroku

## 🏗️ Struktura Folderów Projektów

### Automatyczne Generowanie Struktury

**Lokalizacja**: `Z:\_NoweRozdanie\[KLIENT]\[PROJEKT]`

#### Struktura Główna
```
Z:\_NoweRozdanie\
├── [NAZWA_KLIENTA]/
│   ├── [PROJEKT_1]/
│   ├── [PROJEKT_2]/
│   └── [PROJEKT_N]/
└── [INNY_KLIENT]/
```

#### Struktura Pojedynczego Projektu
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

### Dynamiczne Dodawanie Modułów

#### API Endpoint
```http
POST /api/projects/:id/fs-sync
Authorization: Bearer <token>
Content-Type: application/json

{
  "modules": ["concept", "materials"],
  "action": "add"
}
```

#### Proces Synchronizacji
1. **Walidacja uprawnień** zapisu do katalogu
2. **Sprawdzenie istniejących** folderów
3. **Utworzenie brakujących** folderów
4. **Aktualizacja bazy danych** o strukturze
5. **Logowanie operacji** w pliku log_zmian.md

## 📊 Szczegóły Projektu

### Strona Szczegółów Projektu

**Lokalizacja**: `/projekt/[id]`

#### Layout Strony
```typescript
<ProjectLayout>
  <ProjectHeader project={project} />
  <ProjectTabs>
    <Tab value="overview">
      <OverviewModule />
    </Tab>
    {project.modules.includes('concept') && (
      <Tab value="concept">
        <ConceptModule />
      </Tab>
    )}
    {project.modules.includes('elements') && (
      <Tab value="elements">
        <ElementsModule />
      </Tab>
    )}
    {/* ... inne moduły */}
  </ProjectTabs>
</ProjectLayout>
```

#### Nagłówek Projektu
```typescript
interface ProjectHeaderProps {
  project: Project;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}
```

**Elementy nagłówka:**
- **Nazwa projektu** i numer
- **Status** z kolorowym wskaźnikiem
- **Klient** i lokalizacja
- **Timeline** z progress barem
- **Akcje** (edytuj, archiwizuj, usuń)

#### System Tabsów
Tabsy są dynamicznie generowane na podstawie aktywnych modułów w projekcie:

```typescript
const getActiveTabs = (modules: ProjectModule[]) => {
  const tabs = [
    { id: 'overview', label: 'Przegląd', icon: FiHome, always: true },
    { id: 'concept', label: 'Koncepcja', icon: FiLightbulb, module: 'concept' },
    { id: 'elements', label: 'Elementy', icon: FiBox, module: 'elements' },
    { id: 'quotation', label: 'Wycena', icon: FiDollarSign, module: 'quotation' },
    { id: 'schedule', label: 'Harmonogram', icon: FiCalendar, module: 'schedule' },
    { id: 'files', label: 'Pliki', icon: FiFileText, module: 'files' },
    { id: 'materials', label: 'Materiały', icon: FiPackage, module: 'materials' },
    { id: 'logistics', label: 'Logistyka', icon: FiTruck, module: 'logistics' },
    { id: 'crew', label: 'Załoga', icon: FiUsers, module: 'crew' }
  ];

  return tabs.filter(tab => tab.always || modules.includes(tab.module));
};
```

## 🔄 Cykl Życia Projektu

### Statusy Projektu

```typescript
type ProjectStatus = 
  | 'draft'        // Szkic
  | 'active'       // Aktywny
  | 'paused'       // Wstrzymany
  | 'completed'    // Zakończony
  | 'cancelled'    // Anulowany
  | 'archived';    // Zarchiwizowany
```

### Przejścia Statusów

```typescript
const statusTransitions: Record<ProjectStatus, ProjectStatus[]> = {
  draft: ['active', 'cancelled'],
  active: ['paused', 'completed', 'cancelled'],
  paused: ['active', 'cancelled'],
  completed: ['archived'],
  cancelled: ['archived'],
  archived: [] // Końcowy status
};
```

### Automatyczne Aktualizacje

#### Na podstawie elementów
```typescript
const updateProjectStatus = async (projectId: string) => {
  const elements = await getProjectElements(projectId);
  const allCompleted = elements.every(el => el.status === 'completed');
  
  if (allCompleted && elements.length > 0) {
    await updateProject(projectId, { status: 'completed' });
  }
};
```

#### Na podstawie timeline
```typescript
const checkProjectDeadlines = async () => {
  const overdueProjects = await getProjectsByDeadline(new Date());
  
  for (const project of overdueProjects) {
    if (project.status === 'active') {
      await updateProject(project.id, { status: 'paused' });
      await sendNotification(project.managerId, 'Project overdue');
    }
  }
};
```

## 📈 Dashboard i Statystyki

### Dashboard Projektu

**Lokalizacja**: `/projekt/[id]` (tab Overview)

#### Kluczowe Metryki
```typescript
interface ProjectMetrics {
  progress: number;           // Postęp ogólny (0-100%)
  budget: {
    planned: number;          // Planowany budżet
    spent: number;            // Wydane środki
    remaining: number;        // Pozostałe środki
  };
  timeline: {
    startDate: string;
    endDate: string;
    currentPhase: string;
    daysRemaining: number;
  };
  elements: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
  team: {
    assigned: number;
    active: number;
  };
}
```

#### Komponenty Dashboard
- **Progress Ring** - ogólny postęp projektu
- **Budget Chart** - wykres wydatków vs plan
- **Timeline Gantt** - harmonogram z kamieniami milowymi
- **Elements Kanban** - status elementów
- **Team Status** - status załogi
- **Recent Activity** - ostatnie aktywności

### Statystyki Globalne

**Lokalizacja**: `/dashboard`

#### Metryki Firmowe
```typescript
interface CompanyMetrics {
  projects: {
    active: number;
    completed: number;
    total: number;
  };
  revenue: {
    current: number;
    projected: number;
    growth: number;
  };
  clients: {
    total: number;
    active: number;
    new: number;
  };
  team: {
    utilization: number;
    capacity: number;
  };
}
```

## 🔧 API Endpoints

### Projekty

#### Lista projektów
```http
GET /api/projects
Authorization: Bearer <token>
Query Parameters:
  - search?: string
  - status?: ProjectStatus
  - client?: string
  - sortBy?: 'name' | 'createdAt' | 'updatedAt'
  - sortOrder?: 'asc' | 'desc'
  - page?: number
  - limit?: number

Response:
{
  "projects": Project[],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

#### Szczegóły projektu
```http
GET /api/projects/:id
Authorization: Bearer <token>

Response: Project
```

#### Tworzenie projektu
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

Request Body: CreateProjectRequest

Response: Project
```

#### Aktualizacja projektu
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body: UpdateProjectRequest

Response: Project
```

#### Usuwanie projektu
```http
DELETE /api/projects/:id
Authorization: Bearer <token>

Response: { success: boolean }
```

### Synchronizacja Folderów

#### Synchronizacja struktury
```http
POST /api/projects/:id/fs-sync
Authorization: Bearer <token>
Content-Type: application/json

{
  "modules": string[],
  "action": "add" | "remove" | "sync"
}

Response:
{
  "success": boolean,
  "created": string[],
  "removed": string[],
  "errors": string[]
}
```

## 🎨 Komponenty UI

### ProjectCard
```typescript
interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onView: (project: Project) => void;
  onArchive: (project: Project) => void;
}

<Card.Root>
  <Card.Header>
    <HStack justify="space-between">
      <VStack align="start" spacing={1}>
        <Text fontWeight="semibold">{project.name}</Text>
        <Text fontSize="sm" color="gray.600">{project.client.name}</Text>
      </VStack>
      <Badge colorPalette={getStatusColor(project.status)}>
        {getStatusLabel(project.status)}
      </Badge>
    </HStack>
  </Card.Header>
  <Card.Body>
    <VStack align="stretch" spacing={3}>
      <Text fontSize="sm">{project.description}</Text>
      <HStack justify="space-between" fontSize="sm" color="gray.600">
        <Text>📍 {project.location.city}</Text>
        <Text>📅 {formatDate(project.timeline.endDate)}</Text>
      </HStack>
      <Progress.Root value={project.progress}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </VStack>
  </Card.Body>
  <Card.Footer>
    <HStack gap={2}>
      <Button size="sm" variant="outline" onClick={() => onView(project)}>
        <FiEye />
        Zobacz
      </Button>
      <Button size="sm" variant="outline" onClick={() => onEdit(project)}>
        <FiEdit />
        Edytuj
      </Button>
    </HStack>
  </Card.Footer>
</Card.Root>
```

### ProjectWizard
```typescript
interface ProjectWizardProps {
  onComplete: (project: Project) => void;
  onCancel: () => void;
}

const steps = [
  { id: 'basic', title: 'Dane podstawowe', component: BasicInfoStep },
  { id: 'modules', title: 'Moduły', component: ModulesStep },
  { id: 'details', title: 'Szczegóły', component: DetailsStep }
];

<Wizard.Root>
  <Wizard.Header>
    <Progress.Root value={(currentStep / steps.length) * 100}>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
    <Text fontSize="sm" color="gray.600">
      Krok {currentStep + 1} z {steps.length}
    </Text>
  </Wizard.Header>
  <Wizard.Content>
    {steps[currentStep].component}
  </Wizard.Content>
  <Wizard.Footer>
    <HStack justify="space-between">
      <Button 
        variant="outline" 
        onClick={handlePrevious}
        disabled={currentStep === 0}
      >
        Wstecz
      </Button>
      <Button 
        colorPalette="primary"
        onClick={handleNext}
        disabled={!isStepValid}
      >
        {currentStep === steps.length - 1 ? 'Utwórz' : 'Dalej'}
      </Button>
    </HStack>
  </Wizard.Footer>
</Wizard.Root>
```

## 🔍 Wyszukiwanie i Filtrowanie

### Zaawansowane Wyszukiwanie
```typescript
interface SearchFilters {
  query?: string;
  status?: ProjectStatus[];
  client?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  modules?: string[];
  location?: {
    city?: string;
    radius?: number;
  };
}

const useProjectSearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['projects', 'search', filters],
    queryFn: () => searchProjects(filters),
    keepPreviousData: true
  });
};
```

### Komponent Wyszukiwania
```typescript
<SearchFilters>
  <Input
    placeholder="Szukaj projektów..."
    value={filters.query}
    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
    leftIcon={<FiSearch />}
  />
  <Select.Root
    value={filters.status}
    onValueChange={(e) => setFilters({ ...filters, status: e.value })}
  >
    <Select.Trigger>
      <Select.Value placeholder="Status" />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="active">Aktywne</Select.Item>
      <Select.Item value="completed">Zakończone</Select.Item>
      <Select.Item value="paused">Wstrzymane</Select.Item>
    </Select.Content>
  </Select.Root>
</SearchFilters>
```

## 📱 Responsywność

### Breakpointy
```typescript
const breakpoints = {
  base: '0px',    // Mobile
  sm: '480px',    // Large mobile
  md: '768px',    // Tablet
  lg: '992px',    // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px' // Extra large desktop
};
```

### Responsywny Layout
```typescript
<SimpleGrid 
  columns={{ base: 1, md: 2, lg: 3 }} 
  spacing={{ base: 4, md: 6 }}
>
  {projects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))}
</SimpleGrid>
```

## 🧪 Testowanie

### Testy Komponentów
```typescript
// __tests__/components/ProjectCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '@/components/ProjectCard';

describe('ProjectCard', () => {
  const mockProject = {
    id: 'proj-123',
    name: 'Test Project',
    client: { name: 'Test Client' },
    status: 'active',
    location: { city: 'Kraków' },
    timeline: { endDate: '2024-12-31' },
    progress: 75
  };

  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('Kraków')).toBeInTheDocument();
  });

  it('calls onView when view button is clicked', () => {
    const onView = jest.fn();
    render(<ProjectCard project={mockProject} onView={onView} />);
    
    fireEvent.click(screen.getByText('Zobacz'));
    expect(onView).toHaveBeenCalledWith(mockProject);
  });
});
```

### Testy API
```typescript
// __tests__/api/projects.test.ts
import { createProject, getProjects } from '@/lib/api/projects';

describe('Projects API', () => {
  it('should create a new project', async () => {
    const projectData = {
      name: 'Test Project',
      client: { name: 'Test Client', email: 'test@example.com' },
      location: { address: 'Test Address', city: 'Kraków', postalCode: '30-001' },
      modules: ['overview', 'elements']
    };

    const project = await createProject(projectData);
    
    expect(project.id).toBeDefined();
    expect(project.name).toBe('Test Project');
    expect(project.status).toBe('draft');
  });

  it('should fetch projects with filters', async () => {
    const filters = { status: ['active'], search: 'test' };
    const projects = await getProjects(filters);
    
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.every(p => p.status === 'active')).toBe(true);
  });
});
```

## 🚀 Performance

### Optymalizacje
```typescript
// Lazy loading komponentów
const ProjectWizard = lazy(() => import('@/components/ProjectWizard'));
const ProjectDetails = lazy(() => import('@/components/ProjectDetails'));

// Memoization
const ProjectCard = memo(({ project, onEdit, onView }) => {
  // Component implementation
});

// Virtual scrolling dla dużych list
import { FixedSizeList as List } from 'react-window';

const ProjectList = ({ projects }) => (
  <List
    height={600}
    itemCount={projects.length}
    itemSize={120}
    itemData={projects}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <ProjectCard project={data[index]} />
      </div>
    )}
  </List>
);
```

### Caching
```typescript
// React Query cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minut
      cacheTime: 10 * 60 * 1000, // 10 minut
    }
  }
});

// Prefetching
const prefetchProject = (projectId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId)
  });
};
```

---

**NextFab Projects Page** - Kompletna dokumentacja strony projektów

*Ostatnia aktualizacja: Styczeń 2024*
