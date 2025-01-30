# Etapa de build do frontend
FROM node:18 AS build

WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências primeiro
COPY package.json package-lock.json ./
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

# Copia o default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia os certificados
COPY nginx/certificate.crt /etc/ssl/fullchain.crt
COPY nginx/private.key    /etc/ssl/private.key

# Ajusta permissões (opcional)
# Isso é importante para que o Nginx consiga ler a chave
RUN chmod 600 /etc/ssl/private.key && \
    chmod 644 /etc/ssl/fullchain.crt

# Copia o nginx.conf (se você estiver usando)
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expor portas 80 e 443
EXPOSE 80 443

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
