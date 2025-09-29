#!/bin/bash

# NextFab Lint Suite Runner
# Uruchamia linting dla całego projektu

set -e

echo "🔍 NextFab Lint Suite"
echo "====================="

# Sprawdź czy jesteśmy w głównym katalogu projektu
if [ ! -f "package.json" ]; then
    echo "❌ Uruchom skrypt z głównego katalogu projektu"
    exit 1
fi

# Uruchom linting backend
echo "🔧 Linting backend..."
cd backend
if [ -f "package.json" ]; then
    npm run lint
    echo "✅ Backend linting - OK"
else
    echo "⚠️  Backend nie jest skonfigurowany"
fi
cd ..

# Uruchom linting frontend
echo "🔧 Linting frontend..."
cd frontend
if [ -f "package.json" ]; then
    npm run lint
    echo "✅ Frontend linting - OK"
else
    echo "⚠️  Frontend nie jest skonfigurowany"
fi
cd ..

# Uruchom type checking
echo "🔧 Type checking..."
npm run type-check
echo "✅ Type checking - OK"

echo ""
echo "✅ Wszystkie sprawdzenia zakończone!"
echo ""
echo "Aby uruchomić konkretne sprawdzenia:"
echo "- Backend lint: cd backend && npm run lint"
echo "- Frontend lint: cd frontend && npm run lint"
echo "- Type check: npm run type-check"
echo "- Auto-fix: npm run lint:fix"