# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Kopiuj package files
COPY package*.json ./

# Instaluj dependencies
RUN npm ci --only=production

# Kopiuj kod źródłowy
COPY . .

# Build aplikacji
RUN npm run build

# Expose port
EXPOSE 5000

# Start aplikacji
CMD ["npm", "start"]