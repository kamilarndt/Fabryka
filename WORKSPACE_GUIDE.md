# Przewodnik po Zautomatyzowanym Workspace

Ten dokument opisuje, jak efektywnie pracować w naszym nowym, zautomatyzowanym środowisku deweloperskim w Cursorze.

## 1. Fundament: `.cursorrules`

W głównym katalogu znajduje się plik `.cursorrules`. To "konstytucja" naszego projektu. Definiuje on stack technologiczny, metodologię pracy (TDD) i wskazuje na folder `/docs` jako jedyne źródło prawdy. Nie musisz nic z nim robić – on po prostu działa, dając kontekst każdemu Twojemu czatowi.

## 2. Nasze Własne Komendy

Stworzyliśmy bibliotekę własnych komend, aby zautomatyzować powtarzalne zadania. Znajdują się one w folderze `.github/prompts`.

### Jak z nich korzystać?

W oknie czatu Cursora, użyj komendy `@prompts` i wybierz odpowiedni szablon. Wypełnij zmienne (np. `{{componentName}}`), a Cursor wygeneruje kod zgodny z naszymi standardami.

**Przykłady:**
- **Tworzenie komponentu:** `@prompts/create-component`
- **Tworzenie testu TDD:** `@prompts/create-tdd-test`
- **Tworzenie endpointu API:** `@prompts/create-api-route`

## 3. Zautomatyzowany Workflow

Nasz proces pracy, wspierany przez AI, wygląda następująco:

1.  **Planowanie:** W czacie, opisz co chcesz zrobić, odwołując się do dokumentacji, np. `Chcę zaimplementować filtrowanie na liście projektów, zgodnie z @docs/20_FEATURE_PROJECTS.md`.
2.  **Test (TDD):** Zawsze zaczynaj od testu. Użyj naszego promptu `@prompts/create-tdd-test`, aby szybko wygenerować szkielet pliku testowego.
3.  **Kod:** Poproś Cursora o napisanie kodu, który sprawi, że testy przejdą.
4.  **Poprawki:** Używaj wbudowanych funkcji Cursora:
    - **"Fix Linter Errors"**: do automatycznego czyszczenia kodu.
    - **"Debug with AI"**: do analizy i naprawy błędów.
    - **"Generate Docs"**: do dokumentowania skomplikowanych funkcji.

Przestrzeganie tego workflow sprawi, że nasza praca będzie szybsza, wydajniejsza i obarczona mniejszą liczbą błędów.