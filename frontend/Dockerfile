FROM node:18 AS build

WORKDIR /app

# Copia apenas package.json para instalar as dependências primeiro
COPY package.json ./

# Instala as dependências sem gerar cache desnecessário
RUN npm install

# Copia o restante do código
COPY . ./

# Gera a versão de produção do frontend
RUN npm run build

FROM nginx:alpine

# Remove os arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados na etapa anterior para o Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta padrão do Nginx
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
