# Usa a imagem do Node.js para construir a aplicação
FROM node:18 AS build

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos do projeto para o container
COPY package.json ./
RUN npm install

# Copia o restante dos arquivos e compila o projeto
COPY . .
RUN npm run build

# Usa uma imagem mais leve para rodar o frontend
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80 para servir a aplicação
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
