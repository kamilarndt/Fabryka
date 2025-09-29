# NextFab - Cursor Workspace Guide

## 🎯 Przegląd

Ten dokument zawiera kompletną instrukcję użytkowania zoptymalizowanego workspace Cursor IDE dla projektu NextFab. Workspace został skonfigurowany zgodnie z najlepszymi praktykami społeczności Cursor IDE, zapewniając maksymalną automatyzację i samodzielność AI.

## 🏗️ Struktura Workspace

```
nextfab/
├── .cursor/                    # Konfiguracja Cursor IDE
│   ├── index.mdc              # Główne zasady projektu
│   ├── rules/                 # Specjalizowane reguły
│   │   ├── frontend.mdc       # Zasady frontendu
│   │   ├── backend.mdc        # Zasady backendu
│   │   ├── testing.mdc        # Zasady testowania
│   │   ├── components.mdc     # Zasady komponentów
│   │   └── api.mdc            # Zasady API
│   └── agents.md              # Konfiguracja agentów
├── .cursorignore              # Pliki ignorowane przez Cursor
├── .cursorindexignore         # Pliki wykluczone z indeksowania
├── .cursorrules               # Konstytucja projektu
├── PRD.md                     # Product Requirements Document
├── scripts/                   # Skrypty automatyzacji
└── database/                  # Inicjalizacja bazy danych
```

## 🚀 Pierwsze Kroki

### 1. Konfiguracja Cursor IDE

**Ustawienia Globalne:**
- Model: Claude-4 Sonnet (lub najnowszy dostępny)
- Enable YOLO mode (dla doświadczonych użytkowników)
- Enable Auto Run mode dla testów
- Enable web search
- Enable codebase indexing

**Agent Configuration:**
- Max iterations: 20
- Enable autonomous execution
- Enable shell command execution
- Enable file system access

### 2. Weryfikacja Konfiguracji

Otwórz Chat w Cursor (Cmd+L) i wpisz:
```
@.cursor/index.mdc Sprawdź czy konfiguracja workspace jest poprawna
```

AI powinno potwierdzić, że wszystkie reguły są aktywne.

## 🛠️ Codzienne Użycie

### Tworzenie Nowych Funkcjonalności

**Krok 1: Użyj Agent Mode (Cmd+Shift+I)**
```
@PRD.md @.cursor/index.mdc Implementuj funkcję tworzenia nowego projektu 
zgodnie z design system i TDD approach. Dodaj testy jednostkowe i E2E.
```

**Krok 2: Pozwól AI na Autonomous Execution**
- AI automatycznie utworzy strukturę plików
- Napisze testy (TDD approach)
- Zaimplementuje funkcjonalność
- Doda dokumentację

**Krok 3: Przejrzyj i Zatwierdź**
- Sprawdź wygenerowany kod
- Uruchom testy: `npm run test`
- Zatwierdź zmiany

### Debugging

**Krok 1: Użyj AI Chat (Cmd+L)**
```
@terminal @file:problematic-file.ts Napraw błąd który widzę w terminalu
```

**Krok 2: AI Automatycznie:**
- Przeanalizuje błąd
- Zidentyfikuje przyczynę
- Zaproponuje rozwiązanie
- Zaimplementuje poprawkę

### Code Review

**Inline Review (Cmd+K):**
1. Zaznacz blok kodu
2. Naciśnij Cmd+K
3. Wpisz: "Przejrzyj ten kod pod kątem bezpieczeństwa, wydajności i best practices"
4. Zastosuj sugerowane poprawki

### Testowanie

**Automatyczne Testy:**
- Cursor automatycznie uruchomi testy po każdej zmianie
- Testy są uruchamiane w tle dzięki Auto Run mode

**Pisanie Testów z AI:**
```
@.cursor/rules/testing.mdc napisz testy jednostkowe dla tej funkcji używając Vitest
```

**E2E Testing:**
```
@.cursor/rules/testing.mdc napisz test E2E dla workflow tworzenia projektu używając Playwright
```

## 🎯 Specjalizowane Agenty

### Development Agent
```
@agents/development Implement new project creation feature with TDD approach
```

### Testing Agent
```
@agents/testing Create comprehensive test suite for projects module
```

### Documentation Agent
```
@agents/documentation Generate API docs for projects endpoints
```

### Security Agent
```
@agents/security Review authentication implementation for security issues
```

### Performance Agent
```
@agents/performance Optimize database queries in projects module
```

## 📋 Workflow Patterns

### Feature Development Workflow
1. **Development Agent**: Implement feature with TDD
2. **Testing Agent**: Create comprehensive test suite
3. **Security Agent**: Review for security issues
4. **Performance Agent**: Optimize performance
5. **Documentation Agent**: Generate documentation

### Bug Fix Workflow
1. **Development Agent**: Analyze and fix bug
2. **Testing Agent**: Add regression tests
3. **Security Agent**: Verify fix doesn't introduce vulnerabilities
4. **Documentation Agent**: Update relevant documentation

### Code Review Workflow
1. **Security Agent**: Security review
2. **Performance Agent**: Performance review
3. **Testing Agent**: Test coverage review
4. **Documentation Agent**: Documentation review

## 🔧 Automatyzacja

### Pre-commit Hooks
- Automatyczne uruchamianie ESLint
- Automatyczne formatowanie z Prettier
- Uruchamianie testów jednostkowych
- Walidacja Conventional Commits

### Continuous Feedback
- Real-time suggestions podczas pisania
- Auto-fix dla błędów ESLint i TypeScript
- Automatyczne generowanie dokumentacji
- Performance monitoring

## 📚 Best Practices

### Prompty dla AI

**✅ DOBRE:**
```
@PRD.md @components/ui/ Stwórz komponent Button zgodny z design system 
Chakra UI v3, dodaj proper TypeScript types, accessibility i testy
```

**❌ ZŁE:**
```
Zrób przycisk
```

### Wykorzystanie Context

- `@File` - dla konkretnych plików
- `@Code` - dla fragmentów kodu  
- `@Web` - dla dokumentacji zewnętrznej
- `@Terminal` - dla błędów i logów

### Model Selection

- **Claude-4 Sonnet**: dla złożonej logiki biznesowej
- **GPT-4.1**: dla refactoringu i dokumentacji  
- **Auto**: pozwól Cursor wybrać optymalny model

## 🚨 Rozwiązywanie Problemów

### Częste Problemy

**Problem**: AI generuje kod niezgodny z zasadami
**Rozwiązanie**: Sprawdź czy `.cursor/rules/` są poprawnie skonfigurowane

**Problem**: Słaba wydajność Cursor
**Rozwiązanie**: Sprawdź `.cursorignore` i codebase indexing

**Problem**: AI nie rozumie kontekstu projektu  
**Rozwiązanie**: Dodaj więcej szczegółów do PRD.md i index.mdc

### Debug Mode

1. Enable debug mode in Cursor settings
2. Sprawdź logi w Developer Tools
3. Verify rules activation w chat

## 📈 Metryki Sukcesu

### Jakość Kodu
- 100% przechodzących testów
- 0 błędów ESLint
- 80%+ code coverage
- Wszystkie security checks passed

### Produktywność
- 60% redukcja czasu development
- Automatyczne generowanie testów
- Real-time error detection
- Automated documentation

### Zespół
- Konsystentny kod style
- Reduced code review time
- Faster onboarding
- Better knowledge sharing

## 🔄 Aktualizacje

### Regularne Aktualizacje
- Sprawdzaj nowe wersje Cursor IDE
- Aktualizuj reguły na podstawie doświadczeń
- Optymalizuj prompty dla lepszych rezultatów
- Rozszerzaj bibliotekę agentów

### Feedback Loop
- Zbieraj feedback od zespołu
- Mierz metryki produktywności
- Dostosowuj workflow do potrzeb
- Dokumentuj najlepsze praktyki

## 📞 Wsparcie

### Dokumentacja
- `docs/` - Kompletna dokumentacja projektu
- `PRD.md` - Product Requirements Document
- `.cursor/rules/` - Reguły development

### Zespół
- Regularne spotkania zespołu
- Code review sessions
- Knowledge sharing sessions
- Training sessions

---

**Ten workspace configuration czyni Cursor IDE maksymalnie samodzielnym i wydajnym dla rozwoju NextFab. AI będzie automatycznie sprawdzać kod, uruchamiać testy, debugować problemy i generować dokumentację, pozwalając zespołowi skupić się na logice biznesowej i architekturze.**
