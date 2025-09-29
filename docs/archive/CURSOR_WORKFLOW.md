# NextFab - Cursor Workflow & Best Practices

## 📋 Przegląd

Ten dokument opisuje najlepsze praktyki pracy z Cursor w projekcie NextFab, aby maksymalizować wydajność i efektywność rozwoju.

## 🎯 **CURSOR RULES - Fundament Wydajnej Pracy**

### Konfiguracja .cursorrules
Cursor Rules to fundament wydajnej pracy - ustaw reguły projektowe które będą automatycznie stosowane we wszystkich chatach.

```typescript
// .cursorrules - Główne zasady projektu
# NextFab - Global Cursor Rules
# Zasady obowiązujące dla wszystkich chat-ów w projekcie

## 🎯 Podział Odpowiedzialności Chat-ów
### 📋 STRONA MAGAZYNU (UMMS)
**Chat odpowiedzialny:** Magazyn i Materiały
**Pliki:** `nextfab/src/app/magazyn/`, `nextfab/src/components/warehouse/`, etc.

## 🚫 ZASADY OGRANICZAJĄCE
### ❌ CO NIE ROBIĘ:
- NIE ZMIENIAM plików należących do innych chat-ów/stron
- NIE MODYFIKUJĘ głównych layout-ów aplikacji
- NIE DOTYKAM plików konfiguracyjnych Next.js

### ✅ CO ROBIĘ:
- Tworzę i modyfikuję TYLKO pliki z mojej odpowiedzialności
- Implementuję komponenty dla mojej strony
- Tworzę API endpoints dla mojego modułu
```

### Przykłady reguł projektowych
```typescript
// Preferencje TypeScript
- Zawsze używaj strict mode
- Preferuj interfaces nad types dla obiektów
- Używaj readonly dla immutable danych
- Zawsze definiuj return types dla funkcji

// Struktura kodu
- Komponenty w PascalCase
- Hooks w camelCase z prefiksem 'use'
- Pliki w kebab-case
- Foldery w lowercase

// Importy
- Używaj absolute imports (@/components)
- Grupuj importy: React, libraries, local
- Sortuj importy alfabetycznie
```

## 🔄 **ZARZĄDZANIE KONTEKSTEM**

### Świadomość "Runway"
Zarządzanie kontekstem w dłuższych sesjach wymaga świadomości "runway" - momentu gdy kontekst staje się zbyt duży i AI traci skuteczność.

#### Wskaźniki końca runway:
- AI zaczyna powtarzać się
- Odpowiedzi stają się mniej precyzyjne
- Zapomina o wcześniejszych decyzjach
- Prosi o ponowne wyjaśnienie kontekstu

#### Strategie zarządzania kontekstem:

##### 1. **Rozdzielanie rozmów**
```markdown
# Główny chat: "NextFab Development"
- Ogólne decyzje architektoniczne
- Planowanie funkcjonalności
- Code review i refactoring

# Chat poboczny: "Bug Fixes"
- Rozwiązywanie konkretnych błędów
- Debugowanie problemów
- Optymalizacja wydajności
```

##### 2. **Duplicate Chat dla pobocznych zagadnień**
- Używaj "Duplicate Chat" dla eksperymentów
- Testuj różne podejścia w osobnych chatach
- Porównuj rozwiązania między chatami

##### 3. **Podsumowania kontekstu**
```markdown
## Podsumowanie sesji:
- Zaimplementowano: [lista funkcjonalności]
- Rozwiązano: [lista problemów]
- Następne kroki: [lista zadań]
- Ważne decyzje: [lista decyzji architektonicznych]
```

## 🛡️ **BEZPIECZEŃSTWO I KONTROLA**

### Terminal Command Execution
Terminal Command Execution może być ograniczony regułami bezpieczeństwa - warto ustawić wymóg zatwierdzania komend przed wykonaniem.

#### Konfiguracja bezpieczeństwa:
```json
// .cursor/settings.json
{
  "terminal.requireApproval": true,
  "terminal.allowedCommands": [
    "npm run dev",
    "npm run build",
    "npm run test",
    "git add",
    "git commit",
    "git push"
  ],
  "terminal.blockedCommands": [
    "rm -rf",
    "sudo",
    "chmod 777",
    "format",
    "del /f"
  ]
}
```

#### Lista dozwolonych komend:
```bash
# Development
npm run dev
npm run build
npm run test
npm run lint
npm install
npm update

# Git
git add
git commit
git push
git pull
git status
git log

# File operations
mkdir
touch
cat
ls
cd
echo

# Build tools
tsc
vitest
jest
```

#### Lista zablokowanych komend:
```bash
# Niebezpieczne operacje
rm -rf
sudo
chmod 777
format
del /f
rmdir /s
mv
```

## ⚡ **ALIASY I SKRÓTY KLAWISZOWE**

### Konfiguracja aliasów Cursor
```json
// .cursor/keybindings.json
[
  {
    "key": "ctrl+shift+d",
    "command": "workbench.action.terminal.new",
    "when": "terminalFocus"
  },
  {
    "key": "ctrl+shift+r",
    "command": "workbench.action.reloadWindow"
  },
  {
    "key": "ctrl+shift+b",
    "command": "workbench.action.tasks.build"
  },
  {
    "key": "ctrl+shift+t",
    "command": "workbench.action.tasks.test"
  }
]
```

### Skróty dla często używanych akcji:
- **Ctrl+Shift+D** - Nowy terminal
- **Ctrl+Shift+R** - Restart Cursor
- **Ctrl+Shift+B** - Build projektu
- **Ctrl+Shift+T** - Uruchom testy
- **Ctrl+Shift+L** - Lint kod
- **Ctrl+Shift+F** - Format kod

## 🔧 **AUTOMATYZACJA WORKFLOW**

### Skrypty automatyzacji
```bash
#!/bin/bash
# cursor-workflow.sh

# Automatyczne uruchamianie serwisów
start_dev() {
    echo "🚀 Uruchamianie NextFab Development..."
    
    # Sprawdź czy porty są wolne
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port 3000 zajęty. Zatrzymuję proces..."
        kill -9 $(lsof -ti:3000)
    fi
    
    if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port 5000 zajęty. Zatrzymuję proces..."
        kill -9 $(lsof -ti:5000)
    fi
    
    # Uruchom backend
    echo "🔧 Uruchamianie backendu..."
    cd backend && npm run server &
    
    # Poczekaj na backend
    sleep 3
    
    # Uruchom frontend
    echo "🎨 Uruchamianie frontendu..."
    cd ../nextfab && npm run dev &
    
    echo "✅ NextFab uruchomiony!"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:5000"
}

# Automatyczne testy
run_tests() {
    echo "🧪 Uruchamianie testów..."
    cd nextfab && npm run test
    cd ../backend && npm run test
}

# Automatyczny build
build_project() {
    echo "🏗️ Budowanie projektu..."
    cd nextfab && npm run build
    cd ../backend && npm run build
}

# Automatyczny lint
lint_code() {
    echo "🔍 Lintowanie kodu..."
    cd nextfab && npm run lint
    cd ../backend && npm run lint
}

# Menu główne
case "$1" in
    "start")
        start_dev
        ;;
    "test")
        run_tests
        ;;
    "build")
        build_project
        ;;
    "lint")
        lint_code
        ;;
    *)
        echo "Użycie: $0 {start|test|build|lint}"
        exit 1
        ;;
esac
```

## 📊 **MONITOROWANIE WYDAJNOŚCI**

### Metryki wydajności Cursor
```typescript
// .cursor/metrics.json
{
  "session": {
    "startTime": "2025-01-15T10:00:00Z",
    "endTime": "2025-01-15T18:00:00Z",
    "duration": "8h",
    "commandsExecuted": 45,
    "filesModified": 23,
    "testsRun": 12,
    "buildsCompleted": 3
  },
  "performance": {
    "averageResponseTime": "2.3s",
    "contextSwitches": 8,
    "memoryUsage": "1.2GB",
    "cpuUsage": "15%"
  }
}
```

### Optymalizacja wydajności:
- **Zamykaj niepotrzebne terminale**
- **Czyszcz cache regularnie**
- **Używaj lazy loading dla komponentów**
- **Optymalizuj importy**
- **Używaj memoization**

## 🎯 **STRATEGIE ROZWOJU**

### 1. **Iteracyjne podejście**
```markdown
## Cykl rozwoju:
1. Planowanie (5 min)
2. Implementacja (25 min)
3. Testowanie (5 min)
4. Refaktoring (5 min)
5. Dokumentacja (5 min)
```

### 2. **Test-Driven Development**
```typescript
// 1. Napisz test
describe('MaterialCard', () => {
  it('should render material information', () => {
    // Test implementation
  });
});

// 2. Zaimplementuj funkcjonalność
export function MaterialCard({ material }: MaterialCardProps) {
  // Implementation
}

// 3. Refaktoryzuj
// 4. Dokumentuj
```

### 3. **Code Review Process**
```markdown
## Checklista Code Review:
- [ ] Kod jest czytelny i zrozumiały
- [ ] Testy przechodzą
- [ ] Lint nie ma błędów
- [ ] Dokumentacja jest aktualna
- [ ] Performance jest akceptowalna
- [ ] Security nie ma luk
```

## 🔄 **BACKUP I WERSJONOWANIE**

### Automatyczne commity
```bash
#!/bin/bash
# auto-commit.sh

# Sprawdź status git
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Znaleziono zmiany. Tworzę commit..."
    
    # Dodaj wszystkie zmiany
    git add .
    
    # Commit z timestampem
    git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Push do remote
    git push origin main
    
    echo "✅ Zmiany zapisane!"
else
    echo "ℹ️ Brak zmian do commitowania"
fi
```

### Backup konfiguracji
```bash
#!/bin/bash
# backup-config.sh

# Backup .cursorrules
cp .cursorrules backup/.cursorrules.$(date +%Y%m%d)

# Backup konfiguracji
cp -r .cursor backup/cursor-config.$(date +%Y%m%d)

# Backup package.json
cp nextfab/package.json backup/package-nextfab.$(date +%Y%m%d).json
cp backend/package.json backup/package-backend.$(date +%Y%m%d).json

echo "✅ Konfiguracja zbackupowana!"
```

## 🚀 **NAJLEPSZE PRAKTYKI**

### 1. **Systematyczne podejście**
- Zamykaj niepotrzebne terminale
- Zarządzaj kontekstem chatów świadomie
- Używaj aliasów i skrótów klawiszowych
- Regularnie czyść cache i temp files

### 2. **Bezpieczeństwo**
- Zawsze zatwierdzaj komendy przed wykonaniem
- Używaj zmiennych środowiskowych
- Regularnie aktualizuj zależności
- Backupuj ważne konfiguracje

### 3. **Wydajność**
- Monitoruj użycie zasobów
- Optymalizuj importy i bundle size
- Używaj lazy loading
- Cache'uj często używane dane

### 4. **Dokumentacja**
- Dokumentuj ważne decyzje
- Aktualizuj README regularnie
- Używaj JSDoc dla funkcji
- Twórz diagramy architektury

## 📋 **CHECKLISTA PRZED ROZPOCZĘCIEM PRACY**

- [ ] Sprawdź czy wszystkie terminale są zamknięte
- [ ] Wyczyść cache i temp files
- [ ] Sprawdź status git
- [ ] Uruchom testy
- [ ] Sprawdź lint
- [ ] Backupuj ważne zmiany
- [ ] Sprawdź dostępność serwisów

## 🎯 **CHECKLISTA PO ZAKOŃCZENIU PRACY**

- [ ] Zatrzymaj wszystkie serwisy
- [ ] Zamknij niepotrzebne terminale
- [ ] Commit i push zmian
- [ ] Zaktualizuj dokumentację
- [ ] Backupuj konfigurację
- [ ] Sprawdź czy wszystko działa
- [ ] Zaplanuj następne kroki

---

**NextFab Cursor Workflow** - Kompletny przewodnik wydajnej pracy z Cursor

*Ostatnia aktualizacja: Styczeń 2025*


