# Etapa 1: Build do frontend
FROM node:18 AS build

WORKDIR /app

# Copia package.json e package-lock.json para otimizar cache do npm install
COPY package.json ./

# Instala apenas as dependências, sem executar o código
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . ./

# Gera a versão de produção do frontend
RUN npm run build

# Etapa 2: Configuração do Nginx para servir a aplicação
FROM nginx:alpine

# Remove os arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados na etapa anterior para o Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia um arquivo de configuração do Nginx otimizado para React
COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta padrão do Nginx
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
