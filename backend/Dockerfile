# 1. Imagem base
FROM node:20-alpine

# 2. Diretório de trabalho
WORKDIR /app

# 3. Copia apenas dependências (cache eficiente)
COPY package*.json ./

# 4. Instala dependências
RUN npm install --production

# 5. Copia o restante do código
COPY . .

# 6. Expõe a porta da API
EXPOSE 3000

# 7. Inicia o servidor
CMD ["node", "server.js"]
