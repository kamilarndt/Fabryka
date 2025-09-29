# Moduł: Model 3D (Integracja Speckle)

## 1. Cel Modułu

Celem modułu "Model 3D" jest stworzenie głębokiej, interaktywnej integracji pomiędzy modelami CAD a systemem zarządzania produkcją NextFab. Moduł ma umożliwić nie tylko wizualizację modeli 3D, ale również precyzyjne powiązanie **konkretnych fragmentów geometrii** z produkcyjnymi "Elementami", co stanowi kluczowy element cyfrowego przepływu pracy.

## 2. Kluczowe Funkcjonalności

### 2.1. Zaawansowany Viewer 3D (Speckle)
Sercem modułu jest wbudowany, w pełni interaktywny viewer 3D, oparty na technologii Speckle.

- **Nawigacja:** Umożliwia standardowe operacje na modelu: obracanie, przesuwanie, powiększanie.
- **Wybór Danych:** Interfejs pozwala na wybór projektu (stream) i wersji (commit) ze Speckle Server do wyświetlenia w viewerze.

### 2.2. Interaktywne Powiązanie Geometrii z "Elementem"
Jest to kluczowa funkcja modułu, która wykracza poza prosty podgląd.

- **Tryb Selekcji:** Użytkownik (projektant) może włączyć w viewerze "tryb selekcji".
- **Zaznaczanie Obiektów:** W tym trybie, projektant może klikać i zaznaczać pojedyncze lub mnogie obiekty/geometrie bezpośrednio w modelu 3D.
- **Zapisywanie Powiązania:** Po dokonaniu selekcji, użytkownik klika przycisk `[Powiąż z Elementem]`. System zapisuje referencje do tych konkretnych, zaznaczonych obiektów Speckle w danych "Elementu", z którym pracuje.

## 3. Przepływ Pracy (Workflow)

1.  W widoku szczegółów "Elementu" (`02_elements.md`), projektant klika przycisk `[Zarządzaj modelem 3D]`.
2.  Otwiera się modal z interfejsem modułu `Model 3D`.
3.  Projektant wybiera z listy odpowiedni projekt (stream) i wersję (commit) ze Speckle.
4.  Model 3D ładuje się w viewerze.
5.  Projektant aktywuje tryb selekcji i zaznacza w modelu te części, które odpowiadają edytowanemu "Elementowi" (np. zaznacza wszystkie części składowe pulpitu kandydata w ogólnym modelu scenografii).
6.  Po kliknięciu `[Zapisz powiązanie]`, referencje do tej selekcji są zapisywane. Od tego momentu, podgląd 3D dla tego "Elementu" będzie pokazywał tylko te wybrane obiekty.

## 4. Integracje

- **Elementy (`02_elements.md`):** Każdy "Element" w systemie może mieć powiązane ze sobą referencje do geometrii w Speckle.
- **Projektowanie (`26_FEATURE_PROJEKTOWANIE.md`):** Jest to jedno z głównych narzędzi pracy na stronie `/projektowanie`.
- **API Speckle:** Moduł intensywnie komunikuje się z GraphQL API serwera Speckle w celu pobierania listy projektów, wersji oraz danych o geometrii.
