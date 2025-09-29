#!/bin/bash

# NextFab Development Setup Script
# Automatyczna konfiguracja środowiska deweloperskiego

set -e

echo "🚀 NextFab Development Setup"
echo "=============================="

# Sprawdź czy Node.js jest zainstalowany
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nie jest zainstalowany. Zainstaluj Node.js 18+ i spróbuj ponownie."
    exit 1
fi

# Sprawdź wersję Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Wymagana wersja Node.js 18+. Aktualna wersja: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) - OK"

# Sprawdź czy npm jest zainstalowany
if ! command -v npm &> /dev/null; then
    echo "❌ npm nie jest zainstalowany."
    exit 1
fi

echo "✅ npm $(npm -v) - OK"

# Instaluj dependencies root
echo "📦 Instalowanie dependencies root..."
npm install

# Instaluj dependencies backend
echo "📦 Instalowanie dependencies backend..."
cd backend
npm install
cd ..

# Instaluj dependencies frontend
echo "📦 Instalowanie dependencies frontend..."
cd frontend
npm install
cd ..

# Sprawdź czy pliki .env istnieją
echo "🔧 Konfiguracja zmiennych środowiskowych..."

if [ ! -f ".env" ]; then
    echo "📝 Tworzenie pliku .env..."
    cp .env.example .env
    echo "⚠️  Wypełnij plik .env odpowiednimi wartościami"
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Tworzenie pliku backend/.env..."
    cp backend/.env.example backend/.env
    echo "⚠️  Wypełnij plik backend/.env odpowiednimi wartościami"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Tworzenie pliku frontend/.env.local..."
    cp frontend/.env.example frontend/.env.local
    echo "⚠️  Wypełnij plik frontend/.env.local odpowiednimi wartościami"
fi

# Sprawdź czy Docker jest zainstalowany (opcjonalnie)
if command -v docker &> /dev/null; then
    echo "✅ Docker $(docker --version) - OK"
    
    if command -v docker-compose &> /dev/null; then
        echo "✅ Docker Compose $(docker-compose --version) - OK"
    else
        echo "⚠️  Docker Compose nie jest zainstalowany"
    fi
else
    echo "⚠️  Docker nie jest zainstalowany (opcjonalne)"
fi

# Uruchom testy aby sprawdzić czy wszystko działa
echo "🧪 Sprawdzanie konfiguracji..."
npm run type-check

echo ""
echo "✅ Setup zakończony pomyślnie!"
echo ""
echo "Następne kroki:"
echo "1. Wypełnij pliki .env odpowiednimi wartościami"
echo "2. Uruchom 'npm run dev' aby rozpocząć development"
echo "3. Lub użyj 'docker-compose up --build' dla Docker"
echo ""
echo "Dokumentacja: README.md"
echo "Wsparcie: Sprawdź docs/ folder"