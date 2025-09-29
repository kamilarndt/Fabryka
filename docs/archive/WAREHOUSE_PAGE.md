# NextFab - Strona Magazynu i Materiałów (UMMS)

## 📋 Przegląd

**Uniwersalny System Zarządzania Materiałami (UMMS)** to fundamentalny moduł NextFab, będący cyfrowym bliźniakiem fizycznego magazynu. System łączy bezpośrednio projektowanie, produkcję i finanse, zapewniając jedno centralne źródło prawdy o wszystkich materiałach wykorzystywanych w firmie.

## 🎯 Cel Strony

Stworzenie **jednego, centralnego źródła prawdy** o wszystkich materiałach wykorzystywanych w firmie. Strona ma na celu śledzenie stanów magazynowych, zarządzanie dostawcami, automatyzację zamówień oraz dostarczanie precyzyjnych danych materiałowych do modułów **"Elementy Projektowe"** i **"Wycena"**.

## 🏗️ Architektura Systemu

### Kluczowe Koncepcje

#### 1. **Baza Materiałowa (Material Master)**
Katalog/biblioteka wszystkich materiałów, z jakimi kiedykolwiek pracowała firma.

```typescript
interface MaterialMaster {
  id: string;
  name: string;                    // "PŁYTA WIÓROWA SUROWA 18MM"
  sku: string;                     // Kod Produktu / SKU
  manufacturer: string;            // Producent
  supplier: string;                // Dostawca
  category: MaterialCategory;      // Kategoria materiału
  specification: {
    thickness?: number;            // Grubość (mm)
    dimensions?: {                 // Wymiary
      width: number;
      height: number;
      length: number;
    };
    color?: string;                // Kolor
    weight?: number;               // Waga (kg)
    material?: string;             // Rodzaj materiału
    description: string;           // "FOREX BLANC 19 mm"
  };
  pricing: {
    defaultPrice: number;          // Cena zakupu (domyślna)
    currency: string;              // Waluta
    unit: string;                  // Jednostka (szt, m², m, kg)
  };
  images: string[];                // Zdjęcia materiału
  documentation: string[];         // Dokumentacja techniczna
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface MaterialCategory {
  id: string;
  name: string;                    // "Płyty meblowe", "Tworzywa sztuczne"
  parentId?: string;               // Kategoria nadrzędna
  children?: MaterialCategory[];
  icon?: string;
  color?: string;
}
```

#### 2. **Stany Magazynowe (Stock)**
Ewidencja fizyczna materiałów aktualnie posiadanych.

```typescript
interface Stock {
  id: string;
  materialId: string;              // Powiązanie z MaterialMaster
  material: MaterialMaster;
  quantity: {
    available: number;             // Ilość dostępna
    reserved: number;              // Ilość zarezerwowana
    total: number;                 // Ilość ogółem
  };
  location: {
    warehouse: string;             // Magazyn
    zone: string;                  // Strefa (np. "A")
    rack: string;                  // Regał (np. "A1")
    shelf: string;                 // Półka (np. "3")
    position: string;              // Pozycja
  };
  thresholds: {
    minimum: number;               // Minimalny stan magazynowy
    maximum: number;               // Maksymalny stan magazynowy
    reorderPoint: number;          // Punkt zamówienia
  };
  batch?: {
    number: string;                // Numer partii
    expiryDate?: string;           // Data ważności
    supplierBatch?: string;        // Partia dostawcy
  };
  lastUpdated: string;
  updatedBy: string;
}
```

## 🏠 Strona Główna Magazynu

### Lokalizacja
**URL**: `/magazyn`

### Layout Strony

```typescript
<WarehouseLayout>
  <WarehouseHeader />
  <WarehouseContent>
    <WarehouseSidebar />           {/* Panel lewy - kategorie */}
    <WarehouseMain />              {/* Kolumna środkowa - materiały */}
    <WarehouseDetails />           {/* Panel prawy - szczegóły */}
  </WarehouseContent>
</WarehouseLayout>
```

### Interfejs Użytkownika

#### Panel Lewy - Drzewo Kategorii
```typescript
interface CategoryTreeProps {
  categories: MaterialCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  onCategoryExpand: (categoryId: string) => void;
}

<CategoryTree>
  {categories.map(category => (
    <CategoryNode
      key={category.id}
      category={category}
      isSelected={selectedCategory === category.id}
      onSelect={() => onCategorySelect(category.id)}
      onExpand={() => onCategoryExpand(category.id)}
    >
      {category.children?.map(child => (
        <CategoryNode key={child.id} category={child} />
      ))}
    </CategoryNode>
  ))}
</CategoryTree>
```

#### Kolumna Środkowa - Siatka Materiałów
```typescript
interface MaterialGridProps {
  materials: MaterialMaster[];
  selectedMaterial: string | null;
  onMaterialSelect: (materialId: string) => void;
  viewMode: 'grid' | 'list';
  filters: MaterialFilters;
}

<MaterialGrid>
  <MaterialGridHeader>
    <SearchInput
      placeholder="Szukaj materiałów..."
      value={searchTerm}
      onChange={setSearchTerm}
    />
    <ViewModeToggle
      mode={viewMode}
      onChange={setViewMode}
    />
    <FilterButton
      filters={filters}
      onFiltersChange={setFilters}
    />
  </MaterialGridHeader>
  
  <MaterialGridContent>
    {materials.map(material => (
      <MaterialCard
        key={material.id}
        material={material}
        isSelected={selectedMaterial === material.id}
        onClick={() => onMaterialSelect(material.id)}
      />
    ))}
  </MaterialGridContent>
</MaterialGrid>
```

#### Panel Prawy - Szczegóły Materiału
```typescript
interface MaterialDetailsProps {
  material: MaterialMaster | null;
  stock: Stock[];
  onClose: () => void;
}

<MaterialDetails>
  {material && (
    <>
      <MaterialDetailsHeader>
        <MaterialImage src={material.images[0]} />
        <MaterialBasicInfo material={material} />
      </MaterialDetailsHeader>
      
      <MaterialDetailsTabs>
        <Tab value="specification">
          <MaterialSpecification material={material} />
        </Tab>
        <Tab value="stock">
          <StockLevels stock={stock} materialId={material.id} />
        </Tab>
        <Tab value="history">
          <MaterialHistory materialId={material.id} />
        </Tab>
        <Tab value="suppliers">
          <MaterialSuppliers materialId={material.id} />
        </Tab>
        <Tab value="orders">
          <MaterialOrders materialId={material.id} />
        </Tab>
      </MaterialDetailsTabs>
    </>
  )}
</MaterialDetails>
```

## 📦 Karta Materiału

### Komponent MaterialCard
```typescript
interface MaterialCardProps {
  material: MaterialMaster;
  stock?: Stock;
  isSelected: boolean;
  onClick: () => void;
  viewMode: 'grid' | 'list';
}

<Card.Root
  variant={isSelected ? "elevated" : "outline"}
  onClick={onClick}
  cursor="pointer"
  transition="all 0.2s"
  _hover={{ shadow: "md" }}
>
  <Card.Body>
    {viewMode === 'grid' ? (
      <VStack align="stretch" spacing={3}>
        <MaterialImage src={material.images[0]} />
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold" fontSize="sm">
            {material.name}
          </Text>
          <Text fontSize="xs" color="gray.600">
            {material.sku}
          </Text>
          <Text fontSize="xs" color="gray.600">
            {material.specification.description}
          </Text>
        </VStack>
        {stock && (
          <StockIndicator stock={stock} />
        )}
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="medium">
            {material.pricing.defaultPrice} {material.pricing.currency}
          </Text>
          <Badge colorPalette="blue" size="sm">
            {material.category.name}
          </Badge>
        </HStack>
      </VStack>
    ) : (
      <HStack spacing={4}>
        <MaterialImage src={material.images[0]} size="sm" />
        <VStack align="start" flex={1} spacing={1}>
          <Text fontWeight="semibold">{material.name}</Text>
          <Text fontSize="sm" color="gray.600">
            {material.sku} • {material.specification.description}
          </Text>
          {stock && <StockIndicator stock={stock} />}
        </VStack>
        <VStack align="end" spacing={1}>
          <Text fontWeight="medium">
            {material.pricing.defaultPrice} {material.pricing.currency}
          </Text>
          <Badge colorPalette="blue" size="sm">
            {material.category.name}
          </Badge>
        </VStack>
      </HStack>
    )}
  </Card.Body>
</Card.Root>
```

### Wskaźnik Stanu Magazynowego
```typescript
interface StockIndicatorProps {
  stock: Stock;
}

<StockIndicator>
  <HStack spacing={2}>
    <Box
      w={3}
      h={3}
      borderRadius="full"
      bg={getStockColor(stock.quantity.available, stock.thresholds.minimum)}
    />
    <VStack align="start" spacing={0}>
      <Text fontSize="xs" fontWeight="medium">
        Dostępne: {stock.quantity.available} {stock.material.pricing.unit}
      </Text>
      {stock.quantity.reserved > 0 && (
        <Text fontSize="xs" color="gray.600">
          Zarezerwowane: {stock.quantity.reserved}
        </Text>
      )}
    </VStack>
  </HStack>
</StockIndicator>

const getStockColor = (available: number, minimum: number) => {
  if (available === 0) return 'red.500';
  if (available <= minimum) return 'orange.500';
  if (available <= minimum * 1.5) return 'yellow.500';
  return 'green.500';
};
```

## 🔍 Wyszukiwanie i Filtrowanie

### Zaawansowane Filtry
```typescript
interface MaterialFilters {
  search?: string;
  category?: string[];
  supplier?: string[];
  manufacturer?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  stockStatus?: 'inStock' | 'lowStock' | 'outOfStock' | 'reserved';
  specifications?: {
    thickness?: { min: number; max: number };
    color?: string[];
    material?: string[];
  };
}

<FilterPanel>
  <VStack align="stretch" spacing={4}>
    <SearchInput
      placeholder="Szukaj po nazwie, SKU, opisie..."
      value={filters.search}
      onChange={(value) => setFilters({ ...filters, search: value })}
    />
    
    <CategoryFilter
      categories={categories}
      selected={filters.category}
      onChange={(selected) => setFilters({ ...filters, category: selected })}
    />
    
    <SupplierFilter
      suppliers={suppliers}
      selected={filters.supplier}
      onChange={(selected) => setFilters({ ...filters, supplier: selected })}
    />
    
    <PriceRangeFilter
      range={filters.priceRange}
      onChange={(range) => setFilters({ ...filters, priceRange: range })}
    />
    
    <StockStatusFilter
      status={filters.stockStatus}
      onChange={(status) => setFilters({ ...filters, stockStatus: status })}
    />
    
    <SpecificationFilter
      specifications={filters.specifications}
      onChange={(specs) => setFilters({ ...filters, specifications: specs })}
    />
  </VStack>
</FilterPanel>
```

### Szybkie Filtry
```typescript
<QuickFilters>
  <HStack spacing={2} wrap="wrap">
    <FilterChip
      label="Niski stan"
      icon={<FiAlertTriangle />}
      isActive={filters.stockStatus === 'lowStock'}
      onClick={() => setFilters({ ...filters, stockStatus: 'lowStock' })}
    />
    <FilterChip
      label="Brak w magazynie"
      icon={<FiX />}
      isActive={filters.stockStatus === 'outOfStock'}
      onClick={() => setFilters({ ...filters, stockStatus: 'outOfStock' })}
    />
    <FilterChip
      label="Zarezerwowane"
      icon={<FiLock />}
      isActive={filters.stockStatus === 'reserved'}
      onClick={() => setFilters({ ...filters, stockStatus: 'reserved' })}
    />
  </HStack>
</QuickFilters>
```

## 📊 Zarządzanie Stanami Magazynowymi

### Dokumenty Magazynowe

#### 1. **PZ (Przyjęcie Zewnętrzne)**
```typescript
interface ReceiptDocument {
  id: string;
  type: 'PZ';
  number: string;                  // Numer dokumentu
  date: string;                    // Data przyjęcia
  supplier: string;                // Dostawca
  items: ReceiptItem[];
  status: 'draft' | 'confirmed' | 'completed';
  createdBy: string;
  confirmedBy?: string;
  notes?: string;
}

interface ReceiptItem {
  materialId: string;
  material: MaterialMaster;
  quantity: number;
  unitPrice: number;
  batchNumber?: string;
  expiryDate?: string;
  location: StockLocation;
}
```

#### 2. **WZ (Wydanie Zewnętrzne)**
```typescript
interface IssueDocument {
  id: string;
  type: 'WZ';
  number: string;
  date: string;
  projectId?: string;              // Projekt (jeśli wydanie na projekt)
  client?: string;                 // Klient (jeśli sprzedaż)
  items: IssueItem[];
  status: 'draft' | 'confirmed' | 'completed';
  createdBy: string;
  confirmedBy?: string;
  notes?: string;
}

interface IssueItem {
  materialId: string;
  material: MaterialMaster;
  quantity: number;
  batchNumber?: string;
  fromLocation: StockLocation;
}
```

#### 3. **RW (Rozchód Wewnętrzny)**
```typescript
interface InternalConsumptionDocument {
  id: string;
  type: 'RW';
  number: string;
  date: string;
  projectId: string;               // Projekt
  elementId?: string;              // Element (jeśli zużycie na element)
  items: ConsumptionItem[];
  status: 'draft' | 'confirmed' | 'completed';
  createdBy: string;
  confirmedBy?: string;
  notes?: string;
}

interface ConsumptionItem {
  materialId: string;
  material: MaterialMaster;
  quantity: number;
  batchNumber?: string;
  fromLocation: StockLocation;
}
```

### Rezerwacje Materiałowe
```typescript
interface MaterialReservation {
  id: string;
  materialId: string;
  material: MaterialMaster;
  projectId: string;
  elementId?: string;
  quantity: number;
  reservedBy: string;
  reservedAt: string;
  validUntil: string;
  status: 'active' | 'consumed' | 'cancelled';
  consumptionDocumentId?: string;  // Jeśli zostało zużyte
}
```

## 🏭 Zarządzanie Dostawcami

### Baza Dostawców
```typescript
interface Supplier {
  id: string;
  name: string;
  code: string;                    // Kod dostawcy
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentTerms: string;            // Warunki płatności
  deliveryTime: number;            // Czas dostawy (dni)
  minimumOrderValue: number;       // Minimalna wartość zamówienia
  materials: SupplierMaterial[];   // Materiały oferowane przez dostawcę
  rating: number;                  // Ocena dostawcy (1-5)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SupplierMaterial {
  materialId: string;
  material: MaterialMaster;
  supplierSku: string;             // SKU u dostawcy
  price: number;                   // Cena u dostawcy
  currency: string;
  minimumOrderQuantity: number;    // Minimalna ilość zamówienia
  deliveryTime: number;            // Czas dostawy (dni)
  lastUpdated: string;
}
```

### Strona Dostawców
```typescript
<SuppliersPage>
  <SuppliersHeader>
    <Heading>Dostawcy</Heading>
    <Button colorPalette="primary" onClick={openAddSupplierModal}>
      <FiPlus />
      Dodaj dostawcę
    </Button>
  </SuppliersHeader>
  
  <SuppliersList>
    {suppliers.map(supplier => (
      <SupplierCard
        key={supplier.id}
        supplier={supplier}
        onEdit={() => editSupplier(supplier.id)}
        onView={() => viewSupplier(supplier.id)}
      />
    ))}
  </SuppliersList>
</SuppliersPage>
```

## 🤖 Automatyzacja Zapotrzebowań

### System Alertów
```typescript
interface StockAlert {
  id: string;
  materialId: string;
  material: MaterialMaster;
  type: 'lowStock' | 'outOfStock' | 'reorderPoint';
  currentStock: number;
  threshold: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

const checkStockLevels = async () => {
  const materials = await getMaterialsWithStock();
  
  for (const material of materials) {
    const stock = material.stock;
    
    if (stock.quantity.available === 0) {
      await createAlert({
        materialId: material.id,
        type: 'outOfStock',
        currentStock: 0,
        threshold: stock.thresholds.minimum,
        priority: 'critical'
      });
    } else if (stock.quantity.available <= stock.thresholds.minimum) {
      await createAlert({
        materialId: material.id,
        type: 'lowStock',
        currentStock: stock.quantity.available,
        threshold: stock.thresholds.minimum,
        priority: 'high'
      });
    } else if (stock.quantity.available <= stock.thresholds.reorderPoint) {
      await createAlert({
        materialId: material.id,
        type: 'reorderPoint',
        currentStock: stock.quantity.available,
        threshold: stock.thresholds.reorderPoint,
        priority: 'medium'
      });
    }
  }
};
```

### Automatyczne Zapotrzebowania
```typescript
interface PurchaseRequest {
  id: string;
  materialId: string;
  material: MaterialMaster;
  requestedQuantity: number;
  reason: 'lowStock' | 'projectNeed' | 'manual';
  projectId?: string;
  elementId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  approvedBy?: string;
  approvedAt?: string;
  orderId?: string;
  receivedAt?: string;
  notes?: string;
}

const generatePurchaseRequest = async (alert: StockAlert) => {
  const material = await getMaterial(alert.materialId);
  const suggestedQuantity = calculateReorderQuantity(material);
  
  const request = await createPurchaseRequest({
    materialId: alert.materialId,
    requestedQuantity: suggestedQuantity,
    reason: 'lowStock',
    priority: alert.priority,
    requestedBy: 'system',
    notes: `Automatyczne zapotrzebowanie - ${alert.type}`
  });
  
  await notifyPurchasingTeam(request);
};
```

## 🔗 Integracje z Innymi Modułami

### Integracja z Elementami Projektowymi
```typescript
// W 3D Viewer podczas przypisywania materiału
const MaterialSelector = ({ onMaterialSelect }: MaterialSelectorProps) => {
  const { data: materials } = useQuery({
    queryKey: ['materials', 'search'],
    queryFn: () => searchMaterials({ available: true })
  });

  return (
    <Select.Root onValueChange={onMaterialSelect}>
      <Select.Trigger>
        <Select.Value placeholder="Wybierz materiał..." />
      </Select.Trigger>
      <Select.Content>
        {materials?.map(material => (
          <Select.Item key={material.id} value={material.id}>
            <HStack>
              <MaterialImage src={material.images[0]} size="xs" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm">{material.name}</Text>
                <Text fontSize="xs" color="gray.600">
                  Dostępne: {material.stock.quantity.available}
                </Text>
              </VStack>
            </HStack>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};
```

### Integracja z Wyceną
```typescript
// Automatyczne pobieranie cen z magazynu
const useMaterialPricing = (materialIds: string[]) => {
  return useQuery({
    queryKey: ['materials', 'pricing', materialIds],
    queryFn: () => getMaterialsPricing(materialIds),
    staleTime: 5 * 60 * 1000 // 5 minut
  });
};

const QuotationItem = ({ materialId, quantity }: QuotationItemProps) => {
  const { data: pricing } = useMaterialPricing([materialId]);
  
  if (!pricing) return <Skeleton />;
  
  const material = pricing[materialId];
  const totalPrice = material.price * quantity;
  
  return (
    <HStack justify="space-between">
      <Text>{material.name}</Text>
      <Text>{totalPrice.toFixed(2)} {material.currency}</Text>
    </HStack>
  );
};
```

### Integracja z Logistyką
```typescript
// Planowanie wydań materiałów
const LogisticsPlanner = ({ projectId }: LogisticsPlannerProps) => {
  const { data: projectMaterials } = useQuery({
    queryKey: ['project', 'materials', projectId],
    queryFn: () => getProjectMaterials(projectId)
  });

  return (
    <VStack align="stretch" spacing={4}>
      {projectMaterials?.map(material => (
        <MaterialLogisticsCard
          key={material.id}
          material={material}
          onScheduleIssue={(date) => scheduleMaterialIssue(material.id, date)}
        />
      ))}
    </VStack>
  );
};
```

## 📱 Responsywność

### Mobile Layout
```typescript
<WarehouseLayout>
  <Box display={{ base: 'block', lg: 'none' }}>
    <MobileWarehouseHeader />
    <MobileFilters />
    <MobileMaterialList />
  </Box>
  
  <Box display={{ base: 'none', lg: 'flex' }}>
    <DesktopWarehouseLayout />
  </Box>
</WarehouseLayout>
```

### Mobile Material Card
```typescript
<MobileMaterialCard>
  <HStack spacing={3}>
    <MaterialImage src={material.images[0]} size="sm" />
    <VStack align="start" flex={1} spacing={1}>
      <Text fontWeight="semibold" fontSize="sm">
        {material.name}
      </Text>
      <Text fontSize="xs" color="gray.600">
        {material.sku}
      </Text>
      <StockIndicator stock={material.stock} />
    </VStack>
    <VStack align="end" spacing={1}>
      <Text fontSize="sm" fontWeight="medium">
        {material.pricing.defaultPrice} {material.pricing.currency}
      </Text>
      <Button size="xs" variant="outline">
        <FiEye />
      </Button>
    </VStack>
  </HStack>
</MobileMaterialCard>
```

## 🧪 Testowanie

### Testy Komponentów
```typescript
// __tests__/components/MaterialCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MaterialCard } from '@/components/MaterialCard';

describe('MaterialCard', () => {
  const mockMaterial = {
    id: 'mat-123',
    name: 'Płyta MDF 18mm',
    sku: 'MDF-18-001',
    pricing: { defaultPrice: 45.50, currency: 'PLN' },
    category: { name: 'Płyty meblowe' },
    images: ['image1.jpg']
  };

  const mockStock = {
    quantity: { available: 10, reserved: 2 },
    thresholds: { minimum: 5 }
  };

  it('renders material information correctly', () => {
    render(
      <MaterialCard 
        material={mockMaterial} 
        stock={mockStock}
        onClick={jest.fn()}
      />
    );
    
    expect(screen.getByText('Płyta MDF 18mm')).toBeInTheDocument();
    expect(screen.getByText('MDF-18-001')).toBeInTheDocument();
    expect(screen.getByText('45.50 PLN')).toBeInTheDocument();
  });

  it('shows correct stock indicator color', () => {
    render(
      <MaterialCard 
        material={mockMaterial} 
        stock={mockStock}
        onClick={jest.fn()}
      />
    );
    
    const stockIndicator = screen.getByText('Dostępne: 10 szt');
    expect(stockIndicator).toBeInTheDocument();
  });
});
```

### Testy API
```typescript
// __tests__/api/materials.test.ts
import { getMaterials, createMaterial, updateStock } from '@/lib/api/materials';

describe('Materials API', () => {
  it('should fetch materials with filters', async () => {
    const filters = { 
      category: ['plyty-meblowe'], 
      search: 'MDF',
      stockStatus: 'inStock'
    };
    
    const materials = await getMaterials(filters);
    
    expect(Array.isArray(materials)).toBe(true);
    expect(materials.every(m => m.category.name === 'Płyty meblowe')).toBe(true);
  });

  it('should create new material', async () => {
    const materialData = {
      name: 'Test Material',
      sku: 'TEST-001',
      category: 'test-category',
      pricing: { defaultPrice: 100, currency: 'PLN' }
    };

    const material = await createMaterial(materialData);
    
    expect(material.id).toBeDefined();
    expect(material.name).toBe('Test Material');
  });

  it('should update stock levels', async () => {
    const stockUpdate = {
      materialId: 'mat-123',
      quantity: { available: 15, reserved: 0 },
      location: { warehouse: 'main', zone: 'A', rack: 'A1', shelf: '3' }
    };

    const result = await updateStock(stockUpdate);
    
    expect(result.success).toBe(true);
    expect(result.stock.quantity.available).toBe(15);
  });
});
```

## 🚀 Performance

### Optymalizacje
```typescript
// Virtual scrolling dla dużych list materiałów
import { FixedSizeList as List } from 'react-window';

const MaterialList = ({ materials }: MaterialListProps) => (
  <List
    height={600}
    itemCount={materials.length}
    itemSize={120}
    itemData={materials}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <MaterialCard material={data[index]} />
      </div>
    )}
  </List>
);

// Lazy loading obrazów
const MaterialImage = ({ src, alt, ...props }: MaterialImageProps) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <Box position="relative" {...props}>
      {!loaded && <Skeleton />}
      <Image
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </Box>
  );
};

// Debounced search
const useDebouncedSearch = (searchTerm: string, delay: number = 300) => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return debouncedTerm;
};
```

### Caching Strategy
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

// Prefetching materiałów
const prefetchMaterials = (categoryId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['materials', 'category', categoryId],
    queryFn: () => getMaterialsByCategory(categoryId)
  });
};

// Background updates
const useMaterialsWithBackgroundUpdate = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: getMaterials,
    refetchInterval: 30 * 1000, // 30 sekund
    refetchIntervalInBackground: true
  });
};
```

## 📊 Dashboard i Statystyki

### Dashboard Magazynu
```typescript
interface WarehouseMetrics {
  totalMaterials: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  pendingOrders: number;
  recentMovements: MaterialMovement[];
  topCategories: CategoryStats[];
  supplierPerformance: SupplierStats[];
}

const WarehouseDashboard = () => {
  const { data: metrics } = useQuery({
    queryKey: ['warehouse', 'metrics'],
    queryFn: getWarehouseMetrics
  });

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      <MetricCard
        title="Łączna wartość"
        value={`${metrics?.totalValue.toLocaleString()} PLN`}
        icon={<FiDollarSign />}
        colorPalette="green"
      />
      <MetricCard
        title="Materiały w magazynie"
        value={metrics?.totalMaterials}
        icon={<FiPackage />}
        colorPalette="blue"
      />
      <MetricCard
        title="Niski stan"
        value={metrics?.lowStockItems}
        icon={<FiAlertTriangle />}
        colorPalette="orange"
      />
      <MetricCard
        title="Brak w magazynie"
        value={metrics?.outOfStockItems}
        icon={<FiX />}
        colorPalette="red"
      />
    </SimpleGrid>
  );
};
```

---

**NextFab Warehouse Page (UMMS)** - Uniwersalny System Zarządzania Materiałami

*Ostatnia aktualizacja: Styczeń 2024*
