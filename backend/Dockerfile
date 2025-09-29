# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Kopiuj package files
COPY package*.json ./

# Instaluj dependencies (including dev for build)
RUN npm install

# Kopiuj kod źródłowy
COPY . .

# Build aplikacji
RUN npm run build

# Remove dev dependencies
RUN npm prune --omit=dev

# Expose port
EXPOSE 5000

# Start aplikacji
CMD ["npm", "start"]