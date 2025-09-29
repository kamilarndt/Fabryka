#!/bin/bash

# NextFab Test Suite Runner
# Uruchamia wszystkie testy w projekcie

set -e

echo "🧪 NextFab Test Suite"
echo "====================="

# Sprawdź czy jesteśmy w głównym katalogu projektu
if [ ! -f "package.json" ]; then
    echo "❌ Uruchom skrypt z głównego katalogu projektu"
    exit 1
fi

# Uruchom testy backend
echo "🔧 Uruchamianie testów backend..."
cd backend
if [ -f "package.json" ]; then
    npm test
    echo "✅ Testy backend - OK"
else
    echo "⚠️  Backend nie jest skonfigurowany"
fi
cd ..

# Uruchom testy frontend
echo "🔧 Uruchamianie testów frontend..."
cd frontend
if [ -f "package.json" ]; then
    npm test
    echo "✅ Testy frontend - OK"
else
    echo "⚠️  Frontend nie jest skonfigurowany"
fi
cd ..

# Uruchom testy E2E (jeśli dostępne)
echo "🔧 Uruchamianie testów E2E..."
cd frontend
if [ -f "package.json" ] && npm run test:e2e --dry-run &> /dev/null; then
    npm run test:e2e
    echo "✅ Testy E2E - OK"
else
    echo "⚠️  Testy E2E nie są skonfigurowane"
fi
cd ..

echo ""
echo "✅ Wszystkie testy zakończone!"
echo ""
echo "Aby uruchomić konkretne testy:"
echo "- Backend: cd backend && npm test"
echo "- Frontend: cd frontend && npm test"
echo "- E2E: cd frontend && npm run test:e2e"