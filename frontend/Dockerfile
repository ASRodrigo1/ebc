# Etapa de build do frontend
FROM node:18 AS build

WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências primeiro
COPY package.json package-lock.json ./

# Instala as dependências de forma confiável e reproduzível
RUN npm ci --legacy-peer-deps

# Copia o restante do código e gera o build de produção
COPY . ./
RUN npm run build

# Etapa final: Servindo o frontend com Nginx
FROM nginx:alpine

# Remove arquivos padrão do Nginx (caso existam)
RUN rm -f /etc/nginx/conf.d/default.conf

# Copia os arquivos do frontend para a pasta padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia os arquivos de configuração do Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80 para servir a aplicação
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
