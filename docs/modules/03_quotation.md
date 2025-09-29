# Moduł: Wycena (Quotation)

## 1. Cel Modułu

Celem modułu "Wycena" jest stworzenie centralnego, zintegrowanego narzędzia do tworzenia, wersjonowania i eksportowania profesjonalnych ofert handlowych. Moduł ma na celu wyeliminowanie ręcznego tworzenia kosztorysów w zewnętrznych narzędziach i zminimalizowanie ryzyka błędów poprzez automatyzację pobierania danych z innych części systemu.

## 2. Kluczowe Funkcjonalności

### 2.1. Edytor Wyceny
Głównym interfejsem modułu jest interaktywna tabela w stylu arkusza kalkulacyjnego, która pozwala na:
- **Dodawanie i Edycja Pozycji:** Użytkownik może ręcznie dodawać dowolne pozycje do kosztorysu, edytować ich nazwy, ilości, jednostki i ceny.
- **Grupowanie:** Możliwość tworzenia kategorii i grupowania w nich pozycji kosztowych (np. "Materiały", "Robocizna", "Transport").
- **Wersjonowanie:** Każda wycena może mieć wiele wersji, co pozwala na śledzenie zmian i negocjacji z klientem.

### 2.2. Inteligentny Import Kosztów (Pół-automatyzacja)
Jest to kluczowa funkcja modułu, która znacząco przyspiesza pracę i zwiększa precyzję.

- **Przycisk `[Importuj koszty z projektu]`:** W edytorze wyceny znajduje się przycisk, który uruchamia proces analizy projektu.
- **Panel Sugestii:** Po kliknięciu, system skanuje aktywne moduły projektu i prezentuje użytkownikowi panel z "sugerowanymi" pozycjami do dodania, np.:
    - **Sugerowane Materiały:** Suma kosztów wszystkich materiałów z list BOM "Elementów".
    - **Sugerowana Robocizna:** Suma kosztów pracy osób przypisanych w module `Załoga`.
    - **Sugerowany Transport:** Koszt transportu obliczony na podstawie danych z modułu `Logistyka`.
- **Wybór Użytkownika:** Użytkownik za pomocą checkboxów decyduje, które z tych automatycznie obliczonych sugestii chce zaimportować do finalnego kosztorysu.

### 2.3. Generowanie Oferty PDF
Po zakończeniu pracy nad kosztorysem, użytkownik może wygenerować profesjonalny dokument PDF.
- **Szablony:** Możliwość wyboru szablonu wizualnego oferty.
- **Automatyczne Dane:** Dokument jest automatycznie uzupełniany o dane klienta, numer projektu oraz wszystkie pozycje z edytora wyceny.

## 3. Integracje z Innymi Modułami

Moduł `Wycena` jest potężnym narzędziem dzięki ścisłej integracji z innymi częściami systemu:
- **Elementy (`02_elements.md`):** Stanowi główne źródło danych o kosztach materiałowych.
- **Załoga:** Dostarcza danych o kosztach robocizny.
- **Logistyka:** Dostarcza danych o kosztach transportu.
- **Klienci (`21_FEATURE_CLIENTS.md`):** Pobiera dane do finalnego dokumentu PDF.
