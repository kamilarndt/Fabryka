# 00: Przegląd i Wizja Aplikacji NextFab

## 1. Wprowadzenie i Wizja Produktu

NextFab to kompleksowy system do zarządzania produkcją w Fabryce Dekoracji, lidera na polskim rynku scenografii. Aplikacja ma na celu cyfrową transformację całego procesu operacyjnego – od zapytania klienta, przez projektowanie i produkcję, aż po logistykę i montaż.

**Wizją produktu** jest stworzenie centralnego, zintegrowanego środowiska pracy, które eliminuje chaos informacyjny, zwiększa precyzję wycen i zapewnia pełną transparentność procesu produkcyjnego. NextFab ma stać się kręgosłupem operacyjnym firmy, umożliwiając jej dalszy, skalowalny rozwój.

## 2. Problem Biznesowy

Wraz ze wzrostem skali działalności, Fabryka Dekoracji napotyka na krytyczne problemy operacyjne, które hamują jej efektywność i rentowność:

* **Brak spójnego centrum zarządzania projektami:** Jest to główny problem, który prowadzi bezpośrednio do dwóch kolejnych:
    * **Chaos Informacyjny:** Kluczowe dane są rozproszone (e-maile, notatki), co generuje błędy i opóźnienia.
    * **Brak Przejrzystości Procesu:** Brak wglądu w postęp prac w czasie rzeczywistym utrudnia planowanie i reagowanie na problemy.
* **Niedokładne Wyceny:** Brak scentralizowanej bazy kosztów materiałów i historycznych danych o czasochłonności prowadzi do tworzenia nieprecyzyjnych wycen, co obniża marżowość projektów.

## 3. Proponowane Rozwiązanie

NextFab adresuje zidentyfikowane problemy poprzez wdrożenie trzech kluczowych koncepcji, które składają się na spójne centrum zarządzania projektami:

* **Centralizacja Informacji:** Aplikacja tworzy **jedno, cyfrowe źródło prawdy** dla każdego projektu. Wszystkie pliki, ustalenia i dane są gromadzone w jednym miejscu, co eliminuje chaos informacyjny.
* **Atomizacja Produkcji ("Elementy"):** Zamiast zarządzać projektem jako monolitem, NextFab dzieli go na **policzalne "Elementy" (kafelki)**. Każdy element ma swój własny cykl życia i listę materiałów (BOM), co daje pełną przejrzystość i kontrolę nad produkcją.
* **Zarządzanie Zasobami i Precyzja Wycen:** System wprowadza **Uniwersalny System Zarządzania Materiałami (UMMS)**, który rozwiązuje dwa krytyczne problemy:
    * **Porządkuje stany magazynowe:** Aplikacja staje się cyfrowym bliźniakiem hali, dając wgląd w czasie rzeczywistym w to, jakie materiały są dostępne, a jakich brakuje.
    * **Automatyzuje proces zamawiania:** Na podstawie zapotrzebowania z "Elementów", system automatycznie generuje listy zakupowe, co usprawnia i porządkuje proces zaopatrzenia.

Dzięki tym danym, wyceny stają się **szybkie i precyzyjne**, ponieważ opierają się na rzeczywistych kosztach i stanach magazynowych, a nie na szacunkach.

## 4. Kluczowe Koncepcje Aplikacji

Architektura aplikacji opiera się na trzech fundamentalnych koncepcjach, które organizują jej strukturę i logikę:

* **📄 Strony (Pages):** Główne obszary nawigacyjne aplikacji, odpowiadające za konkretne dziedziny działalności (np. `/projekty`, `/klienci`, `/magazyn`). Są to "miejsca", do których użytkownik może się udać, aby zarządzać danym obszarem.
* **🧩 Moduły (Modules):** Wymienne "klocki" funkcjonalne dostępne w widoku szczegółów projektu. Pozwalają na dynamiczne dostosowanie interfejsu do potrzeb konkretnego zlecenia poprzez włączanie i wyłączanie specyficznych narzędzi, takich jak `Wycena`, `Logistyka` czy `Załoga`.
* **📦 Elementy / Kafelki (Elements / Tiles):** Atomowe, policzalne komponenty, z których składa się fizyczna scenografia. Są sercem systemu produkcyjnego – każdy "Element" jest wzorem z własną listą materiałów (BOM) i dokumentacją, a jego fizyczne kopie, zwane "Egzemplarzami", są śledzone w całym cyklu produkcyjnym.

## 5. Główne Funkcjonalności (Strony)

Docelowa aplikacja będzie składać się z następujących, głównych stron, które razem tworzą zintegrowany system do zarządzania produkcją:

* **Dashboard (`/`)**: Strona główna z kluczowymi wskaźnikami (KPI) i ostatnią aktywnością.
* **Projekty (`/projects`)**: Centralne miejsce do zarządzania wszystkimi projektami.
* **Klienci (`/klienci`)**: Baza danych (CRM) wszystkich klientów firmy.
* **Magazyn (`/magazyn`)**: Uniwersalny System Zarządzania Materiałami (UMMS).
* **Podwykonawcy (`/subcontractors`)**: Baza podwykonawców i zarządzanie zleceniami zewnętrznymi.
* **Projektowanie (`/projektowanie`)**: Dedykowana strona dla działu projektowego.
* **CNC (`/cnc`)**: Zarządzanie kolejką zadań i pracą maszyn CNC.
* **Produkcja (`/produkcja`)**: Ogólne zarządzanie zleceniami produkcyjnymi.
* **Kalendarz (`/calendar`)**: Globalny harmonogram prac i terminów.

Początkowy etap rozwoju aplikacji skupi się na dostarczeniu trzech fundamentalnych stron: **Projektów, Klientów i Magazynu**.
