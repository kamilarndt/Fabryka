# Plan Tworzenia Aplikacji NextFab z Cursor IDE

## Faza 1: Przygotowanie Workspace (Tydzień 1)

### Dzień 1: Konfiguracja Podstawowa
```bash
# 1. Inicjalizacja projektu
mkdir nextfab && cd nextfab
npm init -y

# 2. Setup struktury katalogów
mkdir -p .cursor/rules
mkdir -p src/{app,components,lib,types,hooks}
mkdir -p backend/{routes,controllers,services,models}
mkdir -p tests/{unit,e2e,fixtures}

# 3. Pliki konfiguracyjne Cursor
touch .cursor/index.mdc
touch .cursor/rules/{frontend,backend,testing,components,api}.mdc
touch .cursorignore
touch PRD.md
```

### Dzień 2-3: Konfiguracja Środowiska
- [ ] Install dependencies (Next.js, React, TypeScript, Chakra UI v3)
- [ ] Setup ESLint, Prettier, Husky pre-commit hooks  
- [ ] Configure Vitest i Playwright
- [ ] Setup Docker environment
- [ ] Configure Supabase connection

### Dzień 4-5: Testowanie Workspace
- [ ] Test wszystkich Cursor rules z AI
- [ ] Verify YOLO mode i Auto Run
- [ ] Setup debugging workflow
- [ ] Team onboarding i szkolenia

---

## Faza 2: Rozwój Core Modułów (Tygodnie 2-5)

### Tydzień 2: Moduł Projects 
**Priorytety MVP:**
1. **Lista projektów** z filtrowaniem i wyszukiwaniem
2. **Kreator projektu** (3-krokowy wizard)  
3. **Widok szczegółów** projektu z modułowym interfejsem
4. **System statusów** projektu

**Cursor Workflow:**
```bash
# Prompt dla AI Agent mode:
@PRD.md @.cursor/index.mdc @20_FEATURE_PROJECTS.md 

"Implementuj kompletny moduł Projects zgodnie ze specyfikacją. 
Stwórz:
1. Next.js pages dla /projects i /projects/[id]
2. React komponenty: ProjectCard, ProjectCreationWizard, ModuleTabs
3. API endpoints: GET/POST /api/projects
4. TypeScript types z 10_DATA_MODELS.md
5. Testy jednostkowe i E2E
6. Chakra UI styling zgodny z design system

Użyj TDD approach i dodaj proper error handling + logging."
```

### Tydzień 3: Moduł Clients
**Priorytety MVP:**
1. **Baza klientów** z wyszukiwaniem
2. **Profile klientów** z osobami kontaktowymi  
3. **Historia projektów** klienta
4. **Integracja** z modułem Projects

**Cursor Workflow:**
```bash
@PRD.md @21_FEATURE_CLIENTS.md @10_DATA_MODELS.md

"Implementuj moduł Clients CRM:
1. Komponenty: ClientCard, ClientDetails, ContactPersonForm
2. API: CRUD operations dla clients i contact persons  
3. Integration z Projects module
4. Search i filtering functionality
5. Mobile-responsive design z Chakra UI
6. Complete test suite"
```

### Tydzień 4: Moduł Materials (UMMS)
**Priorytety MVP:**
1. **Katalog materiałów** z kategoriami
2. **Stany magazynowe** real-time
3. **System wyszukiwania** i filtrowania
4. **Listy zakupowe** automatyczne

**Cursor Workflow:**
```bash
@PRD.md @06_materials.md @10_DATA_MODELS.md

"Implementuj UMMS - Uniwersalny System Zarządzania Materiałami:
1. Material catalog z advanced search
2. Stock management z real-time updates
3. Automatic shopping lists generation
4. Suppliers integration
5. Supabase real-time subscriptions
6. Comprehensive testing + documentation"
```

### Tydzień 5: Integracja i Optymalizacja
- [ ] **Cross-module integration** testing
- [ ] **Performance optimization** 
- [ ] **Security audit** z AI
- [ ] **Documentation** generation
- [ ] **Deployment** pipeline setup

---

## Faza 3: Advanced Features (Tygodnie 6-8)

### Tydzień 6: Moduł Elements (Kafelki)
**Funkcjonalności:**
1. **Kanban board** dla statusów elementów
2. **BOM management** (Bill of Materials)
3. **3D model integration** (Speckle)
4. **Production tracking**

### Tydzień 7: Moduł Quotation  
**Funkcjonalności:**
1. **Interactive spreadsheet** dla wycen
2. **Automatic cost import** z innych modułów  
3. **PDF generation** profesjonalnych ofert
4. **Versioning system**

### Tydzień 8: UI/UX Polish
- [ ] **Design system refinement**
- [ ] **Accessibility improvements**  
- [ ] **Performance optimization**
- [ ] **Mobile responsiveness**

---

## Strategia Cursor AI

### Prompt Templates

#### Dla Nowych Komponentów:
```
@PRD.md @.cursor/rules/frontend.mdc @03_DESIGN_SYSTEM.md

"Stwórz komponent [ComponentName] który:
1. Implementuje [specific functionality]
2. Używa Chakra UI v3 z proper design tokens
3. Ma complete TypeScript types
4. Includes accessibility features
5. Ma comprehensive unit tests
6. Jest mobile-responsive
7. Follows project conventions z index.mdc

Dodaj również Storybook stories i proper documentation."
```

#### Dla API Endpoints:
```
@PRD.md @.cursor/rules/backend.mdc @11_API_REFERENCE.md

"Implementuj API endpoint [endpoint] który:
1. Follows RESTful conventions
2. Ma proper input validation z Zod
3. Uses repository pattern dla database access
4. Includes error handling i logging
5. Ma JWT authentication
6. Has comprehensive tests
7. Proper TypeScript types
8. API documentation"
```

#### Dla Testów:
```
@.cursor/rules/testing.mdc @02_DEV_WORKFLOW.md

"Napisz comprehensive test suite dla [feature]:
1. Unit tests z Vitest dla business logic
2. E2E tests z Playwright dla user workflows  
3. Integration tests dla API endpoints
4. Mock strategies dla external services
5. Test fixtures i helper functions
6. Coverage reports
7. CI/CD integration"
```

### Auto-Run Configuration
```json
{
  "auto-run": {
    "enabled": true,
    "commands": [
      "npm run lint",
      "npm run test:unit",
      "npm run type-check"
    ],
    "triggers": ["save", "commit"]
  }
}
```

---

## Monitoring i Quality Gates

### Pre-commit Checks (Automated)
- [ ] **ESLint** - zero errors
- [ ] **TypeScript** - strict type checking
- [ ] **Unit tests** - must pass all
- [ ] **Test coverage** - minimum 80%
- [ ] **Performance** - bundle size limits

### Weekly Reviews
- [ ] **Code quality** metrics
- [ ] **Test coverage** analysis  
- [ ] **Performance** monitoring
- [ ] **Security** scan results
- [ ] **Documentation** updates

---

## Team Collaboration

### Daily Workflow z Cursor:
1. **Pull latest changes** z main branch
2. **Create feature branch** z descriptive name
3. **Use Agent mode** dla complex implementations
4. **AI-powered code review** przed commit
5. **Automated testing** w pre-commit hooks
6. **Create PR** z AI-generated description

### Code Review Process:
```bash
# AI-assisted review
"@code-diff Przejrzyj te zmiany pod kątem:
1. Zgodności z project rules
2. Security best practices  
3. Performance implications
4. Test coverage
5. Documentation quality"
```

---

## Success Metrics

### Development Velocity:
- **Feature delivery time**: 50% reduction przez AI automation
- **Bug rate**: 30% reduction przez AI code review
- **Test coverage**: 90%+ maintanied through AI
- **Code quality**: Consistent przez enforced rules

### AI Efficiency:
- **Automated code generation**: 60% of boilerplate
- **Test generation**: 80% automated
- **Documentation**: 90% AI-generated
- **Debugging time**: 40% reduction

---

## Zasoby i Narzędzia

### Essential Cursor Extensions:
- **Cursor Rules Directory** - ready-made rules
- **GitHub Copilot Chat** - backup AI assistant
- **Error Lens** - inline error highlighting
- **Thunder Client** - API testing

### External Tools Integration:
- **Figma** - design handoff
- **Linear** - project management  
- **Sentry** - error monitoring
- **Vercel** - deployment platform

---

## Risk Mitigation

### Potential Issues:
1. **AI hallucinations** → Solution: thorough code review + tests
2. **Over-reliance on AI** → Solution: maintain human oversight
3. **Token limits** → Solution: optimize context + use caching
4. **Integration complexity** → Solution: iterative development

### Backup Strategies:
- **Manual fallbacks** dla critical operations
- **Code backups** przed major AI refactoring
- **Team knowledge sharing** sessions
- **Regular workspace optimization**

---

## Wniosek

Ten plan zapewni efektywne wykorzystanie Cursor IDE do tworzenia NextFab, maksymalizując:

✅ **Autonomię AI** w coding, testing, i debugging  
✅ **Jakość kodu** przez enforced rules i automation  
✅ **Szybkość rozwoju** przez intelligent assistance  
✅ **Spójność zespołu** przez shared workspace configuration  
✅ **Maintainability** przez comprehensive documentation i tests  

**Rezultat**: Professional-grade aplikacja dostarczona w 8 tygodniach z maksymalną wykorzystaniem AI capabilities.