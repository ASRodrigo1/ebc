# Etapa de build
FROM node:18 AS build

WORKDIR /app

# Copia apenas o package.json
COPY package.json package-lock.json ./

# Instala as dependências sem precisar do package-lock.json
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . ./

# Gera a versão de produção do frontend
RUN npm run build

# Etapa 2: Configuração do Nginx para servir a aplicação
FROM nginx:alpine

# Remove os arquivos padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados na etapa anterior para o Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia um arquivo de configuração do Nginx otimizado para React
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expõe a porta padrão do Nginx
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
