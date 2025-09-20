FROM node:20-bullseye-slim

WORKDIR /app

# Instala dependências (inclui devDependencies para ambiente de desenvolvimento)
COPY package*.json ./
RUN npm install

# Copia o restante do projeto (será sobrescrito pelo volume em dev, mas mantém para build)
COPY . .

EXPOSE 3001

# Em dev, o comando real vem do docker-compose (command:)
CMD ["npm", "run", "dev"]
